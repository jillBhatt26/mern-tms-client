import { useEffect, useState, useCallback } from 'react';
import useAppContext from '../../hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/system/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { createUser } from '../../services/user';
import {
    createTask,
    fetchTasksAll,
    fetchTasksAssignedToUser,
    fetchTasksCreatedByUser,
    deleteTask,
    updateTask
} from '../../services/task';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Dashboard = () => {
    // component states

    // create user
    const [role, setRole] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // create task
    const [taskPurpose, setTaskPurpose] = useState('Create');
    const [task_description, setTaskDescription] = useState('');
    const [assignTo, setAssignTo] = useState('');
    const [statusLog, setStatusLog] = useState('');

    // tasks
    const [fetchTasksAdmin, setFetchTasksAdmin] = useState([]);
    const [fetchTasksAssigned, setFetchTasksAssigned] = useState([]);
    const [fetchTasksCreated, setFetchTasksCreated] = useState([]);
    const [toUpdateTask, setToUpdateTask] = useState(null);

    // hooks
    const { userState } = useAppContext();
    const navigate = useNavigate();

    // callbacks
    const fetchTasksCB = useCallback(async () => {
        if (userState.user) {
            try {
                if (userState.user.role.trim().toUpperCase() === 'ADMIN') {
                    // fetch all tasks
                    const fetchTasksData = await fetchTasksAll();

                    if (!fetchTasksData.success) {
                        alert(fetchTasksData.message);
                    } else if (fetchTasksData.success) {
                        setFetchTasksAdmin(fetchTasksData.tasks);
                    }
                } else {
                    if (
                        userState.user.role.trim().toUpperCase() === 'TM USER'
                    ) {
                        const fetchTasksAssignedData =
                            await fetchTasksAssignedToUser();

                        if (!fetchTasksAssignedData.success) {
                            alert(fetchTasksAssignedData.message);
                        } else if (fetchTasksAssignedData.success) {
                            setFetchTasksAssigned(fetchTasksAssignedData.tasks);
                        }
                    }
                }

                const fetchTasksCreatedData = await fetchTasksCreatedByUser();

                if (!fetchTasksCreatedData.success) {
                    alert(fetchTasksCreatedData.message);
                } else if (fetchTasksCreatedData.success) {
                    setFetchTasksCreated(fetchTasksCreatedData.tasks);
                }
            } catch (error) {
                alert(error.message);
            }
        }
    }, [userState.user]);

    // component effects
    useEffect(() => {
        if (!userState.isAuth) {
            navigate('/login');
        }
    }, [userState, navigate]);

    useEffect(() => {
        fetchTasksCB();
    }, [fetchTasksCB]);

    // event handlers
    const handleClearValues = () => {
        setRole('');
        setName('');
        setEmail('');
        setPassword('');

        setTaskPurpose('Create');
        setTaskDescription('');
        setAssignTo('');
        setStatusLog('');
    };

    const handleCreateNewUser = async event => {
        event.preventDefault();

        if (!name || !name.length) {
            return alert('Name is required');
        }

        if (!email || !email.length) {
            return alert('Email is required');
        }

        if (!password || !password.length) {
            return alert('Password is required');
        }

        if (!role || !role.length) {
            return alert('Role is required');
        }

        try {
            const createUserData = await createUser(
                name,
                email,
                password,
                role
            );

            if (!createUserData.success) {
                alert(createUserData.message);
            } else if (createUserData.success) {
                handleClearValues();

                alert('New user created!');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleTaskSubmit = async event => {
        event.preventDefault();

        if (taskPurpose.toLowerCase() === 'create') {
            if (!task_description || !task_description.length) {
                return alert('Task description is required');
            }

            if (!assignTo || !assignTo.length) {
                return alert('Name of person to assign the task is required');
            }

            try {
                const createNewTaskData = await createTask(
                    task_description,
                    assignTo
                );

                if (!createNewTaskData.success) {
                    alert(createNewTaskData.message);
                } else if (createNewTaskData.success) {
                    handleClearValues();

                    const newTask = {
                        ...createNewTaskData.task,
                        assignedToName: assignTo,
                        createdByName: userState.user.name
                    };

                    setFetchTasksCreated([...fetchTasksCreated, newTask]);

                    if (userState.user.role.trim().toUpperCase() === 'ADMIN') {
                        setFetchTasksAdmin([...fetchTasksAdmin, newTask]);
                    }

                    alert('New task created!');
                }
            } catch (error) {
                alert(error.message);
            }
        }

        if (taskPurpose.toLowerCase() === 'update') {
            if (!task_description || !task_description.length) {
                return alert('Task description is required');
            }

            if (!statusLog || !statusLog.length) {
                return alert('Status log is required to update');
            }

            if (!toUpdateTask) {
                return alert('No task chosen to update!');
            }

            try {
                const updateTaskData = await updateTask(
                    task_description,
                    assignTo,
                    statusLog,
                    toUpdateTask._id
                );

                if (!updateTaskData.success) {
                    alert(updateTaskData.message);
                } else if (updateTaskData.success) {
                    const updatedTask = updateTaskData.task;

                    if (userState.user.role === 'ADMIN') {
                        const fetchTasksAdminIndex = fetchTasksAdmin.findIndex(
                            task => task._id === toUpdateTask._id
                        );

                        if (fetchTasksAdminIndex !== -1) {
                            fetchTasksAdmin[fetchTasksAdminIndex] = updatedTask;

                            setFetchTasksAdmin(fetchTasksAdmin);
                        }
                    }

                    if (userState.user.id === toUpdateTask.createdBy) {
                        const fetchTasksCreatedIndex =
                            fetchTasksCreated.findIndex(
                                task => task._id === toUpdateTask._id
                            );

                        if (fetchTasksCreatedIndex !== -1) {
                            fetchTasksCreated[fetchTasksCreatedIndex] =
                                updatedTask;

                            setFetchTasksCreated(fetchTasksCreated);
                        }
                    }

                    if (fetchTasksAssigned.length) {
                        const fetchTasksAssignedIndex =
                            fetchTasksAssigned.findIndex(
                                task => task._id === toUpdateTask._id
                            );

                        if (fetchTasksAssignedIndex !== -1) {
                            fetchTasksAssigned[fetchTasksAssignedIndex] =
                                updatedTask;

                            setFetchTasksCreated(fetchTasksCreated);
                        }
                    }

                    handleClearValues();

                    alert('Task updated!');
                }
            } catch (error) {
                alert(error.message);
            }
        }
    };

    const handleDeleteTask = async task => {
        const { _id, createdBy } = task;

        if (
            !createdBy === userState.user.id ||
            !userState.user.role.trim().toUpperCase() === 'ADMIN'
        ) {
            console.log('createdByName: ', task.createdByName);
            console.log('role: ', useState.user.role);
            return alert('Only admins or creators can delete tasks!');
        }

        try {
            const deleteTaskData = await deleteTask(_id);

            if (!deleteTaskData.success) {
                console.log('alerting message...');
                return alert(deleteTaskData.message);
            }

            if (deleteTaskData.success) {
                const newFetchAdminTasks = fetchTasksAdmin.filter(
                    task => task._id !== _id
                );

                const newCreatedTasks = fetchTasksCreated.filter(
                    task => task._id !== _id
                );

                setFetchTasksAdmin(newFetchAdminTasks);
                setFetchTasksCreated(newCreatedTasks);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDisplayUpdateTask = task => {
        setToUpdateTask(task);
        setTaskDescription(task.task_description);
        setAssignTo(task.assignedToName);
        setStatusLog(
            task.statusLog || task.statusLogs[task.statusLogs.length - 1].status
        );
        setTaskPurpose('Update');
    };

    return (
        <div>
            {userState.user &&
                userState.user.role.trim().toUpperCase() === 'ADMIN' && (
                    <Paper
                        elevation={10}
                        style={{
                            padding: 20,
                            margin: '40px auto',
                            maxWidth: 500
                        }}
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            component="h4"
                            sx={{ textAlign: 'center' }}
                        >
                            Create New User
                        </Typography>

                        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                            <form
                                onSubmit={handleCreateNewUser}
                                autoComplete="off"
                                noValidate
                            >
                                <TextField
                                    id="name"
                                    label="Name"
                                    type="text"
                                    variant="outlined"
                                    value={name}
                                    sx={{ width: '100%', margin: '10px 0' }}
                                    onChange={e => setName(e.target.value)}
                                />

                                <TextField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={email}
                                    sx={{ width: '100%', margin: '10px 0' }}
                                    onChange={e => setEmail(e.target.value)}
                                />

                                <TextField
                                    id="password"
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    value={password}
                                    sx={{ width: '100%', margin: '10px 0' }}
                                    onChange={e => setPassword(e.target.value)}
                                />

                                <FormControl fullWidth>
                                    <InputLabel id="role">Role</InputLabel>
                                    <Select
                                        labelId="role"
                                        id="role"
                                        value={role}
                                        label="Role"
                                        onChange={e => setRole(e.target.value)}
                                        sx={{
                                            display: 'block'
                                        }}
                                    >
                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        <MenuItem value="TM USER">
                                            TM USER
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{
                                        backgroundColor: 'green',
                                        margin: '15px 0 0',
                                        ':active': { background: 'green' },
                                        ':hover': { background: 'green' }
                                    }}
                                >
                                    Create User
                                </Button>
                            </form>
                        </Box>
                    </Paper>
                )}

            {userState.user && (
                <Paper
                    elevation={10}
                    style={{
                        padding: 20,
                        margin: '40px auto',
                        maxWidth: 500
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        component="h4"
                        sx={{ textAlign: 'center' }}
                    >
                        {taskPurpose === 'Create' ? 'Create New' : 'Update'}{' '}
                        Task
                    </Typography>

                    <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                        <form
                            onSubmit={handleTaskSubmit}
                            autoComplete="off"
                            noValidate
                        >
                            <TextField
                                id="description"
                                label="Task Description"
                                type="text"
                                variant="outlined"
                                value={task_description}
                                sx={{ width: '100%', margin: '10px 0' }}
                                onChange={e =>
                                    setTaskDescription(e.target.value)
                                }
                            />

                            <TextField
                                id="assignTo"
                                label="Assign To"
                                type="text"
                                variant="outlined"
                                value={assignTo}
                                sx={{ width: '100%', margin: '10px 0' }}
                                onChange={e => setAssignTo(e.target.value)}
                            />

                            {taskPurpose === 'Update' && (
                                <TextField
                                    id="statusLog"
                                    label="Status Log"
                                    type="text"
                                    variant="outlined"
                                    value={statusLog}
                                    sx={{ width: '100%', margin: '10px 0' }}
                                    onChange={e => setStatusLog(e.target.value)}
                                />
                            )}

                            <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                    backgroundColor: 'green',
                                    margin: '15px 0 0',
                                    ':active': { background: 'green' },
                                    ':hover': { background: 'green' }
                                }}
                            >
                                {taskPurpose} Task
                            </Button>

                            {taskPurpose.toLowerCase() === 'update' && (
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'red',
                                        margin: '15px 5px 0',
                                        ':active': {
                                            background: 'red'
                                        },
                                        ':hover': {
                                            background: 'red'
                                        }
                                    }}
                                    onClick={handleClearValues}
                                >
                                    Cancel
                                </Button>
                            )}
                        </form>
                    </Box>
                </Paper>
            )}

            {fetchTasksAdmin.length > 0 && (
                <TableContainer
                    component={Paper}
                    elevation={10}
                    sx={{ margin: '20px auto 50px' }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        component="h4"
                        sx={{ textAlign: 'center' }}
                    >
                        Admin Tasks
                    </Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    Description
                                </TableCell>
                                <TableCell align="center">Created By</TableCell>
                                <TableCell align="center">
                                    Assigned To
                                </TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fetchTasksAdmin.map(row => (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0
                                        }
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="center"
                                    >
                                        {row.task_description}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.createdByName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.assignedToName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.statusLog ||
                                            row.statusLogs[
                                                row.statusLogs.length - 1
                                            ].status}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'blue',
                                                margin: '0 5px',
                                                ':active': {
                                                    background: 'blue'
                                                },
                                                ':hover': {
                                                    background: 'blue'
                                                }
                                            }}
                                            onClick={() =>
                                                handleDisplayUpdateTask(row)
                                            }
                                        >
                                            Update
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'red',
                                                margin: '0 5px',
                                                ':active': {
                                                    background: 'red'
                                                },
                                                ':hover': {
                                                    background: 'red'
                                                }
                                            }}
                                            onClick={() =>
                                                handleDeleteTask(row)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {fetchTasksCreated.length > 0 && (
                <TableContainer
                    component={Paper}
                    elevation={10}
                    sx={{ margin: '20px auto 50px' }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        component="h4"
                        sx={{ textAlign: 'center' }}
                    >
                        Tasks created by me
                    </Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    Description
                                </TableCell>
                                <TableCell align="center">
                                    Assigned To
                                </TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fetchTasksCreated.map(row => (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0
                                        }
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="center"
                                    >
                                        {row.task_description}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.assignedToName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.statusLog ||
                                            row.statusLogs[
                                                row.statusLogs.length - 1
                                            ].status}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'blue',
                                                margin: '0 5px',
                                                ':active': {
                                                    background: 'blue'
                                                },
                                                ':hover': {
                                                    background: 'blue'
                                                }
                                            }}
                                            onClick={() =>
                                                handleDisplayUpdateTask(row)
                                            }
                                        >
                                            Update
                                        </Button>

                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'red',
                                                margin: '0 5px',
                                                ':active': {
                                                    background: 'red'
                                                },
                                                ':hover': {
                                                    background: 'red'
                                                }
                                            }}
                                            onClick={() =>
                                                handleDeleteTask(row)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {fetchTasksAssigned.length > 0 && (
                <TableContainer
                    component={Paper}
                    elevation={10}
                    sx={{ margin: '20px auto 50px' }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        component="h4"
                        sx={{ textAlign: 'center' }}
                    >
                        Tasks assigned to me
                    </Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    Description
                                </TableCell>
                                <TableCell align="center">Created By</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fetchTasksAssigned.map(row => (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0
                                        }
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="center"
                                    >
                                        {row.task_description}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.createdByName}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.statusLog ||
                                            row.statusLogs[
                                                row.statusLogs.length - 1
                                            ].status}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'blue',
                                                margin: '0 5px',
                                                ':active': {
                                                    background: 'blue'
                                                },
                                                ':hover': {
                                                    background: 'blue'
                                                }
                                            }}
                                            onClick={() =>
                                                handleDisplayUpdateTask(row)
                                            }
                                        >
                                            Update
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default Dashboard;
