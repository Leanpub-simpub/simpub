class BooksController < ApplicationController  
  require "aws-sdk-s3"
  require "json"
  
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :pricing, :publish, :unpublish, :editor_new, :editor_edit]
  before_action :find_book, only: [:show, :edit, :update, :pricing, :publish, :unpublish, :wish, :read, :add_chapter, :add_section]

  def index
    @books = Book.published_books

    if params[:book_search].present?
      @books = @books.book_search(params[:book_search])
    elsif params[:author_search].present?
      @books = @books.author_search(params[:author_search])
    elsif params[:tag_search].present?
      @books = @books.tag_search(params[:tag_search])
    end

    @books = @books.page(params[:page]).per(24)
  end
  
  def show
    @comments = @book.comments.where.not(content: "")
    @stars = @comments.average(:stars).round() if @comments.size > 0
  end
  

  def new
    @book = Book.new
    @tags = Tag.all.map(&:name)
    titles = Book.pluck(:title)

    respond_to do |format|
      format.html
      format.json { render json: titles }
    end
  end
  
  def create
    @book = Book.new(book_params)
    @book.authors << current_user
    
    # 把 cover 切出 大中小 三個尺寸
    
    if @book.save
      CoverUploaderJob.perform_later(@book) if @book.cover_data?
      if @book.md_data
        @book.update(publish_state: "on_shelf")
        current_user.update(as_author: true)

        publish_notify
        
        redirect_to pricing_book_path(@book)
      else
        # 在 s3 做出書的資料夾，chapter1.md，與 structure.json(存章節結構)
        book_start(@book.title)
        redirect_to users_books_path
      end
    else
      @tags = Tag.all.map(&:name)
      render :new
    end
  end

  def edit
    @tags = Tag.all.map(&:name)
  end
  
  def update
    if @book.update(book_params)
      CoverUploaderJob.perform_later(@book)
      redirect_to pricing_book_path(@book)
    else
      render :edit
      @tags = Tag.all.map(&:name)
    end
  end

  # 設定書本價格
  def pricing
  end
  
  def publish
    @book.update(book_params)
    @book.update(publish_state: "on_shelf")
    current_user.update(as_author: true)

    publish_notify
    
    redirect_to @book, notice: "書籍已上架囉～"
  end

  def unpublish
    @book.remove!
    redirect_to users_books_path, notice: "#{@book.title} 已下架"
  end

  def wish
    current_user.wish_books << @book
    flash[:notice] = "書籍已加入願望清單"
  end

  # 線上編輯 action
  def editor_edit
    @book = Book.friendly.find(params[:id])
    # @book = Book.find(params[:id])
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{@book.title}/structure.json")    
    structure_json = object.body.read
    # 將新增的章節加入結構中
    @json = JSON.parse(structure_json)
  end

  def add_chapter
    if params[:chapter] == ""  
      return
    end
    
    
    # 取到結構json檔資料
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{@book.title}/structure.json")    
    structure_json = object.body.read
    # 將新增的章節加入結構中
    structure_json = JSON.parse(structure_json)

    # 檢查 chapter 是否重複
    chapter_name = params[:chapter].gsub(/\s/, '_')
    structure_json.each do |obj|
      if obj["#{chapter_name}"] != nil
        return
      end
    end     
    
    chapter = { "#{chapter_name}": []}
    structure_json.push(chapter)     
    structure_json = structure_json.to_json

    s3_resource = Aws::S3::Resource.new
    bucket = s3_resource.bucket(ENV['bucket'])
    structure = bucket.object("store/book/#{@book.title}/structure.json")
    structure.put(body: structure_json)
    # 將新的結構存到 structure.json檔案
    chapter = bucket.object("store/book/#{@book.title}/#{chapter_name}.md")
    chapter.upload_stream{|ws| ws << "# #{chapter_name}"}
    # 做出章節
    
  end

  def add_section
    if params[:section] == ""
      return
    end
    

    # 取到結構json檔資料
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{@book.title}/structure.json")    
    structure_json = object.body.read
    # 將新增的 section 加入結構中
    structure_json = JSON.parse(structure_json)
    
    # 檢查 section 是否重複
    section = "#{params[:section]}".gsub(/\s/, '_')
    structure_json[params[:order].to_i][params[:chapter]].each do |obj|
      if obj["#{section}"] != nil
        return
      end
    end  
    
    structure_json[params[:order].to_i][params[:chapter]].push(section)
    structure_json = structure_json.to_json
    
    s3_resource = Aws::S3::Resource.new
    bucket = s3_resource.bucket(ENV['bucket'])
    structure = bucket.object("store/book/#{@book.title}/structure.json")
    structure.put(body: structure_json)
    # 將新的結構存到 structure.json檔案
    section_obj = bucket.object("store/book/#{@book.title}/#{params[:chapter]}_#{section}.md")
    section_obj.upload_stream{|ws| ws << "# #{section}"}    # 做出 section 檔案
  end
  
  def get_content  
    s3_client = Aws::S3::Client.new
    
    if params[:chapter]
      object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{params[:bookName]}/#{params[:target]}.md")    
    elsif params[:section]
      object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{params[:bookName]}/#{params[:chapterName]}_#{params[:target]}.md")   
    end
    
    content = object.body.read
    respond_to do |format|
      format.json{ render json: {content: content} }
    end
  end

  def update_content
    s3_resource = Aws::S3::Resource.new
    bucket = s3_resource.bucket(ENV['bucket'])
    if params[:chapter]
      obj = bucket.object("store/book/#{params[:bookName]}/#{params[:target]}.md")
    elsif params[:section]
      obj = bucket.object("store/book/#{params[:bookName]}/#{params[:chapterName]}_#{params[:target]}.md")
    end
    
    obj.upload_stream{|ws| ws << params[:content]}
    
    respond_to do |format|
      format.json{ render json: {message: 'ok'} }
    end
  end

  def rename    
    # 取到結構json檔資料
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{params[:bookName]}/structure.json")    
    structure_json = object.body.read
    structure_json = JSON.parse(structure_json)
    
    # 修改json 內容
    if params[:chapter]
      structure_json[params[:chapterOrder].to_i][params[:newName]] = structure_json[params[:chapterOrder].to_i].delete(params[:currentName])
    elsif params[:section]
      index = structure_json[params[:chapterOrder].to_i][params[:chapterName]].find_index(params[:currentName])
      structure_json[params[:chapterOrder].to_i][params[:chapterName]][index] = params[:newName]
    end
    
    # 改 檔案名稱
    bucket = Aws::S3::Bucket.new("#{ENV['bucket']}")
    if params[:chapter]
      object = bucket.object("store/book/#{params[:bookName]}/#{params[:currentName]}.md")
      object.copy_to(bucket: "#{ENV['bucket']}", key: "store/book/#{params[:bookName]}/#{params[:newName]}.md")
      object.delete(bucket: "#{ENV['bucket']}",key: "store/book/#{params[:bookName]}/#{params[:currentName]}.md")
      structure_json[params[:chapterOrder].to_i][params[:newName]].each do |section|
        object = bucket.object("store/book/#{params[:bookName]}/#{params[:currentName]}_#{section}.md")
        object.copy_to(bucket: "#{ENV['bucket']}", key: "store/book/#{params[:bookName]}/#{params[:newName]}_#{section}.md")
        object.delete(bucket: "#{ENV['bucket']}",key: "store/book/#{params[:bookName]}/#{params[:currentName]}_#{section}.md")
      end
    elsif params[:section]
      object = bucket.object("store/book/#{params[:bookName]}/#{params[:chapterName]}_#{params[:currentName]}.md")
      object.copy_to(bucket: "#{ENV['bucket']}", key: "store/book/#{params[:bookName]}/#{params[:chapterName]}_#{params[:newName]}.md")
      object.delete(bucket: "#{ENV['bucket']}",key: "store/book/#{params[:bookName]}/#{params[:chapterName]}_#{params[:currentName]}.md")
    end
    # 存回 json 檔
    s3_resource = Aws::S3::Resource.new
    bucket = s3_resource.bucket(ENV['bucket'])
    structure = bucket.object("store/book/#{params[:bookName]}/structure.json")
    structure_json = structure_json.to_json
    structure.put(body: structure_json)
    
    # 回應
    respond_to do |format|
      format.json{ render json: {message: 'ok'} }
    end
  end
  
  def delete_chapter_or_section
    # 取到結構json檔資料
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{params[:bookName]}/structure.json")    
    structure_json = object.body.read
    structure_json = JSON.parse(structure_json)
    
    # 移除檔案
    bucket = Aws::S3::Bucket.new("#{ENV['bucket']}")
    if params[:section]
      # 刪除 section
      object = bucket.object("store/book/#{params[:bookName]}/#{params[:target]}.md")
      object.delete(bucket: "#{ENV['bucket']}",key: "store/book/#{params[:bookName]}/#{params[:chapterName]}_#{params[:target]}.md")
    elsif params[:chapter]
      # 刪除 chapter
      # 先刪 section
      params[:allSection].each do |section|
        object = bucket.object("store/book/#{params[:bookName]}/#{params[:chapterName]}_#{section}.md")
        object.delete(bucket: "#{ENV['bucket']}",key: "store/book/#{params[:bookName]}/#{params[:chapterName]}_#{section}.md")
      end
      # 再刪除 chapter
      object = bucket.object("store/book/#{params[:bookName]}/#{params[:target]}.md")
      object.delete(bucket: "#{ENV['bucket']}",key: "store/book/#{params[:bookName]}/#{params[:target]}.md")
    end

    # 修改json 內容
    if params[:chapter]
      structure_json.delete_at(params[:chapterOrder].to_i)
    elsif params[:section]
      index = structure_json[params[:chapterOrder].to_i][params[:chapterName]].find_index(params[:target])
      structure_json[params[:chapterOrder].to_i][params[:chapterName]].delete_at(index)
    end

    # 存回 json 檔
    s3_resource = Aws::S3::Resource.new
    bucket = s3_resource.bucket(ENV['bucket'])
    structure = bucket.object("store/book/#{params[:bookName]}/structure.json")
    json = structure_json
    structure_json = structure_json.to_json
    structure.put(body: structure_json)

    respond_to do |format|
      format.json{ render json: {message: 'ok', structure_json: structure_json} }
    end
  end

  def all_content
    # 取到結構json檔資料
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{params[:bookName]}/structure.json")    
    structure_json = object.body.read
    structure_json = JSON.parse(structure_json)

    all_content=[]
    all_chapter=[]
    structure_json.each do |obj|
      chapter = obj.keys[0].to_s
      all_chapter.push(chapter)
      object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{params[:bookName]}/#{chapter}.md")
      chapter_content = object.body.read

      obj.values[0].each do |section|
        object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{params[:bookName]}/#{chapter}_#{section}.md")
        section_content = object.body.read

        chapter_content << "\n"
        chapter_content << section_content 
      end
      all_content.push(chapter_content)
    end
    
    respond_to do |format|
      format.json{ render json: {all_content: all_content,all_chapter: all_chapter} }
    end
  end

  def upload_pdf
    s3_resource = Aws::S3::Resource.new
    bucket = s3_resource.bucket(ENV['bucket'])
    pdf = bucket.object("store/book/#{params[:bookName]}/#{params[:filename]}.pdf")
    pdf.upload_file(params[:file])
    respond_to do |format|
      format.json{ render json: {message: 'ok'} }
    end
  end

  def sample
    find_book
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{@book.title}/structure.json")    
    structure_json = object.body.read
    # 將新增的章節加入結構中
    @json = JSON.parse(structure_json)[0].keys[0]
  end

  def table_of_contents
    find_book
    s3_client = Aws::S3::Client.new
    object = s3_client.get_object(bucket: ENV['bucket'], key:"store/book/#{@book.title}/structure.json")    
    structure_json = object.body.read
    @json = JSON.parse(structure_json)
  end

  def read
    
  end

  private
  def book_params
    params.require(:book).permit(:cover, :title, :about, :price, :catalog, :completeness, :md, { tag_items: [] })
  end

  def find_book
    @book = Book.friendly.find(params[:id])
  end

  def book_start(title)
    s3_resource = Aws::S3::Resource.new
    bucket = s3_resource.bucket(ENV['bucket'])
    structure = bucket.object("store/book/#{title}/structure.json")
    a = [Chapter_1:[]]
    a = a.to_json
    structure.put(body: a )
    chapter = bucket.object("store/book/#{title}/Chapter_1.md")
    chapter.upload_stream{|ws| ws << '# Chapter_1'}
  end

  def publish_notify
    (current_user.followees.uniq).each do |followee|
      create_notification(followee, current_user, "published a book", @book)
    end
  end
  
end