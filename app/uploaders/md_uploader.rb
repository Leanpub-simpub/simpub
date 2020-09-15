class MdUploader < ApplicationUploader
  plugin :pretty_location, identifier: :title
end