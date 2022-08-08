import { useEffect, useState } from 'react';
import useAppContext from '../../hooks/useAppContext';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { loginUser } from '../../services/user';

const Login = () => {
    // component states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // hooks
    const { userState, dispatchUser } = useAppContext();

    const navigate = useNavigate();

    // component effects
    useEffect(() => {
        if (userState.isAuth) {
            navigate('/');
        }
    }, [userState, navigate]);

    // event handlers
    const handleLogin = async event => {
        event.preventDefault();

        if (!email || !email.length) {
            return alert('Email is required!');
        }

        if (!password || !password.length) {
            return alert('Password is required!');
        }

        try {
            const loginUserData = await loginUser(email, password);

            if (!loginUserData.success) {
                alert(loginUserData.message);
            } else if (loginUserData.success) {
                dispatchUser({
                    type: 'LOGIN',
                    payload: {
                        user: loginUserData.user
                    }
                });

                return navigate('/');
            }
        } catch (error) {
            alert('login user error: ', error.message);
        }
    };

    return (
        <div>
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
                    Login
                </Typography>

                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                    <form onSubmit={handleLogin} autoComplete="off" noValidate>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            variant="outlined"
                            onChange={e => setEmail(e.target.value)}
                            sx={{ width: '100%', margin: '10px 0' }}
                        />

                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                            sx={{ width: '100%', margin: '10px 0' }}
                        />

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
                            Login
                        </Button>
                    </form>
                </Box>
            </Paper>
        </div>
    );
};

export default Login;
