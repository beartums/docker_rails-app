import moment from 'moment';
import { getSignedAmount } from '../services/transactionService'

export class Period {
  rangeType = 'M';
  rangeCount = 1;
  startDate = null;
  endDate = null;
  transactions = [];
  transactionsByCategory = [];
  totalsByCategory = {};

  constructor(rangeStartDate, periodOffset, rangeType, rangeCount) {
    this.rangeType = rangeType || 'M';
    this.rangeCount = rangeCount || 1;
    periodOffset = periodOffset || 0;
    let totalRangeCount = rangeCount * periodOffset;
    let startDate = moment(rangeStartDate).add(totalRangeCount, rangeType);
    this.startDate = startDate.toDate();
    let endDate = startDate.add(rangeCount, rangeType);
    this.endDate = endDate.toDate();
  }

  setPeriodTransactions = (transactions) => {
    // take a list of raw transactions and collect them if they are in this period
    this.transactions = [];
    this.transactionsByCategory = {};
    this.totalsByCategory = {};

    this.transactions = transactions.reduce( (tList, transaction) => {
      if (this.isInPeriod(transaction.date)) {
        tList.push(transaction);
        if (!this.transactionsByCategory[transaction.category]) {
          this.transactionsByCategory[transaction.category] = [];
          this.totalsByCategory[transaction.category] = 0;
        }
        this.transactionsByCategory[transaction.category].push(transaction);
        this.totalsByCategory[transaction.category] += getSignedAmount(transaction)
      }
      return tList;
    }, []);
  }

  isInPeriod = (isoDate) =>{
    let isoStart = this.startDate.toISOString();
    let isoEnd = this.endDate.toISOString()
    return isoDate >= isoStart && isoDate < isoEnd
  }

  getRelativePeriod = (date) => {
    let diff = Period.getPeriodTypeDiff(this.startDate, date);
    let offset = Math.ceil(diff/this.rangeCount);
    let period = this.getOffsetPeriod(offset);
    return period;
  }

  getOffsetPeriod = (offset) => {
    return new Period(
      this.startDate, offset, this.rangeType, this.rangeCount
    );
  }

  getCategorySums = (categories) => {
    return categories.reduce( (total, cat) => {
      return total += this.totalsByCategory[cat.name] ? this.totalsByCategory[cat.name] : 0;
    },0);
  }

  static getPeriodDiff = (periodA, periodB) => {
    return Math.ceil(Period.getPeriodTypeDiff(periodA.startDate, periodB.startDate)/periodA.rangeCount);  
  }

  static getPeriodTypeDiff = (date1, date2, type = 'M') => {
    // currently enabled only for Months
    let months =date2.getMonth() - date1.getMonth();
    let years = date2.getFullYear() - date1.getFullYear();
    let diff = months + years * 12;
    diff += date2.getDate() < date1.getDate() ? -1 : 0;

    return diff || 0;
  }

  static isoToDate = (isoString) => {
    isoArray = isoString.split('-');
    return new Date(isoArray[0], isoArray[1]-1, isoArray[2]);
  }
}

export class CategoryGroup {
  constructor(name, categories) {
    this.name = name;
    this.categories = categories;
  }
}
