const express = require("express");
const data = express.Router();
const IsLoggedIn = require("../middleware/IsLoggedIn");

const {
    FetchUserData,
    UpdateStatusTask,
    UpdateFullTask,
    UpdateCheckList,
    DeleteTask,
    getTaskAnalytics,
} = require("../controller/Data.js")

data.get('/fetch_data',IsLoggedIn, FetchUserData);
data.get('/get_task_analytics',IsLoggedIn, getTaskAnalytics);
data.put('/task/status/:id',IsLoggedIn, UpdateStatusTask);
data.put('/update_task/:id',IsLoggedIn, UpdateFullTask);
data.put('/tasks/:taskId/checklist/:itemId',IsLoggedIn, UpdateCheckList);
data.delete('/task/:taskId/delete',IsLoggedIn, DeleteTask)

module.exports = data;