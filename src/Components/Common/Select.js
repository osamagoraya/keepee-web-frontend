import React from 'react';
import './Select.css';

import Select, { components } from 'react-select';

import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
const DropdownIndicator = (
  props
) => {
  return (
    <components.DropdownIndicator {...props}>
      <SearchIcon style={{height: "20px", width: "20px"}}/>
    </components.DropdownIndicator>
  );
};

const DropdownIndicatorKeyboardArrowDown = (
  props
) => {
  return (
    <components.DropdownIndicator {...props}>
      <KeyboardArrowDown style={{height: "20px", width: "20px"}}/>
    </components.DropdownIndicator>
  );
};

const KSelect = (props) => (
  <div className={`${props.transparent ? 'k-select-container-transparent': 'k-select-container'} k-select-common ${props.containerClasses}`}>
    <Select
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      options={props.options}
      getOptionLabel={option => props.labelKey ? option[props.labelKey] : option.label}
      getOptionValue={option => props.valueKey ? option[props.valueKey] : option.value}
      placeholder={props.placeholder}
      className="k-select"
      isMulti={false}
      isRtl={true}
      backspaceRemovesValue={true}
      components={props.EmailSetting === true ? {DropdownIndicatorKeyboardArrowDown} : {DropdownIndicator} }
    />
    {
      props.feedback 
      ? <span className="k-form-feedback">{props.feedback}</span> 
      : null
    }
  </div>
);

export default KSelect;