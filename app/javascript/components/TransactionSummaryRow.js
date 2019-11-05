import React from 'react';
import { getSignedAmount } from '../services/transactionService';
import * as numeral from 'numeraljs';
import PropTypes from 'prop-types';
import { Period } from './classes';
import moment from 'moment';

class TransactionSummaryRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSummarized: this.props.isSummarized
    }
  }

  getDateFromIsoString = (isoDate) => {
    let dateArray = isoDate.split('-');
    return new Date(dateArray[0], dateArray[1]-1, dateArray[2])
  }

  getPeriodTotals = (categories, periods) => {

    let amountArray = new Array(periods.length).fill(0);
    categories.forEach(category => {
      category.transactions.forEach( (transaction) => {
        //let transDate = this.getDateFromIsoString(transaction.date);
        //if (periods[0].startDate > transDate || periods[periods.length-1].endDate <= transDate) return;
        for (let i = 0; i < periods.length; i++) {
          let period = periods[i];
          if (period.isInPeriod(transaction.date)) {
            amountArray[i] += getSignedAmount(transaction);
            break;
          }
        }        
      });
    });
    if (this.props.setFunction && typeof this.props.setTotals == 'function') {
      this.props.setTotals(amountArray);
    }
    return amountArray

  }
  findPeriodIndex = (transaction, periods, currentIndex) => {
    // periods will be in order from earliest to latest.  It is expected the transactions will be
    // also, so the best way to find the right one is move relative to the current period
    currentIndex = currentIndex || 0;
    let currentPeriod = periods[currentIndex];
    while (transaction.date < currentPeriod.startDate | transaction.date > currentPeriod.endDate) {
      if (transaction.date < currentPeriod.startDate) {
        currentPeriod = periods[--currentIndex]
      } else {
        currentPeriod = periods[++currentIndex]
      }
      if (!currentPeriod) throw new Error("period not found");
    }
    return currentIndex;
  }

  toggleSummarized = () => {
    let isSumarized = this.state.isSumarized;
    //this.setState({ isSummarized: !isSummarized });
    this.props.toggleSummarized(this.props.group.name);
  }

  render() {
    //let periodTotals = 
    // this.getPeriodTotals(this.props.group.categories, this.props.periods);
    return (
      <tr>
        <td><input type="checkbox" checked={this.state.isSummarized} onClick={this.toggleSummarized} /></td>
        <td>{this.props.group.name}</td>
        { this.props.periods.map( (period,idx) => {
            return (
              <td key={idx} className="text-right">
                {numeral(period.getCategorySums(this.props.group.categories)).format('$0.00')}
              </td>
            )
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
  }),
  setTotals: PropTypes.func
}