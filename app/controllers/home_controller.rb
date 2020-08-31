class HomeController < ApplicationController

  def index
  end

  def upload
    @book = Book.new 
  end

  def uploaded
  end


  private
  
  def upload_params
    params.require(:book).permit(:title, :about, :cover_data)
  end

  
end


