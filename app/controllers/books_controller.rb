class BooksController < ApplicationController

  def index
    @books = Book.all
  end
  
  def show
    @book = Book.find(params[:id])
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, filter_html: false, autolink: true, tables: true)
    @content = markdown.render(@book.content.to_plain_text)
  end
  
  def new
    @book = Book.new
  end

  def create
    @book = Book.new(book_params)
    
    if @book.save
      redirect_to "/", notice: "已建立新書～"
    end
  end

  private
  def book_params
    params.require(:book).permit(:title, :about, :price, :catalog, :completeness, :content)
  end
  
end