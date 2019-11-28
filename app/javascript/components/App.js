import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './Main';
import Error from './Error';
import CategoryGroups from './CategorrGroups';
import AllTransactions from './AllTransactions';

class App extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route path='/' conponent={Main} exact />
          <Route path='/analysis' conponent={CategoryGroups} />
          <Route path='/all' conponent={AllTransactions} />
          <Route component={Error} />
        </Switch>
      </main>
    )
  }
}

export default App;