import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datafilterTalent'
})
export class DatafilterTalentPipe implements PipeTransform {

  transform(items: any[], filt: any): any {
    const filter = filt.toLowerCase();
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.value.toLowerCase().indexOf(filter) !== -1);
  }

}
