//ROUTES
const express = require("express");
const auth = express.Router();
const IsLoggedIn = require('../middleware/IsLoggedIn')

const {
    UserSignup,
    UserLogin,
    TaskFetch,
    TaskPost,
    UserPassChange,
}  = require("../controller/Users");

auth.post('/signup' , UserSignup); 
auth.post('/login' , UserLogin)
auth.post ('/taskupdate',IsLoggedIn, TaskPost)
auth.get ('/taskfetch',IsLoggedIn, TaskFetch)
auth.put('/passchange',IsLoggedIn, UserPassChange)

module.exports = auth;

            /*OR*/
            /*exports.auth = User */
            /*module.exports = auth; */