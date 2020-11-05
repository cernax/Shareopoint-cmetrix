import * as React from 'react';
import { IFwdProps } from './IFwdProps';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { sp } from "@pnp/sp/presets/all";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

export interface interfacefwd {
  id:number;
  titulo: string;
  cantidad: string;
  precio:string;
  plazo:string;
  formapago:string;
  moneda:string;
  contraparte:string;
  tipooperacion:string;

}

export default class Fwd extends React.Component<IFwdProps, any> {
  constructor(prop){
    super(prop);
    this.state = {
      fwd:[]
    };
  }

  public componentDidMount() {

  }

  public render(): React.ReactElement<IFwdProps> {
    this._getfwd();

    return (
      <>
        <span role="heading" aria-level={2} style={{fontSize:"28px", color:"#c00518"}} >FWD</span>

        <Card style={{ width: '100%', height:"auto" }}>
          <Table striped hover>
            <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Plazo</th>
              <th>Forma de Pago</th>
              <th>Moneda</th>
              <th>Contraparte</th>
              <th>Tipo de Operación</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.fwd.map( value => {
              return <>
                    <tr>
                      <td>{value.id}</td>
                      <td>{value.titulo}</td>
                      <td>{value.cantidad}</td>
                      <td>{value.precio}</td>
                      <td>{value.plazo}</td>
                      <td>{value.formapago}</td>
                      <td>{value.moneda}</td>
                      <td>{value.contraparte}</td>
                      <td>{value.tipooperacion}</td>
                    </tr>
                  </>;
              })
            }
            </tbody>
          </Table>
        </Card>
      </>
    );
  }

  private async _getfwd(){

    let arrayfwd: interfacefwd[] = [];

    const items: any[] = await sp.web.lists.getByTitle("FWD").items
      .select("ID", "Title", "Cantidad","Precio", "Plazo", "FormadePago",  "Moneda", "Contraparte", "TipodeOperacion")
      .get();

    items.map( val => {
      arrayfwd.push({
        id:val.ID,
        titulo: val.Title,
        cantidad: val.Cantidad,
        precio:val.Precio,
        plazo:val.Plazo,
        formapago:val.FormadePago,
        moneda:val.Moneda,
        contraparte:val.Contraparte,
        tipooperacion:val.TipodeOperacion
      });
    });

    this.setState({fwd:arrayfwd});
  }
}
