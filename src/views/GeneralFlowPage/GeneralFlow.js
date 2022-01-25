import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import App from '../../App';
import DatabaseAuth from './components/DatabaseAuth'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '100px 50px',
        '& .step-btn':{
            '& .MuiSvgIcon-root':{
                fontSize: '25px',
            },
            '& .MuiStepIcon-text':{
                fontSize: '12px',
            }
        }
    },
}))

const steps = ['MySQL Database Authentication', 'Select Table to Migrate', 'Final Steps'];

const GeneralFlow = props => {
    const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const classes = useStyles();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
      <div className={classes.root}>
            <Box sx={{ width: '100%' }}>
            <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                    <StepButton color="inherit" onClick={handleStep(index)} className="step-btn">
                        <p className="main-heading">{label}</p>
                    </StepButton>
                </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset} size="large"><p className="main-heading">Reset</p></Button>
                    </Box>
                </React.Fragment>
                ) : (
                <React.Fragment>
                    {
                        activeStep + 1 === 1 ? 
                        <Typography sx={{ mt: 2, mb: 1 }}><DatabaseAuth /></Typography>
                        :
                        null
                    }
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        size="large"
                    >
                        <p className="main-heading">Back</p>
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext} sx={{ mr: 1 }} size="large">
                        <p className="main-heading">Next</p>
                    </Button>
                    {activeStep !== steps.length &&
                        (completed[activeStep] ? (
                        <Typography variant="caption" sx={{ display: 'inline-block' }}>
                            Step {activeStep + 1} already completed
                        </Typography>
                        ) : (
                        <Button onClick={handleComplete} size="large">
                            {completedSteps() === totalSteps() - 1
                            ? <p className="main-heading">Finish</p>
                            : <p className="main-heading">Complete Step</p>}
                        </Button>
                        ))}
                    </Box>
                </React.Fragment>
                )}
            </div>
            </Box>
        </div>
  );
}

export default GeneralFlow;