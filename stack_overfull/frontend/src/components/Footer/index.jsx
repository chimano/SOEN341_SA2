import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { Icon } from "antd";

export class Footer extends React.Component {
  render() {
    return (
      <div className="footer-wrapper">
        <div className="footer page-width">
          <ul>
            <h3>
              <Link style={{ color: "white" }} to="/">
              © Stack Overfull 2018
              </Link>
            </h3>
            <li>
              <a style={{ color: "white" }} href="https://github.com/chimano/SOEN341_SA2/wiki">About</a>
            </li>
            <li>
              <a style={{ color: "white" }} href="https://github.com/chimano/SOEN341_SA2/wiki/How-to-Set-up-Localhost">Help</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
