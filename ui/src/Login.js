import './App.css';
import React from "react"
import { getUsers } from './api';
export default class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            userId: null,
            userName: null
        }
    }

    componentDidMount() {
        const savedUserId = window.localStorage.getItem("userId")
        if (savedUserId) {
            this.setState({
                userId: savedUserId,
            })
            this.props.onLogin(savedUserId)
        }
    }

    login = async () => {
        const users = await getUsers()
        if (!users[this.state.userId]) {
          alert("PIN was incorrect, please try again.")
        }
        else {
            window.localStorage.setItem("userId", this.state.userId)
            window.localStorage.setItem("userName", users[this.state.userId].name)
            this.props.onLogin(this.state.userId)
        }
        
        
      }


      addCode = (number) => {
        const currentNumber = (this.state.userId) ? this.state.userId : ""
        this.setState({
            userId: currentNumber + number.toString()
        })
      }
      
      renderKeypad = () => {
        return (
          <table id="keypad" cellpadding="5" cellspacing="3">
            <tr>
                {
                    [1,2,3].map((num) => {
                        return (
                            <td><button onClick={() => this.addCode(num)}>{num}</button></td>
                        )
                    })
                }
              </tr>
              <tr>
              {
                    [4,5,6].map((num) => {
                        return (
                            <td><button onClick={() => this.addCode(num)}>{num}</button></td>
                        )
                    })
                }
              </tr>
              <tr>
              {
                    [7,8,9].map((num) => {
                        return (
                            <td><button onClick={() => this.addCode(num)}>{num}</button></td>
                        )
                    })
                }
              </tr>
              <tr>
              {
                    [0].map((num) => {
                        return (
                            <td><button onClick={() => this.addCode(num)}>{num}</button></td>
                        )
                    })
                }
                 <td><button onClick={() => {
                     this.setState({
                         userId: null,
                     })
                 }}>Clear</button></td>
              </tr>
          </table>
        )
      }


    render() {
        return (
            <div style={{
                padding: 20,
                textAlign: "center"
            }}>
             
             <h4>Enter your 4 digit pin number:</h4>
             <input type="number" style={{
                 height: "50px",
                 width: "300px",
                 fontSize: "2rem"
             }} value={this.state.userId || ""} maxLength={4} onChange={(e) => {
                 this.setState({
                     userId: e.target.value
                 })
             }}></input>



             <br></br>


             <div style={{
                 margin: "20px auto",
                 display: "inline-block",
             }}>
             {this.renderKeypad()}
             </div>
             
             
             <br /><br></br>




             <button className={(this.state.userId && this.state.userId.length === 4) ? "pure-button pure-button-primary" : "pure-button"} onClick={() => {
                 this.login()
             }}>Launch</button>
            </div>
          )
    }
}