class PeriodService {
  getPeriodCount = () => {
    let startDate = this.getStartDate();
    let endDate = this.getEndDate();
    return this.getPeriod(startDate, endDate)+1;
  }

  getEndDate = () => {
    let settings = this.props.settings;
    let endDate = new Date(settings.START.YEAR, settings.START.MONTH-1 + settings.DISPLAY.COLUMNS, settings.START.DAY);
    endDate = endDate > new Date() ? new Date() : endDate;
    return endDate;
  }

  getStartDate = () => {
    let settings = this.props.settings;
    return new Date(settings.START.YEAR, settings.START.MONTH-1, settings.START.DAY);
  }

  getPeriod = (startDate, date) => {
    let yearDiff = date.getYear() - startDate.getYear();
    let monthDiff = date.getMonth() - startDate.getMonth();
    let period = monthDiff + yearDiff * 12;
    period -= startDate.getDate() > date.getDate() ? 1 : 0;
    return period;
  }
}

export default PeriodService;