class CartItem
  attr_accessor :cart_price
  attr_reader :book_id

  def initialize(book_id, cart_price = 0)
    @book_id = book_id
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