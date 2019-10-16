class ImportTransactionsForm extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <input onChange={this.props.handleClick}
                className="btn btn-default"
                type="file" />

    )
  }
}