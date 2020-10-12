Rails.application.routes.draw do

  root "home#index"

  # 測試用
  # devise_for :users, controllers: { registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks" }
  
  # 正式用
  devise_for :users, controllers: { registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks", confirmations: "users/confirmations" }
  # devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  devise_scope :user do
    get "/users", to: "users/registrations#new"
    get "/users/password", to: "users/passwords#new"
    get "/user_dashboard/settings", to: "users/registrations#edit", as: "user_dashboard"
  end

  namespace :users, path: :u do
    get "/:username", to: "profiles#show", as: "profile"
    post "/:username", to: "profiles#follow", as: "follow"
    get "/:username/wishlist", to: "profiles#wishlist", as: "wishlist"
    delete "/:username/unwish", to: "profiles#unwish", as: "unwish"
  end
  
  namespace :users, path: :dash_board do
    get "/followship", to: "profiles#followship"
    get "/books", to: "authors#show"
    get "/library", to: "library#show"
    post "/library", to: "library#comment", as: "comment"
  end

  resources :books do
    member do
      get :editor_new
      post :editor_create
      get :editor_edit
      post :editor_update
      get :pricing
      patch :publish
      post :add_chapter
      post :add_section
      get :sample
      get :table_of_contents
      get :read
      patch :unpublish
      post :wish
    end
    
    collection do
      get :search
      post :get_content
      post :update_content
      post :rename
      post :delete_chapter_or_section
      post :all_content
      post :upload_pdf
      post :download_pdf
    end
  end

  get "/purchases", to: "users/purchase#index"
  get "/purchases_show", to: "users/purchase#show"

  resource :cart, only:[:show, :edit, :update, :destroy] do
    collection do
      post :add, path:'add/:id'
      get :payment
      post :checkout
      patch :delete
      post :refund
    end
  end

  resources :notifications, only: [:index] do
    collection do
      post :mark_as_read
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
