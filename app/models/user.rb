class User < ApplicationRecord

  validates :email, presence: true, uniqueness: true

  has_many :book_authors
  has_many :pub_books, through: :book_authors, source: :books

  has_many :book_users
  has_many :bought_books, through: :book_users, source: :books
  
end
