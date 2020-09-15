class CreateBooks < ActiveRecord::Migration[6.0]
  def change
    create_table :books do |t|
      t.string :title
      t.text :about
      t.float :price, default: 0.00
      t.text :catalog
      t.integer :pages
      t.integer :words
      t.string :cover
      t.string :sample
      t.string :completed_content
      t.integer :completeness
      t.string :publish_state, default: "off-shelf"

      t.timestamps
    end
  end
end
