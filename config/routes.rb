Rails.application.routes.draw do

  devise_for :users
  root "home#index"

  resources :books, only: [:new, :create]
  
end
