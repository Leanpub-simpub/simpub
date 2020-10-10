class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :book, null: false, foreign_key: true
      t.text :content
      t.integer :stars, default: 0

      t.timestamps
    end
  end
end
