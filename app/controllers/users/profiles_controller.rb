class Users::ProfilesController < ApplicationController
  before_action :authenticate_user!, except: [:show]
  before_action :find_user
  before_action :find_book, only: [:unwish, :wishcart]

  def show
  end

  def follow
    current_user.toggle_following(@user)
    followship = Followship.find_by(follower_id: @user, followee_id: current_user)
    
    # create the notification
    create_notification(@user, current_user, "starts following", followship) if followship
    
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
    remove_wish_book(@book)
    redirect_to users_wishlist_path, notice: "已從願望清單中移除"
  end

  def wishcart
    remove_wish_book(@book)
  end
  
  private
  def find_user
    @user = User.find_by(username: params[:username])
  end

  def find_book
    @book = Book.friendly.find(params[:id])
  end

  def remove_wish_book(book)
    current_user.wish_books.destroy(book)
  end
end
