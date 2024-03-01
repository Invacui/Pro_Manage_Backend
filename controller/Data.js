const List = require("../models/List");
const { fetchTaskAnalytics } = require("../services/TaskAnalyticsService");



const FetchUserData = (req,res) =>{
    const UserInfo = req.user.toObject();
    delete UserInfo.password; // Exclude the password field
    res.status(200).json({
        Message:"Data Fetched",
        User:UserInfo
    })
}

const UpdateStatusTask = async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;

    try {
        // Find the task by ID
        const task = await List.findById(taskId);
        if (!task) {
            return res.status(404).json({ Error: 'Task not found' });
        }
        // Update task status
        task.status = status;
        // Save the updated task
        const updatedTask = await task.save();
        res.json({ Message: 'Task status updated successfully', data: updatedTask });
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: error.message });
    }
}
const UpdateCheckList = async (req,res) =>{
  const taskId = req.params.taskId;
  const itemId = req.params.itemId;
  const { checked } = req.body;
  
  try {
    // Find the task by ID
    const task = await List.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const checklistItem = task.checklist.find(item => item._id.toString() === itemId);
    if (!checklistItem) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }
    checklistItem.checked = checked;
    // Save the updated task
    await task.save();
    res.json({ Message: 'Checklist item updated successfully', task });
  } catch (error) {

    res.status(500).json({ Error: error.message });
  }
}

const DeleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  if (!req.user) {
    return res.status(401).json({ Error: 'User not authenticated' });
  }
  const user = req.user;
  try {
    // Find the task by ID
    const task = await List.findById(taskId);
    if (!task) {
      return res.status(404).json({ Error: 'Task not found' });
    }
    console.log(task);
    console.log(String(task.userId));
    console.log(String(user._id));
    if (String(task.userId) === String(user._id)) {
      await List.findByIdAndDelete(taskId);
      user.task.pull(taskId); // Remove task ID from user's task array
      await user.save(); // Save the updated user
      res.json({ Message: 'Task deleted successfully' });
    } else {
      return res.status(403).json({ Error: 'You are not authorized to delete this task' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
};
//UPDATE FULL TASK
const UpdateFullTask = async (req, res) => {
  const taskId = req.params.id;
  const newTask = req.body; // New data for the task
  
  if (!req.user) {
    return res.status(401).json({ Error: 'User not authenticated' });
  }
   
  try {
    // Find the task by ID
    const task = await List.findById(taskId);
    if (!task) {
      return res.status(404).json({ Error: 'Task not found' });
    }

    // Update task fields with new data
    Object.keys(newTask).forEach(key => {
      task[key] = newTask[key];
    });

    // Save the updated task
    await task.save();

    res.json({ Message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  } 
};


const getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request

    const analyticsData = await fetchTaskAnalytics(userId);

    res.status(200).json({ Analytics: analyticsData });
  } catch (error) {
    console.error('Error fetching task analytics:', error);
    res.status(500).json({ Error: error.message });
  }
};

const SharedTask = async(req,res)=>{
  try {
    const taskId = req.params.taskId;
    const task = await List.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ Error: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    console.error("Error fetching shared task:", error);
    res.status(500).json({ Error: error.message });
  }
}

module.exports = {FetchUserData,UpdateStatusTask,UpdateFullTask,UpdateCheckList,DeleteTask,getTaskAnalytics,SharedTask}