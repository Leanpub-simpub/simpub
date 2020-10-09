class FollowshipsController < ApplicationController
  before_action :authenticate_user!

  def show
    @followers = current_user.followers
    @followees = current_user.followees
  end

  def create
    @user = User.find_by(id: params[:follower_id])
    current_user.followers << @user

    if is_following?(@user)
      render js: "alert('已經追蹤該作者')"
    else
      current_user.followers << @user
      redirect_to users_followship_path(current_user), notice: "已追蹤作者"
    end
  end

  def destroy
    @followship = Followship.find_by(id: params[:id])
    @followship.destroy
    redirect_to root_path, notice: "已取消追蹤"
  end

  private
  def is_following?(user)
    current_user.followers.include?(user)
  end

end