import React from 'react';
import axios from 'axios';
import qs from 'qs';
export class Footer extends React.Component {

    createQuestion(){
        axios.post('/api/question/', qs.stringify({
            question:"what is your name?"
          }))
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
    
