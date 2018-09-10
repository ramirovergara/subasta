import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type'
})
export class TypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.trim() === 'JUDICIAL EN VIA DE APREMIO') {
      return 'Apremio';
    } else if (value.trim() === 'JUDICIAL VOLUNTARIA') {
      return 'Voluntaria';
    } else if ('JUDICIAL CONCURSAL') {
      return 'Concursal';
    }
    return value;
  }

}
