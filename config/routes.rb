Rails.application.routes.draw do

  devise_for :users
  root "home#index"

  get "/upload", to: "home#upload"
  
end
