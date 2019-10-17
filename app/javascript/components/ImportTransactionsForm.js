import React from "react"
import PropTypes from "prop-types"
class ImportTransactionsForm extends React.Component {

  inputStyle = {display: "none"}
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="file-field">

        <label className="btn btn-default btn-file">
            Browse 
            <input type="file" 
                    style={this.inputStyle} 
                    onChange={this.props.handleClick} />
        </label>
  

      </div>
    )
  }
}

export default ImportTransactionsForm
