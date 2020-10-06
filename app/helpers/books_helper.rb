module BooksHelper
  def has_published?(book)
    book.publish_state == "on_shelf"
  end
end