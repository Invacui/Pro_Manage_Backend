const List = require('../models/List');

const fetchTaskAnalytics = async (userId) => {
  try {
    const tasks = await List.find({ userId });

    let backlogCount = 0;
    let toDoCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;
    let dueDateTaskCount = 0;
    let highPriorityCount = 0;
    let mediumPriorityCount = 0;
    let lowPriorityCount = 0;

    tasks.forEach(task => {
      switch (task.status) {
        case "Backlog":
          backlogCount++;
          break;
        case "To Do":
          toDoCount++;
          break;
        case "In Progress":
          inProgressCount++;
          break;
        case "Done":
          doneCount++;
          break;
      }

      if (task.dueDate) {
        dueDateTaskCount++;
      }

      switch (task.priority) {
        case "High Priority":
          highPriorityCount++;
          break;
        case "Medium Priority":
          mediumPriorityCount++;
          break;
        case "Low Priority":
          lowPriorityCount++;
          break;
      }
    });

    return {
      "Backlog": backlogCount,
      "To Do": toDoCount,
      "In Progress": inProgressCount,
      "Done": doneCount,
      "Due Date Task": dueDateTaskCount,
      "High Priority": highPriorityCount,
      "Medium Priority": mediumPriorityCount,
      "Low Priority": lowPriorityCount
    };
  } catch (error) {
    throw new Error(`Error fetching task analytics: ${error.message}`);
  }
};

module.exports = {
  fetchTaskAnalytics
};
