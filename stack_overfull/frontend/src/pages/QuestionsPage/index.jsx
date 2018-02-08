import React from 'react';
import {
  NavigationBar,
  SignUpFormWindow,
  SignInFormWindow,
  QuestionList,
  Footer
} from "../../components";
import './index.css';
import axios from 'axios';

export class QuestionsPage extends React.Component {

  render() {

    return (
      
      <div>
        <h1 className="question">Questions</h1>
          <h3 className="question">Categories</h3>
            <h4 className="question">
            <li><a href="/pages/QuestionsPage/BusinessPage/BusinessQuestions">Business</a></li>
            <li><a href="/pages/QuestionsPage/CookingPage/CookingQuestions">Cooking</a></li>
            <li><a href="/pages/QuestionsPage/EntertainmentPage/EntertainmentQuestions">Entertainment</a></li>
            <li><a href="/pages/QuestionsPage/FashionPage/FashionQuestions">Fashion</a></li>
            <li><a href="/pages/QuestionsPage/SchoolPage/SchoolQuestions">School</a></li>
            <li><a href="/pages/QuestionsPage/SocialPage/SocialQuestions">Social</a></li>
            <li><a href="/pages/QuestionsPage/TechnologyPage/TechnologyQuestions">Technology</a></li>
            </h4>
          <h3 className="question">Top Questions</h3>
          <h3 className="question">Latest Questions</h3>
      </div>
    );
  }
}
