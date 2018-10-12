import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byLotes'
})
export class ByLotesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.includes('lote')) {
      return value;
    }
    return null;
  }

}
