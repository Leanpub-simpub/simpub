require 'rails_helper'

RSpec.describe Cart, type: :model do
  describe "購物車基礎功能" do
    it "可以把商品丟到購物車裡" do
      cart = Cart.new 
      # 新增一台購物車
      cart.add_item 1 
      # 放一件商品到購物車裡
      expect(cart.empty?).to be false 
      # 它應該不是空的
    end
    it "如果加了相同種類的商品到購物車裡，購買項目(CartItem)並不會增加， 但商品的數量會改變" do
      cart = Cart.new # 新增一台購物車 
      3.times { cart.add_item(1) } 
      # 加了 3 次的 1 
      5.times { cart.add_item(2) } 
      # 加了 5 次的 2 
      2.times { cart.add_item(3) } 
      # 加了 2 次的 3

      expect(cart.items.length).to be 3 
      # 總共應有 3 個 item
      expect(cart.items.first.quantity).to be 3 
      # 第 1 個 item的數量會是 3
      expect(cart.items.second.quantity).to be 5 
      # 第 2 個 item 的數量會是 5
    end
  end
end
