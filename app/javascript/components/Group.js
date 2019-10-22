import React from 'react';
import Category from './Category';

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCategories: false
    }
  }

  deleteGroup = () => {
    this.props.deleteGroup(this.props.group);
  }
  renameGroup = () => {
    this.props.renameGroup(this.props.group);
  }

  render() {
    return (
      <div className="indent">
        { this.props.group.name } ({ this.props.group.categories.length }) 
        &nbsp;
        <button className="btn btn-xs btn-hover" 
          onClick={() => this.setState({showCategories: !this.state.showCategories})}>
          {this.state.showCategories ? "hide" : "show"}
        </button>
        { +this.props.group.id < 0 ? '' : (
          <span>
            <button className="btn btn-xs btn-hover" onClick={this.deleteGroup}>
              Delete
            </button>
            <button className="btn btn-xs btn-hover" onClick={this.renameGroup}>
              Rename
            </button>
          </span>          
        )}
        { this.state.showCategories ? (
            <div className="indent">
              {
                this.props.group.categories.map( (category) => {
                 return (
                    <Category key={category.name} category={category} 
                              createNewGroup={this.props.createNewGroup}
                              groups={this.props.groups} changeGroup={this.props.changeGroup} 
                              parentGroup={this.props.group}/> 
                 )
                })
              }
            </div>
          ) : ''
        }
      </div>
    )
  }
}

export default Group;