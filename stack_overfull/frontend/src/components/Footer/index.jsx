<<<<<<< HEAD
import React from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import "./index.css";
import qs from "qs";
import {Icon} from 'antd';
=======
import React from 'react';
import './index.css';
>>>>>>> 35f8800046a3695423af9237e109d83f1c2794b7

export class Footer extends React.Component {
  createQuestion() {
    axios
      .post("/api/question/", qs.stringify({question: "what is your name?"}))
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    this.forceUpdate();
  }

<<<<<<< HEAD
  render() {
    return (
      <div className="footer">
        <div className="listfooter">
          <ul>
            <li>
              <Link
                style={{
                color: "white"
              }}
                activestyle={{
                color: "red"
              }}
                to="/About">
                About Us
              </Link>
            </li>
            <li>Terms & Conditions</li>
            <li>Help</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="listfooter">
          <ul>
            <li>About Us</li>
            <li>Terms & Conditions</li>
            <li>Help</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="listfooter">
          <ul>
            <li>About Us</li>
            <li>Terms & Conditions</li>
            <li>Help</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="listfooter">
          <ul>
            <li>About Us</li>
            <li>Terms & Conditions</li>
            <li>Help</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="icon">
          <p>© Stack Overfull 2018</p>
          <Icon
            type="android"
            style={{
            fontSize: 20,
            marginRight: 5
          }}/>
          <Icon
            type="apple"
            style={{
            fontSize: 20,
            marginRight: 5
          }}/>
          <Icon
            type="windows"
            style={{
            fontSize: 20,
            marginRight: 5
          }}/>
        </div>
      </div>
    );
  }
}
=======
    render() {

        return (
            <div className="footer">

                <div className="footer__list">
                    <ul>
                        <li>About Us</li>
                        <li>Terms & Conditions</li>
                        <li>Help</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div className="listfooter">
                    <ul>
                        <li>About Us</li>
                        <li>Terms & Conditions</li>
                        <li>Help</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div className="listfooter">
                    <ul>
                        <li>About Us</li>
                        <li>Terms & Conditions</li>
                        <li>Help</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
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
>>>>>>> 35f8800046a3695423af9237e109d83f1c2794b7
