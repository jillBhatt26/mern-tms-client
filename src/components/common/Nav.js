import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { logoutUser } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import useAppContext from '../../hooks/useAppContext';

const authMenuItems = ['Logout'];

const Nav = () => {
    // component states
    const [anchorElNav, setAnchorElNav] = useState(null);

    // hooks
    const { userState, dispatchUser } = useAppContext();
    const navigate = useNavigate();

    // event handlers
    const handleOpenNavMenu = event => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = menuItem => {
        if (menuItem === 'Logout') {
            handleLogout();
            setAnchorElNav(null);
        } else {
            setAnchorElNav(null);
        }
    };

    const handleLogout = async () => {
        const logoutUserData = await logoutUser();

        if (logoutUserData.success) {
            dispatchUser({
                type: 'LOGOUT'
            });

            navigate('/login');
        }
    };

    return (
        <AppBar position="static" sx={{ background: '#4b6584' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link component={RouterLink} to="/">
                        <Typography
                            variant="h4"
                            noWrap
                            component="h4"
                            sx={{
                                mr: 2,
                                flexGrow: 1,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'roboto',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: '#fff',
                                textDecoration: 'none',
                                ':visited': {
                                    textDecoration: 'none'
                                },
                                ':active': {
                                    textDecoration: 'none'
                                }
                            }}
                        >
                            TMS
                        </Typography>
                    </Link>

                    <Box
                        sx={{
                            flexGrow: 0,
                            display: { xs: 'flex', md: 'none' }
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        {userState.isAuth && (
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={() => handleCloseNavMenu(null)}
                                sx={{
                                    display: { xs: 'block', md: 'none' }
                                }}
                            >
                                {authMenuItems.map(menuItem => (
                                    <MenuItem
                                        key={menuItem}
                                        onClick={() =>
                                            handleCloseNavMenu(menuItem)
                                        }
                                    >
                                        <Typography textAlign="center">
                                            {menuItem}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        )}
                    </Box>

                    <Link component={RouterLink} to="/">
                        <Typography
                            variant="h5"
                            noWrap
                            component="h5"
                            sx={{
                                ml: 1,
                                textAlign: 'center',
                                display: { xs: 'flex', md: 'none' },
                                fontFamily: 'roboto',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: '#fff',
                                textDecoration: 'none'
                            }}
                        >
                            TMS
                        </Typography>
                    </Link>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' }
                        }}
                    >
                        {userState.isAuth &&
                            authMenuItems.map(menuItem => (
                                <Button
                                    key={menuItem}
                                    onClick={() => handleCloseNavMenu(menuItem)}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block'
                                    }}
                                >
                                    {menuItem}
                                </Button>
                            ))}
                    </Box>

                    {userState.isAuth && (
                        <Box
                            sx={{
                                flexGrow: 2,
                                justifyContent: 'end',
                                ml: 15,
                                display: { md: 'flex' }
                            }}
                        >
                            Welcome,{' '}
                            {userState.user.name
                                .split(' ')
                                .shift()
                                .toUpperCase()}
                            !
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Nav;
