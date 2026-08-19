# frozen_string_literal: true

class CreateSpreeWholesaleApplications < ActiveRecord::Migration[8.1]
  def change
    create_table :spree_wholesale_applications do |t|
      t.references :store, null: false, foreign_key: { to_table: :spree_stores }
      t.references :user, null: true, foreign_key: { to_table: :spree_users }
      t.string :status, null: false, default: 'pending'
      t.string :tier
      t.string :company_name, null: false
      t.string :contact_name, null: false
      t.string :email, null: false
      t.string :phone
      t.string :website
      t.string :license_number
      t.text :notes
      t.datetime :reviewed_at
      t.bigint :reviewed_by_id
      t.timestamps
    end

    add_index :spree_wholesale_applications, :status
    add_index :spree_wholesale_applications, :email
    add_index :spree_wholesale_applications, :tier
    add_index :spree_wholesale_applications, [:store_id, :email]
  end
end
