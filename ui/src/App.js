import './App.css';
import React from "react"
import { Slideshow } from "./Slideshow"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { Manage } from './Manage';
import Login from './Login';
import { getUsers, getFeed } from './api';

const refreshSpeed = 86400

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      userId: null,
      userName: "----",
      feed: null,
    }
  }

  getUserDetails = async (userId) => {
    const users = await getUsers()
    if (!users[userId]) {
      alert("PIN was incorrect, please try again.")
    }
    else {
      this.setState({
        userName: users[userId].name,
        userId,
      })
    }
    
  }

  loadFeed = async () => {
    if (this.state.userId) {
      const result = await getFeed(this.state.userId)
      this.setState({
          feed: result
      })
    }
    else {
      setTimeout(() => {
        this.loadFeed()
      }, 100)
    }
    
  }

  // componentDidUpdate() {
  //   this.loadFeed()
  // }

  componentDidMount() {
    setInterval(() => {
      this.loadFeed()
    }, 30000)

    setTimeout(() => {
      this.loadFeed()
    }, 0)
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
                        <li className="pure-menu-item"><Link to="/manage" className="pure-menu-link">Send A Note</Link></li>
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
              <Route path="/manage">
                <Manage userId={this.state.userId}></Manage>
              </Route>
              <Route path="/">
                <Slideshow id="carousel" userId={this.state.userId} feed={this.state.feed} loadFeed={this.loadFeed}></Slideshow>
              </Route>
            </Switch>
          </div>
        </Router>
      )
     }
     else {
       return (
        <Login onLogin={(userId) => {
          this.getUserDetails(userId)
        }}></Login>
       )
     }
  }
}

export default App;
