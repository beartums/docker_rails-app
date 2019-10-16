Rails.application.routes.draw do
  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :transactions, only: [:index, :create, :destroy, :update]
      resources :transactions do 
        collection do
          post :import
        end
      end
    end
  end



  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  #test 
end
