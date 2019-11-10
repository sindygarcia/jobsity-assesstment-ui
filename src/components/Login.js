import React from 'react';
import "../style/App.css";
import {router} from '../router/router';
import {setUser} from '../actions/common';
import { connect } from "react-redux";
import axios from '../axiosConfig';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userNotFound: false,
            invalidCredentials: false,
            unknownError: false
        };
    }

    handleChange = (event) => {
        let key = event.target.name;
        let value = event.target.value;

        this.setState({
            [key] : value
        });
    }

    onLogin = async (username, password) => {
        this.setState({ userNotFound: false, invalidCredentials: false, unknownError: false });
        try {  
            let login = await axios().post("/login", { username: username, password: password });
            let response = login.response;

            if(response.status === 200) {
                localStorage.setItem("authToken", response.data.authToken);
                this.props.dispatch( 
                    setUser({
                        username: username,
                        isLogged: true
                    })
                );
                router.stateService.go('chatroom', {});
            }
        }catch(err) {
            if(err.status === 404) {
                this.setState({ userNotFound: true });
            } else if(err.status === 401) {
                this.setState({ invalidCredentials: true });
            }else {
                this.setState({ unknownError: true });
            }
        }
    }

    onSignUp = () => {
        router.stateService.go('signup', {});
    }

    render() {
        let { username, password, userNotFound, invalidCredentials, unknownError} = this.state;

        return (
            <div className="container">
                <form className="col-md-6 offset-0 offset-md-1 mt-3">
                    <div className="form-group mb-2">
                        <input type="email" name="username" className="form-control" placeholder="Username" value={username} onChange={this.handleChange} />
                    </div>
                    <div className="form-group mb-2">
                        <input type="password" name="password" className="form-control" placeholder="Password" value={password} onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={() => this.onLogin(username, password)} className="btn custom-btn btn-light col">Sign In</button>
                    </div>
                    <div className="form-group">
                        <div className="text-center">
                            <button className="btn btn-link" onClick={this.onSignUp}>Sign Up</button>
                        </div>
                    </div>
                </form> 
                { 
                    userNotFound &&
                        <div class="alert alert-danger" role="alert">User does not exist</div>
                }
                {
                    invalidCredentials &&
                        <div class="alert alert-danger" role="alert">Invalid Username and/or Password</div>
                }
                {
                    unknownError && 
                        <div class="alert alert-danger" role="alert">Ops! something went wrong. Try again later</div>
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        storage: state.storage,
        user: state.user
    }
};

const AppContainer = connect(
    mapStateToProps,
    null
)(Login);

export default AppContainer;