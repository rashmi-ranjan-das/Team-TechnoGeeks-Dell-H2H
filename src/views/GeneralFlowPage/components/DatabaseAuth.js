import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';

const DatabaseAuth = props => {
    const classes = useStyles();
    const [state, setState] = useState({data:{}, error: {}});

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
                    <button className='btn btn-submit mt-10'>Authenticate</button>
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