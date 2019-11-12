import React from 'react';
import "../style/App.css";
import { router } from '../router/router';
import axios from '../axiosConfig';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            unknownError: false
        };
    }

    handleChange = (event) => {
        let key = event.target.name;
        let value = event.target.value;

        this.setState({
            [key]: value
        });
    }

    onSave = async (username, password) => {
        this.setState({ unknownError: false });
        try {
            let response = await axios().post("/signup", { username: username, password: password });

            if (response.status === 201) {
                console.log("User created");
                router.stateService.go('login', {});
            }
        } catch (err) {
            console.log(err);
            this.setState({ unknownError: true });
        }
    }

    onCancel = () => {
        router.stateService.go('login', {});
    }

    render() {
        let { username, password, unknownError } = this.state;

        return (
            <div className="container mt-5">
                <div className="col-md-6 offset-0 offset-md-1 text-center app-title"><h2>Chat Assesstment</h2></div>
                <form className="col-md-6 offset-0 offset-md-1 mt-3">
                    <div className="form-group mb-2">
                        <input type="email" name="username" className="form-control" placeholder="Username" value={username} onChange={this.handleChange} />
                    </div>
                    <div className="form-group mb-2">
                        <input type="password" name="password" className="form-control" placeholder="Password" value={password} onChange={this.handleChange} />
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={() => this.onSave(username, password)} className="btn custom-btn btn-light col-6">Save</button>
                        <button type="button" onClick={this.onCancel} className="btn custom-btn btn-light col-6">Cancel</button>
                    </div>
                </form>
                {
                    unknownError &&
                        <div className= "col-md-6 offset-0 offset-md-1 alert alert-danger" role="alert"> Ops! something went wrong. Try again later.</div>
                }
            </div>
        );
    }
}