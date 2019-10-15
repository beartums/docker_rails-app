class AllTransactions extends React.Component {
      
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    };
  }

  componentDidMount(){
    fetch('/api/v1/transactions.json')
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ transactions: data }) });
  }

  render() {
    return this.state.transactions.map( transaction => {

      return (
        <Transaction key={transaction.id} transaction={transaction} />
      )
    })
  }
}