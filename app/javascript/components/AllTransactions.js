import React from "react"
import PropTypes from "prop-types"
import Transaction from "./Transaction";

class AllTransactions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.transactions) return '';

    let transactionsJsx = this.props.transactions.map( transaction => {

      return (
        <Transaction key={transaction.id} transaction={transaction} />
      )
    })
    transactionsJsx = <table className="table table-condensed"><tbody>{transactionsJsx}</tbody></table>
    return transactionsJsx;
  }
}

export default AllTransactions
