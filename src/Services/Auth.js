import Axios from 'axios'
import {config} from './AsyncRequestService';

const loggedInUserHandle = "LIU";
const userKeys = ["userId", "name", "email", "type", "accountantId"];

// TODO: refactor this class
class Auth {

    constructor(){
        this.isAuthenticated = false
    }

    putUser (user) {
      console.log("putting", user);
      userKeys.forEach(k => localStorage.setItem(`${loggedInUserHandle}${k}`, user[k]))
    }

    getUser () {
      let user = {};
      userKeys.forEach(k => user[k] = localStorage.getItem(`${loggedInUserHandle}${k}`))
      return user;
    }
    
    login(userData,cb){
        Axios.post(`${config.apiRoot}/login`,userData).then(response=>{
            if(response.data.statusCode === 200){
                this.isAuthenticated = true
                localStorage.setItem('token',response.data.token)
                const loggedInUser = JSON.parse(response.data.body);
                this.putUser(loggedInUser)
                cb(true,loggedInUser)
                
            }else{
                this.isAuthenticated = false
                cb(false, null,"Invalid Credentials")
            }
        }).catch(error=>{
            console.log("Login Error", error)
            this.isAuthenticated = false
            cb(false,null,"Network Error")
        })
    }

    logout(cb){

        this.isAuthenticated = false
        cb(true)
    }

    getLoggedInUser() {
      return this.getUser();
    }

    getAuthentication(){
        if(localStorage.getItem('token'))
        {
            this.isAuthenticated = true
            return this.isAuthenticated
        }
        else{
            this.isAuthenticated = false
            return this.isAuthenticated
        }
    }
}

export default new Auth()