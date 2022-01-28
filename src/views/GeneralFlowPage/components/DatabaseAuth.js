import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';
import { Loading } from "../../../components/Loading";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const DatabaseAuth = props => {
    const classes = useStyles();
    const [state, setState] = useState({data:{}, error: false});
    const [loading, setLoading] = useState(false);
    const activeStep = props.activeStep;
    const setActiveStep = props.setActiveStep;
    var db_authenticated = sessionStorage.getItem('db_url') ? true : false;

    console.log("@@@@@@", db_authenticated)

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
        setLoading(true);
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
                setLoading(false)
                setActiveStep(activeStep + 1)
            } else {
                setState(new_state => ({
                    ...new_state,
                    error: true
                }))
                setLoading(false)
            }
        })
        .catch(err => console.log(err))
    }

    return(
        <>
        {
            loading ? <Loading /> : null
        }
        <div className={classes.root}>
            <div class="card pd-20">
                {
                    state.error ? 
                    <>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Database Authentication Failed. Please check the credentials again !!!
                    </Alert>
                    </>
                    :
                    null
                }
                {
                    db_authenticated ?
                    <>
                     <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        Connection to database already exists. Please proceed further !!!
                    </Alert>
                    </>
                    :
                    null
                }
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
                        <input type="text" name="db_url" placeholder="Database Host Url" onChange={handleInputChange} value={state.data.db_url ? state.data.db_url : null} required disabled={db_authenticated ? true: false} />
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
                        <input type="text" name="db_username" placeholder="Database Username" onChange={handleInputChange} value={state.data.db_username ? state.data.db_username : null} required disabled={db_authenticated ? true: false} />
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
                        <input type="password" name="db_password" placeholder="Database Password" onChange={handleInputChange} value={state.data.db_password ? state.data.db_password : null} required disabled={db_authenticated ? true: false} />
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