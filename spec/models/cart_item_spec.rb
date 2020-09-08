require 'rails_helper'

RSpec.describe CartItem, type: :model do
  it "每個 CartItem 都可以計算它自己的金額(小計)" do
    p1 = Book.create(title:"七龍珠", price: 80)
    # 建立商品 1
    p2 = Book.create(title:"冒險野郎", price: 200)
    # 建立商品 2

    cart = Cart.new
    
    3.times { cart.add_item(p1.id) }
    # 加 3 次商品 1
    4.times { cart.add_item(p2.id) } 
    # 加 4 次商品 2
    2.times { cart.add_item(p1.id) }
    # 加 2 次商品 1

    expect(cart.items.first.price).to be 400.0
    # 第 1 條 cart item 的價格應該是 400 元
    expect(cart.items.second.price).to be 800.0
    # 第 2 條 cart item 應該是 800 元
  end
end
