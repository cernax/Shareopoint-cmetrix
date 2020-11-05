import * as React from 'react';
import { ICalendarProps } from './ICalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {FcCalendar} from 'react-icons/fc';
import { IconContext } from "react-icons";
import 'bootstrap/dist/css/bootstrap.min.css';


export default class Calendar extends React.Component<ICalendarProps, {}> {
  public render(): React.ReactElement<ICalendarProps> {

    var dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sabado'];
    var hoy = new Date();

    const options = { month: "long" };
    var customFecha = new Intl.DateTimeFormat("es-ES", options).format(hoy);
    var date = hoy.getDate().toString().length == 2 ? hoy.getDate() : "0" + hoy.getDate() ;
    // console.log("0" + hoy.getDate() );

    return (<>
          <div className="container" style={{textAlign:"center"}}>
            <span role="heading" aria-level={2} style={{fontSize:"28px", color:"#c00518"}}>{customFecha}</span>
            <div>
              <div style={{paddingTop: "31px", paddingLeft:'40.5%', fontSize: "12px",fontWeight: "bold", position:"absolute"}} >{dias[hoy.getUTCDay()]}</div>
              <div style={{paddingTop: "45px",paddingLeft:'40%', fontSize: "40px", fontWeight: "bold", position:"absolute"}}>{date}</div>
            </div>
          </div>
        </>
    );
  }
}
