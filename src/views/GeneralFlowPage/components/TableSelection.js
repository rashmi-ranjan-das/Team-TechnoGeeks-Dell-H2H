import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { JsonToTable } from "react-json-to-table";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Loading } from "../../../components/Loading";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const TableSelection = props => {
    const classes = useStyles();
    const [state, setState] = useState({data:{}, error: {}});
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const activeStep = props.activeStep;
    const setActiveStep = props.setActiveStep;

    useEffect(() => {
        setLoading(true);
        fetch('http://127.0.0.1:8000/api/db/details/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                db_url: sessionStorage.getItem('db_url'),
                db_username: sessionStorage.getItem('username'),
                db_password: sessionStorage.getItem('password')
            })
        }).then(response => response.json())
        .then(data => {
            console.log(data)
            setState(new_state => ({
                ...new_state,
                db_details: data,
                db_names: Object.keys(data),
                table_names_of_selected_db: getTableNames(data),
                table_data: getTableData(data)
            }))
            setLoading(false)
        })
        .catch(err => console.log(err))
    }, [])

    function getTableNames(data){
        var table_names = {};
        Object.keys(data).map(key => {
            table_names[key] = Object.keys(data[key])
        })
        return table_names
    }

    function getTableData(data){
        var table_data = {};
        Object.keys(data).map(key => {
            console.log("####", key)
            Object.keys(data[key]).map(table => {
                table_data[table] = data[key][table]
            })
        })
        return table_data
    }
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

    function handleTableMigration(){
        setLoading(true);
        fetch('http://127.0.0.1:8000/api/db/model/prediction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                db_url: sessionStorage.getItem('db_url'),
                db_username: sessionStorage.getItem('username'),
                db_password: sessionStorage.getItem('password'),
                database: state.data.database,
                table: state.data.table
            })
        }).then(response => response.json())
        .then(data => {
            console.log("PPPP", data)
            sessionStorage.clear();
            setLoading(false)
            setActiveStep(activeStep + 1)
        })
        .catch(err => console.log(err))
    }

    console.log(state)

    return(
        <>
        {
            loading ? <Loading /> : null
        }
        <div className={classes.root}>
            <div class="card pd-20">
                <Grid container spacing="2">
                    <Grid item lg={12}>
                        <div className="d-flex align-center space-between">
                            <span>
                                <label className={classes.InputLabel}>
                                    Select Database
                                    <span style={{color : 'red'}}>*</span>
                                </label>
                            </span>
                        </div>
                        <select className="select" name="database" value={state.data.database ? state.data.database : ''} id="database" placeholder='Select Database' onChange={handleInputChange}>
                            <option value="">Please Select</option>
                            {
                                state.db_names && state.db_names.map(db_name => {
                                    return (<option value={db_name}>{db_name}</option>)
                                })
                            }
                        </select>
                        {/* <input type="text" name="db_url" placeholder="Database Host Url" onChange={handleInputChange} value={state.data.db_url ? state.data.db_url : null} required /> */}
                    </Grid>
                    <Grid item lg={11} className="mt-10">
                        <div className="d-flex align-center space-between">
                            <span>
                                <label className={classes.InputLabel}>
                                    Select Table
                                    <span style={{color : 'red'}}>*</span>
                                </label>
                            </span>
                        </div>
                        <select className='select' name="table" id="table" value={state.data.table ? state.data.table : ''} placeholder='Select Table' onChange={handleInputChange} disabled={state.data.database ? false : true}>
                            <option value="">Please Select</option>
                            {
                                state.table_names_of_selected_db && state.data.database && state.table_names_of_selected_db[state.data.database].map(table_name => {
                                    return (<option value={table_name}>{table_name}</option>)
                                })
                            }
                        </select>
                        {/* <input type="text" name="db_username" placeholder="Database Username" onChange={handleInputChange} value={state.data.db_username ? state.data.db_username : null} required /> */}
                    </Grid>
                    <Grid item lg={1} style={{marginTop: '45px', textAlign:'center'}}>
                        <span style={state.data.database && state.data.table && state.data.table !== '' && state.data.database !== '' ? {color : 'blue', fontSize: '11px', cursor: 'pointer'} : {color : 'blue', fontSize: '11px', cursor: 'not-allowed'}} onClick={state.data.table && state.data.table !== '' ? handleOpen : {}}>View Table</span>
                    </Grid>
                </Grid>
                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <JsonToTable json={state.data.table ? {[state.data.table]: state.table_data[state.data.table]} : {}} />
                        </Typography>
                        </Box>
                    </Modal>
                </div>
                <div className='d-flex space-between'>
                    <button className='btn btn-outline-grey' style={{visibility: 'hidden'}}>Reset</button>
                    <button className='btn btn-submit mt-10' onClick={handleTableMigration}>Proceed</button>
                </div>
            </div>
        </div>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '32px 30px 20px 30px',
        '.json-to-table': {
            table: {
                fontSize: '10px'
            }
        }
    },
    InputLabel:{
        fontSize: '12px',
        fontWeight:400,
        color:'#828282'
    },
}))

export default TableSelection;