class CoverUploaderJob < ApplicationJob
  queue_as :default

  def perform(book)
    book.cover_derivatives!
    book.save
  end
end