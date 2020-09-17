class Users::LibraryController < ApplicationController

  def show
    @books = current_user.bought_books
  end

  
end