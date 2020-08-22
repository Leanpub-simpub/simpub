class CreateBookUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :book_users do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :book, null: false, foreign_key: true

      t.timestamps
    end
  end
end
