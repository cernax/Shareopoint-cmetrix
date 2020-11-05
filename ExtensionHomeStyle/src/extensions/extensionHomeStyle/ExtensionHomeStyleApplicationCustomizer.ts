import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ExtensionHomeStyleApplicationCustomizerStrings';

const LOG_SOURCE: string = 'ExtensionHomeStyleApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IExtensionHomeStyleApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ExtensionHomeStyleApplicationCustomizer
  extends BaseApplicationCustomizer<IExtensionHomeStyleApplicationCustomizerProperties> {

  private _JS: string = "SiteAssets/Complemento/archivocss.js";
  
  @override
  public onInit(): Promise<void> {
    var context;
    if(window.location.href.split("/")[4] == "MundoEuronetDesa")
      context = window.location.href.substring(0,58);
    else
      context = window.location.href.substring(0,49);

    let articleRedirectScriptTag: HTMLScriptElement = document.createElement("script");
    articleRedirectScriptTag.src = context + this._JS;
    articleRedirectScriptTag.type = "text/javascript";
    document.body.appendChild(articleRedirectScriptTag);


    return Promise.resolve();
  }
}
