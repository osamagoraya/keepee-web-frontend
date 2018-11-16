import React, { Component } from 'react';
import './UserList.css';
import 'bulma/css/bulma.css'

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = { Images: ['20-11-2018','19-11-2018','19-11-2018','18-11-2018','18-11-2018'] };
    }

    render() {
        return (
            <div className="panel">
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
                <div className="panel-block">

                </div>
            </div>
        );
    }
}

export default UserList;