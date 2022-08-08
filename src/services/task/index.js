import axios from 'axios';
import BE_URL from '../../config/env';

const tasksURL = `${BE_URL}/tasks`;

const fetchTasksAll = async () => {
    try {
        const fetchTasksAllRes = await axios({
            url: tasksURL,
            withCredentials: true
        });

        return fetchTasksAllRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const createTask = async (task_description, assignedTo) => {
    try {
        const createTaskRes = await axios({
            url: tasksURL,
            method: 'POST',
            data: {
                task_description,
                assignedTo
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return createTaskRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const fetchTasksCreatedByUser = async () => {
    try {
        const fetchTasksRes = await axios({
            url: `${tasksURL}/created`,
            withCredentials: true
        });

        return fetchTasksRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const fetchTasksAssignedToUser = async () => {
    try {
        const fetchTasksRes = await axios({
            url: `${tasksURL}/assigned`,
            withCredentials: true
        });

        return fetchTasksRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const assignTask = async userID => {
    try {
        const assignTaskRes = await axios({
            url: `${tasksURL}/assign/user/${userID}`,
            withCredentials: true
        });

        return assignTaskRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const updateTask = async (
    task_description,
    assignTo,
    toUpdateStatusLog,
    taskID
) => {
    try {
        const updateTaskRes = await axios({
            url: `${tasksURL}/${taskID}`,
            method: 'PUT',
            data: {
                task_description,
                assignTo,
                toUpdateStatusLog
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return updateTaskRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const deleteTask = async taskID => {
    try {
        const deleteTaskRes = await axios({
            url: `${tasksURL}/${taskID}`,
            method: 'DELETE',
            withCredentials: true
        });

        return deleteTaskRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

const updateTaskStatusLogs = async (taskID, updated_status) => {
    try {
        const updateLogsRes = await axios({
            url: `${tasksURL}/logs/${taskID}`,
            method: 'PUT',
            data: {
                updated_status
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return updateLogsRes.data;
    } catch (error) {
        return {
            success: false,
            message: error.response.data.error || error.message
        };
    }
};

export {
    fetchTasksAll,
    createTask,
    fetchTasksCreatedByUser,
    fetchTasksAssignedToUser,
    assignTask,
    updateTask,
    deleteTask,
    updateTaskStatusLogs
};
