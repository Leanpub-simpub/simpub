class BooksController < ApplicationController  
  before_action :authenticate_user!, only: [:new, :create, :edit, :update]
  before_action :find_book, only: [:show, :edit, :update]

  def index
    @books = Book.published_books
  end
  
  def show
    # markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, filter_html: false, autolink: true, tables: true)
    # @content = markdown.render(@book.content.to_plain_text)
  end
  

  def new
    @book = Book.new
  end

  def create
    @book = Book.new(book_params)
    @book.authors << current_user
    
    if @book.save
      redirect_to edit_book_path(@book), notice: "已建立新書～"
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

  

  private
  def book_params
    params.require(:book)
      .permit(:cover, :title, :about, :price, :catalog, :completeness, :content)
      .merge(publish_state: "on-shelf")
  end

  def find_book
    @book = Book.find_by(id: params[:id])
  end
  
end