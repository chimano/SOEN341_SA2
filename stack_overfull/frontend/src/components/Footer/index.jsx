import React from 'react';
import axios from 'axios';
import './index.css';
import qs from 'qs';

export class Footer extends React.Component {

    createQuestion() {
        axios
            .post('/api/question/', qs.stringify({question: "what is your name?"}))
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        return (
            <div className="footer">

                <div className="listfooter">
                    <ul>
                        <li>About Us</li>
                        <li>Terms & Conditions</li>
                        <li>Help</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <p>© Stack Overfull 2018</p>
            </div>

        );

    }

}