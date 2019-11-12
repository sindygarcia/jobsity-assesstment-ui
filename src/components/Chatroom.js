import React from 'react';
import "../style/App.css";
import axios from '../axiosConfig';
import { router } from '../router/router';
import { connect } from "react-redux";
import { setUser } from '../actions/common';
import socketIOClient from 'socket.io-client'
const socket = socketIOClient('http://localhost:8000/');

class Chatroom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayErrorMessage: false,
            chatMessages: [],
            message: ""
        };
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

    componentDidMount() {
        socket.emit("load_initial_data");
        socket.on("get_messages", this.handleInitialData);
        socket.on('update_messages', this.updateMessages);
        socket.on("get_bot_message", this.handleBotMessages);
    }

    componentWillUnmount() {
        socket.off("get_messages");
        socket.off("update_messages");
        socket.off("get_bot_message");
    }

    updateMessages = () => {
        socket.emit("load_initial_data");
        this.setState({ message : ""});
    }

    handleInitialData = ( messages) => {
        this.setState({ chatMessages: messages.reverse() });
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
        }).catch((error) => {
            console.log(error)
            this.setState({
                displayErrorMessage: true
            });
        });
    }

    isMessageWithStockCommand = (message) => {
        let commandRegex = /\/stock=([a-z0-9A-Z\.|\-|\_]*)$/;
        return commandRegex.test(message);
    }

    onSendMessage = async (message) => {
        try {
            let newMessage = {
                username: this.props.user.username,
                message: message,
                chatId: 1
            };

            let isMessageforBot = this.isMessageWithStockCommand(message);
            if(!isMessageforBot) {
                socket.emit("sendMessage", newMessage);
            }else{
                socket.emit("getStockStatus", message.split('=')[1]);
            }
        }catch(err) {
            console.log(err);
        }
    }

    handleBotMessages = ( message ) => {
        let { chatMessages } = this.state;
        chatMessages.push(message)
        this.setState({
            chatMessages,
            message: ""
        })
    }

    render() {
        let { message, chatMessages, displayErrorMessage } = this.state;

        return (
            <div className="container mt-5">
                <div name="chatroom" className="form-control overflow-auto messagesArea mb-2" value={chatMessages}>
                   {
                       chatMessages.map( message => {
                           return (
                               <div className="row mx-2 " key={message.id}>
                                   <span className="font-italic timestamp">{new Date(message.createdAt).toLocaleString()}&nbsp;&nbsp;</span>
                                   <h6 className="font-weight-bold">{message.userInfo.username}:&nbsp;&nbsp;</h6>
                                   <p>{message.content}</p>
                               </div>
                           );
                       })
                   }
                </div>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Type a Message..." name="message" value={message} onChange={this.handleChange}/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={() => this.onSendMessage(message)}>Send</button>
                        </div>
                </div>
                <div className="text-left">
                    <button className="btn btn-link" onClick={this.onLogout}>Logout</button>
                </div>
                {
                    displayErrorMessage &&
                        <div class="alert alert-danger" role="alert">Ops! Something went wrong.</div>
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
)(Chatroom);

export default AppContainer;