import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/other/constants';
import { ApiService } from 'src/app/other/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-content-listing',
  templateUrl: './content-listing.component.html',
  styleUrls: ['./content-listing.component.scss']
})
export class ContentListingComponent implements OnInit {

  constructor(private toastr: ToastrService, private apiService: ApiService, private router:Router, private route: ActivatedRoute) { }

  typeSelected:string=null;
  tabSelected:string=null;
  sentToReviewLength:number = 0;
  tabCountObj={    
    'all': 0,
    'completed': 0,
    'draft': 0,
    'review': 0,
  };
  limit = 18;
  offset = 0;

  listing={
    data:[],
    s3Url:[],
    totalList: 0
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
        this.router.navigate(['./artist'],{relativeTo: this.route, queryParams: {'type': 'all'}});
      }
      else if(!results.query['type'])
      {
        this.router.navigate([],{relativeTo: this.route, queryParams: {'type': 'all'}});
      }
      else
      {
        
        this.apiCall(results.params, results.query['type']);
      }
    });

    this.subscription = this.searchTextChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap(search => this.apiService.getApiData(Constants.url[this.urlDetail.urlName]+'?status='+this.tabSelected+'&search='+this.searchText+'&limit='+this.limit+'&offset=0'))
      ).subscribe((response)=>{
        this.listing.data = [];
        this.listing.s3Url = [];
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
        'all': 0,
        'completed': 0,
        'draft': 0,
        'review': 0,
      };
    
      this.listing.data=[];
      this.listing.s3Url=[];
      this.sentToReviewLength=0;
    if(section=='artist')
    {
      this.urlDetail.urlName='getArtistListing';
      this.urlDetail.resDataName='artistData';
      this.getCountsSection('getArtistTabCount');
      //this.getDetail();
    }
    else if(section=='collection')
    {
      this.urlDetail.urlName='getCollectionListing';
      this.urlDetail.resDataName='collectionData';
      
      this.getCountsSection('getCollectionTabCount');
      //this.getDetail();
    } 
    else if(section=='show')
    {
      this.urlDetail.urlName='getShowListing';
      this.urlDetail.resDataName='showData';
      
      this.getCountsSection('getShowTabCount');
      //this.getDetail();
    } 
    else if(section=='individual')
    {
      this.urlDetail.urlName='getIndividualListing';
      this.urlDetail.resDataName='episodeData';
      
      this.getCountsSection('getIndividualTabCount');
      //this.getDetail();
    }     
  }

   // get the counts of artist tabs
  getCountsSection(urlName){
    let url = Constants.url[urlName];
    this.apiService.getApiData(url).subscribe(response =>{
      if(response['status'] == 200)
      {
        this.tabCountObj.all = response['data']['active'] + response['data']['inactive'] + response['data']['draft'] + response['data']['completed'] + response['data']['reviewed'] + response['data']['forReview'] + response['data']['publish'];
        this.tabCountObj.completed = response['data']['completed'];
        this.tabCountObj.draft = response['data']['draft'];
        this.tabCountObj.review = response['data']['reviewed'] + response['data']['forReview'] + response['data']['active'] + response['data']['publish'];
      }
      this.getDetail();
    })
  }

  // get the artist detail for all the tabs
  getDetail(){
    let url = Constants.url[this.urlDetail.urlName]+'?status='+this.tabSelected+'&limit='+this.limit+'&offset='+this.offset;
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
        if(this.searchText == null || this.searchText == ''){
          this.listing.totalList = this.tabCountObj[this.tabSelected]
          if (this.listing.totalList > this.listing.data.length) {
            this.offset = this.offset + this.limit;
          }
        }else{
          this.listing.totalList = 0;
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
  apiSendFoReview(){
    this.saveApiCalling=true;
    let slugArr=[];
    var url = '';
    if(this.typeSelected == 'artist'){
      url = Constants.url.sentArtistToReview;
    } else if(this.typeSelected == 'collection'){
      url = Constants.url.sentCollectionToReview;
    } else if(this.typeSelected == 'show'){
      url = Constants.url.sentShowToReview;
    } else if(this.typeSelected == 'individual'){
      url = Constants.url.sentIndividualToReview;
    }

    this.listing.data.forEach(element=> {
      if(element['reviewChecked'])
        slugArr.push(element['slug'])
    });

    this.apiService.postData(url, {'slug': slugArr}).subscribe(response =>{
      if(response['status'] == 200)
      {
        this.router.navigate([],{relativeTo: this.route, queryParams: {'type': 'review'}});
        this.toastr.success('Send to review successfully.');
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
    this.limit = 18;
    if (event.length > 0) {
      this.limit = 0;
    }

    this.searchTextChanged.next(event);
    
    // this.searchText = event.trim().toLowerCase();
    // this.applyFilter(event);
    // if (event.length === 0) {
    //   this.listing.data=[];
    //   this.listing.s3Url=[];
    // } else {
    //   var search = event.trim(); console.log(search)
    //   if (search.length === 0) {
    //     return false;
    //   }
    // }
    
    // if(this.typeSelected == 'artist'){
    //   this.getDetail(this.tabSelected, 'getArtistListing', 'artistData')
    // } else if(this.typeSelected == 'collection') {
    //   this.getDetail(this.tabSelected, 'getCollectionListing', 'collectionData')
    // } else {
    //   this.getDetail(this.tabSelected, 'getShowListing', 'showData')
    // }
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

}
