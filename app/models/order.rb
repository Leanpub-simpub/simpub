class Order < ApplicationRecord
  require 'securerandom'
  
  acts_as_paranoid

  before_create :generate_uuid

  belongs_to :user
  has_many :order_items, dependent: :destroy

  private
  def generate_uuid
    self.uuid = SecureRandom.uuid
  end

  include AASM
  aasm(column: "state") do
    state :success, initial: true
    state :refund

    event :return do
      transitions from: :success, to: :refund
    end
  end

end
