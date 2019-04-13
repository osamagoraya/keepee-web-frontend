import React from 'react';
import './Common.css';

const ColoredHeader = (props) => {
  return (
    <div className={`k-header k-${props.variant ? props.variant : 'green' }-header`} style={props.style}>
      <div>
        {props.leftLabel}
      </div>
      <div>
        {props.rightLabel}
      </div>
    </div>
  );

}


export default ColoredHeader;