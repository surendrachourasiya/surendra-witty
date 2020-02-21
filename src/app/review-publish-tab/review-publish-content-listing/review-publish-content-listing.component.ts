import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/other/constants';
import { ApiService } from 'src/app/other/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-review-publish-content-listing',
  templateUrl: './review-publish-content-listing.component.html',
  styleUrls: ['./review-publish-content-listing.component.scss']
})
export class ReviewPublishContentListingComponent implements OnInit {
  public constantImg:any;
  constructor(private toastr: ToastrService, private apiService: ApiService, private router:Router, private route: ActivatedRoute) {
    this.constantImg = Constants.image;
   }

  typeSelected:string=null;
  tabSelected:string=null;
  sentToReviewLength:number = 0;
  tabCountObj={    
    'artist': 0,
    'collection': 0,
    'show': 0,
    'individual': 0,
  };
  limit = 18;
  offset = 0;

  listing={
    data:[],
    s3Url:[],
    totalList: 0
  };

  publishListing={
    artistData:[],
    showData:[],
    collectionData:[],
    individualData:[],
    s3Url:{}
  };

  sendPublish={
    artist:[],
    show:[],
    collection:[],
    individual:[]
  };

  searchText: string = null;
  public searchTextChanged = new Subject<KeyboardEvent>();
  private subscription: Subscription;

  saveApiCalling:boolean=false;

