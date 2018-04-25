import React from 'react';

class Location extends React.Component {
  render() {

    const index = this.props.index;
    let colors = Array('pinkBg','greenBg','orangeBg','purpleBg','yellowBg');
    
    const details = this.props.details;

    return(
      <th ><div className={colors[index%4] + " " + "pill"}>{details}</div></th>
    )
  }
}

export default Location;