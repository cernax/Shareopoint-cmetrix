import * as React from 'react';
import "@pnp/polyfill-ie11";
import { INewsmoreviewProps } from './INewsmoreviewProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Spinner from 'react-bootstrap/Spinner';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from "@pnp/sp";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

export interface  NoticiasLike {
  urlimge: string;
  titulo: string;
  path:string;
}
function GetFirstWeekDays () {
  var now = new Date();

  var dia = now.toLocaleDateString('es-ES', { weekday: 'long' });
  var fechaCal = new Date();

  if (dia.localeCompare('lunes') == 0) {
    fechaCal = now;
  } else if (dia.localeCompare("martes") == 0) {
    now.setDate(now.getDate() - 1);
    fechaCal = now;
  } else if (dia.localeCompare('miércoles') == 0) {
    now.setDate(now.getDate() - 2);
    fechaCal = now;
  } else if (dia.localeCompare("jueves") == 0) {
    now.setDate(now.getDate() - 3);
    fechaCal = now;
  } else if (dia.localeCompare("viernes") == 0) {
    now.setDate(now.getDate() - 4);
    fechaCal = now;
  } else if (dia.localeCompare("sábado") == 0) {
    now.setDate(now.getDate() - 5);
    fechaCal = now;
  } else if (dia.localeCompare("domingo") == 0) {
    now.setDate(now.getDate() - 6);
    fechaCal = now;
  } else {
    console.log("Error mal fecha");
  }
  return fechaCal;
}
export default class Newsmoreview extends React.Component<INewsmoreviewProps, any> {

