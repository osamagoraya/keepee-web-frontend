import React, { Component } from 'react';
import lodash from 'lodash'
import './UserList.css';
import 'bulma/css/bulma.css'

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = { Images: ['20-11-2018', '19-11-2018', '19-11-2018', '18-11-2018', '18-11-2018'] };
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
                    <div className="level">
                        <div className="level-left user-list-text">
                            <p>הלקוחות של</p>
                        </div>
                        <div className="level-right">
                            <span className="icon has-text-white">
                                <i className="fas fa-search"></i>
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