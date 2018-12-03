import React, { Component } from 'react';
import lodash from 'lodash'
import './UserList.css';
import 'bulma/css/bulma.css'

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            searchTerm: '' 
        };
    }

    onChangeText = (event)=>{
        console.log("Value",event.target.value)
        this.setState({searchTerm: event.target.value})
        this.props.searchUsers(event.target.value)
    }

    render() {
        let userList
        if (this.props.userList) {
            userList =
                <ol>
                    {
                        this.props.renderUserListRow()
                    }
                </ol>

        } else {
            userList = "Loading"
        }
        return (
            <div className="panel content-overflow">
                <div className="panel-heading">
                    <div className="field" style={{ width: '100%', position: 'relative' , right: '-3%' }}>
                        <p className="control has-icons-right">
                            <input className="input input-search-box"
                                   type="text"
                                   placeholder="לחפש"
                                   onChange={this.onChangeText}
                                   value={this.state.searchTerm}
                            />
                            <span className="icon is-small is-right">
                              <i className="fal fa-search icon-color" style={{ fontSize: '13.85px'}}></i>
                            </span>
                        </p>
                    </div>
                </div>
             {userList}
            </div>
        );
    }
}

export default UserList;