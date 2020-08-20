class Book < ApplicationRecord

  has_many :taggings
  has_many :tags, through: :taggings
  
end
