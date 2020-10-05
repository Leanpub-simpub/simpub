class NotificationsController < ApplicationController
  before_action :authenticate_user!, :find_unread_notif
  
  def index
    @notifications = Notification.where(recipient: current_user)
  end
  
  def mark_as_read
    # @notifications.update_all(read_at: Time.zone.now)
    render json: { success: true }
  end
  
  private
  def find_unread_notif
    @notifications = Notification.where(recipient: current_user).unread
  end
end