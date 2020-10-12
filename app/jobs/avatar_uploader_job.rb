class AvatarUploaderJob < ApplicationJob
  queue_as :default

  def perform(user, **crop)
    user.avatar_derivatives!(crop)
    user.save
  end
end