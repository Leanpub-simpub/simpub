class AddUuidToOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :orders, :uuid, :uuid, null: false
  end
end
