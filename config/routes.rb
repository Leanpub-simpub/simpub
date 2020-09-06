Rails.application.routes.draw do

  devise_for :users,
    controllers: { registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks" }

  root "home#index"

  resources :books, only: [:index, :show, :new, :create]
  
end
