class BookRenameS3Columns < ActiveRecord::Migration[6.0]
  def change
    remove_column :books, :cover
    add_column :books, :cover_data, :text

    remove_column :books, :sample
    add_column :books, :sample_date, :text

    remove_column :books, :completed_content
    add_column :books, :completed_content_data, :text
  end
end
