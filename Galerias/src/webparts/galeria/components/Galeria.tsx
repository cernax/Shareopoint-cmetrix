import * as React from 'react';
import { IGaleriaProps } from './IGaleriaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";
import {Web} from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files/web";
import { IFile } from "@pnp/sp/files";
import * as $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import {Dialog, DialogType, DialogFooter} from "office-ui-fabric-react";

sp.setup({
  // set ie 11 mode
  ie11: true,
});


export interface  getGaleria {
  img:string;
  titulo:string;
  urlarchivos:string;
}
export interface  getImgEvent {
  num:number;
  img:string;
}

export default class Galeria extends React.Component<IGaleriaProps, any> {

  public constructor(prop) {
    super(prop);
    this.state = {
      imagenes:[],
      boolShow:false,
      imgEvent:[]
    };

  }

  public componentDidMount() {
    this.getGaleria();
  }


  public render(): React.ReactElement<IGaleriaProps> {
    let event;
    return (
      <>
      <div className="row row-cols-3">
        <div className='col' style={{marginBottom:"3%"}}>
        {
          this.state.imagenes.map( (res) =>{
            event = <>
            <div style={{width:"20rem", cursor:"pointer"}}  onClick={() => this.openModal(true,res.urlarchivos)}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={res.img} height="210px" />
                <Card.Body>
                  <Card.Title>{res.titulo}</Card.Title>
                </Card.Body>
              </Card>
            </div>
            <Dialog className='Contenedor-popup' hidden={false} isOpen={this.state.boolShow} onDismiss={() => this.openModal(false,res.urlarchivos)}   title="Escribe tu saludo" minWidth={630} type={DialogType.normal}>
              <div className='Formulario-popup'>
                {
                  this.state.imgEvent.map( (res) =>{
                    
                    return(<>
                      {
                      res.num == 0 ? 
                      <div className="carousel-item active"> 
                        <img className='d-block w-100' src={res.img} alt='First slide' style={{height:'750px'}} />
                      </div> 
                      :
                      <div className="carousel-item">
                        <img className='d-block w-100' src={res.img} alt='First slide' style={{height:'750px'}} />
                      </div>
                      }
                    </>
                    ) 
                  })
                }                
              </div>
            </Dialog>
            </>
            return event;
          })
        }
        </div>
      </div>
      </>
    );
  }
  private async getGaleria(): Promise<getGaleria[]> {
    return new Promise<getGaleria[]>(async (resolve, reject) => {
      let galerias: getGaleria[] = [];

      const w = Web("https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/galerias/");
      const items = await w.lists.getByTitle("Imágenes").items
        .select("ID", "Portada", "Created")
        .filter("Portada eq 1")
        .orderBy("Created", false)
        .get()
        console.log(items);
      items.map( async (val) =>{            	
        var img  = "";
        var titulo = "";
        var urlarchivos	="/sites/MundoEuronetDesa/galerias/PublishingImages/";
           
     await $.ajax({
					url: "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/galerias/_api/Web/Lists(guid'766430fb-4535-45f8-b744-71357cef5d80')/Items(" + val.ID + ")/File",
					type: "GET",
					async: true,
					dataType: 'json',	
					success: function(dataimg){					
						try
						{
							img  = "https://euroamerica.sharepoint.com" + dataimg.ServerRelativeUrl;
							titulo = dataimg.ServerRelativeUrl.split('/')[5];
              urlarchivos = urlarchivos + titulo;
              
              galerias.push({
                img:img,
                titulo:titulo,
                urlarchivos:urlarchivos
              });
						}
						catch(e)
						{
							console.log(e);
						}
          },	
					error: function (error){
						console.log("Error: " + error.message);
          }   
        });	
        
        this.setState({imagenes: galerias});
      });

      resolve(galerias);
    });
  }
  private openModal = (estShow, urlEvent): Promise<getImgEvent[]>  => {
    return new Promise<getImgEvent[]>(async (resolve, reject) => {
      let imgEvents: getImgEvent[] = [];
      if(estShow == true)
      {
        $.ajax({
        url: "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/galerias/_api/Web/GetFolderByServerRelativePath(decodedurl='" + urlEvent + "')/Files",
        type: "GET",
        async: false,
        dataType: 'json',	
        success: function(data){
          var response = data.value;				
          try
          {
            for(var x = 0; x < response.length; x++)
            {    
              imgEvents.push({
                num:x,
                img:"https://euroamerica.sharepoint.com" + response[x].ServerRelativeUrl
              });
            }
          }
          catch(e)
          {
            console.log(e);
          }
        },	
        error: function (error){
          console.log("Error: " + error.message);
        }
      });	
      }
      this.setState({boolShow: estShow, imgEvent: imgEvents});
      resolve(imgEvents);
    });
  }
}
