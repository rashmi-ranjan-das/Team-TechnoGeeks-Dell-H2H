import { makeStyles } from '@mui/styles';
import React from "react";
import { AppBar, Toolbar, Badge, Hidden, IconButton, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import '../assets/style.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const TopNav = props => {
    const classes = useStyles();

    return(
        <>
            <AppBar
            className={classes.root}
            style={{ backgroundColor: '#ffffff' }}
            >
            <Toolbar className={classes.newHeight}>
                    <div>
                        <RouterLink to="/" style={{ display: 'flex', textDecoration: 'None' }}>
                        <img
                            alt="Logo"
                            className={classes.logo}
                            src="/images/logos/DellLogo.png"
                            width="80px"
                        />
                        <p className={classes.breadcrumbLink}>Hack 2 Hire (H2H)</p>
                    </RouterLink>
                    </div>
            </Toolbar>
            </AppBar>
        </>
    )
}


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '7px 0px',
    },
    newHeight: {
        minHeight: '60px!important',
        display: 'flex',
        justifyContent: 'space-between'
    },
    logo: {
        height: '80%!important',
    },
    breadcrumbLink: {
        lineHeight: 2.5,
        fontWeight: 'bolder',
        fontFamily: 'Montserrat, sans-serif',
        fontSize: 20,
        color: "#228DC1"
    },
    avatarColor: {
        color: '#fff',
    
      },
      avatarRoot: {
        width: "30px",
        height: "30px",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        fontWeight: 600,
        backgroundColor: '#0086ff',
        fontSize: "1.15rem",
        alignItems: "center",
        flexhSrink: "0",
        fontFamily: "Heebo",
        lineHeight: "1",
        userSelect: "none",
        borderRadius: "4px",
        justifyContent: "center",
      },
      userDetails: {
        padding: '15px',
        textAlign: 'center',
        fontFamily: "Inter",
        '& .username': {
          fontSize: '16px',
          lineHeight: '22px',
          color: '#000',
          marginBottom: '10px',
          fontWeight: '300'
        },
        '& .other-details': {
          fontSize: '12px',
          width: '250px'
        },
        '& .text-lite-gray': {
          color: '#9d9d9d'
        }
      },
      heading: {
        backgroundColor: '#284060',
        fontFamily: "Inter",
        color: '#fff',
        fontSize: '12px',
        lineHeight: '1.4',
        padding: '10px'
      }
}))

export default TopNav;

const UserMenu = props => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const user_data = props.authenticated_user;
    console.log()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };

    return(
        <div className={classes.root}>
            <IconButton
            color="inherit"
            className={classes.signOutButton + " " + "dropdown-container"}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            >
            <div className={classes.avatarRoot} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <div className={classes.avatarColor}>
                {user_data.name.toUpperCase()[0]}
                </div>
            </div>
            </IconButton>
            <Menu
                id="simple-menu"
                className="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <p className={classes.heading}>Account Infromation</p>
                <div className={classes.userDetails}>
                <p className="username">
                    {user_data.name}
                </p>
                <p className="other-details">
                    <span>Email: &nbsp;</span><div className="text-lite-gray">{user_data.email}</div>
                </p>
                <a href="/initiateLogOut" style={{ margin: '20px auto 10px' }} class="logout-btn">
                    <ExitToAppIcon style={{ marginRight: '3px' }} /> Logout
                </a>
                </div>
            </Menu>
        </div>
    )
}