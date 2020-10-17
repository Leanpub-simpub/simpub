class AvatarUploader < ApplicationUploader
  plugin :derivatives
  plugin :default_url
  plugin :pretty_location, identifier: :username
  plugin :remote_url, max_size: 20*1024*1024
  
  
  Attacher.validate do
    validate_mime_type_inclusion ['image/jpg', 'image/jpeg', 'image/png']
  end

  Attacher.derivatives do |original, crop: nil|
    magick = ImageProcessing::MiniMagick.source(original)
    magick = magick.crop("#{crop[:w]}x#{crop[:h]}+#{crop[:x]}+#{crop[:y]}") if crop
    {
      small:  magick.resize_to_limit!(300, 300)
    }
  end

  Attacher.default_url do |**options|
    url if derivatives
  end
end