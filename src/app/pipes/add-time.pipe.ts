import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'addTime'
})
export class AddTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value.time, value.minutes)
    return null;
  }

}
