class ApplicationController < ActionController::Base
  include CartsHelper

  helper_method :published_books, :unpublish_books, :has_avatar?, :has_cover?,
                :any_purchase?
  
  

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

  def any_purchase?(user)
    user.orders.count > 0
  end

  def create_notification(receiver, actor, action, notifiable)
    Notification.create(
        recipient: receiver,
        actor: actor,
        action: action,
        notifiable: notifiable
    )
  end
end
