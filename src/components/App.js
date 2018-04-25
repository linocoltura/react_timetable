import React from 'react';
import axios from 'axios';
import { format, isWithinRange, isEqual } from 'date-fns';
import TimeStamp from './TimeStamp';
import Location from './Location';
import Date from './Date';
import { withStore } from '../store';
import createHistory from 'history/createBrowserHistory';




// NOTE : depending on daylight savings time schedule can be one hour off (!)

// class App extends Component {
let App = withStore('events')(class extends React.Component{

  constructor(props){
    // init & state
    super(props);


    this.state = {
      events: this.props.store.get('events'),
      locations: {},
      dates: {},
      timestamps: [],
      prevStartingTime: 0,
      finalTimeStamps: [],
    };

  }

  componentDidMount(){

    this.calcDatesLocations();
    this.addColSpansToEvents();


    // let eventsFromStore = "HELA";
    // // let eventsFromStore = this.props.store.get('events');

    // console.log("store:");
    // console.log(eventsFromStore);

    // this.setState({
    //   events: eventsFromStore,
    // });

    // console.log("state:");
    // console.log(this.state.events);

    // api call before render via axios
    axios({
      method:'get',
      url:'https://fluxit.be/react/wordcamp18/wp-json/wp/v2/talks?per_page=100',
      responseType:'json'
    })
      .then((response) => {

      const result = response.data;

      result.sort(function (a, b) {
        return parseInt(a.acf.start_datetime, 10) - parseInt(b.acf.start_datetime, 10)
      });

      this.setState({
        events: result,
      });
      this.calcDatesLocations();
      this.addColSpansToEvents();

      this.props.store.set('events')(result);



    });
  }



  removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) === -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
  }

  removeDuplicatesBasedOnProp(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {

      if(obj.id !== -1){
        return true;
      } else return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      
      
    });
  }

  removeDuplicatesBasedOnProp2(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {

      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      
      
    });
  }


  addColSpansToEvents(){

    // getting a unique array of start / ending hours

    const events = this.state.events;


    let uniqueTimestamps = [];

    for (let item, i = 0; item = events[i++];) {
        let unixDate = parseInt(item.acf.start_datetime, 10)*1000;
        let unixDateEnd = parseInt(item.acf.end_datetime, 10)*1000;
        item.rowspan = 1;
        uniqueTimestamps.push(unixDate);
        uniqueTimestamps.push(unixDateEnd);
    }

    let prevClicked = this.props.store.get('clicked');

    if(prevClicked !== -1){
      for (let item, i = 0; item = events[i++];) {
        if(item.id === prevClicked){
          item.clicked = "clicked";
          this.props.store.set('clicked')(-1);
        } else item.clicked = "";
      }
    }
    
    uniqueTimestamps = this.removeDuplicates(uniqueTimestamps);
    
    
    uniqueTimestamps = uniqueTimestamps.map(x => new Date(x));


    for (let uniqueTimestamp, i = 0; uniqueTimestamp = uniqueTimestamps[i++];) {

      
      for (let j = 0; j < events.length; j++) {

        
        let startDate = new Date(parseInt(events[j].acf.start_datetime, 10)*1000);
        let endDate = new Date(parseInt(events[j].acf.end_datetime, 10)*1000);
      
        if(isWithinRange(uniqueTimestamp.props, startDate.props, endDate.props) && !isEqual(uniqueTimestamp.props, startDate.props) && !isEqual(uniqueTimestamp.props, endDate.props)){
          events[j].rowspan++;
        }

      }

    }
    
    // adding the timestamp prop

    for (let item, i = 0; item = events[i++];) {
     
      item.timestamp = item.acf.start_datetime;

      // let start = new Date(parseInt(item.acf.start_datetime, 10)*1000);
      // let end = new Date(parseInt(item.acf.end_datetime, 10)*1000);
      
      let startUnix = parseInt(item.acf.start_datetime, 10);
      let endUnix = parseInt(item.acf.end_datetime, 10);


      let Date1 = startUnix;
      let Date2 = endUnix;
      
      let secdiff = Date2 - Date1; 
      let mindiff = Math.floor( secdiff / 60 );
      secdiff = secdiff % 60;
      let hourdiff = Math.floor( mindiff / 60 );
      mindiff = mindiff % 60;
      // let daydiff = Math.floor( hourdiff / 24 );
      // hourdiff = hourdiff % 24;
      
      item.duration = hourdiff*60+mindiff;
    
    }

    let newEvents = events.slice();

    for (let item, i = 0; item = uniqueTimestamps[i++];) {


        newEvents.push({
          id: -1,
          acf: {start_datetime: (item.props/1000).toString()},
          timestamp: (item.props/1000).toString(),
        });
      

    }

    // console.log(newEvents)

    // console.log("initial events: ")
    // console.log(events)
    
    // console.log("sliced array: ")
    // console.log(newEvents)

    newEvents = this.removeDuplicatesBasedOnProp(newEvents,"timestamp");
    

    // console.log("no duplicates: ")
    // console.log(newEvents)
    

    newEvents.sort(function (a, b) {
      return parseInt(a.acf.start_datetime, 10) - parseInt(b.acf.start_datetime, 10);
    });

    
    for (let event, i = 0; event = newEvents[i++];) {

      if(newEvents[i] !== undefined){

        let nextStartDate = 0;

        let startDate = new Date(parseInt(newEvents[i].acf.start_datetime, 10)*1000);
        

        if(i<(newEvents.length-1)){
          nextStartDate = new Date(parseInt(newEvents[i+1].acf.start_datetime, 10)*1000);
        }

        // console.log(startDate.props);
        // console.log(nextStartDate.props);
        // console.log(i);

        if(isEqual(nextStartDate.props, startDate.props)){
          newEvents[i].nextIsSame = true;
          //console.log(true);
        } else {newEvents[i].nextIsSame = false};

      }

    }

    let finalTimeStamps = [];

    for (let event, i = 0; event = newEvents[i++];) {
      finalTimeStamps.push({
        timestamp: event.timestamp,
        eventsOnThisStamp: [],
      });
    }

    finalTimeStamps = this.removeDuplicatesBasedOnProp2(finalTimeStamps, "timestamp");

    for (let stamp, i = 0; stamp = finalTimeStamps[i++];) {
      for (let event, i = 0; event = newEvents[i++];) {
        if(stamp.timestamp === event.timestamp){
          stamp.eventsOnThisStamp.push(event);
        }
      }
    }
    
    this.setState({ finalTimeStamps: finalTimeStamps });
    
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
      <div className="app">

        <nav>
          <ul>
            {
              Object
                .keys(this.state.dates)
                .map(key => <Date key={key} dates={this.state.dates} index={key} details={this.state.dates[key]} /> )
            }
          </ul>
        </nav>
        
        <table cellspacing="20">
          <tbody>
            <tr>
              <th className="time"><i className="far fa-clock"></i></th>
              {
                Object
                  .keys(this.state.locations)
                  .map(key => <Location key={key} index={key} details={this.state.locations[key]} /> )
              }
            </tr>

            {

            Object
              .keys(this.state.finalTimeStamps)
              .map(key => <TimeStamp date={this.props.match.params.date} locations={this.state.locations} index={key} key={key} details={this.state.finalTimeStamps[key]} />)
            }
            

          </tbody>
        </table>


      </div>
    );
  }
})


export default App;
