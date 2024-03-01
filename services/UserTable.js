const Users = require("../models/Users")
const bcrypt = require("bcrypt");
//services
const UserLoginService = async (email , password) =>{
    try {
        const validEmaildata = await Users.findOne({email});

        if(validEmaildata){
            const passcheck = await bcrypt.compare(password,validEmaildata.password);
            if(passcheck){
                return validEmaildata;
            }
            else{
                throw new Error("Password is Incorrect Please Check Again!")
            }
        }
        else{
            throw new Error("User Doesnt Exist with this Email")
        }
    } catch (error) {
        console.error(`Error checking conditions: ${error.message}`);
        throw new Error(error.message)
    }
}

 


module.exports = {UserLoginService};