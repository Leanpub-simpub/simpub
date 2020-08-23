class Book < ApplicationRecord
  include BookUploader::Attachment(:book) # adds an `image` virtual attribute

  has_many :taggings
  has_many :tags, through: :taggings
  
  has_many :book_authors
  has_many :authors, through: :book_authors, source: :users

  has_many :book_users
  has_many :readers, through: :book_users, source: :users

  has_one :order_items
  
end
