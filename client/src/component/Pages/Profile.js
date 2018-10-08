import React, { Component } from "react";
import { getFromStorage } from "../../utils/storage";
import fakeAuth from "../Auth/fakeAuth";
import withRouter from "react-router/es/withRouter";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            token: ""
        };

        this.logout = this.logout.bind(this);
    }

    logout() {
        this.setState({
            isLoading: true
        });

        const object = getFromStorage("the_main_app");
        if (object && object.token) {
            const { token } = object;
            //verify token
            fetch("/api/account/logout?token=" + token)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        window.localStorage.removeItem("the_main_app");
                        fakeAuth.signout();
                        this.setState({
                            //clear token
                            token: "",
                            isLoading: false
                        });
                        window.location = "/";
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

    render() {
        const AuthButton = withRouter(
            ({ history }) =>
                fakeAuth.isAuthenticated ? (
                    <p>
                        Welcome!{" "}
                        <button
                            onClick={() => {
                                this.logout(() => history.push("/"));
                            }}
                        >
                            Sign out
                        </button>
                    </p>
                ) : (
                    <p>You are not logged in.</p>
                )
        );

        return <AuthButton />;
    }
}

export default Profile;
