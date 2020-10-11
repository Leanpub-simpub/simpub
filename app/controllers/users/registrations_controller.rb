# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_permitted_parameters, only: [:create, :update]

  def update
    super

    if params[:x].present?
      current_user.avatar_derivatives!(crop: { x: params[:x], y: params[:y], w: params[:width], h: params[:height] })
    end
  end
 
  private
  # 在 devise 中加入 name & username 欄位
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :username])
    devise_parameter_sanitizer.permit(:account_update, keys: [:avatar, :name, :username, :about, :password, :x, :y, :width, :height])
  end

  # update 的時候不需要驗證密碼
  def update_resource(resource, params)
    new_params = params
    new_params[:password] = nil if new_params[:password] == ""
    resource.update(new_params)
  end
end
