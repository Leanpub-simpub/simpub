class CartsController < ApplicationController

  def add
    cart_price = params[:cart_price][1..-1].to_i
    
    current_cart.add_item(params[:id], cart_price) 
    session[Cart::SessionKey] = current_cart.serialize
  end

  def show
    respond_to do |format|
      format.html
      format.json { @cart = session[Cart::SessionKey] }
    end
  end

  def destroy
    session[Cart::SessionKey] = nil
    redirect_to :cart, notice: "購物車已清空"
  end


  def payment
    if user_signed_in?
      @token = gateway.client_token.generate
    else
      redirect_to new_user_session_path
    end
  end

  def checkout
    result = gateway.transaction.sale(
      amount: current_cart.total_price,
      payment_method_nonce: params[:nonce],
      options: {
        submit_for_settlement: true
      }
    )

    if result.success?
      current_cart.items.each do |item|
        current_user.bought_books << Book.find_by(id: item.book_id)
      end

      session[Cart::SessionKey] = nil
      redirect_to root_path, notice: "付款成功"
    else
      redirect_to root_path, notice: "付款發生錯誤"
    end
  end



  private
  def gateway
    Braintree::Gateway.new(
      environment: :sandbox, 
      merchant_id: ENV["merchant_id"],
      public_key: ENV["public_key"],
      private_key: ENV["private_key"],
    )
  end
end
