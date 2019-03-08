import React from 'react';
import './Common.css';

import Button from "@material-ui/core/Button";

const KButton = (props) => (
  <Button 
    classes={{root: 'k-blue-button'}}
    className={props.className}
  >   
    {props.children}
  </Button>
);

export default KButton;