import * as React from 'react';
import "@pnp/polyfill-ie11";
import {ICumpleanosProps} from './ICumpleanosProps';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@pnp/sp/profiles";
import "@pnp/sp/site-users/web";
import Button from "react-bootstrap/Button";
import {Web} from "@pnp/sp/webs";
import {FaBirthdayCake} from 'react-icons/fa';
import { IconContext } from "react-icons";
import {Dialog, DialogType, DialogFooter} from "office-ui-fabric-react";
import * as $ from 'jquery';
import { sp } from "@pnp/sp";
import { IContextInfo } from "@pnp/sp/sites";
sp.setup({
  // set ie 11 mode
  ie11: true,
});

var context;

export interface  getCumpleanos {
  id:number;
  Nombre:string;
  ApellidM:string;
  ApellidoP:string;
  Email:string;
  picture:string;
}

export interface IListItem {
  Title: string;
  Description: string;
  Id: number;
}
var contadorFecha = 0;

export default class Cumpleanos extends React.Component<ICumpleanosProps, any> {

  public constructor(prop) {
    super(prop);
    this.state = {
      items:[],
      boolShow:false,
      fecha:'',
      nombre:'',
      correo:'',
      saludos:'',
      cc: false
    };

  }

  public async componentDidMount() {
    const oContext: IContextInfo = await sp.site.getContextInfo();
    context = oContext.SiteFullUrl  + "/";
    this.getdato(new Date());
  }


