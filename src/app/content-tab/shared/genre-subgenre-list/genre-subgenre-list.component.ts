import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-genre-subgenre-list',
  templateUrl: './genre-subgenre-list.component.html',
  styleUrls: ['./genre-subgenre-list.component.scss']
})
export class GenreSubgenreListComponent implements OnInit {

  constructor() { }

  allGenreList={
    allListData:[],
    checkedCount:0
  }

  genreSearchText = '';
  
  @Input() genreList;
  @Input() selectedData;
  @Input() langType;
  @Output() updateGenreList = new EventEmitter<{}>();

  @Input() seasonIndex;

  copyGenreObj = [];
  list = [];
  ngOnInit() {
    // set the checked/unchecked value   
    this.list = []; 
    this.allGenreList.checkedCount=this.selectedData.length;
    if(this.selectedData!=undefined){
      this.genreList.forEach((subGenreList, main_index) => {
        this.list.push({ parentIndex: 0, childIndex: 0,'_id': subGenreList['_id'], 'name': subGenreList['name'], 'genreId': subGenreList['id'], 'hinName': subGenreList['hindiName'], 'checked': false, 'isHeading': true });

        subGenreList['subgenre'].forEach((element, gIndex) => {
          element['isHeading'] = false;
          element['parentIndex'] = main_index;
          element['childIndex'] = gIndex;
          if(this.selectedData.length > 0)
          {
            for(let x of this.selectedData) 
            { 
              if( x['id'] === element._id)
              {
                //subGenreList['subgenre'][gIndex]['checked']=true;
                element['checked'] = true;
                break;
              }
              else
                element['checked']=false;
            }
          }
          else{
            element['checked']=false;
          }

          this.list.push(element);

        });

      });
    }
    this.copyGenreObj = JSON.parse(JSON.stringify(this.list));


    // update the form data
    this.closeModal();    
  }

  checkUncheck(status, gIndex, index, listIndex)
  {
    this.genreList[gIndex]['subgenre'][index]['checked']=status;
    this.copyGenreObj[listIndex]['checked']=status;

    if(status)
      this.allGenreList.checkedCount++;
    else 
      this.allGenreList.checkedCount--;
    
  }

  closeModal(){
    let dGenreList={
      'english':[],
      'hindi':[]
    };
    let dSubGenreList={
      'english':[],
      'hindi':[]
    };
    
    this.genreList.forEach(subGenreList => {
      let count=0;
      subGenreList['subgenre'].forEach(element => {
        if(element['checked']==true)
        {
          count++;
          dSubGenreList['english'].push({
            'id':element._id,
            'name': element.name
          })
          dSubGenreList['hindi'].push({
            'id':element._id,
            'name': element.hinName
          })
        }
      });    
      if(count>0)        
      {
        dGenreList['english'].push({
          'id':subGenreList.id,
          'name': subGenreList.name
        })
        dGenreList['hindi'].push({
          'id':subGenreList.id,
          'name': subGenreList.hindiName
        })
      }
    });
    
    this.updateGenreList.emit({ dGenreList, dSubGenreList });
  }

  genreSearch(event){
    if (event.length > 0) {
      var arr = JSON.parse(JSON.stringify(this.copyGenreObj));;
      var str = event.replace(/\s+/g, '-').toLowerCase();
      this.list = [];
      arr.forEach((genre, index) => {
        let subName = genre.name.replace(/\s+/g, '-').toLowerCase();
        if (subName.includes(str) || genre.checked || genre.isHeading) {
          this.list.push(genre);
        }
      })
    } else {
      this.list = JSON.parse(JSON.stringify(this.copyGenreObj));
    }
  }
}
