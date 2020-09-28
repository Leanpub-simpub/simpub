class User < ApplicationRecord
  include AvatarUploader::Attachment(:avatar)

  # 測試用
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:facebook, :google_oauth2, :github]
  
  # 正式用
  # devise :database_authenticatable, :registerable,
  #        :recoverable, :rememberable, :validatable, :confirmable,
  #        :omniauthable, omniauth_providers: [:facebook, :google_oauth2, :github]

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true
  validates :username, presence: true, uniqueness: true

  has_many :book_authors
  has_many :pub_books, through: :book_authors, source: :book

  has_many :book_users
  has_many :bought_books, through: :book_users, source: :book

  has_many :orders

  has_many :followers, foreign_key: :follower_id, class_name: :followship
  has_many :followers, through: :followed
  
  has_many :followed, foreign_key: :followed_id, class_name: :followship
  has_many :followed, through: :followers

  def self.from_omniauth(auth, signed_in_resource = nil)
    identity = Identity.find_for_oauth(auth)
    user = signed_in_resource ? signed_in_resource : identity.user
      if user.nil?
        email = auth.info.email
        user = User.where(email: email).first if email
        if user.nil?
          user = User.new(name: auth.info.name.gsub(/\s+/, '_'),
                          email: auth.info.email,
                          password: Devise.friendly_token[0,20],
                          username: auth.info.name.gsub(/\s+/, '_').downcase)
          user.save!   
        end
      end

      if identity.user != user
        identity.user = user
        identity.save!
      end
      
    user
  end
  
end
