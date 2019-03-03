import React, { Component } from 'react';
import Axios from 'axios';
import Moment from 'moment';
import Grid from '@material-ui/core/Grid';

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
        selectedImageID: null,
        imageList: null
      }
      console.log('select User ID',this.state.selectedUserID)
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { selectedUserID } = this.state;
    console.log("before",selectedUserID);
    this.setState({ selectedUserID: nextProps.selectedUserID});
    if( selectedUserID !== nextProps.selectedUserID)
      this.getImages(this.state.selectedUserID);
      console.log("after",selectedUserID);
  }

  getImages = (userId) => {
    if(userId) {
      Axios.post('http://localhost:8085/getImages', {userID: userId}).then(response => {
          console.log("Result", response.data)
          this.setState({ imageList: JSON.parse(response.data.body)})
      }).catch(error => {
          console.log("Error", error)
      })
  }
}


  // getImages = (userId) => {
  //   Axios.post('http://localhost:8085/getImages', userId).then(response => {
  //       console.log("Result", response.data)
  //       this.setState({ imageList: JSON.parse(response.data.body)})
  //   }).catch(error => {
  //       console.log("Error", error)
  //   })
  // }


  // // label 
  // // label on click to fetch child components
  // // child components with routes
  // prepareMenuItems() {

  // }

  // render(){
  //   return (
  //     <div> 
  //         <MenuItems />
  //         {/* <MenuList style={{ marginTop: '45%', width: "100%"}}>
  //           {
  //             items.map((item, index) => (
  //               <MenuItem style={{...styles.menubarItem}} key={index}>
  //                 {item}
  //               </MenuItem>
  //             ))
  //           }
           
  //       </MenuList> */}
  //     </div>
  imageSelected = (imageID,fileType) => {
    console.log("image details",imageID,fileType);
    this.setState({ selectedImageID: imageID});
}
  
  getImageName(imageName){
    let parts = imageName.split('/');
    let answer = parts[parts.length - 1];
    return Moment(`${answer}`,'x').format("MM.DD.YY")
}

renderImageList = () => {
  const { imageList } = this.state;
  
  if( !imageList )
    return;

  let imageRow = [];
      imageList.forEach((image,i) => {
          imageRow.push(
              <div key={i} className="list-item">
                  <li onClick={()=>{this.props.imageSelected(image.ImageID,image.FileType)}} className={`panel-block list-item-container ${this.state.selectedImageID === image.ImageID? 'is-active active-list-item':''}`} >
                      <span className="panel-icon image-list-item-icon">
                          <i className="fas fa-chevron-left" aria-hidden="true"></i>
                      </span>
                      <div className="image-list-item-text" style={{ color: 'rgba(121, 111, 111, 1)' }}>
                      {
                              this.getImageName(image.ImageID)
                      }
                      </div>
                      <i className={` ${this.state.selectedImageID === image.ImageID ? 'fas fa-caret-right fa-4x fa-caret-right-image is-active active-list-item':''}`}></i>
                  </li>
              </div>
           )
      })
      console.log(imageRow);
      return imageRow
}

  render(){
    return (
      <Grid item sm={10} style={{ backgroundColor: '#f5f4f4'}}> {/* menu bar */}
          <p>{this.state.selectedUserID}</p>

          <p>ImageList:</p>
          <div>{this.renderImageList()}</div>
          
      </Grid>
    );
  }
}

export default Menubar;