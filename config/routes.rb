Rails.application.routes.draw do

  root "home#index"

  devise_for :users, controllers: { registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks" }
  
  devise_scope :user do
    get "/user_dashboard/settings", to: "users/registrations#edit", as: "user_dashboard"
  end

  get "/u/:username", to: "users/profile#show", as: "profile"

  resources :books, only: [:index, :show, :new, :create]

end
