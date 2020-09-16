require 'aws-sdk-s3'
s3 = Aws.config.update(
  region: ENV['region'],
  credentials: Aws::Credentials.new(ENV['awsS3_id'], ENV['awsS3_key'])
)