class Api::V1::CartsController < ApplicationController

  def show
    @cart = session[Cart::SessionKey]
  end
  
end