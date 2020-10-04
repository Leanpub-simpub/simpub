class Users::LibraryController < ApplicationController

  def show
    @books = current_user.bought_books
    @book_info = Book.find_by(id: params[:id]).as_json(include: :authors)

    respond_to do |format|
      format.html
      format.json { render json: @book_info }
    end
  end

  
end