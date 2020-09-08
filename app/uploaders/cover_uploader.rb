require "mini_magick"
require "image_processing/mini_magick"

class CoverUploader < Shrine
  plugin :validation_helpers
  plugin :pretty_location
  plugin :derivatives
  
  Attacher.validate do
    validate_mime_type_inclusion ['image/jpg', 'image/jpeg', 'image/png']
  end

  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)
    { 
      large:  magick.resize_to_limit!(800, 800),
      medium: magick.resize_to_limit!(500, 500),
      small:  magick.resize_to_limit!(200,200),
    }
  end

  photo = Photo.new(image: file)
 
  if photo.valid?
    photo.image_derivatives! if photo.image_changed? # create derivatives 
    photo.save
  end
end