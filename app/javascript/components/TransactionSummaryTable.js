import React from 'react';
import TransactionSummaryRow from './TransactionSummaryRow';
import TransactionSummaryHeader from './TransactionSummaryHeader';
import { FaChevronLeft, FaChevronRight, FaBackward, FaForward, FaStepBackward, FaStepForward } from 'react-icons/fa'
import moment from 'moment';
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
    let currentPeriod = this.createPeriod(GLOBAL_SETTINGS.START_DATE);
    let firstPeriod = this.getExtremePeriod('min', currentPeriod);
    let lastPeriod = this.getExtremePeriod('max', currentPeriod);

    let lastPeriodShown = this.createPeriod(currentPeriod.startDate,
      GLOBAL_SETTINGS.PERIOD_COUNT-1,
      currentPeriod.rangeType,
      currentPeriod.rangeCount);

    this.state = {
      SETTINGS: GLOBAL_SETTINGS,
      periodsBeforeFirst: Period.getPeriodDiff(firstPeriod, currentPeriod),
      periodsAfterLast: Period.getPeriodDiff(lastPeriodShown, lastPeriod),
      firstPeriod: firstPeriod,
      lastPeriod: lastPeriod,
      currentPeriod: currentPeriod
    }

  }

  createPeriod = (startDate, offset, rangeType, rangeCount) => {
    let period = new Period(startDate, offset, rangeType, rangeCount);
    return period;
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

  toggleSummarized = (groupName, totals) => {
    let toggles = this.state.summarizedGroupToggles;
    toggles[groupName] = !toggles[groupName]
    this.setState({
      summarizeGroupToggles: toggles
    });
  }

  summarizeTotals = (groups, summarizeGroupToggles) => {
    let totals = groups.forEach( group => {
      if (summarizedGroupToggles[group.name]) {
        group.totals.forEach( (total, idx) => {
          totals[idx] += total;
        })
      }
    });
    return totals;
  }

  render() {
    let numPeriodsToShow = this.state.SETTINGS.PERIOD_COUNT
    let periods = [];
    let totals = [];
    let startPeriod = this.state.currentPeriod;
    for (let i = 0; i < numPeriodsToShow; i++) {
      let period = new Period(startPeriod.startDate, i, startPeriod.rangeType, startPeriod.rangeCount);
      period.setPeriodTransactions(this.props.transactions);
      periods.push(period);
    }

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
                    return <TransactionSummaryRow key={group.id} group={group} periods={periods} toggleSummarized={this.toggleSummarized} />
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