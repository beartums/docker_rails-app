import React from 'react';
import TransactionSummaryRow from './TransactionSummaryRow';
import TransactionSummaryHeader from './TransactionSummaryHeader';
import { FaChevronLeft, FaChevronRight, FaBackward, FaForward, FaStepBackward, FaStepForward } from 'react-icons/fa'
import moment from 'moment';


var GLOBAL_SETTINGS = {
  START_DATE: new Date(2019,7,6), // August 6 2019,
  PERIOD_RANGE_TYPE: 'M',
  PERIOD_RANGE_COUNT: 1,
  PERIOD_COUNT: 3,
}

class Period {
  constructor(rangeStartDate, periodOffset, rangeType, rangeCount) {
    let totalRangeCount = rangeCount * periodOffset;
    let startDate = moment(rangeStartDate).add(totalRangeCount, rangeType);
    this.startDate = startDate.toDate();
    let endDate = startDate.add(rangeCount, rangeType).subtract(1,'d');
    this.endDate = endDate.toDate();
  }
}

class TransactionSummaryTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SETTINGS: GLOBAL_SETTINGS
    }
  }
  changeStartDate = (delta) => {
    let SETTINGS = this.state.SETTINGS
    let periodOffset = 0;
    let period;
    if (delta === Number.MAX_SAFE_INTEGER) {
      period = this.getExtremePeriod('max')
      period = new Period (
        period.startDate,-1 * SETTINGS.PERIOD_COUNT + 1,
        SETTINGS.PERIOD_RANGE_TYPE, SETTINGS.PERIOD_RANGE_COUNT
      );
    } else if (delta === Number.MIN_SAFE_INTEGER) {
      period = this.getExtremePeriod('min')
    } else {
      period = new Period(
        SETTINGS.START_DATE, delta, 
        SETTINGS.PERIOD_RANGE_TYPE, SETTINGS.PERIOD_RANGE_COUNT
      );
    }
    SETTINGS.START_DATE = period.startDate;
    this.setState({SETTINGS: SETTINGS});
  }

  getPeriodTypeDiff = (periodStartDate, transactionDate) => {

    let months = transactionDate.getMonth() - periodStartDate.getMonth();
    let years = transactionDate.getFullYear() - periodStartDate.getFullYear();
    let monthDiff = months + years * 12;
    monthDiff += transactionDate.getDate() < periodStartDate.getDate() ? -1 : 0;

    return monthDiff || 0;
  }
  getPeriodDiff = (periodA, periodB) => {
    let divisor = this.state.SETTINGS.PERIOD_RANGE_COUNT;
    return Math.ceil(this.getPeriodTypeDiff(periodA.startDate, periodB.startDate)/divisor);
  }

  getExtremePeriod = (minmax) => {
    let SETTINGS = this.state.SETTINGS;
    minmax = (minmax == 'min' || minmax == 'max') ? minmax : 'min'
    let months = this.getPeriodTypeDiff(SETTINGS.START_DATE, this.props[`${minmax}Date`]);
    let periodOffset = Math.ceil(months/SETTINGS.PERIOD_RANGE_COUNT);
    let period = new Period(
      SETTINGS.START_DATE, periodOffset, 
      SETTINGS.PERIOD_RANGE_TYPE, SETTINGS.PERIOD_RANGE_COUNT
    );
    return period;
  }

  isEarliestPeriod = (date) => {
    if (!date) return;
    let period = this.getExtremePeriod('min');
    return date >= period.startDate && date <= period.endDate;
  }
  isMostRecentPeriod = (date) => {
    if (!date) return;
    let period = this.getExtremePeriod('max');
    return date >= period.startDate && date <= period.endDate;
  }

  render() {
    let SETTINGS = this.state.SETTINGS;
    let periods = new Array(SETTINGS.PERIOD_COUNT).fill({startDate:null,endDate:null});
    periods.forEach((period,idx) => {
      periods[idx] = new Period(SETTINGS.START_DATE, idx, SETTINGS.PERIOD_RANGE_TYPE, SETTINGS.PERIOD_RANGE_COUNT);
    })
    return(
      <div class-name="row">
        <div className="col-12">

          <div className="row">
            <div className="col-6">
                <button className="btn btn-sm" disabled={this.isEarliestPeriod(periods[0].startDate)}
                      title='Step backward one period'
                      onClick={() => this.changeStartDate(-1)}>
                      <FaChevronLeft />
                </button>
                &nbsp;
                <button className="btn btn-sm" disabled={this.isEarliestPeriod(periods[0].startDate)}
                      title='Jump backward one page'
                      onClick={() => this.changeStartDate(-1*SETTINGS.PERIOD_COUNT)}>
                      <FaBackward />
                </button>
                &nbsp; 
                <button className="btn btn-sm" disabled={this.isEarliestPeriod(periods[0].startDate)}
                      title='Go to the oldest period'
                      onClick={() => this.changeStartDate(Number.MIN_SAFE_INTEGER)}>
                      <FaStepBackward />
                </button>
            </div>
            <div className="col-6 text-right">
                <button className="btn btn-sm" disabled={this.isMostRecentPeriod(periods[periods.length-1].startDate)} 
                      title='Go to the newest period'
                      onClick={() => this.changeStartDate(Number.MAX_SAFE_INTEGER)}>
                  <FaStepForward />
                </button>
                &nbsp; 
                <button className="btn btn-sm"  disabled={this.getPeriodDiff(periods[periods.length-1],this.getExtremePeriod('max'))<3}
                      title='Jump forward one page'
                      onClick={() => this.changeStartDate(SETTINGS.PERIOD_COUNT)}>
                  <FaForward />
                </button>
                &nbsp; 
                <button className="btn btn-sm"  disabled={this.isMostRecentPeriod(periods[periods.length-1].startDate)} 
                      title='Step forward one period'
                      onClick={() => this.changeStartDate(1)}>
                  <FaChevronRight />
                </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table className="table table-condensed table-xs">
                <TransactionSummaryHeader periods={periods} />
                <tbody>
                  { this.props.groups.map(group => {
                    return <TransactionSummaryRow key={group.id} group={group} periods={periods} />
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    )

  }
}

export default TransactionSummaryTable;