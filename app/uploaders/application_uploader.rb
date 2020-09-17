require "image_processing/mini_magick"
class ApplicationUploader < Shrine
  plugin :validation_helpers
end