import React from 'react';
import axios from 'axios';

export class Footer extends React.Component {

    createQuestion(){
        axios.post('/api/question/', {
            question:"what is your name?"
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    render(){
        
        return(
            <div>
                stackoverfull 2018
                <button onClick={() => this.createQuestion()}>create Q</button>
            </div>
        )
    }
}
    
