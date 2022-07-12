import React from 'react';
import Home from './components/Home';
import Error from './components/Error';
import ReviewAlert from './components/ReviewAlert';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../src/history';

function App() {
  return (
    <>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/review" exact component={ReviewAlert} />
        </Switch>
      </Router> 
    </>
  );
}

export default App;