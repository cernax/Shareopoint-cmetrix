import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

// import * as strings from 'HelloWorldApplicationCustomizerStrings';

const LOG_SOURCE: string = 'HelloWorldApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloWorldApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class HelloWorldApplicationCustomizer
  extends BaseApplicationCustomizer<IHelloWorldApplicationCustomizerProperties> {

  private _JS: string = "noticias/SiteAssets/Complemento/MyScript.js";
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
