class AddContentToBook < ActiveRecord::Migration[6.0]
  def change
    add_column :books, :content, :text
  end
end
