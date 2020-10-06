class AddCompletenessDefaultToBook < ActiveRecord::Migration[6.0]
  def change
    change_column_default :books, :completeness, from: nil, to: 0
  end
end
