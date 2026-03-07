import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFriends',
})
export class SearchFriendsPipe implements PipeTransform {
  transform(arr: any[], term: string): any[] {
    return arr.filter((friend) => friend.name.toLowerCase().includes(term.toLowerCase()));
  }
}
