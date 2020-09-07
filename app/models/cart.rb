class Cart
  attr_reader :items

  def initialize(items = [])
    @items = items
  end
  
  def add_item(book_id) 
    @items << book_id
  end
  
  def empty? 
    @items.empty?
  end
end