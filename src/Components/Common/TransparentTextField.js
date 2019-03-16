import React from 'react';
import './TransparentTextField.css';

import FilledInput from "@material-ui/core/es/FilledInput";

//TODO: custom style for date, and number
const KTextField = (props) => (
  <div className={props.containerClasses}>
  <FilledInput 
    type={props.type}
    placeholder={props.placeholder}
    onChange={props.onChange}
    onBlur={props.onBlur}
    value={props.value}
    name={props.name}
    fullWidth={props.fullWidth}
    className={props.className}
    classes={{root: 'k-textfield-transparent-plain', underline: 'k-textfield-transparent-focus'}}
    autoComplete="off"
    />
    {
      props.feedback 
      ? <span className="k-form-feedback">{props.feedback}</span> 
      : null
    }
  
  </div>
);

export default KTextField;