import React, {Component} from 'react';
import {NavigationBar, SignUpFormWindow, SignInFormWindow, QuestionList} from '../components';

export class HomePage extends Component {

    constructor(props){
        super(props)

        this.state = {
            open_signin: false,
            open_signup: false
        }

        this.handle_signup_button = this.handle_signup_button.bind(this)
        this.handle_signin_button = this.handle_signin_button.bind(this)
        this.handle_close_button = this.handle_close_button.bind(this)
    }

    handle_signup_button() {
        this.setState({
            open_signup: true,
            open_signin: false
        })
    }

    handle_signin_button() {
        this.setState({
            open_signin: true,
            open_signup: false
        })
    }

    handle_close_button() {
        this.setState({
            open_signin: false,
            open_signup: false            
        })
    }

    render() {           

        var login_box
        if(this.state.open_signin === true){
            login_box = 
            <div className="login-wrap">
                <SignInFormWindow  handle_close_button = {this.handle_close_button}/>
            </div>
        }
        else if(this.state.open_signup === true){
            login_box = 
            <div className="login-wrap">
                <SignUpFormWindow  handle_close_button = {this.handle_close_button}/>
            </div>
        }else{
            login_box = ''
        }

        return (
            <div>
                <NavigationBar 
                    handle_signup_button = {this.handle_signup_button}
                    handle_signin_button = {this.handle_signin_button}/>

                {login_box}
                <div className="main">
                    <QuestionList />
                </div>
            </div>
        );
    }
}