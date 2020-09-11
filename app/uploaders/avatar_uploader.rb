class AvatarUploader < ApplicationUploader
  plugin :pretty_location, identifier: :username
  Attacher.validate do
    validate_mime_type_inclusion ['image/jpg', 'image/jpeg', 'image/png']
  end
end