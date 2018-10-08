import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Layout from "./component/Header/Layout";
import Profile from "./component/Pages/Profile";
import Home from "./component/Pages/Home";
import MapPage from "./component/Map/Map";
import NotFound from "./component/Pages/NotFound";
import Register from "./component/Auth/Register";
import Signin from "./component/Auth/Signin";
import fakeAuth from "./component/Auth/fakeAuth";
import DataPage from "./component/Data/Data";
import io from "socket.io-client";
import "./App.css";
import { getFromStorage } from "./utils/storage";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io.connect(process.env.REACT_APP_API_URL || "")
    };
  }

  render() {
    {
      const object = getFromStorage("the_main_app");
      if (object && object.token) {
        fakeAuth.authenticate();
      }
    }
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/login" component={Signin} />
            <Route path="/signup" component={Register} />
            <PrivateRoute path="/map" component={MapPage} />
            <Route
              path="/data"
              render={() => <DataPage socket={this.state.socket} />}
            />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
