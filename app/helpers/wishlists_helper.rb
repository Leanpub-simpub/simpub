module WishlistsHelper
  def current_wishlist
    @wishlist ||= Wishlist.from_hash(session[Wishlist::SessionKey])
  end
  
end
