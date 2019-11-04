import React, { Component } from 'react';
import './Home.css';
import logo from '../Assets/Images/logo.png';
import avatar from '../Assets/Images/kk.jpg';
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
            filteredUsers: null,
            selectedUserID: null,
            selectedImageID: null,
            selectedFileType: null,
            selectedUserName: null,
            selectedUserImagesCount: null
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
        Axios.post('http://54.245.6.3:8085/getUsers', user).then(response => {
            console.log("Result", response.data)
            this.setState({ userList: JSON.parse(response.data.body), filteredUsers: JSON.parse(response.data.body)})
        }).catch(error => {
            console.log("Error", error)
        })
    }

    saveImageData = (values,cb) => {
        console.log("User",this.props.location.state)
        Axios.post('http://54.245.6.3:8085/saveImageData',{values,userID:this.state.selectedUserID,accountantID:this.props.location.state.user.UserID}).then((response)=>{
            console.log("Response",response)
            if(response.data.statusCode === 200){
                let updatedImageList = this.state.selectedUserImagesList.filter(image=>{return image.ImageID !== values.image});
                let updatedUsersList = this.state.userList.filter(user=> user.ImageID !== values.image)
                console.log("Old List  ", this.state.selectedUserImagesList,"\nNew List  ",updatedImageList)
                this.setState({selectedImageID: null,selectedUserImagesList: updatedImageList,userList:updatedUsersList})
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
        Axios.post("http://54.245.6.3:8085/irrelevantPicture",{imageID:imageID}).then((response)=>{
            if(response.data.statusCode === 200){
                cb(true)
              let updatedImageList =  this.state.selectedUserImagesList.filter(image=>{return image.ImageID !== imageID})
              let updatedUsersList = this.state.userList.filter(user=> user.ImageID !== imageID)
              this.setState({selectedUserImagesList: updatedImageList,selectedImageID: null,userList:updatedUsersList})
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
        Axios.post("http://54.245.6.3:8085/retakePicture",data).then((response)=>{
            if(response.data.statusCode === 200){
                cb(true)
                let updatedImageList = this.state.selectedUserImagesList.filter(image=>{return image.ImageID !== imageID})
                let updatedUsersList = this.state.userList.filter(user=> user.ImageID !== imageID)
                this.setState({selectedUserImagesList: updatedImageList,selectedImageID: null,userList:updatedUsersList})

            }else{
                cb(false)
            }
        }).catch((error)=>{
            cb(false)
            console.log("Error",error)
        })
    }

    getUniqueUsers = (list) =>{
        const flags = new Set();
        let result = list.filter(entry => {
            if (flags.has(entry.UserID)) {
                return false;
            }
            flags.add(entry.UserID);
            return true;
        });
        return result
    }

    renderUserListRow = () => {
        let result = this.getUniqueUsers(this.state.filteredUsers)
        let userRow = []
        result.forEach(user => {
            userRow.push(
                <div className="list-item">
                <li onClick={() => this.userSelected(user)} className={`panel-block list-item-container ${this.state.selectedUserID === user.UserID? 'is-active active-list-item':''}`} style={{ height: '45px',cursor:'pointer' }}>
                    <div className="panel-icon user-list-item-icon">
                        <i className="fas fa-chevron-left" aria-hidden="true"></i>
                    </div>
                    <div className="user-list-item-text" style={{ color: 'rgba(121, 111, 111, 1)' }}>
                    {user.Name}
                    </div>
                    <i className={` ${this.state.selectedUserID === user.UserID ? 'fas fa-caret-right fa-4x fa-caret-right-user is-active active-list-item':''}`}></i>
                </li>
                </div>
            )
        })
        return userRow
    }

    imageSelected = (imageID,fileType) =>{
        this.setState({selectedImageID: imageID , selectedFileType: fileType})
    }

    getImageName(imageName){
        let parts = imageName.split('/');
        let answer = parts[parts.length - 1];
        return Moment(`${answer}`,'x').format("MM.DD.YY")
    }

    renderImageListRow = () => {
        console.log("Render Image List Row")
        let imageRow = []
        this.state.selectedUserImagesList.map(image => {
            imageRow.push(
                <div className="list-item">
                    <li onClick={()=>{this.imageSelected(image.ImageID,image.FileType)}} className={`panel-block list-item-container ${this.state.selectedImageID === image.ImageID? 'is-active active-list-item':''}`} style={{ height: '45px',cursor:'pointer' }}>
                        <span className="panel-icon image-list-item-icon">
                            <i className="fas fa-chevron-left" aria-hidden="true"></i>
                        </span>
                        <div className="image-list-item-text" style={{ color: 'rgba(121, 111, 111, 1)' }}>
                        {
                                this.getImageName(image.ImageID)
                        }
                        </div>
                        <i className={` ${this.state.selectedImageID === image.ImageID ? 'fas fa-caret-right fa-4x fa-caret-right-image is-active active-list-item':''}`}></i>
                    </li>
                </div>
             )
        })
        return imageRow
    }

    userSelected = (user) => {
        var selectedUserImages = this.state.userList.filter(userList => { return userList.UserID === user.UserID })
        console.log("Selected User Image", selectedUserImages)
        this.setState({ selectedUserID: user.UserID, selectedUserImagesList: selectedUserImages,selectedUserName: user.Name })
    }

    filterUsers = (searchTerm) =>{
        searchTerm = searchTerm.trim(); //remove/ignore leading/trailing spaces
        if(searchTerm){
            let filteredUsers = this.state.userList.filter(user=> {return user.Name.toLowerCase().includes(searchTerm.toLowerCase()) })
            let result = this.getUniqueUsers(filteredUsers)
            this.setState({filteredUsers: result})
        }else{
           this.setState({filteredUsers: this.state.userList}) 
        }
        
       
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
                        <Form imageList={this.state.selectedUserImagesList} imageID={this.state.selectedImageID} fileType={this.state.selectedFileType} saveImageData={this.saveImageData} irrelevantPicture={this.irrelevantPicture} retakePicture={this.retakePicture}/>
                    </div>
                    <div className="column is-one-fifth" style={{ width: '15%' }}>
                        <ImageList imageList={this.state.selectedUserImagesList} renderImageListRow={this.renderImageListRow} imageCount={this.state.selectedUserImagesList?this.state.selectedUserImagesList.length:0} userName={this.state.selectedUserName}/>
                    </div>
                    <div className="column is-one-quarter">
                        <UserList userList={this.state.userList} renderUserListRow={this.renderUserListRow} searchUsers={this.filterUsers}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;