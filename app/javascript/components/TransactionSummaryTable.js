import React from 'react';
import TransactionSummaryRow from './TransactionSummaryRow';
import TransactionSummaryHeader from './TransactionSummaryHeader';
import { FaChevronLeft, FaChevronRight, FaBackward, FaForward, FaStepBackward, FaStepForward } from 'react-icons/fa'
import moment from 'moment';
import * as numeral from 'numeraljs';
import { Period } from './classes';


var GLOBAL_SETTINGS = {
  START_DATE: new Date(2019,7,6), // August 6 2019,
  PERIOD_RANGE_TYPE: 'M',
  PERIOD_RANGE_COUNT: 1,
  PERIOD_COUNT: 3,
}

class TransactionSummaryTable extends React.Component {
  constructor(props) {
    super(props);
    let currentPeriod = new Period(GLOBAL_SETTINGS.START_DATE);
    let firstPeriod = this.getExtremePeriod('min', currentPeriod);
    let lastPeriod = this.getExtremePeriod('max', currentPeriod);

    let lastPeriodShown = new Period(currentPeriod.startDate,
      GLOBAL_SETTINGS.PERIOD_COUNT-1,
      currentPeriod.rangeType,
      currentPeriod.rangeCount);

    this.state = {
      SETTINGS: GLOBAL_SETTINGS,
      periodsBeforeFirst: Period.getPeriodDiff(firstPeriod, currentPeriod),
      periodsAfterLast: Period.getPeriodDiff(lastPeriodShown, lastPeriod),
      firstPeriod: firstPeriod,
      lastPeriod: lastPeriod,
      currentPeriod: currentPeriod,
      groupSummaries: {},
      periods: Period.organizeTransactionsIntoPeriods(null,this.props.transactions,firstPeriod)
    }

  }

  setPeriodRelativeCounts = (period) => {
    let lastShownPeriod = this.getLastShownPeriod(period);
    this.setState({
      periodsBeforeFirst: Period.getPeriodDiff(this.state.firstPeriod, period),
      periodsAfterLast: Period.getPeriodDiff(lastShownPeriod, this.state.lastPeriod),
      currentPeriod: period
    });
  }

  getLastShownPeriod = (firstShownPeriod) => {
    let period = new Period(firstShownPeriod.startDate,
                          this.state.SETTINGS.PERIOD_COUNT-1,
                          firstShownPeriod.rangeType,
                          firstShownPeriod.rangeCount);
    return period;
  }

  changeStartDate = (delta) => {
    let periodOffset = 0;
    let period;
    if (delta === Number.MAX_SAFE_INTEGER) {
      period = this.state.lastPeriod;
      period = period.getOffestPeriod(-1 * this.state.SETTINGS.PERIOD_COUNT + 1);
    } else if (delta === Number.MIN_SAFE_INTEGER) {
      period = this.state.firstPeriod;
    } else {
      period = this.state.currentPeriod;
      period = period.getOffsetPeriod(delta);
    }
    this.setPeriodRelativeCounts(period);
  }

  getExtremePeriod = (minmax, currentPeriod) => {
    if (!this.props.minDate) return;
    currentPeriod = currentPeriod || this.state.currentPeriod;
    let minmaxDate = this.props[`${minmax}Date`];
    let period = currentPeriod.getRelativePeriod(minmaxDate);
    return period;
  }

  periodsAfterLast = () => {
    return this.state.periodsAfterLast;
  }
  periodsBeforeFirst = () => {
    return this.state.periodsBeforeFirst;
  }

  toggleSummarized = (group, totals) => {
    let summaries = this.state.groupSummaries;
    summaries[group.name] = totals
    this.setState({
     groupSummaries: summaries
    });
  }

  summarizeTotals = (summaries) => {
    summaries = summaries || this.state.groupSummaries;
    if (!summaries) return [];
    let totals = Object.values(summaries).reduce( (total, summary) => {
      for (let i = 0; i < summary.length; i++) {
        total[i] = total[i] ? total[i] + summary[i] : summary[i];
      }
      return total
    }, []);
    return totals;
  }

  getPeriodsToShow = () => {
    let periods = this.state.periods;
    let keys = Object.keys(periods).sort();
    let idx = keys.indexOf(this.state.currentPeriod.startDate.toISOString())
    let periodsToShow = [];
    for (let i = idx; i < idx + GLOBAL_SETTINGS.PERIOD_COUNT; i++) {
      periodsToShow.push(periods[keys[i]]);
    }
    return periodsToShow;
  }

  render() {
    let periods = this.getPeriodsToShow();
    let numPeriodsToShow = GLOBAL_SETTINGS.PERIOD_COUNT;

    return(
      <div class-name="row">
        <div className="col-12">

          <div className="row">
            <div className="col-6">
                <button className="btn btn-sm" disabled={this.periodsBeforeFirst() === 0}
                      title='Step backward one period'
                      onClick={() => this.changeStartDate(-1)}>
                      <FaChevronLeft />
                </button>
                &nbsp;
                <button className="btn btn-sm" disabled={this.periodsBeforeFirst() < numPeriodsToShow}
                      title='Jump backward one page'
                      onClick={() => this.changeStartDate(-1*numPeriodsToShow)}>
                      <FaBackward />
                </button>
                &nbsp; 
                <button className="btn btn-sm" disabled={this.periodsBeforeFirst() === 0}
                      title='Go to the oldest period'
                      onClick={() => this.changeStartDate(Number.MIN_SAFE_INTEGER)}>
                      <FaStepBackward />
                </button>
            </div>
            <div className="col-6 text-right">
                <button className="btn btn-sm" disabled={this.periodsAfterLast() === 0} 
                      title='Go to the newest period'
                      onClick={() => this.changeStartDate(Number.MAX_SAFE_INTEGER)}>
                  <FaStepForward />
                </button>
                &nbsp; 
                <button className="btn btn-sm"  disabled={this.periodsAfterLast()<3}
                      title='Jump forward one page'
                      onClick={() => this.changeStartDate(numPeriodsToShow)}>
                  <FaForward />
                </button>
                &nbsp; 
                <button className="btn btn-sm"  disabled={this.periodsAfterLast() === 0} 
                      title='Step forward one period'
                      onClick={() => this.changeStartDate(1)}>
                  <FaChevronRight />
                </button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table width="100%" className="table table-condensed table-xs">
                <TransactionSummaryHeader periods={periods} />
                <tbody>
                  { this.props.groups.map(group => {
                    return <TransactionSummaryRow key={group.id} 
                    group={group} 
                    periods={periods}
                    showTransactions={this.props.showTransactions} 
                    toggleSummarized={this.toggleSummarized} />
                  })}
                  <tr>
                    <td colSpan="2"></td>
                    { this.summarizeTotals().map( total => <td>{numeral(total).format('$0.00')}</td>)}
                  </tr>
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