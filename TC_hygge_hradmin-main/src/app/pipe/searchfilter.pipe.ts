import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(filterRecord: any[], searchText: string): any[] {
    if(!filterRecord) return [];

    if(!searchText) return filterRecord;

    return this.searchItems(filterRecord, searchText.toLowerCase());
   }

   private searchItems(items :any[], searchText): any[] {
     let results = [];
      items.forEach(it => {
        if (it.filtername.toLowerCase().includes(searchText)) {
            results.push(it);
        } else {
          let searchResults =  this.searchItems(it.items, searchText);
          if (searchResults.length > 0) {
              results.push({
                filtername: it.filtername,
              });
          }
        }
      });
      return results;
   }
}