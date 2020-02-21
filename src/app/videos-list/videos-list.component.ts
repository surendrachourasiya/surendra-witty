import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Constants } from './../other/constants';
import { ApiService } from '../other/services/api.service';
import { UploadFileService } from '../other/services/upload-file.service';
import * as $ from "jquery";


@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideosListComponent implements OnInit {

  public constantImg: any;

  constructor(private apiService: ApiService, private uploadService: UploadFileService) {
    this.constantImg = Constants.image;
    uploadService.uploadStatus.subscribe(value => {
      if (!!value['loaded']) {
        this.uploadList['fileList'][value['objIndex']]['progressPer'] = Math.round((value['loaded'] / value['total']) * 100);
      }
    });
  }

  ngOnInit() {
    // get the video Counts of each section in the list
    this.getVideoCounts()
  }

  s3Url = null;
  searchText = '';

  artistPeripheral = {
    label: 'Artist Story',
    count: 0,
    list: [],
    isToggle: false,
    sliceLimit: 10
  }

  show = {
    label: 'Shows Videos',
    count: 0,
    list: [],
    details: [],
    activeIndex: null,
    activeSeasonIndex: 0,
    isToggle: false,
    sliceLimit: 10
  }

  show_pheripheral = {
    label: 'Shows Pheripheral',
    count: 0,
    list: [],
    isToggle: false,
    sliceLimit: 10
  }

  individual = {
    label: 'Individual Videos',
    count: 0,
    list: [],
    isToggle: false,
    sliceLimit: 10
  }

  collection = {
    label: 'Collection Pheripheral',
    count: 0,
    list: [],
    isToggle: false,
    sliceLimit: 10
  }

  uploadList = {
    fileList: [],
    folderName: null,
    count: 0,
    type: ''
  }

  getVideoCounts() {
    let url = Constants.url.getVideoCount;
    this.apiService.getApiData(url).subscribe(response => {
      if (response['status'] == 200) {
        this['artistPeripheral']['count'] = response['data']['videoCount']['artistPeripheralVideoCount'];
        this['collection']['count'] = response['data']['videoCount']['collectionPeripheralVideoCount'];
        this['individual']['count'] = response['data']['videoCount']['episodeVideoCount'];
        this['show']['count'] = response['data']['videoCount']['showEpisodeVideoCount'];
        this['show_pheripheral']['count'] = response['data']['videoCount']['showPeripheralVideoCount'];
        this.s3Url = response['data']['s3Url'];
      }
    })
  }

  getVideoList(type, searchStr, IsSearched) {

    if (IsSearched == '') {
      $('.arrowButton').removeClass('transRotate');
      this[type]['isToggle'] = !this[type]['isToggle'];
    }

    if (this[type]['list'].length == 0 && this[type]['count'] > 0) {
      let url = Constants.url.getAllVideoDetail + '?limit=10&offset=0&type=' + type;
      if (searchStr != '' && searchStr != undefined) {
        url = url + '&search=' + searchStr;
        this[type]['count'] = 0;
      }

      this.apiService.getApiData(url).subscribe(response => {
        if (response['status'] == 200) {
          if (type == 'artistPeripheral') {
            this[type]['list'] = response['data']['videoData']['artistPeripheral'];
          } else if (type == 'show_pheripheral') {
            this[type]['list'] = response['data']['videoData']['showPeripheral'];
          } else if (type == 'show') {
            this[type]['list'] = response['data']['videoData']['showEpisode'];
          } else if (type == 'individual') {
            this[type]['list'] = response['data']['videoData']['episode'];
          } else if (type == 'collection') {
            this[type]['list'] = response['data']['videoData']['collectionPeripheral'];
          }

          if (searchStr != '' && searchStr != undefined) {
            this[type]['count'] = this[type]['list'].length;
            this[type]['sliceLimit'] = 10;
          }
        }
      })
    }
  }

  getShowDetails(slug, index) {

    this.show.activeIndex = index;
    let url = Constants.url.getShowDetails + '?slug=' + slug;
    this.apiService.getApiData(url).subscribe(response => {
      if (response['status'] == 200) {
        this.show.details = response['data'];
        this.show.activeSeasonIndex = 0;
        // this.show.details['seasonData']= this.show.details['seasonData'].concat(this.show.details['seasonData'][0]);
      }
      console.log(this.show);
    })

  }

  // select the video from the episode and pheripheral
  changeVideo(event, arrayName, i, folderName, type) {
    let files = event.target.files;
    if (files) {
      
      for (let file of files) {
          i++;
          let newFileName = file.name.split('.');
          var lastItem = newFileName.pop();
          let appendStr = '_0' + i;
          if (i > 9) {
            appendStr = '_' + i;
          }
          
          this[arrayName]['fileList'].push({
            file: file,
            name: this.convertToSlug(newFileName[0]) + appendStr + '.' + lastItem,
            fileInitName: this.convertToSlug(newFileName[0]),
            size: file.size,
            type: file.type,
            progressPer: 0,
            status: 'created',
            duration: 0
          });
          
          var j = this[arrayName]['fileList'].length - 1;
          this.validateFile(file, this[arrayName]['fileList'], j);
      }

      if (this[arrayName]['fileList'].length > 0) {
        this[arrayName]['folderName'] = folderName;
        this.initiateMultipleVideosUpload(arrayName, type);
      }

    }
  }

  validateFile(file, currentObj, index) {
    //setTimeout(() => {
      var video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        var duration = Math.round(video.duration);
        currentObj[index].duration = duration;
      }
      video.src = URL.createObjectURL(file);
    //}, 2000);
    
  }

  initiateMultipleVideosUpload(arrayName, type) {

    this[arrayName]['fileList'].forEach((element, index) => {
      this[arrayName]['count']++;
      element.status = 'uploading';
      this.uploadService.uploadFileToBucket(element.file, element.name, this[arrayName]['folderName'], arrayName, index).then(response => {
        if (response) {
          this[arrayName]['count']--;
          this.addVideoItem(element, arrayName, type);
        } else {
          element.status = 'failed';
        }

        if (this[arrayName]['count'] == 0) {
          this.uploadList = { fileList: [], folderName: null, count: 0, type: '' };
        }

      }, error => {
        console.log(error);
      })
    });
  }

  convertToSlug(Text) {
    console.log(Text);
    return Text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '_')
      ;
  }

  addVideoItem(data, arrayName, type) {
    let url = Constants.url.saveVideoDetails;
    var request = {
      "type": type,
      "videoFiles": [
        {
          "sourceLink": data.name,
          "duration": data.duration
        }
      ]
    }

    this.apiService.postData(url, request).subscribe(response => {
      if (response['status'] == 200) {
        data.status = 'success';
        this.getVideoCounts();
        let id = '';
        if (type == 'artist') {
          this.getVideoList('artistPeripheral', '', '');
          id = '#artist-section';
        } else if (type == 'show_pheripheral') {
          this.getVideoList('show_pheripheral', '', '');
          id = '#shows-peripheral-section';
        } else if (type == 'show') {
          this.getVideoList('show', '', '');
          id = '#shows-videos-section';
        } else if (type == 'individual') {
          this.getVideoList('individual', '', '');
          id = '#individual-videos-section';
        } else if (type == 'collection') {
          this.getVideoList('collection', '', '');
          id = '#collection-peripheral-section';
        }

        setTimeout(() => {
          $(id).click();
          $(id + ' .arrowButton').addClass('transRotate');
        }, 2000);
      }
    })
  }

  setSliceLimit(type, count) {
    this[type]['sliceLimit'] = count;
  }

  searchRecord(e) {
    if (e.keyCode == 13) {
      this.artistPeripheral.list = [];
      this.show_pheripheral.list = [];
      this.show.list = [];
      this.individual.list = [];
      this.collection.list = [];

      if (this.searchText == '' || this.searchText == undefined) {
        this.getVideoCounts();
      }

      this.getVideoList('artistPeripheral', this.searchText, 'search');
      this.getVideoList('show_pheripheral', this.searchText, 'search');
      this.getVideoList('show', this.searchText, 'search');
      this.getVideoList('individual', this.searchText, 'search');
      this.getVideoList('collection', this.searchText, 'search');

    }
  }

}