class Users::LibraryController < ApplicationController

  def show
    if user_signed_in?
      @books = current_user.bought_books
      @book_info = Book.find_by(id: params[:id]).as_json(include: :authors)
      @comment = current_user.comments.new

      respond_to do |format|
        format.html
        format.json { render json: @book_info }
      end
      
    else
      redirect_to new_user_session_path, alert: 'You need to sign in or sign up before continuing.'
    end
    
  end
  
  def comment
    @book = current_user.bought_books.find_by(id: params[:id])
    comment = @book.comments.new(comment_params)

    if comment.save
      create_notification(@book.authors[0], current_user, "left a comment on", @book)
      redirect_to book_path(@book), notice: "New comment added"
    else
      redirect_to users_library_path, notice: "Something went wrong please try again"
    end
  end


  private
  def comment_params
    params.require(:comment).permit(:stars, :content).merge(user: current_user)
  end
  
end