  ngOnInit() {

    var obsComb = combineLatest(this.route.params, this.route.queryParams)
    .pipe(map(results => ({params: results[0].section, query: results[1]})))
    .subscribe(results => {
      if(!results.params)
      {
        this.router.navigate(['./review'],{relativeTo: this.route, queryParams: {'type': 'artist'}});
      }
      else if(!results.query['type'])
      {
        this.router.navigate([],{relativeTo: this.route, queryParams: {'type': 'artist'}});
      }
      else
      {
        this.apiCall(results.params, results.query['type']);
      }
        // console.log(results.params, results.query.type);
    });

    this.subscription = this.searchTextChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap(search => this.apiService.getApiData(Constants.url[this.urlDetail.urlName]+'?type='+this.tabSelected+'&status='+this.typeSelected+'&search='+this.searchText+'&limit=0&offset=0'))
      ).subscribe((response)=>{
        this.detailResData(response);
      })
  }

  urlDetail={
    urlName: null,
    resDataName: null
  }

  // call API of different section tab on change of url
  apiCall(section, tab){
      this.typeSelected=section;
      this.tabSelected= tab;
      this.tabCountObj={    
        'artist': 0,
        'collection': 0,
        'show': 0,
        'individual': 0,
      };
    
      this.listing.data=[];
      this.listing.s3Url=[];
      this.sentToReviewLength=0;
    if(section=='review')
    {
      this.urlDetail.urlName='getReviewActiveListing';
      this.urlDetail.resDataName='data';
      this.getCountsSection('getReviewAndPublishAndActiveCount');
      // this.getDetail();
    }
    else if(section=='active')
    {
      this.urlDetail.urlName='getReviewActiveListing';
      this.urlDetail.resDataName='data';
      this.getCountsSection('getReviewAndPublishAndActiveCount');
    } 
    else if(section=='publish')
    {
      // this.urlDetail.urlName='getPublishListing';
      // this.urlDetail.resDataName='data';
      // this.getCountsSection('getReviewAndPublishAndActiveCount');
      this.getPublishData();
    }
  }

  getPublishData() {
    let url = Constants.url.getPublishListing;
    this.apiService.getApiData(url).subscribe(response =>{
      if(response['status'] == 200)
      { 
        this.publishListing.artistData = response['data']['artistData'];
        this.publishListing.collectionData = response['data']['collectionData'];
        this.publishListing.showData = response['data']['showData'];
        this.publishListing.individualData = response['data']['individualData'];
        this.publishListing.s3Url = response['data']['s3Url'];
        console.log(response['data']['s3Url'])
      }
    });
  }

   // get the counts of artist tabs
  getCountsSection(urlName){ 
    let url = Constants.url[urlName]+'?type='+this.typeSelected;
    this.apiService.getApiData(url).subscribe(response =>{
      if(response['status'] == 200)
      { 
        this.tabCountObj.artist = response['data']['artistCount'];
        this.tabCountObj.collection = response['data']['collectionCount'];
        this.tabCountObj.show = response['data']['showCount'];
        this.tabCountObj.individual = response['data']['individualCount'];
      }
      this.getDetail();
    })
  }

  // get the artist detail for all the tabs
  getDetail(){
    let url = Constants.url[this.urlDetail.urlName]+'?type='+this.tabSelected+'&status='+this.typeSelected+'&limit='+this.limit+'&offset='+this.offset;
    this.apiService.getApiData(url).subscribe(response =>{
      this.detailResData(response);
    })
  }

  detailResData(response){
    if(response['status'] == 200)
      {
        response['data'][this.urlDetail.resDataName].forEach((element, index) => {
          this.listing.data.push(element);
        });
        this.listing.s3Url= response['data']['s3Url'];
        this.listing.totalList = this.tabCountObj[this.tabSelected]
        
        if(this.listing.totalList > this.listing.data.length){
          this.offset = this.offset + this.limit;
        }
        
        this.listing.data.forEach((element, index) => {
          this.listing.data[index]['reviewChecked']=false;
        });
      }
  }

  // check the status of the active tab as per url
  isActiveSubTab(type): boolean {
      if(this.router.url.includes(type))
      {
        this.tabSelected=type;
        return true;
      } 
      return false;
  }

  // change the active sub tab on click of it
  changeActiveSubTab(type){
    this.searchText = null;
    if( this.tabSelected != type)
    {
      this.listing = {
        data: [],
        s3Url: [],
        totalList: 0
      };
      this.limit = 18;
      this.offset = 0;
      this.tabSelected = type;
      this.router.navigate([], { relativeTo: this.route, queryParams: {'type': type} });
    }
  }

  // select-all/unselect event functionality
  selectAllEvent(status){
    this.listing.data.forEach((element, index) => {
      this.listing.data[index]['reviewChecked']=status;
    });
    if(status)
      this.sentToReviewLength = this.listing.data.length;
    else
      this.sentToReviewLength = 0
  }

  // trigger an event on click of individual checkbox
  indivStatusChange(status, index)
  {
    this.listing.data[index]['reviewChecked']=status;
    if(status)
      this.sentToReviewLength++;
    else
      this.sentToReviewLength--;
  }

  // call an API for send to reivew status ------

  apiMoveToPublish(){
    this.saveApiCalling=true;
    let slugArr=[];
    var url = '';
    if(this.typeSelected == 'review'){
      url = Constants.url.moveToStage;
    }

    this.listing.data.forEach(element=> {
      if(element['reviewChecked'])
        slugArr.push(element['slug'])
    }); 

    this.apiService.postData(url, {'slug': slugArr, 'type': this.tabSelected=='individual'?'episode':this.tabSelected}).subscribe(response =>{
      if(response['status'] == 200)
      {
        this.toastr.success('Send to publish successfully.');
        this.router.navigate([],{relativeTo: this.route});
      }
      else
      {
        this.toastr.error(response['message']);
      }
      this.saveApiCalling=false;
    })
  }

  onSearch(event) {
    this.listing.data=[];
    this.listing.s3Url=[];
    this.searchTextChanged.next(event);
  }

  resetSearch() {
    this.listing = {
      data: [],
      s3Url: [],
      totalList: 0
    };
    this.limit = 18;
    this.offset = 0;
    this.searchText = null;
  }

  loadMoreData(){
    this.getDetail();
  }

  publishNow() {
    let url = Constants.url.publishNow;
    if(this.sendPublish.artist.length > 0 || this.sendPublish.show.length > 0 || this.sendPublish.collection.length > 0 || this.sendPublish.individual.length > 0) {
      this.apiService.postData(url, this.sendPublish).subscribe(response =>{
        if(response['status'] == 200)
        {
          alert("successfully publish");
          this.getPublishData();
        }
      })
    } else {
      alert("please select checkbox");
    }
  }

  onRemoveItem(status, type, slug) {
    
    this.apiService.getApiData(Constants.url.sendToCorrection + '?type='+type+'&status=' + status+'&slug=' + slug).subscribe(response => {
      if (response['status'] == 200 ) {
        let arrName=  type == 'episode'?'individual': type;

        // if(type === 'artist') {
          this.publishListing[arrName+'Data'].filter((item, index) => {
            if(item.slug === slug) {
              this.publishListing[arrName+'Data'].splice(index, 1) 
            }
          })
        // } else if(type === 'show') {
        //   this.publishListing.showData.filter((item, index) => {
        //     if(item.slug === slug) {
        //       this.publishListing.showData.splice(index, 1) 
        //     }
        //   })
        // } else if(type === 'collection') {
        //   this.publishListing.collectionData.filter((item, index) => {
        //     if(item.slug === slug) {
        //       this.publishListing.collectionData.splice(index, 1) 
        //     }
        //   })
        // } else if(type === 'episode') {
        //   this.publishListing.individualData.filter((item, index) => {
        //     if(item.slug === slug) {
        //       this.publishListing.individualData.splice(index, 1) 
        //     }
        //   })
        // }

      }
    })
  }

  

  onEdit(type, slug) {
    if(type=='artist')
      this.router.navigate(['../../update-artist',slug], { relativeTo: this.route });
    else if(type=='collection')
    this.router.navigate(['../../update-collection',slug], { relativeTo: this.route });
    else if(type=='show')
      this.router.navigate(['../../update-show',slug], { relativeTo: this.route });
    else if(type=='individual')
      this.router.navigate(['../../update-individual',slug], { relativeTo: this.route });
  }

  onPublishCheck(type, id, slug, event) {

    if(type == 'artist') { 
      if(event.target.checked) { 
        $('#artist'+id).parent().parent().addClass('active');
        this.sendPublish.artist.push(slug);
      } else {
        this.sendPublish.artist.filter((item, index) => {
          if(item === slug) {
            $('#artist'+id).parent().parent().removeClass('active');
            this.sendPublish.artist.splice(index, 1) 
          }
        })
      }
    } else if(type == 'show') { 
      if(event.target.checked) { 
        $('#show'+id).parent().parent().addClass('active');
        this.sendPublish.show.push(slug);
      } else {
        this.sendPublish.show.filter((item, index) => {
          if(item === slug) {
            $('#show'+id).parent().parent().removeClass('active');
            this.sendPublish.show.splice(index, 1) 
          }
        })
      }
    } else if(type == 'collection') { 
      if(event.target.checked) { 
        $('#collection'+id).parent().parent().addClass('active');
        this.sendPublish.collection.push(slug);
      } else {
        this.sendPublish.collection.filter((item, index) => {
          if(item === slug) {
            $('#collection'+id).parent().parent().removeClass('active');
            this.sendPublish.collection.splice(index, 1) 
          }
        })
      }
    } else if(type == 'individual') { 
      if(event.target.checked) { 
        $('#individual'+id).parent().parent().parent().addClass('active');
        this.sendPublish.individual.push(slug);
      } else {
        this.sendPublish.individual.filter((item, index) => {
          if(item === slug) {
            $('#individual'+id).parent().parent().parent().removeClass('active');
            this.sendPublish.individual.splice(index, 1) 
          }
        })
      }
    }
  }

}
