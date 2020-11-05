import * as React from 'react';
import { IEurotvProps } from './IEurotvProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Eurotv extends React.Component<IEurotvProps, {}> {
  public render(): React.ReactElement<IEurotvProps> {
    return (
      <>
        <div>
          <a href="https://web.microsoftstream.com/group/3f065195-887f-48a3-8811-6b6e4e8ec1cf?view=highlights&referrer=https:%2F%2Feuroamerica.sharepoint.com%2Fsites%2FMundoEuronetDesa">
            <img src="https://euroamerica.sharepoint.com/:i:/s/MundoEuronetDesa/EQ52wMHfgJ9Kr31rmdKgeuUBi4srbGL7b2WLCQa2OACnsg?e=FyMLAh" className="img-fluid" alt="Eurotv" />
          </a>
        </div>
      </>
    );
  }
}
