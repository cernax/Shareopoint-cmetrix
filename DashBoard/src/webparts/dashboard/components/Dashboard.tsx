import * as React from 'react';
import { IDashboardProps } from './IDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {Bar, Doughnut} from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Web} from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import {Dialog, DialogType} from "office-ui-fabric-react";

export interface  CodEst {
  CantEmpresa: number;
  Respondidos: number;
  NoRespondidos:number;
}

interface IPnpstate {
  Estado: CodEst[];
}

export default class Dashboard extends React.Component<IDashboardProps, {}> {

  constructor(prop: IDashboardProps) {
    super(prop);
    this.state = {
      Estado: []
    };
  }

  public async componentDidMount() {
    let Codigo: CodEst[] = [];
    let contTotEmp = 0, contTotEv = 0, cantNotEv = 0;
    const w = Web("https://cmetrix1.sharepoint.com/sites/DemosPresentaciones/");
    const r = await w.lists.getByTitle("Roles").items.get();

    contTotEmp = r.length;

    const ws = Web("https://cmetrix1.sharepoint.com/sites/DemosPresentaciones/");
    const rs = await ws.lists.getByTitle("Respuestas").items.get();
    contTotEv = rs.length;

    cantNotEv = contTotEmp - contTotEv;

    console.log(contTotEmp);
    console.log(contTotEv);
    console.log(cantNotEv);

    Codigo.push({CantEmpresa: contTotEmp, Respondidos: contTotEv, NoRespondidos: cantNotEv});

    this.setState({Estado: Codigo});
  }

  public render(): React.ReactElement<IDashboardProps> {
    return (<DashBoard bindoutput={this.state} />);
  }
}

function MyVerticallyCenteredModal(props) {
  return (
    <Dialog hidden={false} isOpen={props.visible} onDismiss={props.ocultar} minWidth={630} title={props.tituloEuro}
            type={DialogType.normal}>
      <p>{props.descripEuro}</p>
    </Dialog>
  );
}

const DashBoard = (props) => {
  const Respondidos = props.bindoutput.Estado.map((Outfile) => Outfile.Respondidos);
  const CantEmpresa = props.bindoutput.Estado.map((Outfile) => Outfile.CantEmpresa);
  const NoRespondidos = props.bindoutput.Estado.map((Outfile) => Outfile.NoRespondidos);

  const porcRespondidos =  Math.round((Respondidos * 100) / CantEmpresa);
  const porcSinRespodner = Math.round((NoRespondidos * 100) / CantEmpresa);

  const data = {
    labels: ['Logrado', 'Medianamente Logrado', 'No Logrado'],
    datasets: [
      {
        label: 'Primer Ciclo',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [2, 0, 1]
      },
      {
        label: 'Segundo Ciclo',
        backgroundColor: 'rgba(96,133,255,0.2)',
        borderColor: 'rgba(96,133,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(96,133,255,0.4)',
        hoverBorderColor: 'rgba(96,133,255,1)',
        data: [10, 6, 4]
      },
      {
        label: 'Tercer Ciclo',
        backgroundColor: 'rgba(96,255,136,0.2)',
        borderColor: 'rgba(96,255,136,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(96,255,136,0.4)',
        hoverBorderColor: 'rgba(96,255,136,1)',
        data: [10, 1, 15]
      }
    ]
  };

  const data2 = {
    labels: [],
    datasets: [{
      data: [porcRespondidos, porcSinRespodner],
      backgroundColor: [
        '#28a745',
        '#dc3545'
      ],
      hoverBackgroundColor: [
        '#28a745 ',
        '#dc3545'
      ]
    }]
  };
  const [modalShow, setModalShow] = React.useState(false);

  return(<>
    <div className="container">
      <div className="row">
        <div className="col-lg-10">
          <Bar
            data={data}
            width={120}
            height={200}
            options={{
              maintainAspectRatio: false
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col col-lg-4">
          <div className="card text-white bg-success mb-3" style={{maxWidth: "18rem;"}}>
            <div className="card-header">Personas Evaluación</div>
            <div className="card-body">
              <p className="card-text">El {porcRespondidos}% de las personas han contestado la evaluación</p>
            </div>
          </div>
          <div className="card text-white bg-danger mb-3" style={{maxWidth: "18rem;"}}>
            <div className="card-header">Personas sin Contestar Evaluación</div>
            <div className="card-body">
              <p className="card-text">El {porcSinRespodner}% de las personas aun no contestan la evaluación</p>
            </div>
          </div>
        </div>
        <div className="col col-lg-6">
          <Doughnut data={data2} width={110} height={110} />
        </div>
      </div>
    </div>
  </>);
};
