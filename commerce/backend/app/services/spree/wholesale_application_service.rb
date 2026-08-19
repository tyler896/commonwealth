# frozen_string_literal: true

module Spree
  class WholesaleApplicationService
    Result = Struct.new(:success?, :application, :user, :errors, keyword_init: true)

    def self.apply!(store:, params:)
      new(store: store, params: params).apply!
    end

    def initialize(store:, params:)
      @store = store
      @params = params.to_h.with_indifferent_access
    end

    def apply!
      errors = []
      email = @params[:email].to_s.strip.downcase
      password = @params[:password].to_s
      password_confirmation = @params[:password_confirmation].presence || password

      errors << 'email is required' if email.blank?
      errors << 'password is required' if password.blank?
      errors << 'password must be at least 8 characters' if password.present? && password.length < 8
      errors << 'company_name is required' if @params[:company_name].to_s.strip.blank?
      errors << 'contact_name is required' if @params[:contact_name].to_s.strip.blank?

      if email.present? && Spree::WholesaleApplication.where(store: @store, email: email, status: %w[pending approved]).exists?
        errors << 'an open or approved application already exists for this email'
      end

      return Result.new(success?: false, errors: errors) if errors.any?

      application = nil
      user = nil

      ActiveRecord::Base.transaction do
        user = Spree.user_class.find_by(email: email)
        if user
          unless user.valid_password?(password)
            errors << 'email is already registered — use your account password, or sign in'
            raise ActiveRecord::Rollback
          end
        else
          names = @params[:contact_name].to_s.strip.split(/\s+/, 2)
          user = Spree.user_class.new(
            email: email,
            password: password,
            password_confirmation: password_confirmation,
            first_name: names[0],
            last_name: names[1],
            phone: @params[:phone]
          )
          unless user.save
            errors.concat(user.errors.full_messages)
            raise ActiveRecord::Rollback
          end
        end

        application = Spree::WholesaleApplication.new(
          store: @store,
          user: user,
          company_name: @params[:company_name].to_s.strip,
          contact_name: @params[:contact_name].to_s.strip,
          email: email,
          phone: @params[:phone].to_s.strip.presence,
          website: @params[:website].to_s.strip.presence,
          license_number: @params[:license_number].to_s.strip.presence,
          notes: @params[:notes].to_s.strip.presence,
          status: 'pending'
        )

        unless application.save
          errors.concat(application.errors.full_messages)
          raise ActiveRecord::Rollback
        end
      end

      if application&.persisted?
        Result.new(success?: true, application: application, user: user, errors: [])
      else
        Result.new(success?: false, errors: errors.flatten.compact.uniq)
      end
    end
  end
end
