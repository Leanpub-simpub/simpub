class Users::PurchaseController < ApplicationController
  before_action :authenticate_user!

  def index
    @orders = current_user.orders
  end

  def show
    @order = Order.find_by(uuid: params[:uuid])
    @order_items = @order.order_items
    @refund_time = (@order.created_at.next_day(45).to_date - @order.created_at.to_date).to_i
  end

end