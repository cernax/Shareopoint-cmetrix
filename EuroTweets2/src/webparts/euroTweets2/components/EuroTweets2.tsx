import * as React from 'react';
import "@pnp/polyfill-ie11";
import { IEuroTweets2Props } from './IEuroTweets2Props';
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from "@pnp/sp";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Dialog, DialogType} from "office-ui-fabric-react";
import { IContextInfo } from "@pnp/sp/sites";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

var context;

export interface  urlimg {
  descrip: string;
  titulo: string;
}

interface IPnpstate {
  ImageUrl: urlimg[];
}

export default class EuroTweets2 extends React.Component<IEuroTweets2Props, IPnpstate> {

  constructor(prop:IEuroTweets2Props){
    super(prop);
    this.state = {
      ImageUrl: []
    };
  }
  public async componentDidMount() {        
    const oContext: IContextInfo = await sp.site.getContextInfo();
    context = oContext.SiteFullUrl  + "/";
    //console.log(oContext.WebFullUrl);

    this.getDato();

  }

  public render(): React.ReactElement<IEuroTweets2Props> {
    return (<App bindoutput={this.state} />);
  }

  private getDato(): Promise<urlimg[]>{
    return new Promise<urlimg[]>(async (resolve, reject) => {
    let noticias: urlimg[] = [];

    const w = Web(context);
    const r = w.lists.getByTitle("Tweets").items
      .select("ID", "ContentTypeId", "Tweet", "Title", "MostrarEnElHome")
      .top(1)
      .orderBy("Created", false)
      .filter("MostrarEnElHome eq 1")
      .get();

    r.then(responses => {

      responses.map((dato) => {
        noticias.push({descrip: dato.Tweet, titulo: dato.Title});
      });
      this.setState({ImageUrl: noticias});
    });
    });
  }
}
function MyVerticallyCenteredModal(props) {
  return (
    <Dialog hidden={false} isOpen={props.visible} onDismiss={props.ocultar} minWidth={630} title={props.tituloEuro}
            type={DialogType.normal}>
      <p>{props.descripEuro}</p>
    </Dialog>
  );
}
const App = (props) => {
  const [modalShow, setModalShow] = React.useState(false);

  var tit = props.bindoutput.ImageUrl.map((Outfile) => tit = Outfile.titulo);
  var desc = props.bindoutput.ImageUrl.map((Outfile) => desc = Outfile.descrip);

  const Bindvalue = props.bindoutput.ImageUrl.map((Outfile) =>
    <div className="divNoticia" id="divNoticia">
      <a style={{cursor: "pointer"}}  onClick={() => setModalShow(true)}>
        <div>
          <h5>{Outfile.titulo}</h5>
          <p style={{textOverflow: "ellipsis", overflow:"hidden", height: "30px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"}} dangerouslySetInnerHTML={{__html: Outfile.descrip}} />
        </div>
      </a>
    </div>
  );
  return (
    <>
      <span role="heading" aria-level={2} style={{fontSize:"28px", color:"#c00518"}}>EuroTweets</span>
      {Bindvalue}
      <MyVerticallyCenteredModal visible={modalShow} ocultar={() => setModalShow(false)} tituloEuro={tit} descripEuro={desc} />
    </>
  );
};
