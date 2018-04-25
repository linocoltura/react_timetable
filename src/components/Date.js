import React from 'react';
import { NavLink } from 'react-router-dom';
import { format } from 'date-fns';


class Date extends React.Component {

  render() {

    const dates = this.props.dates;    


    //let from = dates[this.props.index].split("/");
    let [day, month, year] = dates[this.props.index].split("/")
    let dateString = month + '/' + day + '/' +  year
    let dateObject = new Date(dateString);

    let dateResult = format(
      dateObject.props,
      'dddd MMMM Do'
    )

    return(
      <li><NavLink to={`/${dates[this.props.index].replace(/\//g, "-")}`} activeClassName="selected">{dateResult}</NavLink></li>
    )
    
  }
}

export default Date;