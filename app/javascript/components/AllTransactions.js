import React from "react"
import PropTypes from "prop-types"
import Transaction from "./Transaction";
import DataService from '../services/dataService';

class AllTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {transactions: this.props.transactions, DataService: DataService};
  }
  getCategoryOptionList = () => {
    return this.props.categories.map( cat => {
      return <option value={cat}>{cat}</option>
    })
  }

  changeTransactionCategory = (transaction, newCategory) => {
    DataService.updateTransaction(transaction, {category: newCategory})
      .then(() => {
        transaction.category = newCategory;
        this.setState({transaction: this.props.transactions})
      })
  }

  render() {
    if (!this.props.transactions) return '';
    let optionList = this.getCategoryOptionList();
    let transactionsJsx = this.props.transactions.map( transaction => {

      return (
        <Transaction key={transaction.id} 
                      transaction={transaction} 
                      optionList={optionList} 
                      changeCategory={this.changeTransactionCategory}
                      showCategory={true}
                      allowCategoryEdit={true} />
      )
    })
    transactionsJsx = <table className="table table-condensed"><tbody>{transactionsJsx}</tbody></table>
    return transactionsJsx;
  }
}

export default AllTransactions
