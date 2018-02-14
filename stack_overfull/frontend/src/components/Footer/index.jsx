import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { Icon } from "antd";

export class Footer extends React.Component {
  render() {
    return (
      <div className="footer-wrapper">
        <div className="footer">
          <ul>
            <h3> Stack Overfull </h3>
            <li>
              {" "}
              <Link style={{ color: "white" }} to="/About">
                {" "}
                About{" "}
              </Link>{" "}
            </li>
            <li>Help</li>
            <li>Contact Us</li>
            <li>Terms & Conditions</li>
          </ul>
          <ul>
            <h3> Questions </h3>
            <li>Business</li>
            <li>Cooking</li>
            <li>Fashion</li>
            <li>Entertainment</li>
            <li>Programming</li>
            <li>Social</li>
            <li>Technology</li>
          </ul>
          <ul>
            <h3> Social Media </h3>
            <li>Facebook</li>
            <li>Intagram</li>
            <li>Twitter</li>
          </ul>
          <ul className="footer__credits">
            <p>© Stack Overfull 2018</p>
            <Icon
              type="android"
              style={{
                fontSize: 20,
                marginRight: 5
              }}
            />
            <Icon
              type="apple"
              style={{
                fontSize: 20,
                marginRight: 5
              }}
            />
            <Icon
              type="windows"
              style={{
                fontSize: 20,
                marginRight: 5
              }}
            />
          </ul>
        </div>
      </div>
    );
  }
}
