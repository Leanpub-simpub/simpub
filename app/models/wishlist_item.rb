class WishlistItem
  attr_reader :book_id

  def initialize(book_id)
    @book_id = book_id
  end
  
  # def increment(n = 1)
  #   @quantity += n
  # end

  def book
    Book.find_by(id: book_id)
  end


  # def price
  #   @cart_price * quantity
  # end

end