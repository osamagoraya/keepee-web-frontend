import React from 'react';
import './Common.css';

const Caption = (props) => (
  <div className="k-caption" style={props.style}>{props.children}</div>
);

export default Caption;