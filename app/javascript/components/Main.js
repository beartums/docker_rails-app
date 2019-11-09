import React from "react";
import PropTypes from "prop-types";
import ImportTransactionsForm from "./ImportTransactionsForm";
import AllTransactions from "./AllTransactions";
import CategoryGroups from './CategoryGroups';
import { getCategories } from '../services/transactionService'
import SETTINGS from '../services/settings';

const TABS = {
  ALL: 'allTransactions',
  GROUPS: "groups",
  TRANSACTIONS: "transactions"
}

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      minDate: null,
      maxDate: null,
      categories: [],
      tab: TABS.TRANSACTIONS,
      isLoading: true,
    };
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);

  }

  componentDidMount() {
    this.fetchTransactions().then(() => this.setState({isLoading: false}));
  }

  handleUploadButtonClick(e) {
    let file = e.target.files[0];
    console.log(file);
    let formData = new FormData();
    formData.append('file', file);
    fetch('/api/v1/transactions/import', {
      method:'POST',
      body: formData,
    }).then(response => {
      console.log(response);
      this.fetchTransactions();
    })
  }

  fetchTransactions() {
    return fetch('/api/v1/transactions.json')
      .then((response) => {return response.json()})
      .then((data) => {
        let minDate, maxDate, categories = {}
        data.forEach( transaction => {
          if (!minDate || transaction.date<minDate) minDate = transaction.date;
          if (!maxDate || transaction.date>maxDate) maxDate = transaction.date;
          categories[transaction.category] = !categories[transaction.category] ? 1 : categories[transaction.category]+1;
        })
        minDate = minDate.split('-');
        minDate = new Date(minDate[0], minDate[1] - 1, minDate[2]);
        maxDate = maxDate.split('-');
        maxDate = new Date(maxDate[0], maxDate[1] - 1, maxDate[2]);

        this.setState({ 
          transactions: data,
          minDate: minDate,
          maxDate: maxDate,
          categories: Object.keys(categories).sort()
         }) ;
         console.log("setup finished");
         return data;
      });
  }

  render() {
    let div = ''
    if (this.state.isLoading) {
      div = (
        <div className="spinner-border spinner-border-xl text-center" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )
    } else if (this.state.tab == TABS.ALL) {
      div = <div>
        <h1>All Transactions ({this.state.transactions.length})</h1>
        <ImportTransactionsForm handleClick={this.handleUploadButtonClick} />
        <AllTransactions transactions={this.state.transactions} categories={this.state.categories} />
      </div>
    } else if (this.state.tab==TABS.GROUPS) {
      div = <div>
        <h1>Category Group Management</h1>
        <CategoryGroups transactions={this.state.transactions} minDate={this.state.minDate} maxDate={this.state.maxDate} />
      </div>
    } else if (this.state.tab==TABS.TRANSACTIONS) {
      div = <div>
        <h1>Transactions</h1>
      </div>
    }
    return(
      <div>
        <div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className={"nav-link " 
                              + (this.state.tab == TABS.ALL ? 'active' : '')
                              + (this.state.isLoading ? 'disabled' : '') } 
                  onClick={ () => {this.setState({tab: TABS.ALL}) } }>All Transactions</a>
            </li>
            <li className="nav-item">
              <a className={"nav-link " 
                              + (this.state.tab == TABS.GROUPS ? 'active' : '') 
                              + (this.state.isLoading ? 'disabled' : '') } 
                   onClick={ () => {this.setState({tab: TABS.GROUPS}) } }>Expense Groups</a>
            </li>
            <li className="nav-item">
              <a className={"nav-link " 
                              + (this.state.tab == TABS.TRANSACTIONS ? 'active' : '') 
                              + (this.state.isLoading ? 'disabled' : '') } 
                  onClick={ () => {this.setState({tab: TABS.TRANSACTIONS}) } }>Transactions</a>
            </li>
          </ul>
        </div>
        {div}
      </div>
      
    )
  }
}

Main.propTypes = {

}

export default Main;