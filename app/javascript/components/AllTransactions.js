import React from "react"
import PropTypes from "prop-types"
import Transaction from "./Transaction";

class AllTransactions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.transactions) return '';
    return this.props.transactions.map( transaction => {

      return (
        <Transaction key={transaction.id} transaction={transaction} />
      )
    })
  }
}

export default AllTransactions
