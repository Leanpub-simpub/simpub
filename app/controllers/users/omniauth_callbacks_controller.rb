class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  
  def facebook
    @user = User.from_omniauth(request.env["omniauth.auth"], current_user)
    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: "Facebook") if is_navigational_format?
    else

      if @user.email.nil?
        @user.delete_access_token(request.env["omniauth.auth"])
        redirect_to new_user_registration_url, alert: "需要您同意 Email 授權唷！"
      else
        session["devise.facebook_data"] = request.env["omniauth.auth"]
        redirect_to "/"
      end
    end
  end

  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"], current_user)
    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
      sign_in_and_redirect @user, event: :authentication
    else
      session["devise.google_data"] = request.env["omniauth.auth"]
      redirect_to "/"
    end
  end

  def github
    @user = User.from_omniauth(request.env["omniauth.auth"])
    sign_in_and_redirect @user
  end


  def failure
    redirect_to new_user_session_path, alert: "無法獲得驗證！"
  end

end