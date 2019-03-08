import React from 'react';
import './Common.css';

import FilledInput from "@material-ui/core/es/FilledInput";

//TODO: custom style for date, and number
const TextField = (props) => (
  <FilledInput 
    type={props.type}
    placeholder={props.placeholder}
    onChange={props.onChange}
    onBlur={props.onBlur}
    value={props.value}
    name={props.name}
    fullWidth={props.fullWidth}
    className={props.className}
    classes={{root: 'k-textfield-plain', underline: 'custom-focus'}}
    autoComplete="off"
    />
);

export default TextField;