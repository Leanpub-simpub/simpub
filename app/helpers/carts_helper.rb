module CartsHelper
  def current_cart
    @cart ||= Cart.from_hash(session[Cart::SessionKey])
  end
end
