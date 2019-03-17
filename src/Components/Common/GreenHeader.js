import React from 'react';
import './Common.css';

const GreenHeader = (props) => {
  return (
    <div className="k-green-header">
      <div>
        {props.leftLabel}
      </div>
      <div>
      {props.rightLabel}
      </div>
    </div>
  );

}


export default GreenHeader;