  public render(): React.ReactElement<ICumpleanosProps> {

    let h5 = <div className="col col-lg-7"><h5 className="card-title">Sin Cumpleaños</h5></div>;

    let v = false;

    return (
        <div>
          <div>
            <h4 role="heading" className="TituloZona" >Cumpleaños</h4>
          </div>
            <div>
              <div>
                <div>
                  <div className="contenedor-item">
                    {
                      this.state.items.map( res =>
                      {
                        h5 = <>
                          
                            <div className="Item">
                            <div className="usuarios" >
                              {  res.ApellidoP == "" ? <></> : <img src={res.picture  == "" ? context + 'EV7m3pYHdbdKpEbBdhktb6gBpru4QgjOZeTan85DrUFJMA?e=k6bviV': res.picture} alt="img user" />}
                              &nbsp;&nbsp;
                              <h6>{res.Nombre} {res.ApellidoP} {res.ApellidM}</h6>
                            </div>
                            <div>
                              {
                                res.ApellidoP != '' ?
                                <IconContext.Provider value={{size: '2em'}}>
                                    <div>
                                      <a className="cumpleanios" onClick={() => this.openModal(res.id,true)}></a>
                                      <Dialog className="Formulario-popup" hidden={false} isOpen={this.state.boolShow} onDismiss={() => this.openModal(0,false)}   title="Escribe tu saludo" minWidth={630} type={DialogType.normal}>
                                        <form>
                                          <div className="Contenedor-para">
                                            <label htmlFor="exampleFormControlTextarea1">Para</label>
                                            <input type="text" id='idPara' placeholder="Default input" value={this.state.nombre} readOnly={true} />
                                          </div>
                                          <div className="Contenedor-saludos">
                                            <label htmlFor="exampleFormControlTextarea1">Saludos</label>
                                            <textarea id="idSaludo" rows={3} required onChange={ (e)=>  this.setTexto(e) }/>
                                          </div>
                                          <div className="Contenedor-check">
                                            <input type="checkbox" value="" id="idEnviarmeCopia" onChange={(e) => this.setCheck(e) } />
                                            <label htmlFor="exampleFormControlTextarea1">Enviarme una copia</label>
                                          </div>
                                          <div className='Contenedor-button-guardar'>
                                            <a href="#" role="button" onClick={() => {this.insertSaludo(this.state.correo, this.state.nombre); }}>
                                              Enviar
                                            </a>
                                          </div>
                                        </form>
                                      </Dialog>
                                    </div>
                                </IconContext.Provider>
                                :
                                <></>
                              }
                            </div>
                          </div>
                          
                        </>;
                        return h5;
                      })
                    }
                  </div>
                </div>
                <div className="navegacion-arrow">
                  <Button variant="secondary" onClick={() => this.lnk_Prev_Click() }>Anterior</Button>
                  &nbsp;&nbsp;
                  <Button variant="secondary" onClick={() => this.lnk_Next_Click() }>Siguiente</Button>                  
                  <div>
                    <span role="heading" className="contenedor-fecha">{this.state.fecha}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
  }
  private insertSaludo = (para, nombre): void =>   {

    var saludo = this.state.saludos;
    var val = false;

    if (saludo != "") {
      val = true;
    }

    if (val == true) {

      try {

        // add an item to the list
        const w = Web(context);
        w.lists.getByTitle("Saludos").items.add({
          Title: nombre,
          Para: para,
          Saludo: saludo,
          Enviarme_x0020_una_x0020_copia: this.state.cc

        }).then((iar) => {
          this.setState({cc:false});
          this.openModal(0,false);
        });

      }
      catch (e) {
        alert(e);
      }
    }
  }

  private setTexto = (e): void =>  {
    this.setState({saludos:e.target.value});
  }

  private setCheck = (e): void =>  {
    this.setState({cc:e.target.checked});
  }

  private async getdato(date: Date): Promise<getCumpleanos[]> {
    return new Promise<getCumpleanos[]>(async (resolve, reject) => {
      let noticias: getCumpleanos[] = [];
      const options = {weekday: 'long', month: "long", day: "numeric"};
      var customFecha = new Intl.DateTimeFormat("es-ES", options).format(date);

      const w = Web(context);
      await w.lists.getByTitle("Cumpleaños").items
        .select("ID", "Title", "ApellidoPaterno", "ApellidoMaterno", "Email", "Day", "Month", "Year")
        .filter("Month eq " + "'" + (date.getMonth() + 1) + "' and Day eq " + "'" + date.getDate() + "'")
        .orderBy("Day", true)
        .get()
        .then((response) => {
          response.map((resp) => {
            // var loginname = encodeURIComponent('i:0#.f|membership|' + resp.Email);
            var picturename = context + '_layouts/15/userphoto.aspx?UserName=' + resp.Email;
            // $.ajax({
            //   url: "https://euroamerica.sharepoint.com/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + loginname + "'",
            //   type: "GET",
            //   async: false,
            //   dataType: 'json',
            //   success: picture => {
            //     if (picture.PictureUrl != null) {
            //       picturename = picture.PictureUrl;
            //     } else {
            //       picturename = '';
            //     }
            //   },
            //   error: error => {
            //     console.log("Error: " + error);
            //   }
            // });

            noticias.push({
              id: resp.ID,
              Nombre: resp.Title,
              ApellidM: resp.ApellidoMaterno,
              ApellidoP: resp.ApellidoPaterno,
              Email: resp.Email,
              picture: picturename
            });
          });
        });

      var fecha = customFecha.replace(',', '');

      if (noticias.length > 0) {
        this.setState({items: noticias, fecha: fecha});

      } else {
        noticias.push({
          id: 0,
          Nombre: 'Este día no hay cumpleaños',
          ApellidM: '',
          ApellidoP: '',
          Email: '',
          picture: ''
        });
        this.setState({items: noticias, fecha: fecha});

      }
      resolve(noticias);
    });
  }

  private openModal = (idlist, estShow): void => {

    let cumpleaniero = this.state.items.filter( resp => resp.id == idlist);

    for (var x = 0; x < cumpleaniero.length; x++)
    {
      this.setState({nombre: cumpleaniero[x].Nombre + " " + cumpleaniero[x].ApellidoP + " " + cumpleaniero[x].ApellidM, correo: cumpleaniero[x].Email});
    }
    this.setState({boolShow: estShow});
  }

  private sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  private lnk_Prev_Click() {
    contadorFecha = contadorFecha - 1;
    var fechaCalculada = this.sumarDias(new Date(), contadorFecha);
    this.getdato(fechaCalculada);
  }

  private lnk_Next_Click() {
    contadorFecha++;
    var fechaCalculada = this.sumarDias(new Date(), contadorFecha);
    this.getdato(fechaCalculada);
  }

  private createItem(): void {

    var datos = {
      Para: undefined,
      Title: undefined,
      Saludo: undefined,
      Enviarme_x0020_una_x0020_copia: undefined
    };
    datos['__metadata'] = { "type": "SP.ListItem" };
    datos.Para = "acorro@cmetrix.la";
    datos.Title = "prueba";
    datos.Saludo = "prueba";
    datos.Enviarme_x0020_una_x0020_copia = true;

    // add an item to the list
    sp.web.lists.getByTitle("Saludos").items.add({
      Title: "PnPJS"
    }).then((iar) => {

    });
  }
}

