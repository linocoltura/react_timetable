import React from 'react';
import { format } from 'date-fns';
import entities from 'entities';
import AuthorsOfEvent from './AuthorsOfEvent';
import { Link } from 'react-router-dom';
import { withStore } from '../store';
import { hourOffset, heightMultiplier } from '../helpers';



let TimeStamp = withStore('clicked')(class extends React.Component{

  saveId(id){
    this.props.store.set('clicked')(id);
  }

  render() {
    
    const details = this.props.details;
    const eventsOnThisStamp = details.eventsOnThisStamp;
    const selectedDate = this.props.date.replace(/-/g, '/');
    const locations = this.props.locations;
    const timestampDate = format(new Date(parseInt(details.timestamp, 10)*1000), 'DD/MM/YYYY').toString();
    let unformattedTime = new Date(parseInt(details.timestamp, 10)*1000+hourOffset*3600000);
    let time = format(unformattedTime, 'HH:mm');

  
    if(selectedDate !== timestampDate){
      return(
        ""
      );
    }

    if(details.eventsOnThisStamp[0].id === -1){
      return(
        // <tr>
        //   <td className="timeVal">{time}</td>
        //   <td></td>
        // </tr>
        <tr>
            <td><div className="empty-space empty"></div></td>
            <td><div className="empty-space empty"></div></td>
        </tr>
      )
    }

    // if the date matches, prepare render arrays

    let correctLocationArray = Array(locations.length);
    let correctCategoryArray = Array(locations.length);
    let correctIdArray = Array(locations.length);
    let correctIdOnlyArray = Array(locations.length);
    let correctRowspanArray = Array(locations.length);
    let correctspeakerArray = Array(locations.length);
    let correctImageArray = Array(locations.length);
    let correctInlineStyleArray = Array(locations.length);
    let correctClickedArray = Array(locations.length);
    let correctHoursArray = Array(locations.length);
    let isNotAnEventArray = Array(locations.length);
    let noLocationClass = "";
    let hasLocation = false;
    let divStyle;

    let colors = Array('pink','green','orange','purple','yellow');

    for (let i = 0; i < eventsOnThisStamp.length; i++) {
      for (let j = 0; j < locations.length; j++) {

        let minHeight = eventsOnThisStamp[i].duration*heightMultiplier;
        if(minHeight >= 600){
          minHeight = 600;
        }

          divStyle = {
            minHeight: minHeight,
          };
        

          if(eventsOnThisStamp[i].acf.location === locations[j] || eventsOnThisStamp[i].acf.room === locations[j]){
            correctLocationArray[j] = eventsOnThisStamp[i].title.rendered;
            correctIdArray[j] = "/event/"+eventsOnThisStamp[i].id;
            correctIdOnlyArray[j] = eventsOnThisStamp[i].id;
            correctRowspanArray[j] = eventsOnThisStamp[i].rowspan;
            correctspeakerArray[j] = eventsOnThisStamp[i].acf.speaker;
            if(eventsOnThisStamp[i].acf.speaker[0].acf != undefined){
              correctImageArray[j] = eventsOnThisStamp[i].acf.speaker[0].acf.speaker_image;
            }
            correctClickedArray[j] = eventsOnThisStamp[i].clicked;
            correctCategoryArray[j] = "event";
            isNotAnEventArray[j] = "";
            correctInlineStyleArray[j] = divStyle;
            hasLocation = true;
            correctHoursArray[j] = format(new Date(parseInt(eventsOnThisStamp[i].acf.start_datetime, 10)*1000+hourOffset*3600000), 'HH:mm') + " - " + format(new Date(parseInt(eventsOnThisStamp[i].acf.end_datetime, 10)*1000+hourOffset*3600000), 'HH:mm');
          } else if(correctLocationArray[j] === undefined){
            correctLocationArray[j] = "none";
            correctHoursArray[j] = "";
            isNotAnEventArray[j] = "hide";
            correctCategoryArray[j] = "empty-fill";
            correctIdArray[j] = "#";
          }

      }
    }

    if(hasLocation){

      
      
      return(
        
        <tr>
          
          <td className="timeVal" >{time}</td>
          {Object.values(locations).map((location, index) => (
            
            <td id={correctIdOnlyArray[index]} rowSpan={correctRowspanArray[index]} className={correctCategoryArray[index]+' '+noLocationClass+' '+correctClickedArray[index]+ ' ' + colors[index%4]}>
            <div className={"event-container"}>
              <Link onClick={ () => this.saveId(correctIdOnlyArray[index])} to={`${correctIdArray[index]}`}>
                    <span className={correctLocationArray[index]+ " " +"eventTitle"}><img className="speakerImage" src={correctImageArray[index]} alt=""/> <span className="inner-title">{correctLocationArray[index]}</span></span>
                <div style={divStyle} className="table-content">
                      {

                        <AuthorsOfEvent correctPlacementArray={correctCategoryArray[index]} authors={correctspeakerArray[index]} />
                        
                      }
                    <span className="timeSpan">
                      <i className={"far fa-clock " + isNotAnEventArray[index]}></i> {correctHoursArray[index]}
                    </span>
                </div>
              </Link>
              </div>
            </td>
            
          ))}
  
        </tr>
      )
    } else{
      
      let minHeight = eventsOnThisStamp[0].duration*heightMultiplier; // height = duration in minutes * [insert multiplier here]
      if(minHeight >= 600){
        minHeight = 600;
      }

      divStyle = {
        minHeight: minHeight,
      };
    
      return(
        <tr>
          
  
          <td className="timeVal">{time}</td>
          <td colSpan={locations.length} className="fill"><div style={divStyle} className="table-content"><span className="middle">{entities.decodeHTML(details.eventsOnThisStamp[0].title.rendered)}</span></div></td>
  
        </tr>
      )
    }
    
  }
})

export default TimeStamp;