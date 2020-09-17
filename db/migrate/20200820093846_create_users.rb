class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :password
      t.text :about
      t.string :avatar
      t.boolean :as_author
      t.integer :order

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
