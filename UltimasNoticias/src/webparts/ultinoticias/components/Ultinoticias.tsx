import * as React from 'react';
import "@pnp/polyfill-ie11";
import { IUltinoticiasProps } from './IUltinoticiasProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconContext } from "react-icons";
import { BsNewspaper } from 'react-icons/bs';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import { IContextInfo } from "@pnp/sp/sites";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

var context;

export interface  urlimg {
  urlimge: string;
  titulo: string;
  path:string;
}

interface IPnpstate {
  ImageUrl: urlimg[];
}


export default class Ultinoticias extends React.Component<IUltinoticiasProps, IPnpstate> {

  private async  GetDato(): Promise<urlimg[]>{
    return new Promise<urlimg[]>(async (resolve, reject) => {
    let noticias: urlimg[] = [];

    const w = Web(context + "noticias/");
    const r = w.lists.getByTitle("Páginas del sitio").items
      .select("ID", "ContentTypeId", "EncodedAbsUrl", "Title", "CanvasContent1", "FechadePublicaci_x00f3_n")
      .top(3)
      .orderBy("FechadePublicaci_x00f3_n", false)
      .filter("Principal eq 0 and Title ne null and Publicado eq 1")
      .get();
    r.then(responses => {
      const result = responses;
      result.map((dato) => {
        if(dato.ID != 1)
        {
          var img = context + "PublishingImages/NOTICIAS/2020/Azul%20Casa%20Cambio%20de%20Domicilio%20Tarjeta%20(1).png?&originalPath=aHR0cHM6Ly9ldXJvYW1lcmljYS5zaGFyZXBvaW50LmNvbS86aTovcy9NdW5kb0V1cm9uZXREZXNhL0VjR0ktVnBob3JoRXBUbDdWb1lVcFM0Qm1MYV9WZ01rYzdFdFhCUDdRb3dGT2c_cnRpbWU9NzJuOTdGWU8yRWc";
          try {

            img = dato.CanvasContent1.split('src="')[1].split('"')[0];
          }
          catch (error) {
            img = context + "PublishingImages/NOTICIAS/2020/Azul%20Casa%20Cambio%20de%20Domicilio%20Tarjeta%20(1).png?&originalPath=aHR0cHM6Ly9ldXJvYW1lcmljYS5zaGFyZXBvaW50LmNvbS86aTovcy9NdW5kb0V1cm9uZXREZXNhL0VjR0ktVnBob3JoRXBUbDdWb1lVcFM0Qm1MYV9WZ01rYzdFdFhCUDdRb3dGT2c_cnRpbWU9NzJuOTdGWU8yRWc";
          }
          noticias.push({
            urlimge: img,
            titulo: dato.Title,
            path: dato.EncodedAbsUrl
          });
        }

      });
      this.setState({ImageUrl:noticias});
      });
    });
  }

  constructor(prop:IUltinoticiasProps){
    super(prop);
    this.state = {
      ImageUrl: []
    };
  }

  public async componentDidMount(){

    const oContext: IContextInfo = await sp.site.getContextInfo();
    context = oContext.SiteFullUrl  + "/";

    this.GetDato();
  }

  public render(): React.ReactElement<IUltinoticiasProps> {
    return (
      <div>
        { this.state.ImageUrl.length > 0 && <UltimasNoticias bindoutput={this.state} /> }
      </div>
    );
  }

}
const UltimasNoticias = (props) => {

var vista;
if (window.location.href.split("/")[4] == "MundoEuronetDesa")
  vista = "noticias/SitePages/Forms/AllPages.aspx";
else
  vista = "noticias/SitePages/Forms/Todas las pginas.aspx";

  const Bindvalue = props.bindoutput.ImageUrl.map((Outfile) =>
    <a className="blockLink" href={Outfile.path}>
      <div className="card mb-3">
      <div className="row no-gutters">
        <div className="col-md-5">
          <img src={Outfile.urlimge} className="card-img" alt="imagen" />
        </div>
        <div className="col-md-7">
            <h5 className="card-title"><a className="container" href={Outfile.path}>{Outfile.titulo}</a></h5>
            <p className="card-text" dangerouslySetInnerHTML={{__html: Outfile.descrip}} />
        </div>
      </div>
    </div>
    </a>
  );
  const MAslider = (
    <div>
      <div className="row">
        <div className="col col-lg-12">
          <h4 role="heading" className="TituloZona">Últimas Noticias</h4>
          {
            Bindvalue
          }
          <a className="vertodas" href={context + vista}>
            <span>Ir a las Noticias</span>
          </a>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {MAslider}
    </>
  );
};
