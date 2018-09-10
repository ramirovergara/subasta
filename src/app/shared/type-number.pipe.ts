import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeNumber'
})
export class TypeNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.split(',')[0].trim();
  }

}
