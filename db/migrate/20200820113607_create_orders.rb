class CreateOrders < ActiveRecord::Migration[6.0]
  def change
    create_table :orders do |t|
      t.belongs_to :book_user, null: false, foreign_key: true
      t.string :payment_term
      t.string :state
      t.float :total

      t.timestamps
    end
  end
end
