import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/other/services/api.service';
import { Constants } from 'src/app/other/constants';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { UploadFileService } from 'src/app/other/services/upload-file.service';
import * as bootstrap from "bootstrap";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video-binding-popup',
  templateUrl: './video-binding-popup.component.html',
  styleUrls: ['./video-binding-popup.component.scss']
})
export class VideoBindingPopupComponent implements OnInit, OnChanges {

  @Input() type;
  @Input() seasonIndex;
  @Input() listing;
  @Input() selectedListing;
  @Input() s3Url;
  @Input() showPopUp;
  @Input() selectedLang;
  @Input() activePopupTab;
  @Input() indvArtistList;
  @Output() updateEpisodeList = new EventEmitter<{}>();

  combineListing=[];
  searchText = '';

  elementPush={
    'episode': false,
    'peripheral': false
  }

  activeTab=0;
  totalVideoChecked=0;
  vForm: FormGroup;
  
  videoList:[];
  copyVideoList = [];
  generatedSlug: string[] = [];

  public constantImg:any;

  constructor(private toastr: ToastrService, private apiService:ApiService, private uploadService: UploadFileService, private fb: FormBuilder) {
    this.constantImg=Constants.image;
    
    uploadService.uploadStatus.subscribe(value => {
      if(!!value['loaded'] && !!value['objName']['type'])
      {
        this.detailFields(this.selectedLang).value[value['objName']['index']][value['objName']['name']]['progPer']= (value['loaded']/value['total'])*100;
        // this.selectedImages[value['objName']].progPer= (value['loaded']/value['total'])*100;
      } 
    });
  }

  ngOnChanges(){
    this.activeTab=this.activePopupTab;
    this.initFunction();
    
  }

  ngOnInit() {
    this.vForm = new FormGroup({
        'english' : new FormGroup({
          'details': this.fb.array([]),
        }),
        'hindi' : new FormGroup({
          'details': this.fb.array([]),
        })
    });

    this.initFunction();
  }

  initFunction(){
    // combining both arrays
    
      this.listing.forEach((element, index) => {
        if(element.isUsed)
        {
          this.listing.splice(index, 1);
        }
      });
      
      this.combineListing=[];
      this.combineListing.push(...this.listing,...this.selectedListing);
      this.copyVideoList = JSON.parse(JSON.stringify(this.combineListing));

    this.totalVideoChecked=0;
    if(this.activePopupTab == 1)
      this.creatingDetailForm();
    else 
      this.countTotalVideoChecked();
  }

  nextToDetailSection(){
    this.activeTab=1;

    this.clearFormArray(this.detailFields('english'));
    this.clearFormArray(this.detailFields('hindi'));
    this.totalVideoChecked=0;
    
    this.creatingDetailForm();
  }

  countTotalVideoChecked(){
    this.totalVideoChecked=0;
    this.combineListing.forEach((element) => {  
      if(element.isUsed){ 
        this.totalVideoChecked++;
      }
    });  
  }
  // creating form builder for detail form
  creatingDetailForm(){
    this.combineListing.forEach((element, index) => {  
      if(element.isUsed){    
        this.totalVideoChecked++;
        this.detailFields('english').push(
          this.detailsFormBuilder(element, 'english')
        );
        this.detailFields('hindi').push(
          this.detailsFormBuilder(element, 'hindi')
        );                
      }
    });
  }   


  // seasong field array
  detailFields(lang) {
    return this.vForm.get(lang+'.details') as FormArray;
  }
  
