class HomeController < ApplicationController

  def index
  end

  def upload
    @book = current_user.books.new 
    
  end



  private
  params

  
end


