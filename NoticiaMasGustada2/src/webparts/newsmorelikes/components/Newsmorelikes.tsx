import * as React from 'react';
import "@pnp/polyfill-ie11";
import {INewsmorelikesProps} from './INewsmorelikesProps';
import {Web} from "@pnp/sp/webs";
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as $ from 'jquery';
import { sp } from "@pnp/sp";
import "@pnp/sp/search";
import { IContextInfo } from "@pnp/sp/sites";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

var context;

export interface  NoticiasLike {
  urlimge: string;
  titulo: string;
  path:string;
}

interface IPnpstate {
  Noticia: NoticiasLike[];
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

export default class Newsmorelikes extends React.Component<INewsmorelikesProps, any> {

  constructor(prop){
    super(prop);
    this.state = {
      Noticia: [],
      idnews: 0
    };
  }
  public async componentDidMount() {

    const oContext: IContextInfo = await sp.site.getContextInfo();
    context = oContext.SiteFullUrl  + "/";
    console.log(context);

    let fechaini = GetFirstWeekDays();
    let fechafin = new Date();
    var anioini = fechaini.getFullYear();
    var mesini = (fechaini.getMonth() + 1).toString().length == 1 ? "0" + (fechaini.getMonth() + 1).toString() : (fechaini.getMonth() + 1);
    var diaini = fechaini.getDate().toString().length == 1 ? "0" + fechaini.getDate().toString() : fechaini.getDate();
    var fecini = anioini + '-' + mesini + '-' + diaini;
    fechafin.setDate(fechaini.getDate() + 6);

    var aniofin = fechafin.getFullYear();
    var mesfin = (fechafin.getMonth() + 1).toString().length == 1 ? "0" + (fechafin.getMonth() + 1).toString() : (fechafin.getMonth() + 1);
    var diafin = fechafin.getDate().toString().length == 1 ? "0" + fechafin.getDate().toString() : fechafin.getDate();
    var fecfin = aniofin + '-' + mesfin + '-' + diafin;

    
    await this.getIdNews(fecini, fecfin);
  }

  public render(): React.ReactElement<INewsmorelikesProps> {

    return (
      <>
        <App bindoutput={this.state} />
      </>);
  }
  private async getSearch(ID_News): Promise<NoticiasLike[]>{
    return new Promise<NoticiasLike[]>(async (resolve, reject) => {

    let noticias: NoticiasLike[] = [];
    //console.log("https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/_api/search/query?querytext='site:https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/noticias/SitePages'&selectproperties='Title,PictureThumbnailURL,path,Publicado,CountLike,ViewsLifeTime,ViewsLifeTimeUniqueUsers'&rowlimit='5000'&refinementfilters='and(Publicado:equals(" + '"' + "True" + '"' + "),Created:range(datetime(" + '"' + fecini + '"' + "),%20datetime(" + '"' + fecfin + '"' + ")))'&sortlist='LastModifiedTime:descending'&TrimDuplicates=false");
      try{
        const w = Web(context + "noticias/");
        await w.lists.getByTitle("Páginas del sitio").items
          .select("ID", "Title", "CanvasContent1", "EncodedAbsUrl")
          .filter("ID eq " + ID_News)
          .get()
          .then(response => {
          response.map(val => {
            var titulo, path, urlimg = "";
            urlimg = context + "PublishingImages/NOTICIAS/2020/Azul%20Casa%20Cambio%20de%20Domicilio%20Tarjeta%20(1).png?&originalPath=aHR0cHM6Ly9ldXJvYW1lcmljYS5zaGFyZXBvaW50LmNvbS86aTovcy9NdW5kb0V1cm9uZXREZXNhL0VjR0ktVnBob3JoRXBUbDdWb1lVcFM0Qm1MYV9WZ01rYzdFdFhCUDdRb3dGT2c_cnRpbWU9NzJuOTdGWU8yRWc";
            try {
              urlimg = val.CanvasContent1.split('src="')[1].split('"')[0];
            } catch (t) {
              urlimg = context + "PublishingImages/NOTICIAS/2020/Azul%20Casa%20Cambio%20de%20Domicilio%20Tarjeta%20(1).png?&originalPath=aHR0cHM6Ly9ldXJvYW1lcmljYS5zaGFyZXBvaW50LmNvbS86aTovcy9NdW5kb0V1cm9uZXREZXNhL0VjR0ktVnBob3JoRXBUbDdWb1lVcFM0Qm1MYV9WZ01rYzdFdFhCUDdRb3dGT2c_cnRpbWU9NzJuOTdGWU8yRWc";
            }
            titulo = val.Title;
            path = val.EncodedAbsUrl;
            noticias.push({
                urlimge: urlimg,
                titulo: titulo,
                path: path
              });
          });
          this.setState({Noticia: noticias});
        });
      }
      catch (e) {
        reject(e);
      }
    });
  }

