class Users::PurchaseController < ApplicationController

  def index
    @orders = current_user.book_users.order!.all
  end
end