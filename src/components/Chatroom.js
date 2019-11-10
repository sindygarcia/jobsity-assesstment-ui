import React from 'react';
import "../style/App.css";
import axios from '../axiosConfig';
import { router } from '../router/router';
import { connect } from "react-redux";
import { setUser } from '../actions/common';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        if (!this.props.user.username) {
            if (this.props.storage && this.props.storage.user) {
                this.props.dispatch(setUser({ username: this.props.storage.user.username, isLogged: this.props.storage.user.isLogged }));
            } else {
                console.log("User not logged");
                router.stateService.go('login', {});
            }
        }
    }

    handleChange = (event) => {
        let key = event.target.name;
        let value = event.target.value;

        this.setState({
            [key]: value
        });
    }

    onLogout = () => {
        axios().post("/logout").then( response => {
            this.props.dispatch(setUser({ username: null, isLogged: false }));
            localStorage.setItem("state", null);
            localStorage.setItem("authToken", null);
            router.stateService.go('login', {});
        }).catch((error) => console.log(error));
    }

    onSendMessage = async (message) => {
        try{
            let sendMessage = axios().post("/postMessage", {
                    username: this.props.storage.user.username, 
                    message: message, 
                    date: new Date()
                });

            let response = sendMessage.response;
            if(response.status === 201) {
                this.setState({
                    message: ""
                });

                //update chatMessages ?
            }
        }catch(err) {
            console.log(err);
        }
    }

    render() {
        let { message, chatMessages } = this.state;

        return (
            <div className="container mt-5">
                <div name="chatroom" className="form-control messagesArea mb-2" value={chatMessages}>
                    Messages here .....
                </div>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Type Message..." value={message} onChange={this.handleChange}/>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" onClick={() => this.onSendMessage(message)}>Send</button>
                        </div>
                </div>
                <div className="text-left">
                    <button className="btn btn-link" onClick={this.onLogout}>Logout</button>
                </div>
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
)(Chatroom);

export default AppContainer;