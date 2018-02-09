class AcceptRejectButton extends React.Component {
    render() {
      return (
        <div className='popup'>
          <div className='popup_inner'>
            <h2>{this.props.text}</h2>
          <button onClick={this.props.closePopup}>Confirm</button>
          <button onClick={this.props.closePopup}>Cancel</button>
          </div>
        </div>
      );
    }
  }
  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        showPopup: false
      };
    }
    togglePopup() {
      this.setState({
        showPopup: !this.state.showPopup
      });
    }
    render() {
      return (
        <div className='app'>
          <p><h1>This is the answer to your question!</h1></p>
          <h3>Do you wish to accept or reject the above answer?</h3>
          <button onClick={this.togglePopup.bind(this)}>Accept</button>
          <button onClick={this.togglePopup.bind(this)}>Reject</button>
          
          {this.state.showPopup ? 
            <AcceptRejectButton
              text='Are you sure you wish to perform this action?'
              closePopup={this.togglePopup.bind(this)}
            />
            : null
          }
        </div>
      );
    }
  };
  
  
  
  ReactDOM.render(
    <App />,
    document.getElementById('content')
  );
  