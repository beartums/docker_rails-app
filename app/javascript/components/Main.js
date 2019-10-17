import React from "react";
import PropTypes from "prop-types";
import ImportTransactionsForm from "./ImportTransactionsForm";
import AllTransactions from "./AllTransactions";

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    };
    this.handleUploadButtonClick = this.handleUploadButtonClick.bind(this);
  }

  componentDidMount() {
    this.fetchTransactions();
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
    fetch('/api/v1/transactions.json')
      .then((response) => {return response.json()})
      .then((data) => {this.setState({ transactions: data }) });
  }

  render() {
    return(
      <div>
        <h1 className="text-success">Hellow World</h1>
        <h1>Trasnactions ({this.state.transactions.length})</h1>
        <ImportTransactionsForm handleClick={this.handleUploadButtonClick} />
        <AllTransactions transactions={this.state.transactions} />
      </div>
    )
  }
}

Main.propTypes = {

}

export default Main;