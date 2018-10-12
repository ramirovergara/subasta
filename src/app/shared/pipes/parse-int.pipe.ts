import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseInt'
})
export class ParseIntPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return parseInt(value.split('.').join(''));
    } else {
      return '---';
    }
  }

}
