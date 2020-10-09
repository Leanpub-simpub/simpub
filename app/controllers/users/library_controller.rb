class Users::LibraryController < ApplicationController

  def show
    @books = current_user.bought_books
    @book_info = Book.find_by(id: params[:id]).as_json(include: :authors)
    @comment = current_user.comments.new

    respond_to do |format|
      format.html
      format.json { render json: @book_info }
    end
  end
  
  def comment
    book = current_user.bought_books.find_by(id: params[:id])
    comment = book.comments.new(comment_params)

    if comment.save
      redirect_to book_path(book), notice: "已新增留言"
    else
      redirect_to users_library_path, notice: "留言失敗，請重新嘗試"
    end
  end


  private
  def comment_params
    params.require(:comment).permit(:stars, :content).merge(user: current_user)
  end
  
end