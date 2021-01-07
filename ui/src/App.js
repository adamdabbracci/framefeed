import './App.css';
import React from "react"
import { Slideshow } from "./Slideshow"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { Create } from './Create';
import Login from './Login';
import { ManageFeed } from './ManageFeed';



class App extends React.Component {

  constructor() {
    super()
    this.state = {
      userId: null,
      userName: window.localStorage.getItem("userName") || "--",
    }
  }



  

  componentDidMount() {
    // Run immediately
    this.setState({
      userName: window.localStorage.getItem("userName"),
      userId: window.localStorage.getItem("userId"),
    })
  }

  

  

  render() {

    if (this.state.userId) {
      return (
        <Router>
          <div>
            <nav>
              <div className="header">
                <div className="pure-menu pure-menu-vertical">
                  <a className="pure-menu-heading" href="">Hello, <b>{this.state.userName}!</b></a>

                  <ul className="pure-menu-list">
                    <li className="pure-menu-item"><Link to="/" className="pure-menu-link">Slideshow</Link></li>
                    <li className="pure-menu-item"><Link to="/create" className="pure-menu-link">Send A Note</Link></li>
                    <li className="pure-menu-item"><Link to="/manage" className="pure-menu-link">Edit Feed</Link></li>
                    <li className="pure-menu-item"><a href="#" className="pure-menu-link" onClick={() => {
                      this.setState({
                        userId: null,
                        userName: null,
                      })
                      window.localStorage.clear()
                    }}>Sign Out</a></li>
                  </ul>
                </div>
              </div>

            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/create">
                <Create userId={this.state.userId}></Create>
              </Route>
              <Route path="/manage">
                <ManageFeed userId={this.state.userId}></ManageFeed>
              </Route>
              <Route path="/">
                <Slideshow userId={this.state.userId}></Slideshow>
                {/* {
                  showFeed && (
                    <Slideshow userId={this.state.userId} feed={this.state.feed}></Slideshow>
                  )
                }
                <div style={{
                  textAlign: "center",
                  marginTop: "10%",
                  fontSize: "2rem"
                }}>
                {
                  !showFeed && feed && (
                    <button class="pure-button pure-button-primary" onClick={() => {
                      this.startSlideshow()
                    }}>Start Slideshow</button>
                  )
                }
                {
                  !showFeed && !feed && (
                    <div>Loading, please wait</div>
                  )
                }
                </div>*/}
              </Route> 
            </Switch>
          </div>
        </Router>
      )
    }
    else {
      return (
        <Login onLogin={(userId, userName) => {
          this.setState({
            userId: userId,
            userName,
          })
          // this.loadFeed()
        }}></Login>
      )
    }
  }
}

export default App;
