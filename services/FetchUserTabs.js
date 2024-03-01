// services/TaskService.js

const List = require('../models/List');

const fetchTasksByTimeDuration = async (time_duration,userId) => {
    console.log("SPAN>>>",time_duration)
  let startDate, endDate;

  // Determine the start and end dates based on the time_duration parameter
  if (time_duration === 'This Week') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to the first day of the current week
    endDate = new Date();
  } else if (time_duration === 'This Month') {
    startDate = new Date();
    startDate.setDate(1); // Set to the first day of the current month
    endDate = new Date();
  } else if (time_duration === 'Today') {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // Set to 24 hours ago
    endDate = new Date();
  } else {
    // Default to today
    startDate = new Date();
    endDate = new Date();
  }

  // Fetch tasks from the database based on the start and end dates
  
  const tasks = await List.find({
    userId,
    createdAt: { $gte: startDate, $lt: endDate }
  });
  console.log("TASKSA RECEIVED::::>>>",tasks);

  return tasks;
};

module.exports = {
  fetchTasksByTimeDuration,
};
