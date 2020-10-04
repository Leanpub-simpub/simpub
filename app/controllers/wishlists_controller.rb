class WishlistsController < ApplicationController
  
  def show
    respond_to do |format|
      format.html
      format.json { @wishlist = session[Wishlist::SessionKey] }
    end
  end

  def add
    current_wishlist.add_item(params[:id])
    session[Wishlist::SessionKey] = current_wishlist.serialize

    redirect_to books_path, notice: "Already added"
  end

  def destroy
    session[Wishlist::SessionKey] = nil
    redirect_to :wishlist, notice: "已清空"
  end
  
end
  
  


