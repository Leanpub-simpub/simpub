class Users::AuthorsController < ApplicationController

  def show
    if not user_signed_in?
      redirect_to new_user_session_path, alert: 'You need to sign in or sign up before continuing.'
    else
      if not current_user.as_author
        redirect_to new_book_path, alert: 'Create your books.'
      end
    end
  end

end