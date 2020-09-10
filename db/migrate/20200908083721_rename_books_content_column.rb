class RenameBooksContentColumn < ActiveRecord::Migration[6.0]
  def change
    remove_column :books, :content
    add_column :books, :md_data, :text
  end
end
