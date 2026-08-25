# frozen_string_literal: true

class CreateSpreeEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :spree_events do |t|
      t.references :store, null: false, foreign_key: { to_table: :spree_stores }
      t.string :title, null: false
      t.string :slug, null: false
      t.text :summary
      t.datetime :starts_at, null: false
      t.datetime :ends_at
      t.string :location
      t.boolean :published, null: false, default: true
      t.integer :position, null: false, default: 0
      t.timestamps
    end

    add_index :spree_events, [:store_id, :slug], unique: true
    add_index :spree_events, [:store_id, :published, :starts_at]
    add_index :spree_events, :position
  end
end
