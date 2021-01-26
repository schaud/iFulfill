import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
}
export function enumSelector(definition) {
  return Object.keys(definition)
    .map(key => ({ value: definition[key], title: key }));
}
