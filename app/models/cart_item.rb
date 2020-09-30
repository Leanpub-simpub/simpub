class CartItem
  attr_reader :book_id, :quantity, :cart_price

  def initialize(book_id, cart_price = 0, quantity = 1)
    @book_id = book_id
    @quantity = quantity
    @cart_price = cart_price
  end
  
  def increment(n = 1)
    @quantity += n
  end

  def book
    Book.find_by(id: book_id)
  end

  def price
    @cart_price
  end
end