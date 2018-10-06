import React from "react";
import {
  Icon,
  Button,
  Form,
  Grid,
  Image,
  Message,
  Segment,
  Divider
} from "semantic-ui-react";

import { getFromStorage, setInStorage } from "../../utils/storage";
import fakeAuth from "./fakeAuth";
import Redirect from "react-router-dom/es/Redirect";
import {Link} from "react-router-dom";
//style
const Style = {
  margin: "20px"
};

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      formClassName: ""
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
  }

  componentDidMount() {
    const object = getFromStorage("the_main_app");
    if (object && object.token) {
      const { token } = object;
      //verify token
      fetch("/api/account/verify?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }
  //onChange of email
  handleEmailChange(e) {
    this.setState({ signInEmail: e.target.value });
  }
  //onchange of Password
  handlePasswordChange(e) {
    this.setState({ signInPassword: e.target.value });
  }

  onSignIn() {
    //grap state
    const { signInEmail, signInPassword } = this.state;

    this.setState({
      isLoading: true
    });

    //Post request to backend
    fetch("/api/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          fakeAuth.authenticate();
          setInStorage("the_main_app", { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            formClassName: "success",
            //input box empty
            signInEmail: "",
            signInPassword: "",
            token: json.token
          });
        } else {
          this.setState({
            signInError: json.message,
            formClassName: "warning",
            isLoading: false
          });
        }
      });
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      formClassName
    } = this.state;

    const { from } = this.props.location.state || { from: { pathname: "/" } };

    if (isLoading) {
      return (
        <div>
          <p>Loading.....</p>
        </div>
      );
    }

    if (!token) {
      return (
        <div style={Style}>
          <Grid
            textAlign="center"
            style={{ height: "100%" }}
            verticalAlign="middle"
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              {/*<Header as='h1' color='blue' textAlign='center' size='massive'>*/}
              {/*<Image src='./logo2.jpg' fluid/> Login*/}
              {/*</Header>*/}
              <Image src="./logo2.jpg" size="small" verticalAlign="middle" />
              <Form className={formClassName} size="large">
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail address"
                    type="email"
                    value={signInEmail}
                    onChange={this.handleEmailChange}
                  />
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Password"
                    type="password"
                    value={signInPassword}
                    onChange={this.handlePasswordChange}
                  />
                  <Button onClick={this.onSignIn} primary animated fluid>
                    <Button.Content visible>Login</Button.Content>
                    <Button.Content hidden>
                      <Icon name="sign-in" />
                    </Button.Content>
                  </Button>
                  <Divider horizontal>Or</Divider>
                  <Button as={Link} to="/signup" secondary animated fluid>
                    <Button.Content visible>
                      Sign-up for a account
                    </Button.Content>
                    <Button.Content hidden>free</Button.Content>
                  </Button>
                </Segment>
                <Message
                  warning
                  color="yellow"
                  header="Woah!"
                  content={signInError}
                />
                <Message
                  success
                  color="green"
                  header="Nice one!"
                  content={signInError}
                />
              </Form>
              <Message>
                forgot passwords? <a href="#">Reset password</a>
              </Message>
            </Grid.Column>
          </Grid>
        </div>
      );
    }

    return <Redirect to={from} />;
  }
}

export default LoginPage;
