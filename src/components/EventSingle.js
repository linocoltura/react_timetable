import React from 'react';
import axios from 'axios';
import striptags from 'striptags';
import entities from 'entities';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { withStore } from '../store';
import { hourOffset } from '../helpers';

// import createHistory from 'history/createBrowserHistory';
// const browserHistory = createHistory();



//class EventSingle extends React.Component {
let EventSingle = withStore('events')(class extends React.Component{


  constructor(){
    // init & state
    super();

    this.state = {
      talk: {},
      title: "",
      acf: {},
      speaker: {},
      image: "",
    };
  }

  componentDidMount(){
    
    window.scrollTo(0, 0);
    let eventsFromStore = this.props.store.get('events');

    // console.log("store:");
    // console.log(eventsFromStore);

    for (let item, i = 0; item = eventsFromStore[i++];) {
      if(item.id === parseInt(this.props.match.params.id.replace(/-/g, '/'), 10)){
        this.setState({
          talk: item,
          title: item.title.rendered,
          acf: item.acf,
          speaker: item.acf.speaker,
          image: item.acf.speaker[0].acf.speaker_image
        });
      }
    }

    // console.log("state:");
    // console.log(this.state.speaker);

    axios({
      method:'get',
      url:`https://fluxit.be/react/wordcamp18/wp-json/wp/v2/talks/${this.props.match.params.id.replace(/-/g, '/')}`,
      responseType:'json'
    })
      .then((response) => {
      const result = response.data;

      this.setState({
        talk: result,
        title: result.title.rendered,
        acf: result.acf,
        speaker: result.acf.speaker,
        image: result.acf.speaker[0].acf.speaker_image
      });

    });
  }

  sformatString(text) {
    return striptags(entities.decode(text));
  }


  render() {

    let hours = format(new Date(parseInt(this.state.acf.start_datetime, 10)*1000+hourOffset*3600000), 'HH:mm') + " - " + format(new Date(parseInt(this.state.acf.end_datetime, 10)*1000+hourOffset*3600000), 'HH:mm');

    
    let unformattedDate = new Date(parseInt(this.state.acf.start_datetime, 10)*1000);

    let date = format(unformattedDate, 'DD/MM/YYYY');


    let prevClicked = this.props.store.get('clicked');

    let backbutton;

    if(prevClicked !== -1){

      backbutton = <div className="back" onClick={ () => this.props.history.goBack()}><i class="fas fa-long-arrow-alt-left"></i> back</div>

    } else backbutton = <Link className="back" to={`/${date.replace(/\//g, "-")}`}><i class="fas fa-long-arrow-alt-left"></i> back</Link>

      
      return(
        <div className="app">

          {backbutton}

          <div className="single">

          <img className="speaker-image" src={this.state.image} alt=""/>

          <h1>{this.state.title || "loading"}</h1>
          <p>{this.sformatString(this.state.acf.description || "")}</p>
  
          <div className="authors_single">
            {
              
              Object
                .values (this.state.speaker)
                .map(speaker => <span className="eventAuthor"><i className="far fa-user"></i> {speaker.post_title}</span> )
            
            }
          </div>
  
          <div className="time_single">
            <span className="timeSpan">
              <i className="far fa-clock"></i> {hours}
            </span>
          </div>

          </div>
        </div>
      )


    } 
    
    // else {
    //   return(
    //     <div className="app">
    //       <Link className="back" to={`/${date.replace(/\//g, "-")}`}><i class="fas fa-long-arrow-alt-left"></i> back</Link>

    //       <h1>{this.state.title || "loading"}</h1>
    //       <p>{this.sformatString(this.state.acf.description || "")}</p>
  
    //       <div className="authors_single">
    //         {
              
    //           Object
    //             .values (this.state.speaker)
    //             .map(speaker => <span className="eventAuthor"><i className="far fa-user"></i> {speaker.post_title}</span> )
            
    //         }
    //       </div>
  
    //       <div className="time_single">
    //         <span className="timeSpan">
    //           <i className="far fa-clock"></i> {hours}
    //         </span>
    //       </div>
  
    //     </div>
    //   )
    // }
    
    
    
  
})

export default EventSingle;