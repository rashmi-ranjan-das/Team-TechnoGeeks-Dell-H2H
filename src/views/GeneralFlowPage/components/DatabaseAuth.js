import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';

const DatabaseAuth = props => {
    const classes = useStyles();
    const [state, setState] = useState({data:{}, error: {}});
    const activeStep = props.activeStep;
    const setActiveStep = props.setActiveStep;

    const handleInputChange = e => {
        var k = e.target.name;
        var v = e.target.value;
        setState(new_state => ({
            ...new_state,
            data :{
                ...new_state.data,
                [k]: v
            }
        }))
    }

    function handleDbAuthentication(){
        console.log("@@@", state)
        fetch('http://127.0.0.1:8000/api/db/authentication/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state.data)
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            if(data['Authenticated']){
                sessionStorage.setItem('db_url', data['db_url'])
                sessionStorage.setItem('username', data['username'])
                sessionStorage.setItem('password', data['password'])
                setActiveStep(activeStep + 1)
            }
        })
        .catch(err => console.log(err))
    }

    return(
        <>
        <div className={classes.root}>
            <div class="card pd-20">
                <Grid container spacing="2">
                    <Grid item lg={12}>
                        <div className="d-flex align-center space-between">
                            <span>
                                <label className={classes.InputLabel}>
                                    Database Host Url
                                    <span style={{color : 'red'}}>*</span>
                                </label>
                            </span>
                        </div>
                        <input type="text" name="db_url" placeholder="Database Host Url" onChange={handleInputChange} value={state.data.db_url ? state.data.db_url : null} required />
                    </Grid>
                    <Grid item lg={12} className="mt-10">
                        <div className="d-flex align-center space-between">
                            <span>
                                <label className={classes.InputLabel}>
                                    Username
                                    <span style={{color : 'red'}}>*</span>
                                </label>
                            </span>
                        </div>
                        <input type="text" name="db_username" placeholder="Database Username" onChange={handleInputChange} value={state.data.db_username ? state.data.db_username : null} required />
                    </Grid>
                    <Grid item lg={12} className="mt-10">
                        <div className="d-flex align-center space-between">
                            <span>
                                <label className={classes.InputLabel}>
                                    Password
                                    <span style={{color : 'red'}}>*</span>
                                </label>
                            </span>
                        </div>
                        <input type="password" name="db_password" placeholder="Database Password" onChange={handleInputChange} value={state.data.db_password ? state.data.db_password : null} required />
                    </Grid>
                </Grid>
                <div className='d-flex space-between'>
                    <button className='btn btn-outline-grey' style={{visibility: 'hidden'}}>Reset</button>
                    <button className='btn btn-submit mt-10' onClick={handleDbAuthentication}>Authenticate</button>
                </div>
            </div>
        </div>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '32px 30px 20px 30px',
    },
    InputLabel:{
        fontSize: '12px',
        fontWeight:400,
        color:'#828282'
    },
}))

export default DatabaseAuth;