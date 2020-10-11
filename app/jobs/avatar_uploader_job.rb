class AvatarUploaderJob < ApplicationJob
  queue_as :default

  def perform(user, **crop)
    user.avatar_derivatives!(crop)
    user.avatar_data?
    user.save
  end
end