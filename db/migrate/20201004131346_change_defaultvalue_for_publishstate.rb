class ChangeDefaultvalueForPublishstate < ActiveRecord::Migration[6.0]
  def change
    change_column_default :books, :publish_state, "draft"
  end
end
