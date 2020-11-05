import * as React from 'react';
import "@pnp/polyfill-ie11";
import { ISocialProps } from './ISocialProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import {Web} from "@pnp/sp/webs";
import "@pnp/graph/users";
import {FiArrowRightCircle} from 'react-icons/fi';
import * as $ from 'jquery';
import { Spinner } from "react-bootstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { sp, PrincipalSource, PrincipalType } from "@pnp/sp";
import "@pnp/sp/profiles";
import { IContextInfo } from "@pnp/sp/sites";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

var context;

export interface  getparametros {
  id:number;
  created:string;
  Comment:string;
  author:string;
  titulo:string;
  imguser:string;
  url:string;
  contador:number;
}
export interface  getparametrosforo {
  id:number;
  created:string;
  Comment:string;
  author:string;
  titulo:string;
  imguser:string;
  url:string;
  contador:number;
}
export interface  Comments {
  id:number;
  created:string;
  Comment:string;
  author:string;
  titulo:string;
  imguser:string;
  url:string;
  contador:number;
}
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(20),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default class Social extends React.Component<ISocialProps, any> {

  public constructor(prop) {
    super(prop);
    this.state = {
      CommentariosNews:[],
      CommentariosForos:[],
      Comments:[],
      ciclo:0,
      loaded: false,
    };
  }
  public async componentDidMount() {

    const oContext: IContextInfo = await sp.site.getContextInfo();
    context = oContext.SiteFullUrl  + "/";
    //console.log(oContext.FormDigestValue);

    await this.getallscommt();
  }

  public render(): React.ReactElement<ISocialProps> {

    var urlforo;
    if (window.location.href.split("/")[4] == "MundoEuronetDesa")
      urlforo = "foro/Paginas/Foros.aspx";
    else
      urlforo = "Paginas/Foros.aspx";

    return (
      <>
        <h4 role="heading" aria-level={2} className='TituloZona'>Social</h4>
        <div className="card" style={{width: "100%"}}>
          <div className="card-body">
            <div style={{height:"235px", width:"100%", overflowY:"scroll", overflowX:"hidden" }}>
              {
                this.state.ciclo == 0 ?
                  <div style={{textAlign: "center", backgroundColor: "rgba(0, 0, 0, .3)", width:"100%", height:"100%"}}>
                    <div  style={{paddingTop:"13%"}}>
                      <div>
                        <Spinner animation="border" style={{color:"white"}} role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                      <div>
                        <span style={{color:"white"}}>Cargando</span>
                      </div>
                    </div>
                  </div>
                  :
                  this.state.CommentariosForos.map(tit => {
                    return <>
                      <table>
                        <tr style={{height:"5em"}}>
                          <td>
                            <img src={tit.imguser == '' ? context + 'EV7m3pYHdbdKpEbBdhktb6gBpru4QgjOZeTan85DrUFJMA?e=k6bviV': tit.imguser} alt="img user" width="40px" style={{borderRadius:"20px"}} />
                          </td>
                          <td>
                            <a style={{color:'rgb(0, 0, 0)', textDecoration: 'none'}} href={tit.url} >
                              <HtmlTooltip title={<div dangerouslySetInnerHTML={{__html: tit.Comment}}/>}  placement="right" arrow={true} >
                                <div className="Item">
                                  <div className="DivTitulo">
                                    <h5 className="Titulo"  >{tit.titulo} {tit.contador == 0 || tit.contador == null ? <></> : <span>({tit.contador})</span>}</h5>
                                  </div>
                                  <div className="DivCuerpo">
                                    <h6 className="Cuerpo" style={{textOverflow: "ellipsis",overflow: "hidden",height: "12px",display: "-webkit-box", WebkitLineClamp: 1,WebkitBoxOrient: "vertical"}} dangerouslySetInnerHTML={{__html: tit.Comment}}/>
                                  </div>
                                </div>
                              </HtmlTooltip>
                            </a>
                          </td>
                        </tr>
                      </table>
                    </>;
                  })
              }
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <a href={context + urlforo} className="vertodas">Ir al Foro</a>
          </div>
        </div>
      </>
    );
  }
  private async getallscommt(){

    await this.getComments();

    this.setState({ciclo:1});
  }

  private async getComments(): Promise<void> {
    let Foros: getparametrosforo[] = [];

    const w = Web(context);
    const r = await w.lists.getByTitle("Comments").items
      .select("ID", "Body", "Autor", "Title", "Url", "Modified", "TipoComments", "Idrelacionado", "ImagenUsuario", "CantComment")
      .top(15)
      .orderBy("Modified", false)
      .get();

    r.map(async resp => {
      try {

        try {
            var contador = resp.CantComment;
            var Comment = resp.Body;
          Foros.push({
              id: resp.ID,
              created: resp.Created,
              Comment: Comment,
              author: resp.Autor,
              titulo: resp.Title,
              imguser: resp.ImagenUsuario,
              url: resp.Url,
              contador: contador
            });
        } catch (e) {
          console.log(e);
        }

      } catch (e) {
        console.log(e);
      }
    });

    this.setState({CommentariosForos: Foros});

    return Promise.resolve();
  }
}