  private async getIdNews(fecini, fecfin){
    var cantlike = 0;
    var id_news = 0;

    var newfecini = new Date(fecini);
    var newfecfin = new Date(fecfin);

    newfecini.setDate(newfecini.getDate() - 6);
    var anioini = newfecini.getFullYear();
    var mesini = (newfecini.getMonth() + 1).toString().length == 1 ? "0" + (newfecini.getMonth() + 1).toString()  : (newfecini.getMonth() + 1);
    var diaini = newfecini.getDate().toString().length == 1 ? "0" + newfecini.getDate().toString()  : newfecini.getDate();
    var fecnewini = anioini + '-' + mesini + '-' + diaini;

    newfecfin.setDate(newfecfin.getDate() - 6);
    var aniofin = newfecfin.getFullYear();
    var mesfin = (newfecfin.getMonth() + 1).toString().length == 1 ? "0" + (newfecfin.getMonth() + 1).toString()  : (newfecfin.getMonth() + 1);
    var diafin = newfecfin.getDate().toString().length == 1 ? "0" + newfecfin.getDate().toString()  : newfecfin.getDate();
    var fecnewfin = aniofin + '-' + mesfin + '-' + diafin;

    console.log(fecini);
    console.log(fecfin);
    try{
      const w = Web(context + "noticias/");
      await w.lists.getByTitle("Páginas del sitio").items
        .select("ID", "Title", "FechadePublicaci_x00f3_n")
        .orderBy("FechadePublicaci_x00f3_n", false)
        .filter("(FechadePublicaci_x00f3_n gt datetime'" + fecini + "T00:00:00.000Z') and (FechadePublicaci_x00f3_n lt datetime'" + fecfin + "T00%3a00%3a00.000Z')")
        .get()
        .then(responses => {
        if(responses.length > 0) {
          var guidlistnoticia;
          if (window.location.href.split("/")[4] == "MundoEuronetDesa")
            guidlistnoticia = "c323f96a-b3cc-4057-9ad8-63048514e6f1";
          else
            guidlistnoticia = "b37d9f26-59f0-4127-9ca3-413db2c9a321";

          responses.map(async val => {
           await $.ajax({
              url: context + "noticias/_api/Web/Lists(guid'" + guidlistnoticia + "')/Items(" + val.ID + ")/LikedByInformation",
              type: "GET",
              async: false,
              dataType: "json",
              success: data => {
                try {
                  if (data.likeCount > cantlike) {
                    cantlike = data.likeCount;
                    id_news = val.ID;
                  }
                } catch (t) {
                  console.log(t);
                }
              },
              error: error => {
                console.log("Error: " + error.message);
              }
            });
          });
          if(id_news > 0) {
            this.getSearch(id_news);
          }
          else{
            newfecini = new Date(fecini);
            newfecfin = new Date(fecfin);

            newfecini.setDate(newfecini.getDate() - 6);
            anioini = newfecini.getFullYear();
            mesini = (newfecini.getMonth() + 1).toString().length == 1 ? "0" + (newfecini.getMonth() + 1).toString()  : (newfecini.getMonth() + 1);
            diaini = newfecini.getDate().toString().length == 1 ? "0" + newfecini.getDate().toString()  : newfecini.getDate();
            fecnewini = anioini + '-' + mesini + '-' + diaini;

            newfecfin.setDate(newfecfin.getDate() - 6);
            aniofin = newfecfin.getFullYear();
            mesfin = (newfecfin.getMonth() + 1).toString().length == 1 ? "0" + (newfecfin.getMonth() + 1).toString()  : (newfecfin.getMonth() + 1);
            diafin = newfecfin.getDate().toString().length == 1 ? "0" + newfecfin.getDate().toString()  : newfecfin.getDate();
            fecnewfin = aniofin + '-' + mesfin + '-' + diafin;

            this.getIdNews(fecnewini, fecnewfin);
          }
        }else
        {
          newfecini = new Date(fecini);
          newfecfin = new Date(fecfin);

          newfecini.setDate(newfecini.getDate() - 6);
          anioini = newfecini.getFullYear();
          mesini = (newfecini.getMonth() + 1).toString().length == 1 ? "0" + (newfecini.getMonth() + 1).toString()  : (newfecini.getMonth() + 1);
          diaini = newfecini.getDate().toString().length == 1 ? "0" + newfecini.getDate().toString()  : newfecini.getDate();
          fecnewini = anioini + '-' + mesini + '-' + diaini;

          newfecfin.setDate(newfecfin.getDate() - 6);
          aniofin = newfecfin.getFullYear();
          mesfin = (newfecfin.getMonth() + 1).toString().length == 1 ? "0" + (newfecfin.getMonth() + 1).toString()  : (newfecfin.getMonth() + 1);
          diafin = newfecfin.getDate().toString().length == 1 ? "0" + newfecfin.getDate().toString()  : newfecfin.getDate();
          fecnewfin = aniofin + '-' + mesfin + '-' + diafin;

          this.getIdNews(fecnewini, fecnewfin);
        }
      });
    }
    catch (e) {
      console.log("Error: " + e.message);
    }
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
                <h5 className="card-title" >
                  <a className="container">{Outfile.titulo}</a></h5>
              </div>
            </div>
          </div>
        </div>
      </a>
    </>
  );

  return (
    <>
    <h4 role="heading" aria-level={2} className="TituloZona" >Noticia Más Gustada</h4>
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
