import React, { Component } from 'react';
import Axios from 'axios';

import MenuItems from './MenuItems';


const styles = {
  menubarItem : {
    height: 20,
    color: '#4d4f5c',
    fontFamily: 'Source Sans Pro',
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 20,
  }
}

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


  // label 
  // label on click to fetch child components
  // child components with routes
  prepareMenuItems() {

  }

  render(){
    return (
      <div> 
          <MenuItems />
          {/* <MenuList style={{ marginTop: '45%', width: "100%"}}>
            {
              items.map((item, index) => (
                <MenuItem style={{...styles.menubarItem}} key={index}>
                  {item}
                </MenuItem>
              ))
            }
           
        </MenuList> */}
      </div>
    );
  }
}

export default Menubar;