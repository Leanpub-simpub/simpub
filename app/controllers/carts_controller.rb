class CartsController < ApplicationController
  def add
    current_cart.add_item(params[:id]) 
    session[Cart::SessionKey] = current_cart.serialize

    redirect_to books_path, notice: "已加入購物車" 
  end

  def destroy
    session[Cart::SessionKey] = nil
    redirect_to books_path, notice: "購物車已清空"
  end

  def payment
    @token = gateway.client_token.generate
  end

  def checkout
    result = gateway.transaction.sale(
      amount: "10.00",
      payment_method_nonce: params[:nonoce],
      options: {
        submit_for_settlement: true
      }
    )

    if result.success?
      redirect_to root_path, notice: '付款成功'
    else
      redirect_to root_path, notice: '付款發生錯誤'
    end
  
  end

  private

  def gateway
    Braintree::Gateway.new(
      environment: :sandbox, 
      merchant_id: "t6xvfx263ygt94zr",
      public_key: "sk8xfghtvvr32dt8",
      private_key: "979c5f7a5d4147a72a4cf87586ac25e9",
    )
  end
end