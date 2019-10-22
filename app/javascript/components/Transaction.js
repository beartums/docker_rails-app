import React from "react";
import { getSignedAmount } from '../services/transactionService';
import * as numeral from 'numeraljs';
import moment from 'moment';


class Transaction extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
          <td>{moment(this.props.transaction.date).format('DD MMM YY')}</td>
          <td width="40%">{this.props.transaction.description}</td>
          <td className="text-right">{numeral(getSignedAmount(this.props.transaction)).format('$0.00')}</td>
          <td>{this.props.transaction.account_name}</td>
      </tr>
    )
  }
}

export default Transaction;
