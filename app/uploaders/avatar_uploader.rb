class AvatarUploader < ApplicationUploader
  plugin :pretty_location, identifier: :username
  plugin :remote_url, max_size: 20*1024*1024

  Attacher.validate do
    validate_mime_type_inclusion ['image/jpg', 'image/jpeg', 'image/png']
  end
end