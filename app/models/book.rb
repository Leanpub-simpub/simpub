class Book < ApplicationRecord
  include CoverUploader::Attachment(:cover) # adds an `image` virtual attribute
  include MdUploader::Attachment(:md) # adds an `image` virtual attribute

  before_save :update_slug

  validates :title, presence: true, uniqueness: true
  # validates :price, presence: true

  has_many :taggings
  has_many :tags, through: :taggings
  
  has_many :book_authors
  has_many :authors, through: :book_authors, source: :user

  has_many :book_users
  has_many :readers, through: :book_users, source: :user

  has_one :order_items
  
  # has_rich_text :content

  scope :published_books, -> { where(publish_state: "on_shelf").order(id: :desc) }
  scope :unpublish_books, -> { where.not(publish_state: "on_shelf") }

  scope :with_search, -> (search) { left_joins(:authors, :tags).where("books.title ILIKE :query OR users.name ILIKE :query OR tags.name ILIKE :query", query: "%#{search}%") }
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
      Tag.where(name: item.strip).first_or_create! unless item.blank?}.compact
  end

  def update_slug
    self.slug = title.gsub(/[\+\#]/, "+" => "p", "#" => "sharp").parameterize
  end

  def to_param
    slug
  end

  include AASM
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
