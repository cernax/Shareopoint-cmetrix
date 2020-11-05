import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ComplementoforoApplicationCustomizerStrings';

const LOG_SOURCE: string = 'ComplementoforoApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IComplementoforoApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ComplementoforoApplicationCustomizer
  extends BaseApplicationCustomizer<IComplementoforoApplicationCustomizerProperties> {

  private _JS: string = "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/foro/SiteAssets/Complemento/foro.js";

  @override
  public onInit(): Promise<void> {

    let articleRedirectScriptTag: HTMLScriptElement = document.createElement("script");
    articleRedirectScriptTag.src = this._JS;
    articleRedirectScriptTag.type = "text/javascript";
    document.body.appendChild(articleRedirectScriptTag);

    return Promise.resolve();
  }
}
