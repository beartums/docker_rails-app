# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

transactions = [
    {date: '1/1/2019', description: 'funny money', amount: 100.04, transaction_type: 'debit'},
    {date: '1/2/2019', description: 'funnier money', amount: 300.04, transaction_type: 'credit'},
    {date: '1/3/2019', description: 'funniest money', amount: 150.04, transaction_type: 'debit'},
    {date: '1/4/2019', description: 'just regular money', amount: 103.04, transaction_type: 'debit'},
]

transactions.each do |transaction|
    Transaction.create(transaction)
end
