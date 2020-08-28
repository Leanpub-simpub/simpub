class BooksController < ApplicationController
  
  def new
    @book = Book.new
  end

  def create
  end
  
end