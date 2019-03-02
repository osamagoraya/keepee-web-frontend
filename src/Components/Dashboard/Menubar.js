import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import Axios from 'axios';

class Menubar extends Component {
    constructor(props){
      super(props);
      console.log(props);
      this.state = {
        selectedUserID: this.props.selectedUserID,
        imageList: null
      }
      console.log('select User ID',this.state.selectedUserID)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ selectedUserID: nextProps.selectedUserID});
  }

  componentWillMount(){
    this.getImages(this.state.selectedUserID);
  }

  getImages = (userId) => {
    Axios.post('http://localhost:8085/getImages', userId).then(response => {
        console.log("Result", response.data)
        this.setState({ imageList: JSON.parse(response.data.body)})
    }).catch(error => {
        console.log("Error", error)
    })
}

  render(){
    return (
      <Grid item sm={10} style={{ backgroundColor: '#f5f4f4'}}> {/* menu bar */}
          <p>{this.state.selectedUserID}</p>
      </Grid>
    );
  }
}

export default Menubar;