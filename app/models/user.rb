class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :email, presence: true, uniqueness: true

  has_many :book_authors
  has_many :pub_books, through: :book_authors, source: :books

  has_many :book_users
  has_many :bought_books, through: :book_users, source: :books
  
end
