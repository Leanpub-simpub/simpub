require "shrine"
require "shrine/storage/s3"
 
s3_options = { 
  bucket:            ENV["bucket"], # required 
  region:            ENV["region"], # required 
  access_key_id:     ENV["awsS3_id"],
  secret_access_key: ENV["awsS3_key"]
}
 

Shrine.storages = {
  cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options), # temporary
  store: Shrine::Storage::S3.new(prefix: "store", **s3_options), # permanent
}

Shrine.plugin :activerecord           # loads Active Record integration
Shrine.plugin :cached_attachment_data # enables retaining cached file across form redisplays
Shrine.plugin :restore_cached_data    # extracts metadata for assigned cached files
Shrine.plugin :derivatives
