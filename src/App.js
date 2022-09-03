import { useEffect, useCallback } from 'react';
import Nav from './components/common/Nav';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/user/Login';
import Dashboard from './components/user/Dashboard';
import { fetchUser } from './services/user';
import useAppContext from './hooks/useAppContext';

const App = () => {
    // hooks
    const navigate = useNavigate();
    const { dispatchUser } = useAppContext();

    const fetchUserCB = useCallback(async () => {
        try {
            const fetchUserData = await fetchUser();

            if (!fetchUserData.success) {
                navigate('/login');
            } else {
                dispatchUser({
                    type: 'FETCH',
                    payload: {
                        user: fetchUserData.user
                    }
                });
            }
        } catch (error) {
            console.log('fetch user error: ', error);
        }
    }, [navigate, dispatchUser]);

    useEffect(() => {
        fetchUserCB();
    }, [fetchUserCB]);

    return (
        <>
            <CssBaseline />
            <Nav />
            <Container>
                {/* <h1>Hello World!</h1> */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </Container>
        </>
    );
};

export default App;
