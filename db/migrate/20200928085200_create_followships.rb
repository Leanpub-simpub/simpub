class CreateFollowships < ActiveRecord::Migration[6.0]
  def change
    create_table :followships, force: :cascade do |t|
      t.references :follower, index: true
      t.references :followee, index: true

      t.timestamps null: false
    end
  end
end
