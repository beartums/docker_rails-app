class AllTransactions extends React.Component {
      
  constructor(props) {
    super(props);
    console.log(this.props.transactions.count)
    
  }

  render() {
    return this.props.transactions.map( transaction => {

      return (
        <Transaction key={transaction.id} transaction={transaction} />
      )
    })
  }
}