  constructor(prop){
    super(prop);
    this.state = {
      Noticia: [],
      idnews: 0
    };
  }
  public componentDidMount() {

    let fechaini = GetFirstWeekDays();
    let fechafin = new Date();
    var anioini = fechaini.getFullYear();
    var mesini = fechaini.getMonth().toString().length == 1 ? "0" + (fechaini.getMonth() + 1).toString()  : (fechaini.getMonth() + 1);
    var diaini = fechaini.getDate().toString().length == 1 ? "0" + fechaini.getDate().toString()  : fechaini.getDate();
    var fecini = anioini + '-' + mesini + '-' + diaini;
    fechafin.setDate(fechaini.getDate() + 6);

    var aniofin = fechafin.getFullYear();
    var mesfin = fechafin.getMonth().toString().length == 1 ? "0" + (fechafin.getMonth() + 1).toString()  : (fechafin.getMonth() + 1);
    var diafin = fechafin.getDate().toString().length == 1 ? "0" + fechafin.getDate().toString()  : fechafin.getDate();
    var fecfin = aniofin + '-' + mesfin + '-' + diafin;


    var val = this.getSearch(fecini, fecfin);

  }
  public render(): React.ReactElement<INewsmoreviewProps> {
    return (
      <>
        <App bindoutput={this.state} />
      </>
    );
  }
  private getSearch(fecini, fecfin): Promise<NoticiasLike[]>{
    return new Promise<NoticiasLike[]>(async (resolve, reject) => {

      let noticias: NoticiasLike[] = [];

      $.ajax(
        {
          url: "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/_api/search/query?querytext='site:https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/noticias/SitePages'&selectproperties='Title,PictureThumbnailURL,path,Publicado,CountLike,ViewsLifeTime,ViewsLifeTimeUniqueUsers'&rowlimit='5000'&refinementfilters='and(Publicado:equals(" + '"' + "True" + '"' + "),Created:range(datetime(" + '"' + fecini + '"' + "),%20datetime(" + '"' + fecfin + '"' + ")))'&sortlist='LastModifiedTime:descending'&TrimDuplicates=false",
          type: "GET",
          async: false,
          dataType: 'json',
          success: data => {
            var resp = data.PrimaryQueryResult.RelevantResults.Table.Rows;

            var mayor = 0;
            if(resp.length == 0)
            {
              var newfecini = new Date(fecini);
              var newfecfin = new Date(fecfin);

              newfecini.setDate(newfecini.getDate() - 6);
              var anioini = newfecini.getFullYear();
              var mesini = newfecini.getMonth().toString().length == 1 ? "0" + (newfecini.getMonth() + 1).toString()  : (newfecini.getMonth() + 1);
              var diaini = newfecini.getDate().toString().length == 1 ? "0" + newfecini.getDate().toString()  : newfecini.getDate();
              var fecnewini = anioini + '-' + mesini + '-' + diaini;

              newfecfin.setDate(newfecfin.getDate() - 6);
              var aniofin = newfecfin.getFullYear();
              var mesfin = newfecfin.getMonth().toString().length == 1 ? "0" + (newfecfin.getMonth() + 1).toString()  : (newfecfin.getMonth() + 1);
              var diafin = newfecfin.getDate().toString().length == 1 ? "0" + newfecfin.getDate().toString()  : newfecfin.getDate();
              var fecnewfin = aniofin + '-' + mesfin + '-' + diafin;

              this.getSearch(fecnewini, fecnewfin);
            }
            else{
              var tit = '';
              var ruta = '';
              var img = '';

              for(var x = 0; x < resp.length;x++){
                debugger;
                if( parseInt(resp[x].Cells[7].Value) > 0){

                  if(parseInt(resp[x].Cells[7].Value) > mayor )
                  {
                    mayor = parseInt(resp[x].Cells[7].Value);

                    tit = resp[x].Cells[2].Value;
                    ruta = resp[x].Cells[4].Value;
                    var imgdefault = "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/PublishingImages/NOTICIAS/2020/Azul%20Casa%20Cambio%20de%20Domicilio%20Tarjeta%20(1).png?&originalPath=aHR0cHM6Ly9ldXJvYW1lcmljYS5zaGFyZXBvaW50LmNvbS86aTovcy9NdW5kb0V1cm9uZXREZXNhL0VjR0ktVnBob3JoRXBUbDdWb1lVcFM0Qm1MYV9WZ01rYzdFdFhCUDdRb3dGT2c_cnRpbWU9NzJuOTdGWU8yRWc";
                    var imgcarga = resp[x].Cells[3].Value;
                    imgcarga = imgcarga.split('/')[6];
                    img = imgcarga == "sitepagethumbnail.png" ? imgdefault : resp[x].Cells[3].Value;
                  }
                }
              }
              if(mayor == 0){
                var newfecini2 = new Date(fecini);
                var newfecfin2 = new Date(fecfin);

                newfecini2.setDate(newfecini2.getDate() - 6);
                var anioini2 = newfecini2.getFullYear();
                var mesini2 = newfecini2.getMonth().toString().length == 1 ? "0" + (newfecini2.getMonth() + 1).toString()  : (newfecini2.getMonth() + 1);
                var diaini2 = newfecini2.getDate().toString().length == 1 ? "0" + newfecini2.getDate().toString()  : newfecini2.getDate();
                var fecnewini2 = anioini2 + '-' + mesini2 + '-' + diaini2;

                newfecfin2.setDate(newfecfin2.getDate() - 6);
                var aniofin2 = newfecfin2.getFullYear();
                var mesfin2 = newfecfin2.getMonth().toString().length == 1 ? "0" + (newfecfin2.getMonth() + 1).toString()  : (newfecfin2.getMonth() + 1);
                var diafin2 = newfecfin2.getDate().toString().length == 1 ? "0" + newfecfin2.getDate().toString()  : newfecfin2.getDate();
                var fecnewfin2 = aniofin2 + '-' + mesfin2 + '-' + diafin2;

                this.getSearch(fecnewini2, fecnewfin2);
              }
              else
              {
                noticias.push({urlimge: img, titulo: tit, path: ruta });
                console.log(noticias);
                this.setState({Noticia: noticias});
                resolve(noticias);
              }
            }
          },
          onError: error => {
            console.log(error);
          }
        }
      );
    });
  }
}
const App = (props) => {

  let d = props.bindoutput.Noticia.map((Outfile) => { return Outfile.titulo;});

  const Bindvalue = props.bindoutput.Noticia.map((Outfile) =>
    <>
      <a className="blockLink" style={{display: "contents",color: "black"}} href={Outfile.path}>
        <div className="card mb-3" style={{maxWidth: "540px;", height: "110px"}}>
          <div className="row no-gutters">
            <div className="col-md-4" style={{height: "110px"}}>
              <img id="img" src={Outfile.urlimge} style={{height:"100%", width:"100%"}} className="card-img" alt="Imagen" />
            </div>
            <div className="col-md-8">
              <div className="card-body" >
                <h5 className="card-title" style={{textOverflow: "ellipsis", overflow: "hidden",height: "75px",color: "black"}}>{Outfile.titulo}</h5>
              </div>
            </div>
          </div>
        </div>
      </a>
    </>
  );

  return (
    <>
      <span role="heading" aria-level={2} style={{fontSize:"28px", color:"#c00518"}} >Noticia Más Visitada</span>
      {
        d == ""
          ?
          <div style={{textAlign: "center"}}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
          : Bindvalue
      }
    </>
  );
};
