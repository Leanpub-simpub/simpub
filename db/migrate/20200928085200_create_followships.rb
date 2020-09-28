class CreateFollowships < ActiveRecord::Migration[6.0]
  def change
    create_table :followships do |t|
      t.belongs_to :follower, index: true
      t.belongs_to :followed, index: true

      t.timestamps null: false
    end
  end
end
