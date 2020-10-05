class Users::ProfilesController < ApplicationController
  before_action :authenticate_user!, only: [:follow, :followship]
  before_action :find_user

  def show
  end

  def follow
    current_user.toggle_following(@user)

    # create the notification
    respond_to do |format|
      format.html { redirect_to profile_path }
      format.json { render json: {status: @user.followed_by?(current_user)} }
    end
  end

  def followship
    @followers = current_user.followers
    @followees = current_user.followees
  end
  
  private
  def find_user
    @user = User.find_by(username: params[:username])
  end
end