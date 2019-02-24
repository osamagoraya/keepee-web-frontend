import Axios from 'axios'

class Auth {
    constructor(){
        this.isAuthenticated = false
    }

    login(userData,cb){
        Axios.post('http://54.245.6.3:8085/login',userData).then(response=>{
            if(response.data.statusCode === 200){
                this.isAuthenticated = true
                localStorage.setItem('token',response.data.token)
                cb(true,JSON.parse(response.data.body))
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