import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { JsonToTable } from "react-json-to-table";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Loading } from "../../../components/Loading";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

const FinalConfirmation = props => {
    const classes = useStyles();
    const [state, setState] = useState(JSON.parse(sessionStorage.getItem("final_result")));
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState(0);
    const [string, setString] = useState('');
    const activeStep = props.activeStep;
    const setActiveStep = props.setActiveStep;
    const s = '<span>hello</span>'

    useEffect(() => {
        setTimeout(function(){
            if(state.final[counter]){
                setString((str) => str + `<span style="color: green; font-size: medium;font-weight: bolder;">&#10004;</span>&nbsp;&nbsp;&nbsp;<b style="padding: '2px';">${state.final[counter]}</b><br/><br/>`)
                setCounter((count) => count + 1);
            }
        }, 3000)
    }, [state.final[counter]])
    console.log("AAAA", counter)
    return(
        <>
            <div className={classes.root}>
                <div className='card pd-20'>
                    {
                        counter === 7 ? 
                        <div style={{maxWidth: '100px', marginLeft: '615px'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161.2 161.2">
                                                    <circle className="path" fill="none" stroke="#1976D2" stroke-width="4" stroke-miterlimit="10" cx="80.6" cy="80.6" r="62.1"/>
                                                    <path className="path" fill="none" stroke="#1976D2" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" d="M113 52.8l-38.9 55.6-25.9-22"/>
                                                    <circle className="spin" fill="none" stroke="#555555" stroke-width="4" stroke-miterlimit="10" stroke-dasharray="12.2175,12.2175" cx="80.6" cy="80.6" r="73.9"/>
                                                </svg>
                    </div>
                    :
                    <>
                    <div className="hint-text" style={{textAlign: 'center'}}>
                                Please wait this might take some time..
                    </div><br/>
                    <div style={{textAlign: 'center'}}>
                    <CircularProgress /></div><br/><br/>
                    </>
}
                <div dangerouslySetInnerHTML={{ __html: string }} style={{fontSize: "13px", textAlign: 'center'}}>
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

export default FinalConfirmation;