import React from "react";
import {Link} from "react-router-dom";
import "./index.css";
import {Icon} from 'antd';

export class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
          <ul className ="footer-one">
            <li>
              <Link
                style={{
                color: "white"
              }}
                to="/About">
                About Us
              </Link>
            </li>
            <li>Terms & Conditions</li>
            <li>Help</li>
            <li>Contact Us</li>
          </ul>
          <ul className ="footer-two">
            <li>Question</li>
            <li>Jobs</li>
            <li>Develop Jobs Directory</li>
            <li>Mobile</li>
          </ul>
          <ul className ="footer-two">
            <li>Technology</li>
            <li>Life/Arts</li>
            <li>Culture/Recreation</li>
            <li>Other</li>
          </ul>
          <ul className ="footer-two">
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
          </ul>
        </div>
    );
  }
}
