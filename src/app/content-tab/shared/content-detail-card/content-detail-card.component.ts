import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Constants } from 'src/app/other/constants';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-content-detail-card',
  templateUrl: './content-detail-card.component.html',
  styleUrls: ['./content-detail-card.component.scss']
})
export class ContentDetailCardComponent implements OnInit, OnChanges {

  public constantImg:any;
  changeText: boolean;
  constructor(private router: Router, private route: ActivatedRoute) { 
    this.constantImg = Constants.image;
    this.changeText =false;
  }

  @Input() type;
  @Input() s3Url;
  @Input() detail;
  @Input() reviewChecked;
  @Output() indivCheckStatus = new EventEmitter<boolean>();

  currentUrl:string=null;

  ngOnInit() {
    if(this.route['_routerState'].snapshot.url.match('review-publish')) {
      this.currentUrl = 'review-publish';
    } else if(this.route['_routerState'].snapshot.url.match('content')) {
      this.currentUrl = 'content';
    }
  }

  ngOnChanges(){
    // this.reviewChecked = true;
  }

  checkUncheck(status)
  {
    this.reviewChecked=status;
    this.indivCheckStatus.emit(status);
  }

  // redirect as per the condition
  onEdit(slug,type, status) {
  if( (this.currentUrl =='content' && (status=='draft' || status=='completed')) || (this.currentUrl =='review-publish' && (status=='forReview' || status=='reviewed')) )
    if(type=='artist')
      this.router.navigate(['../../update-artist',slug], { relativeTo: this.route });
    else if(type=='collection')
    this.router.navigate(['../../update-collection',slug], { relativeTo: this.route });
    else if(type=='show')
      this.router.navigate(['../../update-show',slug], { relativeTo: this.route });
    else if(type=='individual')
      this.router.navigate(['../../update-individual',slug], { relativeTo: this.route });
  }


}
