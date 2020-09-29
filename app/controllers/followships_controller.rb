class FollowshipsController < ApplicationController
  before_action :authenticate_user!

  def show
    @followers = current_user.followers
    @followees = current_user.followees
  end

  def create
    @user = User.find_by(id: params[:follower_id])
    current_user.followers << @user
    @user.followees << current_user

    redirect_to followship_path(current_user), notice: "已追蹤作者"
  end

  def destroy
    @followship = Followship.find_by(id: params[:id])
    @followship.destroy
    redirect_to :root, notice: "已取消追蹤"
  end

end