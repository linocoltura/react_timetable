import React, { Component } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Date from './Date';


class HandleRedirect extends Component {

  constructor(){
    // init & state
    super();

    this.state = {
      events: {},
      locations: {},
      dates: {},
    };
  }

  componentWillMount(){

    // api call before render via axios
    axios({
      method:'get',
      url:'https://fluxit.be/react/wordcamp18/wp-json/wp/v2/talks?per_page=100',
      responseType:'json'
    })
      .then((response) => {
      const result = response.data;

      result.sort( (a, b) => {
        return parseInt(a.acf.start_datetime, 10) - parseInt(b.acf.start_datetime, 10)
      });

      this.setState({
        events: result,
      });
      this.calcDatesLocations();

      const redirect = this.state.dates[0].replace(/\//g, "-");

      this.props.history.push(`${redirect}`);


    });
  }

  calcDatesLocations() {

    //get unique dates

    let lookupDates = {};
    const items = this.state.events;
    let uniqueDates = [];

    for (let item, i = 0; item = items[i++];) {

      let unformattedDate = new Date(parseInt(item.acf.start_datetime, 10)*1000);
      let date = format(unformattedDate.props, 'DD/MM/YYYY');

      
      if(date === undefined){
        continue;
      }

      if (!(date in lookupDates)) {
        lookupDates[date] = 1;
        uniqueDates.push(date);
      }
    }

    uniqueDates.sort( (a, b) => {
      const aa = a.split('/').reverse().join(),
          bb = b.split('/').reverse().join();
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });


    this.setState({
      dates: uniqueDates,
    });
    

    //get unique locations

    let lookupLocations = {};
    let uniqueLocations = [];

    for (let item, i = 0; item = items[i++];) {

      let location = item.acf.room || item.acf.location;

      if(location === undefined){
        continue;
      }

      if (!(location in lookupLocations)) {
        lookupLocations[location] = 1;
        uniqueLocations.push(location);
      }
    }

    this.setState({
      locations: uniqueLocations,
    });

  }


  render() {
    return (
      <div className="redirecting">
        <p>Loading...</p>
      </div>
    );
  }
}


export default HandleRedirect;
