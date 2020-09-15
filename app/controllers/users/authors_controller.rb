class Users::AuthorsController < ApplicationController

  def show
    if not user_signed_in?
      redirect_to new_user_session_path, alert: 'You need to sign in or sign up before continuing.'
    end
  end

end