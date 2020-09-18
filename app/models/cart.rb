class Cart
  SessionKey = :cart9527
  attr_reader :items

  def initialize(items = [])
    @items = items
  end
  
  def add_item(book_id, cart_price) 
    found_item = items.find { |item|
      item.book_id == book_id and item.cart_price == cart_price
    }
    
    if found_item 
      found_item.increment
    else
      @items << CartItem.new(book_id, cart_price)
    end
  end
  
  def empty? 
    @items.empty?
  end

  def total_price
    items.reduce(0) { |sum, item| sum + item.price }
  end

  def serialize
    all_items = items.map { |item|
      { "book_id" => item.book_id, "cart_price" => item.cart_price, "quantity" => item.quantity}
    }
    { "items" => all_items } 
  end

  def self.from_hash(hash)
    if hash.nil? 
      new []
    else
      new hash["items"].map { |item_hash| 
        @cart_item = CartItem.new(item_hash["book_id"], item_hash["cart_price"], item_hash["quantity"])
      }
    end
    # 1. 因為 Cart.from_hash 是類別方法，所以在定義方法的時候加上了 self.。
    # 2. 在 self.from_hash 方法中，不管傳進來的 Hash 是空的還是有資料，最終都是呼叫 new 方法產生一個 Cart 實體，並且把傳入的 Hash 的內容轉換成 CartItem 物件。
    # 3.  Cart 類別的 initialize 方法有做調整，讓它可以接收參數，並把參數指定給 @items 實體變數。
  end
end