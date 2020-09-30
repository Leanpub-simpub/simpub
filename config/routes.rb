Rails.application.routes.draw do

  root "home#index"

  # 測試用
  devise_for :users, controllers: { registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks" }
  
  # 正式用
  # devise_for :users, controllers: { registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks", confirmations: "users/confirmations" }
  
  devise_scope :user do
    get "/user_dashboard/settings", to: "users/registrations#edit", as: "user_dashboard"
  end

  get "/u/:username", to: "users/profiles#show", as: "profile"
  get "/dash_board/books", to: "users/authors#show"
  get "/dash_board/library", to: "users/library#show", as: "library"

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
      post :sample
      post :table_of_contents
      post :read
      
    end
    
    collection do
      get :search
      post :get_content
      post :update_content
      post :rename
    end
  end

  get "/purchase", to: "users/purchase#index"

  resource :cart, only:[:show, :destroy] do
    collection do
      post :add, path:'add/:id'
      get :payment
      post :checkout
    end
  end

  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
