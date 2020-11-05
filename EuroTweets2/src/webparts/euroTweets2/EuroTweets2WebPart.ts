import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EuroTweets2WebPartStrings';
import EuroTweets2 from './components/EuroTweets2';
import { IEuroTweets2Props } from './components/IEuroTweets2Props';

export interface IEuroTweets2WebPartProps {
  description: string;
}

export default class EuroTweets2WebPart extends BaseClientSideWebPart <IEuroTweets2WebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEuroTweets2Props> = React.createElement(
      EuroTweets2,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
