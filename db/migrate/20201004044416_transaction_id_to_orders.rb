class TransactionIdToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :transaction_id, :string
  end
end
