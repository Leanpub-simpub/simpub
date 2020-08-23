class UserRenameAvatarColumn < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :avatar
    add_column :users, :avatar_data, :text
  end
end
