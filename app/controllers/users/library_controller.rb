class Users::LibraryController < ApplicationController

  def show
    @books = current_user.bought_books
    @show_book = Book.find_by(id: params[:format])
  end

  
end