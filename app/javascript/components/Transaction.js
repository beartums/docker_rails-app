import React from "react";

class Transaction extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          {this.props.transaction.date}, 
          {this.props.transaction.description}, 
          {this.props.transaction.transaction_type}, 
          {this.props.transaction.amount}
      </div>
    )
  }
}

export default Transaction;
