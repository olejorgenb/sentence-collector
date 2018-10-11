import React from 'react';
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import Page from './page';
import Home from '../containers/home';
import HowTo from './pages/how-to';
import Login from '../containers/login';
import Profile from '../containers/profile';
import Add from '../containers/add';


export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ConnectedRouter history={this.props.history}>
        <Page>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/how-to" component={HowTo} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute authed={this.props.authed}
              path="/profile" component={Profile} />
            <PrivateRoute authed={this.props.authed}
              path="/add" component={Add} />
            <Route render={() => (<div>Add 404 page here</div>)} />
          </Switch>
        </Page>
      </ConnectedRouter>
    );
  }
}

const PrivateRoute = (props) => {
  const Component = props.component;
  const authed = props.authed;
  return <Route
    path={props.path}
    render={props =>
      authed ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />;
}
