import React from 'react'
import { Link } from 'react-router-dom'
import "./CategoryPage.css";
import { Footer } from "../../components";

const CategoryPage = () => (
  <header>
    <nav>

      <div>
      <h1 className="welcomeTitle1">Welcome to the Questions Categories tab!</h1>
      <h3 className="welcomeTitle2">Here you can find all the questions divided into different categories.</h3>
      </div>

      <div className="categoryBox">
      <ul className="bubbles">
        <li><Link to='/categories/business' style={{ color: "black" }}>Business</Link></li>
        <li><Link to='/categories/cooking' style={{ color: "black" }}>Cooking</Link></li>
        <li><Link to='/categories/entertainment' style={{ color: "black" }}>Entertainment</Link></li>
        <li><Link to='/categories/fashion' style={{ color: "black" }}>Fashion</Link></li>
        <li><Link to='/categories/programming' style={{ color: "black" }}>Programming</Link></li>
        <li><Link to='/categories/social' style={{ color: "black" }}>Social</Link></li>
        <li><Link to='/categories/technology' style={{ color: "black" }}>Technology</Link></li>
      </ul>
      </div>
    </nav>
  </header>
)

export default CategoryPage