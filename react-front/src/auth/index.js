export const signup = (user) =>{
    //sending POST request to backend. There r many ways to do so,
   //  we r using popular fetch method here.
   return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
       method: "POST",
       headers: {
           Accept: "application/json",
           "Content-Type": "application/json"
       },
       body: JSON.stringify(user)
   })
   .then(response=>{
       return response.json()
   })
   .catch(err=> console.log(err))
};


export const  signin = (user) =>{
    //sending POST request to backend. There r many ways to do so,
   //  we r using popular fetch method here.
   return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
       method: "POST",
       headers: {
           Accept: "application/json",
           "Content-Type": "application/json"
       },
       body: JSON.stringify(user)
   })
   .then(response=>{
       return response.json()
   })
   .catch(err=> console.log(err))
};

export const  authenticate = (jwt, next) =>{
    if(typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(jwt))
        next();
    }
}

export const signout = (next) => {
    if(typeof window!== "undefined") localStorage.removeItem("jwt") //jwt key holds the token in local storage.
    next()
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
    .then(response => {
        console.log('signout', response);
        return response.json()
    })
    .catch(err => console.log(err))
}

export const isAuthenticated =() =>{
     if(typeof window =="undefined"){
         return false
     }

     if(localStorage.getItem("jwt")){
         return JSON.parse(localStorage.getItem("jwt"))
     } else {
         return false
     }
}
 
export const forgotPassword = email => {
    console.log("email: ", email);
    return fetch(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};
 
export const resetPassword = resetInfo => {
    return fetch(`${process.env.REACT_APP_API_URL}/reset-password`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};