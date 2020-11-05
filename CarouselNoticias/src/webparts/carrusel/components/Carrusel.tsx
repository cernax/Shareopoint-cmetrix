import * as React from 'react';
import {ICarruselProps} from './ICarruselProps';
import Carousel from 'react-bootstrap/Carousel';
import  $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import { sp, Web, ISearchQuery, SearchResults } from "@pnp/sp/presets/all";
import {SearchQueryBuilder} from "@pnp/polyfill-ie11/dist/searchquerybuilder";
import {any, object, string} from "prop-types";
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
  MosTit:string;
}

interface IPnpstate {
  ImageUrl: urlimg[];
}


export default class Carrusel extends React.Component<ICarruselProps, IPnpstate> {

  private async  GetDato(): Promise<urlimg[]>{
    return new Promise<urlimg[]>(async (resolve, reject) => {

    let noticias: urlimg[] = [];

    const w = Web(context + "noticias/");
    await w.lists.getByTitle("Páginas del sitio").items
      .select("ID", "ContentTypeId", "EncodedAbsUrl", "Title", "CanvasContent1", "FechadePublicaci_x00f3_n", "MostrarTitulo")
      .top(3)
      .orderBy("FechadePublicaci_x00f3_n", false)
      .filter("Principal eq 1 and Title ne null and Publicado eq 1")
      .get()
      .then(responses => {
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
            path: dato.EncodedAbsUrl,
            MosTit: dato.MostrarTitulo
          });
        }

      });
      this.setState({ImageUrl:noticias});
      });
    });
  }

  constructor(prop:ICarruselProps, state:IPnpstate ){
    super(prop);
    this.state = {
      ImageUrl: []
    };
  }

  public async componentDidMount(){

    const oContext: IContextInfo = await sp.site.getContextInfo();
    context = oContext.SiteFullUrl  + "/";

    await this.GetDato();
  }

  public render(): React.ReactElement<ICarruselProps> {
    return (
      <div >
        { this.state.ImageUrl.length > 0 && <MybootstrapCarousel bindoutput={this.state} /> }
      </div>
    );
  }
}
const MybootstrapCarousel = (props) => {

  const Bindvalue = props.bindoutput.ImageUrl.map((Outfile) =>{
    
    return <Carousel.Item>
      <div>
        {
          Outfile.MosTit == true ?
            <img style={{height:"300",width:"850"}} className="d-block w-100" src={Outfile.urlimge} alt="Slide" />
            :
            <a href={Outfile.path}>
              <img style={{height:"300",width:"850"}} className="d-block w-100" src={Outfile.urlimge} alt="Slide" />
            </a>
        }
      </div>
      {
        Outfile.MosTit == true ?
          <Carousel.Caption>
            <div className='div-caption' >
              <div className="container-fluid" style={{height: "100px", textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", color: "rgb(255, 255, 255)", textOverflow: "ellipsis", overflow: "hidden"}}>
                <h4>
                  <a style={{color: 'rgb(255, 255, 255)'}} href={Outfile.path}>{Outfile.titulo}</a>
                </h4>
              </div>
            </div>
          </Carousel.Caption>:
          <></>
      }
    </Carousel.Item>
  });
// interval={4000}
  const MAslider = (
    <Carousel interval={4000} indicators={false} nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />}>
      {Bindvalue}
    </Carousel>
  );
  return (
    <>
      {MAslider}
    </>
  );
};
