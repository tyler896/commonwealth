# frozen_string_literal: true

class CreateSpreeWholesaleTierSettings < ActiveRecord::Migration[8.1]
  def change
    create_table :spree_wholesale_tier_settings do |t|
      t.references :store, null: false, foreign_key: { to_table: :spree_stores }
      t.string :tier, null: false
      t.decimal :minimum_order_amount, precision: 10, scale: 2, null: false, default: 0
      t.timestamps
    end

    add_index :spree_wholesale_tier_settings, [:store_id, :tier], unique: true
  end
end