  // create default season form builder
  detailsFormBuilder(element, lang) {
    if(this.type.videoType=='episode')
    {
      // set artist list
      if(element[lang]['artistList'].length > 0){
        element[lang]['artistList'].map((item) => {
          return item['display'] = item['name']
        })
      }

      if(this.type.screeType=='collection')
      {
        return this.fb.group
             ({
               _id: 0,
               title: new FormControl(element[lang].title, [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]),
               description: new FormControl(element[lang].description, [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
               square: new FormGroup({
                 'sourceLink':  new FormControl(''),
                 'fileName':  new FormControl(!!element[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?element[lang]['thumbnail']['square']['ratio1']['sourceLink']:null, [Validators.required]),
                 'imgUrl':  new FormControl(!!element[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['episodePath']+Constants.image.squareSmall+element[lang]['thumbnail']['square']['ratio1']['sourceLink']:''),
                 'progPer': new FormControl(null),
                 'status': new FormControl(!!element[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?'success':'empty')
               }),
               horizontal_large: new FormGroup({
                 'sourceLink':  new FormControl(''),
                 'fileName':  new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:null, [Validators.required]),
                 'imgUrl':  new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['episodePath']+Constants.image.horizontalSmall+element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:''),
                 'progPer': new FormControl(null),
                 'status': new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?'success':'empty')
               }),
               vertical: new FormGroup({
                 'sourceLink':  new FormControl(''),
                 'fileName':  new FormControl(!!element[lang]['thumbnail']['vertical']['ratio1']['sourceLink']==true?element[lang]['thumbnail']['vertical']['ratio1']['sourceLink']:null, [Validators.required]),
                 'imgUrl':  new FormControl(!!element[lang]['thumbnail']['vertical']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['episodePath']+Constants.image.verticalSmall+element[lang]['thumbnail']['vertical']['ratio1']['sourceLink']:''),
                 'progPer': new FormControl(null),
                 'status': new FormControl(!!element[lang]['thumbnail']['vertical']['ratio1']['sourceLink']==true?'success':'empty')
               }),
               horizontal_small: new FormGroup({
                 'sourceLink':  new FormControl(''),
                 'fileName':  new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio3']['sourceLink']==true?element[lang]['thumbnail']['horizontal']['ratio3']['sourceLink']:null, [Validators.required]),
                 'imgUrl':  new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio3']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['episodePath']+Constants.image.horizontalSmall+element[lang]['thumbnail']['horizontal']['ratio3']['sourceLink']:''),
                 'progPer': new FormControl(null),
                 'status': new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio3']['sourceLink']==true?'success':'empty')
               }),
               tempThumbnail:element.tempThumbnail,
               randomOrder: element.randomOrder,
               artistList:new FormControl(element[lang]['artistList'], [Validators.required]),
               duration:new FormControl(element['duration']),
               sourceLink:new FormControl(element['sourceLink']),
               hlsSourceLink:new FormControl(element['hlsSourceLink']),
               slug:new FormControl(element['slug'], [Validators.required]),
               viewCount:new FormControl(element['viewCount'])
             })
      }
      else if(this.type.screeType=='show')
      {
        return this.fb.group
             ({
               _id: 0,
               title: new FormControl(element[lang].title, [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]),
               description: new FormControl(element[lang].description, [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
               square: new FormGroup({
                 'sourceLink':  new FormControl(''),
                 'fileName':  new FormControl(!!element[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?element[lang]['thumbnail']['square']['ratio1']['sourceLink']:null, [Validators.required]),
                 'imgUrl':  new FormControl(!!element[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['episodePath']+Constants.image.squareSmall+element[lang]['thumbnail']['square']['ratio1']['sourceLink']:''),
                 'progPer': new FormControl(null),
                 'status': new FormControl(!!element[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?'success':'empty')
               }),
               horizontal_large: new FormGroup({
                 'sourceLink':  new FormControl(''),
                 'fileName':  new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:null, [Validators.required]),
                 'imgUrl':  new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['episodePath']+Constants.image.horizontalSmall+element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:''),
                 'progPer': new FormControl(null),
                 'status': new FormControl(!!element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?'success':'empty')
               }),
               tempThumbnail:element.tempThumbnail,
               randomOrder: element.randomOrder,
               artistList:new FormControl(element[lang]['artistList'], [Validators.required]),
               duration:new FormControl(element['duration']),
               sourceLink:new FormControl(element['sourceLink']),
               hlsSourceLink:new FormControl(element['hlsSourceLink']),
               slug:new FormControl(element['slug'], [Validators.required]),
               viewCount:new FormControl(element['viewCount'])
             })
      }
    }
    else
    {
      return this.fb.group
           ({
             id: !!element.id==true?element.id:0,
             type: element.type,
             title: new FormControl(element[lang].title, [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]),
             horizontal_large: new FormGroup({
               'sourceLink':  new FormControl(''),
               'fileName':  new FormControl(!!element[lang]['thumbnail']['horizontal']['sourceLink']==true?element[lang]['thumbnail']['horizontal']['sourceLink']:null, [Validators.required]),
               'imgUrl':  new FormControl(!!element[lang]['thumbnail']['horizontal']['sourceLink']==true?this.s3Url['basePath']+this.s3Url[this.type.screeType+'Path']+Constants.image.horizontalSmall+element[lang]['thumbnail']['horizontal']['sourceLink']:''),
               'progPer': new FormControl(null),
               'status': new FormControl(!!element[lang]['thumbnail']['horizontal']['sourceLink']==true?'success':'empty')
             }),
             tempThumbnail:element.tempThumbnail,
             duration:new FormControl(element['duration']),
             sourceLink:new FormControl(element['sourceLink']),
             hlsSourceLink:new FormControl(element['hlsSourceLink']),
             viewCount:new FormControl(element['viewCount']),
             selectedPeripheralStatus:new FormControl(element.selectedPeripheralStatus)
           })
    }
  }

  // addDetailFields(lang) {
  //   if(this.detailFields(lang).length < 5)
  //   {
  //     this.detailFields(lang).push(this.detailsFormBuilder);
  //     // this.seasonDetail[lang].selectedTab=this.detailFields(lang).length-1;
  //     console.log(this.detailFields)
  //   }      
  // }

   // clear all arrays from the formArray for both invoice formula and donation
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length > 0) {
      formArray.removeAt(0)
    }
  }

  // remove video from the list
  // removeVideo(type, index, item){
  //   console.log(type,index, item);
    
  // }

  // create slug and check the slug type
  checkSlugApi(index){
    let reqSlug='';
    if(this.type.videoType=='episode')
    {
      if(!this.detailFields('english').value[index]['slug'])
      {
        if(this.detailFields(this.selectedLang).controls[index]['controls']['title'].valid)
        {
          reqSlug = this.convertToSlug(this.detailFields('english').value[index]['title']);
          if(this.generatedSlug.indexOf(reqSlug) > -1){
            this.toastr.info('Title already exist.');
            return false;
          }

          this.apiService.getApiData(Constants.url.checkSlug+'?type='+this.type.videoType+'&slug='+reqSlug).subscribe(response =>{
            if(response['status'] == 200 && response['data']['exists']==false)
            {
              this.generatedSlug.push(reqSlug);
              this.detailFields('english')['controls'][index].patchValue({
                'slug': reqSlug
              });
              this.detailFields('hindi')['controls'][index].patchValue({
                'slug': reqSlug
              });
            }
            else{
              this.toastr.info(response['message']);
            }
          });
        }
      }
    }
  }

  // slug convertor
  convertToSlug(text)
  {
      return text
          .toLowerCase()
          .replace(/\s\s+/g, ' ')
          .replace(/ +/g,'-');
  }

  checkUncheck(event, index){
    this.combineListing[index].isUsed=event.srcElement.checked;
    if(event.srcElement.checked)
      this.totalVideoChecked++;
    else
    {
      this.totalVideoChecked--;
      let videotype= this.type.videoType == 'episode'?'episode': this.type.screeType+'-peripheral';

      // call remove API on unchecked
      this.apiService.getApiData(Constants.url.removeVideo+'?type='+videotype+'&sourceLink='+ this.combineListing[index]['sourceLink']).subscribe(response =>{
        if(response['status'] != 200)
        {
          this.totalVideoChecked++;
          this.combineListing[index].isUsed=true;
        }
      });
    }

  }

  // add artist to hindi lang
  addArtistToOther(tag:any, formIndex){
    let artistHinIndex = this.indvArtistList['hindi'].findIndex(x=>(x.slug == tag.slug));
    if(artistHinIndex > -1)
    {
      let value = this.detailFields('hindi')['controls'][formIndex]['controls']['artistList'].value;
      value.push(this.indvArtistList['hindi'][artistHinIndex])

      this.detailFields('hindi')['controls'][formIndex].patchValue({
        'artistList': value
      });
    }
  }

  // remove artist to other lang
  removeArtistToOther(tag:any, formIndex){
    let otherLang = this.selectedLang == 'english'?'hindi':'english';

    let value = this.detailFields('hindi')['controls'][formIndex]['controls']['artistList'].value;
    let valueIndex = value.findIndex(x => x.slug == tag.slug);
    value.splice(valueIndex, 1);

    this.detailFields(otherLang)['controls'][formIndex].patchValue({
      'artistList': value
    });
  }

  // change image function and api call 
  changeImage(event, objName, index, widthRatio, heightRatio){
    if (event.target.files.length === 0)
      return;

    let file = event.target.files[0];

    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message = "Only images are supported.";
      return;
    }
    
    var reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      this.detailFields(this.selectedLang).controls[index]['controls'][objName].setControl('imgUrl', new FormControl(reader.result));
      var self = this;

      // check dimensions
      this.checkImageDimension(_event, self, widthRatio, heightRatio,function (res) {
        if(res)
        {
          let imageParamsName = self.type.videoType == 'episode'?'episode': self.type.screeType;
      
          self.detailFields(self.selectedLang).value[index][objName]['status']='uploading';
          self.detailFields(self.selectedLang).controls[index]['controls'][objName].setControl('fileName', new FormControl(null, [Validators.required]));
          let imageFileName = imageParamsName+'Image-'+Date.now()+'.'+file.name.split('.')[1];
      
          // call an API for image formats
          self.uploadService.uploadSingleFile(file, imageFileName, imageParamsName, {'index':index, 'name':objName, 'type':'popup'}).then( response =>{
            if(response)
            {
              // API call for uploading/change image
              self.apiService.getApiData(Constants.url.uploadImage+'?type='+imageParamsName+'&format='+objName+'&imageName='+imageFileName).subscribe(response =>{
                if(response['status'] == 200)
                {
                  self.detailFields(self.selectedLang).controls[index]['controls'][objName].setControl('fileName', new FormControl(imageFileName, [Validators.required]));
                  self.detailFields(self.selectedLang).value[index][objName]['status'] = 'success';
                }
                else
                  self.detailFields(self.selectedLang).value[index][objName]['status'] = 'failed';
              });
            } 
            else
            {
              self.detailFields(self.selectedLang).value[index][objName]['status'] = 'failed';
            }
          }, error =>{
            self.detailFields(self.selectedLang).value[index][objName]['status'] = 'failed';
          })
        }
        else
        {
          self.detailFields(self.selectedLang).value[index][objName]['status'] = 'failed';
          self.toastr.info("Image aspect ratio should be " + widthRatio +':'+ heightRatio);
        }
      });
    }
    
  }

  // check and validate the image dimesions
  checkImageDimension(e, classObj, widthRatio, heightRatio, callback){
    var isValid = false;
    var image = new Image();
    image.src = e.target['result'];
    image.onload = function (): any {
      
      if ((image.width*heightRatio/widthRatio) === (image.height)) {
        isValid = true;
        callback(isValid);
      }else{
        callback(isValid);
      }
    };
  }

  closePopUp()
  {
    $('#video_modal'+this.type.videoType+this.seasonIndex).modal('hide');
  }

  // create an array
  addVideoToShow(){
    let newReqData=[];
    
    let hinArr = this.detailFields('hindi').value;
    this.detailFields('english').value.forEach((element, index) => {
      if(this.type.videoType=='episode')
      {
        if(this.type.screeType == 'collection')
        {
          newReqData.push({
            duration: element.duration,
            tempThumbnail:false,
            randomOrder: element.randomOrder,
            english: {
             title: element.title,
             description: element.description,
             artistList: element.artistList,
             thumbnail: {
                horizontal:{
                  ratio1:{ gradient:'', sourceLink:element.horizontal_large.fileName },
                  ratio2:{ gradient:'', sourceLink:'' },
                  ratio3:{ gradient:'', sourceLink:element.horizontal_small.fileName }
                },
                square:{ ratio1:{ gradient:'', sourceLink:element.square.fileName } },
                vertical:{ ratio1:{ gradient:'', sourceLink:element.vertical.fileName } }
              }
            },
            hindi: {
              title: hinArr[index].title,
              description: hinArr[index].description,
              artistList: hinArr[index].artistList,
              thumbnail: {
                horizontal:{
                  ratio1:{ gradient:'', sourceLink:hinArr[index].horizontal_large.fileName },
                  ratio2:{ gradient:'', sourceLink:'' },
                  ratio3:{ gradient:'', sourceLink:hinArr[index].horizontal_small.fileName }
                },
                square:{ ratio1:{ gradient:'', sourceLink:hinArr[index].square.fileName } },
                vertical:{ ratio1:{ gradient:'', sourceLink:hinArr[index].vertical.fileName } }
              }
            },
            hlsSourceLink: element.hlsSourceLink,
            isUsed: true,
            slug: element.slug,
            sourceLink: element.sourceLink,
            viewCount: element.viewCount
          })
        }
        else if(this.type.screeType == 'show')
        {
          newReqData.push({
            duration: element.duration,
            tempThumbnail:false,
            randomOrder: element.randomOrder,
            english: {
             title: element.title,
             description: element.description,
             artistList: element.artistList,
             thumbnail: {
                horizontal:{
                  ratio1:{ gradient:'', sourceLink:element.horizontal_large.fileName },
                  ratio2:{ gradient:'', sourceLink:'' },
                  ratio3:{ gradient:'', sourceLink:'' }
                },
                square:{ ratio1:{ gradient:'', sourceLink:element.square.fileName } },
                vertical:{ ratio1:{ gradient:'', sourceLink:'' } }
              }
            },
            hindi: {
              title: hinArr[index].title,
              description: hinArr[index].description,
              artistList: hinArr[index].artistList,
              thumbnail: {
                horizontal:{
                  ratio1:{ gradient:'', sourceLink:hinArr[index].horizontal_large.fileName },
                  ratio2:{ gradient:'', sourceLink:'' },
                  ratio3:{ gradient:'', sourceLink:'' }
                },
                square:{ ratio1:{ gradient:'', sourceLink:hinArr[index].square.fileName } },
                vertical:{ ratio1:{ gradient:'', sourceLink:'' } }
              }
            },
            hlsSourceLink: element.hlsSourceLink,
            isUsed: true,
            slug: element.slug,
            sourceLink: element.sourceLink,
            viewCount: element.viewCount
          })
        }
      }
      else if(this.type.videoType=='peripheral')
      {
        newReqData.push({
          id:!!element.id==true?element.id:Math.floor((Math.random() * 1000) + 1),
          type:element.type,
          isUsed:true,
          sourceLink: element.sourceLink,
          hlsSourceLink: element.hlsSourceLink,
          viewCount: element.viewCount,
          duration: element.duration,
          tempThumbnail:false,
          selectedPeripheralStatus: element.selectedPeripheralStatus,
          english:{
            title: element.title,
            thumbnail: { 
              horizontal:{ sourceLink:element.horizontal_large.fileName },
              square:{ sourceLink:'' },
              vertical:{ sourceLink:''}
            }
          },
          hindi:{
            title: hinArr[index].title,
            thumbnail: {
              horizontal:{ sourceLink:hinArr[index].horizontal_large.fileName },
              square:{ sourceLink:'' },
              vertical:{ sourceLink:'' }
            }
          }
        })
      }
    });    
    this.updateEpisodeList.emit(newReqData);
    
    $('#video_modal'+this.type.videoType+this.seasonIndex).modal('hide');
  }

   // Custom validtor to avoid empty spaces.
   public noWhitespaceValidator(control: FormControl) 
   {
     let isWhitespace = !(control.value === null || control.value === '' || control.value === undefined) && (control.value).trim().length === 0; 
     let isValid = !isWhitespace; 
     return isValid ? null : { 'whitespace': true }; 
   }


   videoSearch(event){
    if (event.length > 0) {
      var arr = JSON.parse(JSON.stringify(this.copyVideoList));
      var str = event.replace(/\s+/g, '-').toLowerCase();
      this.combineListing = []
      arr.forEach((genre, index) => {
        let subName = genre.sourceLink.replace(/\s+/g, '-').toLowerCase();
        let subName1 = genre.english.title.replace(/\s+/g, '-').toLowerCase();
        if (subName.includes(str) || subName1.includes(str)) {
          this.combineListing.push(genre);
        }
      })
    } else {
      this.combineListing = JSON.parse(JSON.stringify(this.copyVideoList));
    }
  }


}
