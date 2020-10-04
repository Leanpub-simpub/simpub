class Wishlist
  SessionKey = :wishlist0881
  attr_reader :items

  def initialize(items = [])
    @items = items
  end

  def add_item(book_id)
    found_item = items.find { |item| 
      item.book_id == book_id 
    }

    if found_item
      found_item
    else
      @items << WishlistItem.new(book_id)
    end
  end
  
  def empty? 
    @items.empty?
  end

  # def total_price
  #   items.reduce(0) { |sum, item| sum + item.price }
  # end

  def serialize
    all_items = items.map { |item|
      { "book_id" => item.book_id}
    }

    { "items" => all_items }
  end

  def self.from_hash(hash)
    if hash.nil? 
      new []
    else
      new hash["items"].map { |item_hash| 
      @wishlist_item = WishlistItem.new(item_hash["book_id"])
      }
    end
    
  end
end