import React from 'react';
import { uploadFile, getUsers } from './api';

export class Manage extends React.Component {
    state = { 
        // Initially, no file is selected 
        selectedFile: null,
        previewUrl: null,
        selectedUsers: [],
        users: null,

      }; 


       
      // On file select (from the pop up) 
      onFileChange = event => { 
  
        var reader = new FileReader();
        console.log(event.target.result)
        this.setState({ 
          selectedFile: event.target.files[0],
          previewUrl: URL.createObjectURL(event.target.files[0]),
        }); 
      }; 
       
      // On file upload (click the upload button) 
      onFileUpload = async () => { 

        const { selectedUsers } = this.state
       
        // Create an object of formData 
        const formData = new FormData(); 
       
        // Update the formData object 
        formData.append( 
          "myFile", 
          this.state.selectedFile, 
          this.state.selectedFile.name 
        ); 
       
       
        try {
            const result = await uploadFile(this.props.userId, selectedUsers, this.state.selectedFile)
            if (result) {
              alert("Uploaded successfully.")
            }
            
        }
        catch(ex) {
            alert("Failed to upload!")
            console.log(ex)
        }
      }; 
       
      getUsers = async () => {
          const users = await getUsers()
          this.setState({
              users,
          })
      }

      componentDidMount = () => {
          this.getUsers()
      }
       
      render() { 
       
        const { users, selectedUsers, previewUrl } = this.state

        return ( 
          <div className={"pure-form "} style={{
            padding: "20px"
          }}>
            
              <div> 
                <h3> 
                    1. Select an image or video
                </h3> 
                <div> 
                    <input type="file" onChange={this.onFileChange}  style={{
                      border: "thin solid gray",
                      padding: "20px",
                      width: "100%",
                    }}/> 
                    {
                  previewUrl && (
                      <img src={previewUrl} style={{
                        width: "50%",
                        padding: "20px"
                      }}></img>
                  )
                }
                </div> 
                <h3>2. Select who you want to share with</h3>
                
                {/* {
                    users && (
                        <select value={selectedUser} onChange={(v) => {
                            console.log(v.target.value)
                        }}>
                        {
                            Object.keys(users).map((userId) => {
                                return (
                                    <option value={userId} key={`user-${userId}`}>{users[userId]}</option>
                                )
                            })
                        }
                        </select>
                    )
                } */}

                {
                    users && (
                        Object.keys(users).map((userId) => {
                            return (
                              <label className="pure-checkbox" key={`user-${userId}`} style={{
                                fontSize: "1.3rem",
                                padding: "20 0"
                              }}>
                                <input type="checkbox" id={userId} value={userId} onChange={(e) => {

                                  // Add to list
                                  if (e.target.checked) {
                                    if (!selectedUsers[e.target.value]) {
                                      selectedUsers.push(e.target.value)
                                    }
                                  }

                                  // Remove from list
                                  if (!e.target.checked) {
                                    if (selectedUsers.includes(e.target.value)) {
                                      selectedUsers.splice(selectedUsers.indexOf(e.target.value), 1)
                                    }
                                  }

                                  this.setState({
                                    selectedUsers
                                  })

                                }}/> {users[userId]}
                              </label>


                                // <div style={{
                                //   fontSize: "1.5rem"
                                // }}><input type="radio" value={userId} key={`user-${userId}`} name="selectedUser"
                                //     onChange={(v) => {
                                //         this.setState({
                                //             selectedUser: v.target.value
                                //         })
                                //     }}
                                // /> {users[userId]}</div>
                            )
                        })
                    )
                }

                <h3>3. Click to share this post!</h3>
                <div>
                    <button className={"pure-button pure-button-primary"} style={{
                      fontSize: "2rem"
                    }} onClick={this.onFileUpload}> 
                            Share Post
                    </button> 
                </div>
                
            </div> 
          </div>
        ); 
      } 
}