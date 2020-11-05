import * as React from 'react';
import { IProgressBarProps } from './IProgressBarProps';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { sp } from "@pnp/sp";
import {Web} from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import "@pnp/sp/profiles";
import "@pnp/sp/site-users/web";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

export interface  CodEst {
  CodigoEstado: number;
}

interface IPnpstate {
  Estado: CodEst[];
}

function getSteps() {
  return ['Inicio', 'Jefe', 'Gerencia'];
}

function getStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown stepIndex';
  }
}

export default class ProgressBar extends React.Component<IProgressBarProps> {

  constructor(prop: IProgressBarProps) {
    super(prop);
    this.state = {
      Estado: []
    };
  }
  public async componentDidMount() {
    let Codigo: CodEst[] = [];

    const users = await sp.web.currentUser.get();
    console.log(users);

    const w = Web("https://cmetrix1.sharepoint.com/sites/DemosPresentaciones/");
    const r = w.lists.getByTitle("Respuestas").items
      .select("CodigoEstado")
      .filter("CorreoTrabajador eq '" + users.UserPrincipalName + "'")
      .orderBy("Created", false)
      .top(1)
      .get();
    r.then(responses => {
      console.log(responses);
      responses.map((dato) => {

        let dat = dato.CodigoEstado;
        console.log(dat.length);

        if(dat >= 1)
        {
          console.log(dat);

          Codigo.push({CodigoEstado: dato.CodigoEstado});
          this.setState({Estado: Codigo});
        }
        else {
          Codigo.push({CodigoEstado: 0});
          this.setState({Estado: Codigo});
        }


      });
    });
  }

  public render(): React.ReactElement<IProgressBarProps> {
    return (<HorizontalLabelPositionBelowStepper bindoutput={this.state} />);
  }
}

function HorizontalLabelPositionBelowStepper(props) {

  const classes = useStyles();
  const Bindvalue = props.bindoutput.Estado.map((Outfile) => Outfile.CodigoEstado);

  const Est = Bindvalue > 0 ? Bindvalue : 0 ;

  console.log("Estado: " +  parseInt(Bindvalue));

  const [activeStep, setActiveStep] = React.useState(parseInt(Est));
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  //props.bindoutput.Noticia.map((Outfile) => setActiveStep(Outfile.CodigoEstado));

  return (
    <div className={classes.root}>
      <Stepper activeStep={parseInt(Est)} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
