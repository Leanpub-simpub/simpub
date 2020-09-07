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
  end
end
