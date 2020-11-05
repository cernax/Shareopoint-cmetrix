import * as React from 'react';
import "@pnp/polyfill-ie11";
import { IIndicadoresProps } from './IIndicadoresProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import { IContextInfo } from "@pnp/sp/sites";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

var context;

export interface  IndicadoresPesos {
  dolar: string;
  euro:string;
  uf:string;
  utm:string;
  ipsa:string;
}

interface IPnpstate {
  Noticia: IndicadoresPesos[];
}

export default class Indicadores extends React.Component<IIndicadoresProps, {}> {

  constructor(prop:IIndicadoresProps){
    super(prop);
    this.state = {
      Noticia: []
    };
  }

  public async componentDidMount() {
    
    if(window.location.href.split("/")[4] == "MundoEuronetDesa")
      context = window.location.href.substring(0,58);
    else
      context = window.location.href.substring(0,49);

    await this.getDato();
  }
  public render(): React.ReactElement<IIndicadoresProps> {
    return (<App bindoutput={this.state} />);
  }
  public async getDato(){

    let indicador: IndicadoresPesos[] = [];
    let montoDolar;
    let montoEuro;
    let montoUF;
    let montoUTM;
    let montoIPSA;

    const w = Web(context);
    await w.lists.getByTitle("Indicadores").items
    .select("Dolar", "Euro", "UF", "UTM", "IPSA")
    .orderBy("Created", false)
    .top(1)
    .get()
    .then(val => {
      val.map( resp => {
        montoDolar = resp.Dolar.toString().replace(".", ","),
        montoEuro = resp.Euro.toString().replace(".", ","),
        montoUF = resp.UF.toString().replace(".", ","),
        montoUTM = resp.UTM.toString().replace(".", ","),
        montoIPSA = resp.IPSA.toString().replace(".", ",")
        
      })
    });
    
    const formatter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    });
    montoDolar = (montoDolar = montoDolar.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.")).split("").reverse().join("").replace(/^[\.]/, "")
    montoEuro = (montoEuro = montoEuro.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.")).split("").reverse().join("").replace(/^[\.]/, "")
    montoUF = (montoUF = montoUF.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.")).split("").reverse().join("").replace(/^[\.]/, "")
    montoUTM = (montoUTM = montoUTM.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.")).split("").reverse().join("").replace(/^[\.]/, "")
    montoIPSA = (montoIPSA = montoIPSA.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.")).split("").reverse().join("").replace(/^[\.]/, "")


    indicador.push({dolar: montoDolar, euro: montoEuro, uf: montoUF, utm: montoUTM, ipsa: montoIPSA});
    this.setState({Noticia: indicador});
  }
}

const App = (props) => {

  const Bindvalue = props.bindoutput.Noticia.map((Outfile) =>
  <>
    <th>Dólar ${Outfile.dolar}</th>
    <th>Euro ${Outfile.euro}</th>
    <th>UF ${Outfile.uf}</th>
    <th>UTM ${Outfile.utm}</th>
    <th>IPSA {Outfile.ipsa}</th>
  </>
  );

  return (
    <>
      {/*<span role="heading" aria-level={2} style={{fontSize:"24px"}} >Indicadores</span>*/}
      <table className="table">
        <thead className="">
        {Bindvalue}
        </thead>
      </table>

    </>
  );
};
