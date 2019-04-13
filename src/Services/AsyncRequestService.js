import axios from 'axios';
// import config from '../config';

// export const config = {apiRoot: 'http://54.245.6.3:8085'}
export const config = {apiRoot: 'http://localhost:8085'}
// export const config = {apiRoot: 'http://a4fa0db2.ngrok.io'}

export function sendAsyncRequest(url, method, data, onSuccessCallback, onFailureCallback){
	axios ({
		method: method,
		url: url,
		data: data
	})
	.then(function (response) {
   	onSuccessCallback(response);
	})
	.catch(function (error) {
		onFailureCallback(error);
	});
}

export function sendAuthenticatedAsyncRequest(uri, method, data, onSuccessCallback, onFailureCallback){
	const authorization_token = localStorage.getItem("token");
	if (authorization_token !== null) {
		axios ({
			method: method,
			url: url(uri),
			data: data,
			headers: { 'Authorization': authorization_token }
		})
		.then(function (response) {
	    onSuccessCallback(response);
		})
		.catch(function (error) {
      if (typeof onFailureCallback === 'function')
        onFailureCallback(error);
      else
        console.log(error);
		});
	}
	else {
		console.log("User is not authenticated. Redirect to Sign in.");
		// redirect to sign in path
	}
}

const url = (uri) => `${config.apiRoot}${uri}`;