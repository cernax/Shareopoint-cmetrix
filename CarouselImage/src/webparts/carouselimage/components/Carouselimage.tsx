import * as React from 'react';
import { ICarouselimageProps } from './ICarouselimageProps';
import * as $ from 'jquery';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import 'bootstrap/dist/css/bootstrap.min.css';
import { sp, Web, ISearchQuery, SearchResults } from "@pnp/sp/presets/all";
import { IContextInfo } from "@pnp/sp/sites";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

var context;

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};


export interface urlimg {
  url: string;
  nombre: string;
  dir:string;
}

export default class Carouselimage extends React.Component<ICarouselimageProps, any> {

  public constructor(prop) {
    super(prop);
    this.state = {
      loaded: false,
      imageintranet: []
    };
  }
  public async componentDidMount(){

    const oContext: IContextInfo = await sp.site.getContextInfo();
    context = oContext.SiteFullUrl  + "/";
    console.log(context);

    await this.getImage();
  }

  
  public render(): React.ReactElement<ICarouselimageProps> {

    //customRightArrow={<div className="prev-icon"><a>prev</a></div>}
    //customLeftArrow={<div className="next-icon"><a>next</a></div>}

    return (
      <>
          <Carousel responsive={responsive}
          infinite={true}
          customLeftArrow={<div className="prev-icon"><a>Prev</a></div>}
          customRightArrow={<div className="next-icon"><a>Next</a></div>}

          >
            {
            this.state.imageintranet.map( val =>{
              return <>
                <div className="Item-Carousel">
                  <a href={val.dir} style={{cursor: "pointer"}} >
                      <img className="card-img-top" src={val.url} alt={val.nombre} data-themekey="#" />
                  </a>
                  {
                    val.nombre != null ? <div className="card-titulo"><span>{val.nombre}</span></div> : <></>
                  }
              </div></>
            })
            }
          </Carousel>
      </>
    );
  }
  private async getImage() {
    
    let ImagenesCarrusel: urlimg[] = [];

    const w = Web(context);
    await w.lists.getByTitle("ImagenesIntranet").items
      .select("Description", "Title", "Direccion", "Mostrar", "ImageHeight", "ID")
      .orderBy("OrdenNumerico", true)    
      .filter("Mostrar eq 1 and ImageHeight ne null")  
      .get()
      .then(val => {
        console.log(val);
        val.map(resp => {
          var ruta = "";
          console.log(resp);

          var guidlistnoticia;
          if (window.location.href.split("/")[4] == "MundoEuronetDesa")
            guidlistnoticia = "a4267899-fb4b-453d-bb21-84a6f8fd98f6";
          else
            guidlistnoticia = "31d97a6a-0e05-46c6-a524-2e83ed07db7a";

            console.log(guidlistnoticia);
          $.ajax({
              url: context + "_api/Web/Lists(guid'" + guidlistnoticia +"')/Items(" + resp.ID + ")/File",
              type: "GET",
              async: false,
              dataType: "json",
              success: function(t) {
                console.log(t.ServerRelativeUrl)
                  ruta = t.ServerRelativeUrl
              },
              error: function(t) {
                  console.log("Error: " + t)
              }
          }),
          ImagenesCarrusel.push({
              url: "https://euroamerica.sharepoint.com/" + ruta,
              nombre: resp.Title,
              dir: resp.Direccion
          })
      }),
      this.setState({
          imageintranet: ImagenesCarrusel
      })
      });
  }
}
