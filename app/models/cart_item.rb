class CartItem
  attr_reader :book_id, :quantity

  def initialize(book_id, quantity = 1)
    @book_id = book_id
    @quantity = quantity
  end
  
  def increment(n = 1)
    @quantity += n
  end

  def book
    Book.find_by(id: book_id)
  end

  def price
    Book.price * quantity
  end
end