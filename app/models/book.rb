class Book < ApplicationRecord
  include CoverUploader::Attachment(:cover) # adds an `image` virtual attribute
  # uploader = CoverUploader(:store)
  uploader = CoverUploader.new(:store)
  uploader.upload StringIO.new("file content")

  has_many :taggings
  has_many :tags, through: :taggings
  
  has_many :book_authors
  has_many :authors, through: :book_authors, source: :user

  has_many :book_users
  has_many :readers, through: :book_users, source: :user

  has_one :order_items
  
  has_rich_text :content
end
