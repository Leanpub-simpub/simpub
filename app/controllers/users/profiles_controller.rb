class Users::ProfilesController < ApplicationController
  before_action :authenticate_user!, except: [:show]
  before_action :find_user

  def show
  end

  def follow
    current_user.toggle_following(@user)
    
    render json: {status: @user.followed_by?(current_user)}
  end

  def followship
    @followers = current_user.followers
    @followees = current_user.followees
  end

  def wishlist
  end
  
  private
  def find_user
    @user = User.find_by(username: params[:username])
  end
end