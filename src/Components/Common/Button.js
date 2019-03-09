import React from 'react';
import './Common.css';

import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";

const KButton = (props) => (
  props.fab 
  ? <Fab
      classes={{root: 'k-grey-button', label: 'k-button-text'}}
      className={props.className}
      onClick={props.onClick}
    >
    {props.children}
    </Fab> 
  : <Button 
      classes={{root: props.variant === 'blue' ? 'k-blue-button' : 'k-grey-button', label: 'k-button-text'}}
      className={props.className}
      onClick={props.onClick}
    >   
      {props.children}
    </Button>
);

export default KButton;