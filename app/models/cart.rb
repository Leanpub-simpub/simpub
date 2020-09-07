class Cart
  attr_reader :items

  def initialize(items = [])
    @items = items
  end
  
  def add_item(book_id) 
    found_item = items.find { |item| item.book_id == book_id}

    if found_item 
      found_item.increment
    else
      @items << CartItem.new(book_id)
    end
  end
  
  def empty? 
    @items.empty?
  end
end