import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import DB from '../../../shared/js/db';
import {
  login,
  logout,
  setPending,
  isLoggedIn,
  isPending
} from '../../store/actions';

import './login.css';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.state = {};
  }

  async tryAuth(username, password) {
    this.props.dispatch(setPending());
    this.db = new DB(username, password);
    const authed = await this.db.auth();
    const message = authed ? 'hello' : 'Login failed';

    this.setState({
      message: message,
    });

    if (authed) {
      this.props.dispatch(login(username));
    } else {
      this.props.dispatch(logout());
    }
  }

  async onLogout(evt) {
    evt.preventDefault();
    this.props.dispatch(logout());
    this.setState({
      message: 'Logged out.',
    });
  }

  onSubmit(evt) {
    evt.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    this.tryAuth(username, password);
  }

  render() {
    let authed = isLoggedIn(this.props.auth);

    // If we are authed and have a place to be, go there.
    let locState = this.props.location.state;
    if (authed && locState && locState.from) {
      return <Redirect to={locState.from} />;
    }

    let pending = isPending(this.props.auth);
    return (
      <form onSubmit={this.onSubmit}>
        <h2>Log in</h2>
        <section>
          {authed ? 'Authed!' : pending ? 'Pending' : 'Log in:'}
        </section>
          <section>
          {this.state.message && (
            <p id="form-message">{this.state.message}</p>
          )}
          </section>
          {!authed ? (
            <section>
              <label htmlFor="username">username</label><input type="text" id="username" />
              <label htmlFor="password">password</label><input type="password" id="password" />
              <button>Submit</button>
            </section>
          ) : (
            <section>
              <p>{`Welcome ${this.props.username}`}</p>
              <button onClick={this.onLogout}>Logout</button>
            </section>
          )}
      </form>
    );
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    username: state.username,
  };
})(Form);
