import './App.css';
import React from "react"

export default class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            userId: null
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
             }} value={this.state.userId || null} maxLength={4} onChange={(e) => {
                 this.setState({
                     userId: e.target.value
                 })
             }}></input><br /><br></br>
             <button className={"pure-button"} onClick={() => {
                 window.localStorage.setItem("userId", this.state.userId)
                 this.props.onLogin(this.state.userId)
             }}>Launch</button>
            </div>
          )
    }
}