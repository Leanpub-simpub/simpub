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
    @books = current_user.wish_books

    respond_to do |format|
      format.html
      format.json { render json: @books.pluck(:slug) }
    end
  end

  def unwish
    book = Book.friendly.find(params[:id])
    current_user.wish_books.destroy(book)
    redirect_to wishlist_path, notice: "已從願望清單中移除"
  end
  
  private
  def find_user
    @user = User.find_by(username: params[:username])
  end
end
