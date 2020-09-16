class BooksController < ApplicationController  
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :editor_new, :editor_edit]
  before_action :find_book, except: [:index, :new, :create]

  def index
    @books = Book.published_books.page(params[:page]).per(24)
  end
  
  def show
    require "open-uri"
    # md = open(@book.md_url).read

    # markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, filter_html: false, autolink: true, tables: true)
    # @md = markdown.render(md)
  end
  

  def new
    @book = Book.new
    @tags = Tag.all.map(&:name)
  end
  
  def create
    @book = Book.new(book_params)
    @book.authors << current_user
    
    # 把 cover 切出 大中小 三個尺寸
    @book.cover_derivatives! if @book.cover_data?
    
    if @book.save
      if @book.md_data
        @book.update(publish_state: "on-shelf")
        redirect_to pricing_book_path(@book)
      else
        redirect_to dash_board_books_path
        # redirect_to editor_new_book_path(@book)
      end
    else
      render :new
    end
  end


  def edit
    @tags = Tag.all.map(&:name)
  end
  
  def update
    if @book.update(book_params)
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
    @book.update(publish_state: "on-shelf")
    
    redirect_to @book, notice: "書籍已上架囉～"
  end


  # 線上編輯 action
  def editor_new
  end

  def editor_create
  end

  def editor_edit
  end

  def editor_update
  end

  

  private
  def book_params
    params.require(:book).permit(:cover, :title, :about, :price, :catalog, :completeness, :md, { tag_items: [] })
  end

  def find_book
    @book = Book.find_by(id: params[:id])
  end
  
end