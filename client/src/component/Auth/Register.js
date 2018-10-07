import React from "react";
import { Button, Form, Grid, Image, Message, Segment } from "semantic-ui-react";
import Joi from "joi-browser";

import {
  getFromStorage
  // setInStorage
} from "../../utils/storage";

//style
const Style = {
  margin: "20px"
};

// schema of signup information judgement using joi (valid email, password longer than 5, require firstname and lastname)
const schema = {
  email: Joi.string()
    .required()
    .email()
    .label("Username"),
  passWord: Joi.string()
    .required()
    .min(5)
    .label("Password"),
  firstName: Joi.string()
    .required()
    .label("Firstname"),
  lastName: Joi.string()
    .required()
    .label("Lastname"),
  address: Joi.string()
    .required()
    .label("address"),
  phone: Joi.string()
    .regex(/^([+]?|[0-9]{3,4}-)[0-9]{6,11}/)
    .required()
    .label("Phone number")
};

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpFirstName: "",
      signUpLastName: "",
      signUpEmail: "",
      signUpPassword: "",
      signUpAddress: "",
      signUpPhone: "",
      signUpError: "",
      isLoading: true,
      token: "",
      errors: {},
      formClassName: ""
    };

    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);

    this.onSignUp = this.onSignUp.bind(this);
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
  //validate the email,password, firstname, lastname, address and phone number
  validate = () => {
    const data = {
      email: this.state.signUpEmail,
      passWord: this.state.signUpPassword,
      firstName: this.state.signUpFirstName,
      lastName: this.state.signUpLastName,
      address: this.state.signUpAddress,
      phone: this.state.signUpPhone
    };
    const result = Joi.validate(data, schema);
    if (!result.error) return null;
    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };
  //onchage of firstName
  handleFirstNameChange(e) {
    this.setState({ signUpFirstName: e.target.value });
  }
  //onchage of lastName
  handleLastNameChange(e) {
    this.setState({ signUpLastName: e.target.value });
  }
  //onChange of email
  handleEmailChange(e) {
    this.setState({ signUpEmail: e.target.value });
  }
  //onchange of Password
  handlePasswordChange(e) {
    this.setState({ signUpPassword: e.target.value });
  }

  handleAddressChange(e) {
    this.setState({ signUpAddress: e.target.value });
  }

  handlePhoneChange(e) {
    this.setState({ signUpPhone: e.target.value });
  }

  onSignUp() {
    //grap state
    const {
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpAddress,
      signUpPhone
    } = this.state;

    this.setState({
      isLoading: true
    });

    console.log(this.validate());

    //Post request to backend
    fetch("/api/account/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
        address: signUpAddress,
        phone: signUpPhone,
        errors: this.validate()
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            formClassName: "success",
            isLoading: false,
            //input box empty
            signUpEmail: "",
            signUpPassword: "",
            signUpFirstName: "",
            signUpLastName: "",
            signUpAddress: "",
            signUpPhone: ""
          });
        } else if (this.validate()) {
          this.setState({
            // signUpError: json.message,
            errors: this.validate(),
            formClassName: "warning",
            isLoading: false
          });
        } else {
          this.setState({
            signUpError: json.message,
            formClassName: "error",
            isLoading: false
          });
        }
      });
  }

  render() {
    const {
      isLoading,
      token,
      signUpError,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      signUpPassword,
      signUpAddress,
      signUpPhone,
      errors,
      formClassName
    } = this.state;

    const err = Object.values(errors); // extract error from error object

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
              <Image
                src={require("./logo.jpg")}
                height="200px"
                width="200px"
                verticalAlign="middle"
              />
              <Form className={formClassName} size="large">
                <Segment textAlign="left" stacked>
                  <Form.Field>
                    <Form.Input
                      icon="user"
                      iconPosition="left"
                      label="Email address"
                      placeholder="Email address"
                      type="email"
                      value={signUpEmail}
                      onChange={this.handleEmailChange}
                    />
                    <Form.Input
                      fluid
                      icon="lock"
                      iconPosition="left"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      value={signUpPassword}
                      onChange={this.handlePasswordChange}
                    />
                  </Form.Field>
                  <Form.Group widths="equal">
                    <Form.Input
                      type="name"
                      label="First name"
                      placeholder="First name"
                      value={signUpFirstName}
                      onChange={this.handleFirstNameChange}
                    />
                    <Form.Input
                      type="name"
                      label="Last name"
                      placeholder="Last name"
                      value={signUpLastName}
                      onChange={this.handleLastNameChange}
                    />
                  </Form.Group>
                  <Form.Field>
                    <Form.Input
                      label="Address"
                      placeholder="Address"
                      value={signUpAddress}
                      onChange={this.handleAddressChange}
                    />
                    <Form.Input
                      icon="mobile alternate"
                      iconPosition="left"
                      label="Phone"
                      placeholder="Phone"
                      value={signUpPhone}
                      onChange={this.handlePhoneChange}
                    />
                  </Form.Field>
                  <Button onClick={this.onSignUp} primary>
                    SignUp
                  </Button>
                </Segment>
                <Message warning color="yellow" header="Woah!" content={err} />
                <Message
                  error
                  color="red"
                  header="Woah!"
                  content={signUpError}
                />
                <Message
                  success
                  color="green"
                  header="Nice one!"
                  content={signUpError}
                />
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      );
    }

    return (
      <div>
        <p>Account</p>
      </div>
    );
  }
}

export default SignUpPage;
