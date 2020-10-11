class CoverUploader < ApplicationUploader
  plugin :derivatives
  plugin :pretty_location, identifier: :title
  plugin :remote_url, max_size: 20*1024*1024
  
  
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
end