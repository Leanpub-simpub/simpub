require "image_processing/mini_magick"

class CoverUploader < Shrine
  plugin :validation_helpers
  plugin :pretty_location
  plugin :derivatives
  plugin :default_url
  
  Attacher.validate do
    validate_mime_type_inclusion ['image/jpg', 'image/jpeg', 'image/png']
  end

  Attacher.derivatives do |original|
    magick = ImageProcessing::MiniMagick.source(original)
    # magick.convert('jpg')
    # file.metadata['mime_type']

    { 
      large:  magick.resize_to_limit!(800, 800),
      medium: magick.resize_to_limit!(500, 500),
      small:  magick.resize_to_limit!(200,200),
    }
  end

  Attacher.default_url do |**options|
    url if derivatives
  end
end