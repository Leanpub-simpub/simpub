class Order < ApplicationRecord

  belongs_to :book_user

  has_many :order_items

end
