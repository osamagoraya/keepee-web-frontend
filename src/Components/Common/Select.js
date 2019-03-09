import React from 'react';
import './Common.css';

import Select from 'react-select';

const KSelect = (props) => (
  <div className={`k-select-container ${props.containerClasses}`}>
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
    />
    {
      props.feedback 
      ? <span className="k-form-feedback">{props.feedback}</span> 
      : null
    }
  </div>
);

export default KSelect;