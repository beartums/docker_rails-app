class Api::V1::TransactionsController < ApplicationController
    def index
      render json: Transaction.all
    end
  
    def create
      transaction = Transaction.create(transaction_params)
      render json: transaction
    end
  
    def destroy
      transaction.destroy(params[:id])
    end
  
    def update
      transaction = Transaction.find(params[:id])
      transaction.update_attributes(transaction_params)
      render json: transaction
    end

    def import
      result = Transaction.import(params[:file].path)
      #puts result.to_s
      render :json => {count: result.count, status: :created}
    end
  
    private
  
    def transaction_params
      params.require(:transaction).permit(:id, :date, :description,
                     :amount, :transaction_type, :account_name, :category)
    end
  end