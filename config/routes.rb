Rails.application.routes.draw do

  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  root "home#index"
  get "/upload", to: "home#upload"
  post "/upload", to: "home#uploaded"

  resources :books, only: [:index, :show, :new, :create]
  
end
