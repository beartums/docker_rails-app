import React from 'react';
import { getSignedAmount } from '../services/transactionService';
import * as numeral from 'numeraljs';
import PropTypes from 'prop-types';
import moment from 'moment';

class TransactionSummaryRow extends React.Component {

  constructor(props) {
    super(props);
  }

  getDateFromIsoString = (isoDate) => {
    let dateArray = isoDate.split('-');
    return new Date(dateArray[0], dateArray[1]-1, dateArray[2])
  }

  getPeriodTotals = (categories, periods) => {

    let amountArray = new Array(periods.length).fill(0);
    categories.forEach(category => {
      category.transactions.forEach( (transaction) => {
        let transDate = this.getDateFromIsoString(transaction.date);
        if (periods[0].startDate > transDate || periods[periods.length-1].endDate <= transDate) return;
        for (let i = 0; i < periods.length; i++) {
          let period = periods[i];
          if (period.startDate <= transDate && period.endDate >= transDate) {
            amountArray[i] += getSignedAmount(transaction);
            break;
          }
        }        
      });
    });

    return amountArray
  }

  render() {
    let periodTotals = this.getPeriodTotals(this.props.group.categories, this.props.periods);
    return (
      <tr>
        <td>{this.props.group.name}</td>
        { periodTotals.map( (total,idx) => {
            return <td key={idx} className="text-right">{numeral(total).format('$0.00')}</td>
          })
        }
      </tr>
    )

  }
}

export default TransactionSummaryRow;

TransactionSummaryRow.propTypes = {
  periods: PropTypes.arrayOf(PropTypes.shape({
    startDate: PropTypes.date,
    endDate: PropTypes.date,
  })).isRequired,
  group: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    categories: PropTypes.array
  })
}