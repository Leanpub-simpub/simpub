class Book < ApplicationRecord
  include CoverUploader::Attachment(:cover) # adds an `image` virtual attribute

  has_many :taggings
  has_many :tags, through: :taggings
  
  has_many :book_authors
  has_many :authors, through: :book_authors, source: :user

  has_many :book_users
  has_many :readers, through: :book_users, source: :user

  has_one :order_items
  
  has_rich_text :content

  scope :published_books, -> { where(publish_state: "on-shelf")}
  scope :unpublish_books, -> { where(publish_state: "off-shelf")}
end
