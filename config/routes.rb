Rails.application.routes.draw do

  root "home#index"

  devise_for :users, controllers: { registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks" }
  
  devise_scope :user do
    get "/user_dashboard/settings", to: "users/registrations#edit", as: "user_dashboard"
  end

  get "/u/:username", to: "users/profiles#show", as: "profile"
  get "/dash_board/books", to: "users/authors#show"

  resources :books

  resource :cart, only:[:show, :destroy] do
    collection do
      post :add, path:'add/:id'
    end
  end
end
