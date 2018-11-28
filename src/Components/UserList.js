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
                    <div className="level" style={{ height: '4vh'}}>
                        <div className="level-left" style={{ marginLeft: '-3%'}}>
                            <div className="field" style={{ width: '100%' }}>
                                <p className="control has-icons-right">
                                    <input
                                        className="input is input-search-box"
                                        type="text"
                                        placeholder="לחפש"
                                        onChange={this.onChangeText}
                                        value={this.state.searchTerm} />
                                </p>
                            </div>
                        </div>
                        <div className="level-right">
                            <span className="icon is-small is-right">
                                    <i className="fal fa-search fa-2x icon-color"></i>
                                </span>
                        </div>
                    </div>
                </div>
                {userList}
            </div>
        );
    }
}

export default UserList;