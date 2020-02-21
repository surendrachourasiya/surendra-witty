import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormatter'
})
export class timeFormatter implements PipeTransform {

  transform(input: any, args?: any): any {
    if (Number.isNaN(input)) {
      return 0;
    }

    let hours = Math.floor(input / 3600);
    input %= 3600;
    let minutes = Math.floor(input / 60);
    let seconds = input % 60;

    var min = '';
    if (minutes < 10) {
      min = '0' + minutes;
    } else {
      min = minutes.toString();
    }
    
    var sec = '';
    if(seconds < 10){
      sec = '0' + seconds;
    }else{
      sec = seconds.toString();
    }

    if(hours > 0)
      return hours + ':' + min+':'+sec;

    return min+':'+sec;
  }

}