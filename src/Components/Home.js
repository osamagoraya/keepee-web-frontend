import React, { Component } from 'react';
import './Home.css';
import logo from '../logo.png';
import avatar from '../kk.jpg'
import 'bulma/css/bulma.css'
import Form from "./Form";
import ImageList from "./ImageList";
import UserList from "./UserList";
import Axios from 'axios'
import Moment from 'moment'

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: null,
            selectedUserImagesList: null,
            selectedUserID: null,
            selectedImageID: null,
        }
    }
    componentWillMount() {
        console.log("User", this.props.location.state)
        if(this.props.location.state){
            this.getUsers(this.props.location.state)
        }else{
            localStorage.clear()
            this.props.history.push("/")
        }
        
    }
    getUsers = (user) => {
        Axios.post('http://35.167.51.228:8085/getUsers', user).then(response => {
            console.log("Result", response.data)
            this.setState({ userList: JSON.parse(response.data.body) })
        }).catch(error => {
            console.log("Error", error)
        })
    }

    saveImageData = (values,cb) => {
        console.log("User",this.props.location.state)
        Axios.post('http://35.167.51.228:8085/saveImageData',{values,userID:this.state.selectedUserID,accountantID:this.props.location.state.user.UserID}).then((response)=>{
            console.log("Response",response)
            if(response.data.statusCode === 200){
                this.setState({selectedImageID: null})
                cb(true)
            }else{
                cb(false)                
            }
        }).catch(error=>{
            console.log("Error",error)
            cb(false)
        })
    }

    irrelevantPicture = (imageID,cb) =>{
        Axios.post("http://35.167.51.228:8085/irrelevantPicture",{imageID:imageID}).then((response)=>{
            if(response.data.statusCode === 200){
                cb(true)
              let updatedImageList =  this.state.selectedUserImagesList.filter(image=>{return image.ImageID !== imageID})
              this.setState({selectedUserImagesList: updatedImageList,selectedImageID: null})
            }else{
                cb(false)
            }
        }).catch((error)=>{
            cb(false)
            console.log("Error",error)
        })
    }

    retakePicture = (imageID,cb) => {
        let user = this.state.userList.find(user=>{return user.ImageID === imageID})
        let data = {
            imageID: imageID,
            name: user.Name,
            userEmail: user.Email
        }
        Axios.post("http://35.167.51.228:8085/retakePicture",data).then((response)=>{
            if(response.data.statusCode === 200){
                cb(true)
                let updatedImageList = this.state.selectedUserImagesList.filter(image=>{return image.ImageID !== imageID})
                this.setState({selectedUserImagesList: updatedImageList,selectedImageID: null})

            }else{
                cb(false)
            }
        }).catch((error)=>{
            cb(false)
            console.log("Error",error)
        })
    }

    renderUserListRow = () => {
        console.log("Render User List Row", this.state.userList)
        const flags = new Set();
        const result = this.state.userList.filter(entry => {
            if (flags.has(entry.UserID)) {
                return false;
            }
            flags.add(entry.UserID);
            return true;
        });
        let userRow = []
        result.forEach(user => {
            userRow.push(
                <li onClick={() => this.userSelected(user.UserID)} className={`panel-block ${this.state.selectedUserID === user.UserID? 'is-active':''}`} style={{ height: '25px', margin: '10px',cursor:'pointer' }}>
                    <span className="panel-icon">
                        <i className="fas fa-book" aria-hidden="true"></i>
                    </span>
                    {user.Name}
                </li>
            )
        })
        return userRow
    }

    imageSelected = (imageID) =>{
        this.setState({selectedImageID: imageID})
    }

    getImageName(imageName){
        let parts = imageName.split('/');
        let answer = parts[parts.length - 1];
        return Moment(`${answer}`,'x').format("MMM Do YY")
    }

    renderImageListRow = () => {
        console.log("Render Image List Row")
        let imageRow = []
        this.state.selectedUserImagesList.map(image => {
            imageRow.push(<li onClick={()=>{this.imageSelected(image.ImageID)}} className={`panel-block ${this.state.selectedImageID === image.ImageID? 'is-active':''}`} style={{ height: '25px', margin: '10px',cursor:'pointer' }}>
                <span className="panel-icon">
                    <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                {
                    this.getImageName(image.ImageID)
                }
            </li>)
        })
        return imageRow
    }

    userSelected = (userID) => {
        var selectedUserImages = this.state.userList.filter(user => { return user.UserID === userID })
        console.log("Selected User Image", selectedUserImages)
        this.setState({ selectedUserID: userID, selectedUserImagesList: selectedUserImages })
    }
    render() {
        return (
            <div className="section">
                <nav className="level navbar is-transparent" style={{ background: 'transparent' }}>
                    <div className="level-left">
                        <div className="level-item">
                            <img className="avatar" src={avatar} alt="Avatar" />
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <img className="app-logo" src={logo} alt="App Logo" />
                        </div>
                    </div>
                </nav>
                <div className="columns">
                    <div className="column is-three-fifths">
                        <Form imageList={this.state.selectedUserImagesList} imageID={this.state.selectedImageID} saveImageData={this.saveImageData} irrelevantPicture={this.irrelevantPicture} retakePicture={this.retakePicture}/>
                    </div>
                    <div className="column is-one-fifth" style={{ width: '15%' }}>
                        <ImageList imageList={this.state.selectedUserImagesList} renderImageListRow={this.renderImageListRow} />
                    </div>
                    <div className="column is-one-quarter">
                        <UserList userList={this.state.userList} renderUserListRow={this.renderUserListRow} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;