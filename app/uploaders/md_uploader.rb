class MdUploader < ApplicationUploader
  plugin :pretty_location, identifier: :title
  Attacher.validate do
    validate_mime_type_inclusion ['file.']
  end
end