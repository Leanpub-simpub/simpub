class OrderItem < ApplicationRecord
  acts_as_paranoid
  
  belongs_to :order
  belongs_to :book
end
