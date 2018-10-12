import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noApply'
})
export class NoApplyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 999999999) {
      return 'No aplica';
    }
    return value;
  }

}
