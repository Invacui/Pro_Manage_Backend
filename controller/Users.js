//controller
const Users = require("../models/Users")
const List = require("../models/List")
const bcrypt = require("bcrypt");
const env = require("dotenv");
const jwttoken = require("jsonwebtoken");
//ENV
env.config({path:'../Private.env'});

//SERVICES DEFINITION
const {
    UserLoginService,
} = require("../services/UserTable");
const { fetchTasksByTimeDuration } = require("../services/FetchUserTabs");

//SIGNUP HANDLER
const UserSignup = async (req, res) => {
    const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      Message: "Please fill out the form correctly. All fields are required.",
    });
  } 
  //Bcrypt
  const hashed_password = await bcrypt.hash(password, 10);
  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists.");
    } else {
      const newUser = new Users({ name, email, password:hashed_password });
      await newUser.save();
       res.status(200).json({
        Message: "User created successfully"
      });
    }
  } catch (error) {
    res.status(400).json({
      Message: `Error! Cannot Login. Error Message: ${error.message}`, //This Message is very Important because the typo can cause headache in toastify
    });
  }
};

//LOGIN HANDLER
const UserLogin = async (req, res) => {
    const PRIVATE_TOKEN_KEY = process.env.PRIVATE_TOKEN_KEY;
    const {email , password} = req.body;
    if ( !email || !password ) {
        return res.status(400).json({ 
            Message: 'Please fill out the form correctly. All fields are required.',
        });
    }
try{
    const validateUser = await UserLoginService(email,password);
    if(validateUser){
      let userData = {
        userId: validateUser._id, 
        name: validateUser.name, 
        email: validateUser.email, // Return only data object that is needed
    };
    const jwttokengen = jwttoken.sign(validateUser.toJSON() , PRIVATE_TOKEN_KEY , {expiresIn:20000})
    res.status(200).json({
        Message:'Login Successfull',
        jwttokengen,
        userData
    });
}else {
    res.status(400).json({
        Message: 'Conditions not met. User not created.'
    })}
}catch(error){
    res.status(400).json({
        Message:`Error! Cannot Login. Error Message: ${error.message}` //This Message is very Important because the typo can cause headache in toastify
    })
}
};

//Password Updater Handler
const UserPassChange = async (req, res) => {
  try {
    const { name, oldpassword, newpassword } = req.body;
    const user = req.user; //Check the decoded ID from the middleware.
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }
    if (oldpassword || newpassword) {
      //Checking if one of the is present in req
      const isMatch = await bcrypt.compare(oldpassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ Error: "Invalid old password" });
      }
      user.password = await bcrypt.hash(newpassword, 10);
    }
    user.name = name; //Update the name though it not a greate way to update the name every time even if its not change but as its a simple application we can neglect this
    await user.save();
    res.status(200).json({ Message: "Data updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: "Internal server error" });
  }
};

//Task Fetch Handler
const TaskFetch = async (req, res) => {
  try {
    const user = req.user; // Check the decoded ID from the middleware.
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    // Extract the time_duration parameter from the query string of the request
    const time_duration = req.query.time_duration;

    // Call the service function to fetch tasks based on time_duration
    const tasks = await fetchTasksByTimeDuration(time_duration,req.user._id);

    // Group tasks by status
    const groupedTasks = tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {});

    res.status(200).json({ tasks: groupedTasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//CREATE NEW TASK
const TaskPost = async (req, res) => {
  try {
    const user = req.user; //Check the decoded ID from the middleware.
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }
    const userId = req.user._id; // Get the user ID from the authenticated user
    
    const { status,priority, title, checklist, dueDate } = req.body;
    console.log("PostNEWTask", req.body)

    // Create a new list instance with the user ID
    const newList = new List({
      userId,
      priority,
      status,
      title,
      checklist,
      dueDate
    });

    // Save the list to the database
    await newList.save();

    res.status(201).json({ Message: 'List saved successfully', List: newList });
    user.task.push(newList._id);
    // Save the updated user document
    await user.save();
  } catch (error) {
    console.error('Error saving list:', Error);
    res.status(500).json({ Error: error.message });
  }
};
module.exports = {UserSignup , UserLogin,TaskPost,TaskFetch ,UserPassChange};

