import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-video-detail-card',
  templateUrl: './video-detail-card.component.html',
  styleUrls: ['./video-detail-card.component.scss']
})
export class VideoDetailCardComponent implements OnInit {

  constructor() { }

  @Input() videoDetail;
  @Input() videoThumbnail;

  ngOnInit() { }

}
