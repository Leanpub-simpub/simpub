class Book < ApplicationRecord
  extend FriendlyId
  include AASM
  include MdUploader::Attachment(:md) # adds an `image` virtual attribute
  include CoverUploader::Attachment(:cover) # adds an `image` virtual attribute


  validates :title, presence: true, uniqueness: true

  has_many :taggings
  has_many :tags, through: :taggings
  
  has_many :book_authors
  has_many :authors, through: :book_authors, source: :user

  has_many :book_users
  has_many :readers, through: :book_users, source: :user
  
  has_many :wishlists
  has_many :wish_buyers, through: :wishlists, source: :user

  has_one :order_items
  has_many :comments

  friendly_id :title, use: :slugged
  
  scope :published_books, -> { where(publish_state: "on_shelf").order(id: :desc) }
  scope :unpublish_books, -> { where.not(publish_state: "on_shelf") }

  scope :book_search, -> (search) { where("books.title ILIKE ?", "%#{search}%") }
  scope :author_search, -> (search) { joins(:authors).where("users.name ILIKE ?", "%#{search}%") }
  scope :tag_search, -> (search) { joins(:tags).where("tags.name ILIKE ?", "%#{search}%") }

  
  # 可以用 Book.tagge_with(tagname) 來找到文章
  def self.tagged_with(name)
    Tag.find_by!(name: name).books
  end
  
  # 如果要取用 tag_items，可以加上這個 getter
  def tag_items
    tags.map(&:name)
  end
  
  # tag_items 的 setter
  def tag_items=(names)
    self.tags = names.map{|item|
      Tag.where(name: item.strip).first_or_create! unless item.blank?
    }.compact
  end


  aasm(column: "publish_state") do
    state :draft, initial: true
    state :on_shelf, :off_shelf

    event :publish do
      transitions from: [:draft, :off_shelf], to: :on_shelf
    end

    event :remove do
      transitions from: :on_shelf, to: :off_shelf
    end
  end
end
