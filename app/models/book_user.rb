class BookUser < ApplicationRecord

  belongs_to :user
  belongs_to :book

  has_many :orders

end
