class Tag < ApplicationRecord

  has_many :taggings
  has_many :books, through: :taggings
  
end
