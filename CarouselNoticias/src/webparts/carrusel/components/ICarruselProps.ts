export interface ICarruselProps {
  path:string;
  description: string;
  link:string;
  title:string[];
  ImageUrl: string[];
}

import {urlimg} from "./Carrusel";

export interface IPnpstate {
  ImageUrl: urlimg[];
}
