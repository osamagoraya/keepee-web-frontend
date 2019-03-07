import React, { Component } from 'react';
import {Grid} from '@material-ui/core';
import './Invoices.css';
import Button from "@material-ui/core/es/Button/Button";
import Input from "@material-ui/core/es/Input/Input";
import logoReport from '../../Assets/Images/Path_981.svg';
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';


const BASE_URL = "https://keepee-images.s3.us-west-2.amazonaws.com/";

class Invoices extends Component {
    
  constructor(props){
    super(props);
    this.state = {
      selectedImageID: this.props.match.params.imageId,
      selectedImageFileType: this.props.match.params.imageType,
      imageAngle: 90,
    }
  }
  
  componentWillReceiveProps(nextProps,nextContext) {
    // console.log("invoices received props", nextProps); 
    const oldImageId = this.state.selectedImageID;
    const { imageId, imageType } = nextProps.match.params;
    if( oldImageId !== imageId ){
      this.setState({ selectedImageID: imageId, selectedImageFileType: imageType});
      // console.log("Image id changed from ", oldImageId, " to ", imageId);
    }
  }


  transformImage = () => {
    let angle = this.state.imageAngle
    angle = parseInt(angle) + 90
    this.setState({ imageAngle: angle })
  }

  render(){
      const { selectedImageID , selectedImageFileType} = this.state;
      const selectedImagePath = BASE_URL + selectedImageID;
      // console.log("Current data: ", selectedImageID, selectedImageFileType, selectedImagePath);
      return (
          <Grid container className="containerMain">
              <Grid container item  style={{ flexBasis: '20%', alignItems: 'flex-end',justifyContent: 'space-evenly'}}>
                  <Grid item style={{ flexBasis: '80%', paddingBottom: '3.4%'}}>
                      <Button size="small" className="invoiceSubmitBtn">
                          Continue
                      </Button>
                  </Grid>
              </Grid>
              <Grid container item  style={{ flexBasis: '30%', flexDirection:"column", justifyContent: 'center'}}>
                  <Grid  container item style={{ flexBasis: '50%', justifyContent: 'space-evenly', marginTop: '-15%'}}>
                      <Input
                          placeholder="Date"
                          inputProps={{
                              'aria-label': 'date',
                          }}
                          className="inputFields"
                      />
                      <Input
                          placeholder="Category"
                          inputProps={{
                              'aria-label': 'category',
                          }}
                          className="inputFields"
                      />
                      <Input
                          placeholder="Sum"
                          inputProps={{
                              'aria-label': 'sum',
                          }}
                          className="inputFields"
                      />
                      <Input
                          placeholder="Vendor"
                          inputProps={{
                              'aria-label': 'vendor',
                          }}
                          className="inputFields"
                      />
                      <Input
                          placeholder="Detail"
                          inputProps={{
                              'aria-label': 'detail',
                          }}
                          className="inputFields"
                      />
                      <Input
                          placeholder="Vat"
                          inputProps={{
                              'aria-label': 'vat',
                          }}
                          className="inputFields"
                      />
                  </Grid>
              </Grid>
              <Grid container item  style={{ flexBasis: '50%' , flexDirection:"column", justifyContent: 'center'}}>
                  <Grid item style={{ flexBasis: '70%'}} className="invoiceImageBox">
                  {   (selectedImageID && selectedImageFileType === "image") ?
                          <Card style={{ height: '100%'}}>
                              <CardActionArea style={{ height: '100%'}}>
                                  <CardMedia style={{ transform: `rotate(${this.state.imageAngle}deg)`}}
                                      component="img"
                                      alt="Unable to load"
                                      height="inherit"
                                      image={selectedImagePath}
                                  />
                              </CardActionArea>
                          </Card> :
                      ( selectedImageID && selectedImageFileType === "pdf" ) ?
                          <div>A PDF FILE</div> :
                          <div>בחר תמונה</div>
                  }
                  </Grid>
                  <Grid container item style={{ flexBasis: '15%', width: '80%' , alignContent: 'center', justifyContent: 'space-around'}}>
                      <Grid item container style={{ flexBasis: '80%', alignContent: 'center', justifyContent: 'space-around'}}>
                          <Button size="small" className="invoicesImageBoxBtn" style={{}}>
                              <p className="invoicesImageBoxBtnText">Not Relevant</p>
                          </Button>
                          <Button size="small" className="invoicesImageBoxBtn">
                              <p className="invoicesImageBoxBtnText">New picture</p>
                          </Button>
                          <IconButton onClick={this.transformImage} size="small" className="invoicesImageBoxBtn" aria-label="Delete" style={{ backgroundColor: '#d0cccc', width:'9%'}}>
                              <img src={logoReport} alt="Not Found"/>
                          </IconButton>
                      </Grid>
                  </Grid>
              </Grid>
          </Grid>
      );
  }
}

export default Invoices;