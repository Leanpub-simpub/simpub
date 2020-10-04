class ApplicationController < ActionController::Base
  include CartsHelper
  include WishlistsHelper

  helper_method :published_books, :unpublish_books, :has_avatar?, :has_cover?
  
  

  private
  def published_books
    current_user.pub_books.published_books
  end
  
  def unpublish_books
    current_user.pub_books.unpublish_books
  end

  def has_avatar?(user)
    user.avatar_data
  end

  def has_cover?(book)
    book.cover_data
  end
end
