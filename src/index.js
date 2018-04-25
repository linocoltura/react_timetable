import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import HandleRedirect from './components/HandleRedirect';
import registerServiceWorker from './registerServiceWorker';
import createHistory from 'history/createBrowserHistory';

import { Route, Link } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import EventSingle from './components/EventSingle';

const browserHistory = createHistory();


const Root = () => {
  return(

    <BrowserRouter history={browserHistory}>
      <React.Fragment>
        <Route exact path="/" component={HandleRedirect}/>
        <Route exact path="/:date" component={App}/>
        <Route exact path="/event/:id" component={EventSingle}/>
      </React.Fragment>
    </BrowserRouter>

  )
}



ReactDOM.render(<Root/>, document.getElementById('root'));
registerServiceWorker();
