import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NewsmoreviewWebPartStrings';
import Newsmoreview from './components/Newsmoreview';
import { INewsmoreviewProps } from './components/INewsmoreviewProps';

export interface INewsmoreviewWebPartProps {
  description: string;
}

export default class NewsmoreviewWebPart extends BaseClientSideWebPart <INewsmoreviewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewsmoreviewProps> = React.createElement(
      Newsmoreview,
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
