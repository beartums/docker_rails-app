const Transaction = (props) => {
  return (
    <div>
        {props.transaction.date}, 
        {props.transaction.description}, 
        {props.transaction.transaction_type}, 
        {props.transaction.amount}
    </div>
  )
}
