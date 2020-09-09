class BooksController < ApplicationController  
  before_action :authenticate_user!, only: [:new, :create, :edit, :update]
  before_action :find_book, except: [:index, :new, :create]

  def index
    @books = Book.published_books
  end
  
  def show
    require "open-uri"
    md = open(@book.md_url).read

    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, filter_html: false, autolink: true, tables: true)
    @md = markdown.render(md)
  end
  

  def new
    @book = Book.new
  end

  def create
    @book = Book.new(book_params)
    @book.authors << current_user
    
    if not @book.valid?
      render :new
      return
    end
    
    @book.cover_derivatives! # create derivatives

    if @book.save
<<<<<<< HEAD
      if @book.md_data
        @book.update(publish_state: "on-shelf")
        redirect_to @book, notice: "已建立新書～"
      else
        redirect_to editor_new_book_path(@book)
      end
=======
      # if @book.md_data
        @book.update(publish_state: "on-shelf")
        redirect_to @book, notice: "已建立新書～"
      # else
        # redirect_to editor_new_book_path(@book)
      # end
>>>>>>> 測試default_url完成 修改s3照片存取路徑
    else
      render :new
    end
  end


  def edit
  end

  def update
    if @book.update(book_params)
      redirect_to @book, notice: "更新成功～"
    else
      render :edit
    end
  end


  # 線上編輯 action
  def editor_new
  end

  def editor_create
  end

  def editor_eidt
  end

  def editor_update
  end

  

  private
  def book_params
    params.require(:book).permit(:cover, :title, :about, :price, :catalog, :completeness, :md)
  end

  def find_book
    @book = Book.find_by(id: params[:id])
  end
  
end