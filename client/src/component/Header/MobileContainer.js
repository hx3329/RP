import { Component } from "react";
import {
  Button,
  Container,
  Icon,
  Menu,
  Responsive,
  Segment,
  Sidebar
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";
import fakeAuth from "../Auth/fakeAuth";

class MobileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handlePusherClick = this.handlePusherClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout() {
    fakeAuth.out();
  }

  handlePusherClick() {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) this.setState({ sidebarOpened: false });
  }

  handleToggle() {
    this.setState({ sidebarOpened: !this.state.sidebarOpened });
  }

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          {fakeAuth.isAuthenticated ? (
            <Sidebar
              as={Menu}
              animation="uncover"
              inverted
              vertical
              visible={sidebarOpened}
            >
              <Menu.Item as={Link} to="/" active>
                Home
              </Menu.Item>
              <Menu.Item as={Link} to="/map">
                Map
              </Menu.Item>
              <Menu.Item onClick={this.logout}>Log out</Menu.Item>
              <Menu.Item as={Link} to="/profile">
                Profile
              </Menu.Item>
            </Sidebar>
          ) : (
            <Sidebar
              as={Menu}
              animation="uncover"
              inverted
              vertical
              visible={sidebarOpened}
            >
              <Menu.Item as={Link} to="/" active>
                Home
              </Menu.Item>
              <Menu.Item as={Link} to="/map">
                Map
              </Menu.Item>
              <Menu.Item as={Link} to="/login">
                Log in
              </Menu.Item>
              <Menu.Item as={Link} to="/signup">
                Sign Up
              </Menu.Item>
            </Sidebar>
          )}

          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
          >
            <Segment
              inverted
              textAlign="center"
              vertical
            >
              <Container>
                {fakeAuth.isAuthenticated ? (
                  <Menu inverted pointing secondary size="large">
                    <Menu.Item onClick={this.handleToggle}>
                      <Icon name="sidebar" />
                    </Menu.Item>
                    <Menu.Item position="right">
                        <Button as={Link} to="/data"  color='teal' inverted style={{ marginRight: "0.5em" }}>
                            InputData
                        </Button>
                      <Button onClick={this.logout} inverted>
                        Log out
                      </Button>
                      <Button
                        as={Link}
                        to="/profile"
                        inverted
                        style={{ marginLeft: "0.5em" }}
                      >
                        Profile
                      </Button>
                    </Menu.Item>
                  </Menu>
                ) : (
                  <Menu inverted pointing secondary size="large">
                    <Menu.Item onClick={this.handleToggle}>
                      <Icon name="sidebar" />
                    </Menu.Item>
                    <Menu.Item position="right">
                      <Button as={Link} to="/login" inverted>
                        Log in
                      </Button>
                      <Button
                        as={Link}
                        to="/signup"
                        inverted
                        style={{ marginLeft: "0.5em" }}
                      >
                        Sign Up
                      </Button>
                    </Menu.Item>
                  </Menu>
                )}
              </Container>
            </Segment>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

export default MobileContainer;
