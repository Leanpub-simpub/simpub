class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:facebook, :google_oauth2, :github]

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  has_many :book_authors
  has_many :pub_books, through: :book_authors, source: :book

  has_many :book_users
  has_many :bought_books, through: :book_users, source: :book

  def self.from_omniauth(auth, signed_in_resource = nil)
    
    identity = Identity.find_for_oauth(auth)
    user = signed_in_resource ? signed_in_resource : identity.user
      if user.nil?
        email = auth.info.email
        user = User.where(email: email).first if email
        if user.nil?
          user = User.new(name: auth.info.name.gsub(/\s+/, '_'),
                          email: auth.info.email,
                          password: Devise.friendly_token[0,20])
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
