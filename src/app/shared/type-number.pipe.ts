import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeNumber'
})
export class TypeNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      if (value.includes('lote') ) {
        return 'por lotes';
      } else {
        return value.split(',')[0].trim();
      }
    } else {
      return value;
    }
  }

}
