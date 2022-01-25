import React from 'react';
import { styled } from '@mui/system';
import Backdrop from '@mui/material/Backdrop';
import { makeStyles, createStyles, Theme } from '@mui/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export function SimpleBackdrop() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };


  return (

    <Backdrop className={classes.backdrop} open={open} onClick={handleClose} >
      <div className="loader-bg-card">
        <div className="loader" id="loader-1">
        </div>
      </div>
    </Backdrop>
  );
}


export const Loading = (props) => {
    const varient = props.varient;
  return (
    <>
    {
      varient == "light" ? 
      <div className="loading-gif-container-two" >
      <div className="loader-bg-card-2">
        <div className="loader top-0px" id="loader-1">
        </div>
      </div>
    </div> 
    :
    <div className="loading-gif">
      <div className="loading-overlay"></div>
      <div className="loader-bg-card">
        <div className="loader" id="loader-1">
        </div>
      </div>
    </div>
    }

    
    </>
  );
}


export const LoadingContainer = (props) => {
  return (
    <div className="loading-gif-container" >
      <div className="loading-overlay"></div>
      <div className="loader-bg-card">
        <div className="loader" id="loader-1">
        </div>
      </div>
    </div>
  );
}

export const LoadingContainerWithoutCircle = (props) => {
  return (
    <div className="loading-gif-container-two" >
      <div className="loader-bg-card-2">
        <div className="loader" id="loader-1">
        </div>
      </div>
    </div>
  );
}

export const LoadingText = (props) => {
  return (
    <MainBody className="loading-text-cc">
      <div class="load-4">
        <div class="ring-1"></div><p className="loading-text">Loading...</p>
      </div>
    </MainBody>
  )
}

export const LoadingGifDots = () => {
  return (
    <div className="loading-gif-container" >
      <div class="loader-dots" id="loader-2">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}
const MainBody = styled('div')({
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})