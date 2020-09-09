class ApplicationController < ActionController::Base
  include CartsHelper

  helper_method :published_books, :unpublish_books

  private
  def published_books
    current_user.pub_books.published_books
  end
  
  def unpublish_books
    current_user.pub_books.unpublish_books
  end
end
