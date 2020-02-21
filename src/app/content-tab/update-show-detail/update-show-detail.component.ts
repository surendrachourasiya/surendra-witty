import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/other/services/api.service';
import { Constants } from 'src/app/other/constants';
import { UploadFileService } from 'src/app/other/services/upload-file.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update-show-detail',
  templateUrl: './update-show-detail.component.html',
  styleUrls: ['./update-show-detail.component.scss']
})
export class UpdateShowDetailComponent implements OnInit {

  public constantImg:any;

  constructor(private toastr: ToastrService, private apiService:ApiService, private fb: FormBuilder, private uploadService: UploadFileService, private router:Router, private route: ActivatedRoute) {
    this.constantImg = Constants.image;

    uploadService.uploadStatus.subscribe(value => {
      if(!!value['loaded'] && !value['objName']['type'])
      {
        this.seasonFields(this.selectedLang).value[value['objName']['index']][value['objName']['name']]['progPer']= (value['loaded']/value['total'])*100;
      }
    });
  }

  tForm: FormGroup;
  viewDataLoaded=false;
  selectedLang:string='english';
  currentUrl = '';
  userData = { "_id": "", "email": "", "roleId": 0, "firstName": "", "lastName": "", "lastLogin": "" };

  labels=[
    {
      'english':'new',
      'hindi': 'नया'
    },
    {
      'english':'viral',
      'hindi': 'वायरल'
    },
    {
      'english':'trending',
      'hindi': 'चर्चा में'
    }
  ]

  videoList={
    'activePopupTab':0,
    all:{
      'collectionVideo':[],
      'peripheralVideo':[],
      'showcollectionVideo': false,
      'showperipheralVideo': false,
      'dataLoadedCollection': false,
      'dataLoadedPeripheral': false,
    },
    season:[],
    's3Url':{}
  };

  individualArtistList={
    'english':[],
    'hindi':[]
  };

  showArtistList={
    'english':[],
    'hindi':[]
  }

  s3Url={};
  storedData={
    'english':{
      'status': 'draft',
      "thumbnail": {
        "horizontal": {
            "ratio1": {"sourceLink": null, "gradient": null },
            "ratio2": { "sourceLink": null, "gradient": null },
            "ratio3": { "sourceLink": "", "gradient": "" }
        },
        "vertical": { "ratio1": { "sourceLink": null, "gradient": null} },
        "square": { "ratio1": { "sourceLink": null, "gradient": null } }
      }
    },
    'hindi':{
      'status': 'draft',
      "thumbnail": {
        "horizontal": {
            "ratio1": {"sourceLink": null, "gradient": null },
            "ratio2": { "sourceLink": null, "gradient": null },
            "ratio3": { "sourceLink": "", "gradient": "" }
        },
        "vertical": { "ratio1": { "sourceLink": null, "gradient": null} },
        "square": { "ratio1": { "sourceLink": null, "gradient": null } }
      }
    }
  }

  formType:string='add';
  formStatus={
    'english': false,
    'hindi': false
  }
  
  storeDetail={
    'slug':null,
    'english':{
      '_id': 0
    },
    'hindi':{
      '_id': 0
    }
  }

  allGenreList={
    season:[],
    showGenre:false,
    allListData:[],
    // selectedData:[],
    // formData:{}
  }

  categoryList=[];
  categoryFormArray={
    'english': new FormArray([]),
    'hindi': new FormArray([])
  }
  
  selectedImages = {
    "horizontal_large": {
        file: null,
        progPer: null,
        imgURL: null,
        status: 'empty',
        sourceLink: null
    },
    "square": {
      file: null,
      progPer: null,
      imgURL: null,
      status: 'empty',
      sourceLink: null
    }
  }

  seasonDetail={
    'english':{
      selectedTab: 0
    },
    'hindi':{
      selectedTab: 0
    }
  }

  imageGradientColor={
    season:[]
  };

  ngOnInit() {
    this.tForm = new FormGroup({
        'english' : new FormGroup({
            '_id': new FormControl(''),
            'slug': new FormControl('', [Validators.required]),
            'title': new FormControl('', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
            'description' : new FormControl('', [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
            'language':new FormControl('', [Validators.required]),
            'categoryList' : new FormArray([]),
            'metaTitle' : new FormControl('', [Validators.maxLength(50)]),
            'metaKeyword': new FormControl([]),
            'metaDescription': new FormControl('', [Validators.maxLength(500), this.noWhitespaceValidator]),
            'seasons': this.fb.array([this.seasonDefaultFieldFormBuilder('english', 1)]),
            'randomOrder': new FormControl(0)
        }),
        'hindi' : new FormGroup({
            '_id': new FormControl(''),
            'slug': new FormControl('', [Validators.required]),
            'title': new FormControl('', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
            'description' : new FormControl('', [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
            'language':new FormControl('', [Validators.required]),
            'categoryList' : new FormArray([]),
            'metaTitle' : new FormControl('', [Validators.maxLength(50)]),
            'metaKeyword': new FormControl([]),
            'metaDescription': new FormControl('', [Validators.maxLength(500), this.noWhitespaceValidator]),
            'seasons': this.fb.array([this.seasonDefaultFieldFormBuilder('hindi', 1)]),
            'randomOrder': new FormControl(0)
        })
    });
    
    // subscribtion for form validation
    this.tForm.valueChanges.subscribe(result => {
        this.validateForm();
    });

    this.route.params.subscribe(params => {
      if(!!params['slug'])
      {
        this.formType='edit';
        this.storeDetail.slug=params['slug'];
      }
    });
    
    // API call for category and genre sub-genre listing
    this.getCategoryList();
    
    this.getArtistList();
    this.getVideoList('episode', 'collectionVideo');
    this.getVideoList('peripheral', 'peripheralVideo');

    this.getGenreList();

    // set userData from local storage
    var retrievedObject = localStorage.getItem('userdata');
    this.userData = JSON.parse(retrievedObject);

    // get current URL
    if(this.route['_routerState'].snapshot.url.match('dashboard/review-publish')) {
      this.currentUrl = 'review-publish';
    } else if(this.route['_routerState'].snapshot.url.match('dashboard/content')) {
      this.currentUrl = 'content';
    }
  }

  updateGenreToOTher(event, seasonIndex){
    this.allGenreList.season['season'+seasonIndex]['formData']=event;
    this.allGenreList.season['season'+seasonIndex]['selectedData']=event['dSubGenreList']['english'];
  }
  
  // seasong field array
  seasonFields(lang) {
    return this.tForm.get(lang+'.seasons') as FormArray;
  }
  
  // clear all arrays from the formArray for both invoice formula and donation
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length > 0) {
      formArray.removeAt(0)
    }
  }
  
  // create default season form builder
  seasonDefaultFieldFormBuilder(lang, seasonIndex) {
      this.allGenreList.season['season'+seasonIndex]={
        selectedData:[],
        formData:{}
      }

      this.videoList.season['season'+seasonIndex]={
        'collectionVideo':[],
        'peripheralVideo':[]
      }

      this.imageGradientColor.season['season'+seasonIndex]={
        'english':[],
        'hindi':[]
      }
    
      return  this.fb.group
               ({
                 _id: null,
                 slug: new FormControl(null, [Validators.required]),
                 title: new FormControl(null, [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
                 description: new FormControl(null, [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
                 label : new FormControl('', [Validators.required]),
                 categoryList : _.cloneDeep(this.categoryFormArray[lang]),
                 tags:new FormControl([], [Validators.required]),
                 gradient:new FormControl('#ffffff'),
                 horizontal_large:new FormGroup({
                  'sourceLink':  new FormControl(''),
                  'fileName':  new FormControl(null, [Validators.required]),
                  'imgUrl':  new FormControl(''),
                  'progPer': new FormControl(null),
                  'status': new FormControl('empty')
                 }),
                 square: new FormGroup({
                  'sourceLink':  new FormControl(''),
                  'fileName':  new FormControl(null, [Validators.required]),
                  'imgUrl':  new FormControl(''),
                  'progPer': new FormControl(null),
                  'status': new FormControl('empty')
                }),
               })
  }

  // create default season form builder
  seasonFieldFormBuilder(element, lang) {
    return  this.fb.group
             ({
               _id: element._id,
               slug: new FormControl(element.slug, [Validators.required]),
               title: new FormControl(element.title, [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
               description: new FormControl(element.description, [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
               label : new FormControl(this.setLabelValueIntoForm(lang, element.label), [Validators.required]),
               categoryList : _.cloneDeep(this.categoryFormArray[lang]),
               tags:new FormControl(!!element['tags'] == true ? element['tags'].split(',') : [], [Validators.required]),
               gradient:new FormControl(element.thumbnail.horizontal.ratio1.gradient),
               horizontal_large:new FormGroup({
                'sourceLink':  new FormControl(''),
                'fileName':  new FormControl(!!element['thumbnail']['horizontal']['ratio1']['sourceLink']==true?element['thumbnail']['horizontal']['ratio1']['sourceLink']:null, [Validators.required]),
                'imgUrl':  new FormControl(!!element['thumbnail']['horizontal']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['showPath']+Constants.image.horizontalSmall+element['thumbnail']['horizontal']['ratio1']['sourceLink']:''),
                'progPer': new FormControl(null),
                'status': new FormControl(!!element['thumbnail']['horizontal']['ratio1']['sourceLink']==true?'success':'empty')
               }),
               square: new FormGroup({
                'sourceLink':  new FormControl(''),
                'fileName':  new FormControl(!!element['thumbnail']['square']['ratio1']['sourceLink']==true?element['thumbnail']['square']['ratio1']['sourceLink']:null, [Validators.required]),
                'imgUrl':  new FormControl(!!element['thumbnail']['square']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['showPath']+Constants.image.squareSmall+element['thumbnail']['square']['ratio1']['sourceLink']:''),
                'progPer': new FormControl(null),
                'status': new FormControl(!!element['thumbnail']['square']['ratio1']['sourceLink']==true?'success':'empty')
              }),
             })
 }

  //  add season field 
  addSeasonFields(lang) {
    let seasonLength = this.seasonFields('english').length;
    if(seasonLength < 5)
    {
      this.seasonFields('english').push(this.seasonDefaultFieldFormBuilder('english', seasonLength));
      this.seasonDetail['english'].selectedTab=seasonLength;

      this.seasonFields('hindi').push(this.seasonDefaultFieldFormBuilder('hindi', seasonLength));
      this.seasonDetail['hindi'].selectedTab=seasonLength;

      this.allGenreList.season['season'+(seasonLength+1)]={
        selectedData:[],
        formData:{}
      }

      this.videoList.season['season'+(seasonLength+1)]={
        'collectionVideo':[],
        'peripheralVideo':[]
      }

      this.imageGradientColor.season['season'+(seasonLength+1)]={
        'english':[],
        'hindi':[]
      }

    }      
  }

  // deleteSeasonFields(lang, index) {
  //   if(this.seasonFields(lang).length > 1)
  //   {
  //     if(this.seasonFields(lang).value[index]['season_id']==null)
  //       this.seasonFields(lang).removeAt(index);
  //     else
  //     {
  //       this.seasonFields(lang).value[index]['is_removed'] = 1;
  //       this.seasonFields(lang).removeAt(index);
  //     }
  //   }
  // }

   // Custom validtor to avoid empty spaces.
   public noWhitespaceValidator(control: FormControl) 
   {
     let isWhitespace = !(control.value === null || control.value === '' || control.value === undefined) && (control.value).trim().length === 0; 
     let isValid = !isWhitespace; 
     return isValid ? null : { 'whitespace': true }; 
   }

  // copy artist language in both the arrays
  copyDataFromOneLangToOther(fieldName){
    let value = this.tForm.get(this.selectedLang+'.'+fieldName).value;
    if(this.selectedLang =='english')
      this.tForm.patchValue({
        'hindi':{
          [fieldName]: value
        }
      })
    else
      this.tForm.patchValue({
        'english':{
          [fieldName]: value
        }
      })
  }

  // copy season data from one language to another
  copySeasonDataFromOneLangToOther(fieldName, seasonIndex){    
    let value = this.seasonFields(this.selectedLang).value[0][fieldName];

    if(this.selectedLang =='english')
      this.seasonFields('hindi')['controls'][seasonIndex].patchValue({
        [fieldName]: value
      });
    else
      this.seasonFields('english')['controls'][seasonIndex].patchValue({
        [fieldName]: value
      });
  }

  // copy category data from one language to another
  copyCategoryDataToAnother(seasonIndex){
    let enValue = this.seasonFields('english')['controls'][seasonIndex]['controls']['categoryList'].value
    let hinValue = this.seasonFields('hindi')['controls'][seasonIndex]['controls']['categoryList'].value
    hinValue.forEach((element, index) => {
      if(this.selectedLang == 'english')
        hinValue[index].checked= enValue[index].checked;
      else
        enValue[index].checked= hinValue[index].checked;
    });
    
    if(this.selectedLang =='english')
      this.seasonFields('hindi')['controls'][seasonIndex].patchValue({
        'categoryList': hinValue
      });
    else
      this.seasonFields('english')['controls'][seasonIndex].patchValue({
        'categoryList': enValue
      });
  }

  setImageColor(color, seasonIndex){
    if (this.selectedLang == 'english'){
      this.seasonFields('english')['controls'][seasonIndex].patchValue({
        'gradient': color
      });
    }else{
      this.seasonFields('hindi')['controls'][seasonIndex].patchValue({
        'gradient': color
      });
    }
  }

  // change Show image function and api call 
  changeShowImage(event, objName, index, widthRatio, heightRatio){
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
      this.seasonFields(this.selectedLang).controls[index]['controls'][objName].setControl('imgUrl', new FormControl(reader.result));
      var self = this;

      // check dimensions
      this.checkImageDimension(_event, self, widthRatio, heightRatio,function (res) {
        if(res)
        {
          let imageParamsName = 'show';
          self.seasonFields(self.selectedLang).value[index][objName]['status']='uploading';
          self.seasonFields(self.selectedLang).controls[index]['controls'][objName].setControl('sourceLink', new FormControl(''));
          self.seasonFields(self.selectedLang).controls[index]['controls'][objName].setControl('fileName', new FormControl(null, [Validators.required]));
      
          let imageFileName = imageParamsName+'Image-'+Date.now()+'.'+file.name.split('.')[1];
      
          self.uploadService.uploadSingleFile(file, imageFileName, imageParamsName, {'index':index, 'name':objName}).then( response =>{
            if(response)
            {
              // API call for uploading/change image
              self.apiService.getApiData(Constants.url.uploadImage+'?type='+imageParamsName+'&format='+objName+'&imageName='+imageFileName).subscribe(response =>{
                if(response['status'] == 200)
                {
                  self.seasonFields(self.selectedLang).controls[index]['controls'][objName].setControl('fileName', new FormControl(imageFileName, [Validators.required]));
                  self.seasonFields(self.selectedLang).value[index][objName]['status'] = 'success';

                  if(objName == 'square') {
                    self.imageGradientColor.season['season'+(index+1)][self.selectedLang] = response['data']['gradientColor'];
                  }

                  console.log(self.imageGradientColor.season);
                }
                else
                  self.seasonFields(self.selectedLang).value[index][objName]['status'] = 'failed';
              });
            } 
            else
            {
              self.seasonFields(self.selectedLang).value[index][objName]['status'] = 'failed';
            }
          }, error =>{
            self.seasonFields(self.selectedLang).value[index][objName]['status'] = 'failed';
          })
        }
        else
        {
          self.seasonFields(self.selectedLang).value[index][objName]['status'] = 'failed';
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
      console.log((image.width*heightRatio/widthRatio) ,image.height);
      
      if ((image.width*heightRatio/widthRatio) === (image.height)) {
        isValid = true;
        callback(isValid);
      }else{
        callback(isValid);
      }
    };
  }

  // check slug of show title
  checkSlugApi(){
    let reqSlug='';
    if(!this.storeDetail.english._id)
    {
      if(this.tForm.get('english.title').valid)
      {
        reqSlug = this.convertToSlug(this.tForm.get('english.title').value);
        this.apiService.getApiData(Constants.url.checkSlug+'?type=show&slug='+reqSlug).subscribe(response =>{
          if(response['status'] == 200)
          {
            if(!response['data']['exists'])
            {
              this.storeDetail.slug = reqSlug;
  
              this.tForm.patchValue({
                'english':{
                  'slug': reqSlug
                }
              })
              this.tForm.patchValue({
                'hindi':{
                  'slug': reqSlug
                }
              })
            }
            else
            {
              this.storeDetail.slug = '';
  
              this.tForm.patchValue({
                'english':{
                  'slug': ''
                }
              })
              this.tForm.patchValue({
                'hindi':{
                  'slug': ''
                }
              })
            }

            this.tForm.get('english.slug').markAllAsTouched();
            this.tForm.get('hindi.slug').markAllAsTouched();
          }
        });
      }
    }
  }

  checkSeasonSlugApi(seasonIndex){
    let reqSlug='';
    if(this.tForm.get('english.slug').invalid)
    {
      this.tForm.get('english.title').markAllAsTouched();
      this.tForm.get('hindi.title').markAllAsTouched();

      alert('Please enter the show title first');
      return;
    }

    if(!this.seasonFields('english')['controls'][seasonIndex].value._id)
    {
      if(this.seasonFields('english')['controls'][seasonIndex]['controls']['title'].valid)
      {
        reqSlug = this.tForm.get('english.slug').value +'-'+ this.convertToSlug(this.seasonFields('english')['controls'][seasonIndex]['controls']['title'].value);
        
        this.apiService.getApiData(Constants.url.checkSlug+'?type=season&slug='+reqSlug).subscribe(response =>{
          if(response['status'] == 200)
          {
            // this.storeDetail.slug = reqSlug;
            if(response['data']['exists']==false)
            {
              this.seasonFields('english')['controls'][seasonIndex].patchValue({
                'slug': reqSlug
              });
  
              this.seasonFields('hindi')['controls'][seasonIndex].patchValue({
                'slug': reqSlug
              });
            }
            else
            {
              this.seasonFields('english')['controls'][seasonIndex].patchValue({
                'slug': ''
              });
  
              this.seasonFields('hindi')['controls'][seasonIndex].patchValue({
                'slug': ''
              });
            }

            this.seasonFields('english')['controls'][seasonIndex]['controls']['slug'].markAllAsTouched();
            this.seasonFields('hindi')['controls'][seasonIndex]['controls']['slug'].markAllAsTouched()

            // console.log(this.seasonFields('english')['controls'][seasonIndex]['controls']['slug'].touched, !this.seasonFields('english')['controls'][seasonIndex]['controls']['slug'].value);
          }
        });
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

  // get genre list
  getGenreList(){
      this.apiService.getApiData(Constants.url.getGenreSubGenreList).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.allGenreList.allListData=response['data']['genreSubGenre'];
          // call if slug is available
          this.viewShowDetail(this.storeDetail.slug);
        }
      });
  }

  // get Artist Video list
  getArtistList(){
    this.apiService.getApiData(Constants.url.getIndividualArtistListing).subscribe(response =>{
      if(response['status'] == 200)
      {
        // this.individualArtistList=response['data']['artistData'];
        response['data']['artistData'].map((item) => {
          if(item.displayLanguage == 'en'){
            return this.individualArtistList['english'].push({'id':item._id, 'name': item.firstName +' '+item.lastName, 'order': 0, 'city': item.city, 'profilePic':item.profilePic, 'slug': item.slug, 'status': item.status })
          }
          else
          {
            return this.individualArtistList['hindi'].push({'id':item._id, 'name': item.firstName +' '+item.lastName, 'order': 0, 'city': item.city, 'profilePic':item.profilePic, 'slug': item.slug, 'status': item.status})
          }
        })
      }
    });
  }

  // manage Popup of videoList
  showHideVideoListPopup(type, seasonIndex){
    this.videoList.all.showperipheralVideo=false;
    this.videoList.all.showcollectionVideo=false;
    if(type == 'peripheral')
    {
      this.videoList.all.showperipheralVideo = true;
    }
    else
    {
      this.videoList.all.showcollectionVideo  = true;
    }
    
    this.videoList.activePopupTab=0;
    setTimeout(() => {
      $('#video_modal'+type+seasonIndex).modal('show')
    }, 500);
  }

  // update episode/peripheral data came from the video popup
  updateEpisodeData(type, values, seasonIndex, index){
    if(type == 'episode')
    {
      this.videoList.season[seasonIndex].collectionVideo = values;
      this.videoList.all.showcollectionVideo=false;  
      
      // console.log( this.videoList.season[seasonIndex].collectionVideo);
      
      this.videoList.season[seasonIndex].collectionVideo.forEach(element => {
        element['english'].artistList.forEach(tElem => {
          let arrayIndex=-1;
          if(!!this.showArtistList['english'][index])
            arrayIndex = this.showArtistList['english'][index].findIndex(x=>x.slug == tElem.slug);
          else
            this.showArtistList['english'][index]=[];

          if(arrayIndex == -1)
          {
            this.showArtistList['english'][index].push(tElem);
          }
        });

        element['hindi'].artistList.forEach(tElem => {
          let arrayIndex=-1;
          if(!!this.showArtistList['hindi'][index])
            arrayIndex = this.showArtistList['hindi'][index].findIndex(x=>x.slug == tElem.slug);
          else
            this.showArtistList['hindi'][index]=[];

          if(arrayIndex == -1)
          {
            this.showArtistList['hindi'][index].push(tElem);
          }
        });
      });
      
    }
    else
    {
      this.videoList.season[seasonIndex].peripheralVideo = values;
      this.videoList.all.showperipheralVideo=false;
    }

    this.validateForm();
  } 

   // remove video from the list
   removeVideo(type, index, item, seasonIndex){
    this.apiService.getApiData(Constants.url.removeVideo+'?type='+type+'&sourceLink='+item['sourceLink']).subscribe(response =>{
      if(response['status'] == 200)
      {
        if(type == 'episode')
        {
          this.videoList.season[seasonIndex].collectionVideo[index]['isUsed']=false;
          let pushedItem = this.videoList.season[seasonIndex].collectionVideo[index];
          this.videoList.season[seasonIndex].collectionVideo.splice(index, 1);
          this.videoList.all.collectionVideo.push(pushedItem);
        }
        else
        {
          this.videoList.season[seasonIndex].peripheralVideo[index]['isUsed']=false;
          let pushedItem = this.videoList.season[seasonIndex].peripheralVideo[index];
          this.videoList.season[seasonIndex].peripheralVideo.splice(index, 1);
          this.videoList.all.peripheralVideo.push(pushedItem);
        }
      }
    });
  }

  // get video list
   getVideoList(type, arrName){
    
    this.videoList['all']['show'+arrName]=false;
    this.apiService.getApiData(Constants.url.getShowVideoList+'?type='+type).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.videoList['s3Url']=response['data']['s3Url'];
          this.s3Url=response['data']['s3Url'];

          if(type == 'peripheral')
          {
            this.videoList.all.dataLoadedPeripheral=true;
            response['data']['showVideo'].forEach(element => {   
              this.videoList.all[arrName].push({
                type:element.type,
                isUsed:false,
                sourceLink: element.sourceLink,
                hlsSourceLink: element.hlsSourceLink,
                viewCount: 0,
                duration: element.duration,
                tempThumbnail: element.thumbnail,
                selectedPeripheralStatus:false,
                english:{
                  title: '',
                  thumbnail: {
                    horizontal:{ sourceLink:''}, square:{ sourceLink:''},vertical:{ sourceLink:''}
                  }
                },
                hindi:{
                  title: '',
                  thumbnail: {
                    horizontal:{ sourceLink:''}, square:{ sourceLink:''},vertical:{ sourceLink:''}
                  }
                }
              })
            });
          }
          else
          {
            response['data']['showVideo'].forEach(element => {   
              this.videoList.all.collectionVideo.push({
                isUsed:false,
                sourceLink: element.sourceLink,
                hlsSourceLink: element.hlsSourceLink,
                viewCount: 0,
                slug :element.slug,
                duration: element.duration,
                tempThumbnail:element.thumbnail,
                randomOrder: 0,
                english:{
                  title: '',
                  description: '',
                  artistList: [],
                  thumbnail: { 
                    horizontal:{ ratio1:{ gradient:'', sourceLink:''},
                      ratio2:{ gradient:'', sourceLink:''},
                      ratio3:{ gradient:'', sourceLink:''}
                    },
                    square:{  ratio1:{ gradient:'', sourceLink:''} },
                    vertical:{  ratio1:{ gradient:'', sourceLink:''} }
                  }
                },
                hindi:{
                  title: '',
                  description: '',
                  artistList: [],
                  thumbnail: { 
                    horizontal:{ ratio1:{ gradient:'', sourceLink:''},
                      ratio2:{ gradient:'', sourceLink:''},
                      ratio3:{ gradient:'', sourceLink:''}
                    },
                    square:{  ratio1:{ gradient:'', sourceLink:''} },
                    vertical:{  ratio1:{ gradient:'', sourceLink:''} }
                  }
                }
              })
            });

            this.videoList.all.dataLoadedCollection = true;
          }

        }
      });
  }

  // get category list
  getCategoryList(){
    this.apiService.getApiData(Constants.url.getCategoryList).subscribe(response =>{
        if(response['status'] == 200)
        {
          let newData=[];
          let categorySlugs = [];
            for(let element of response['data']['categories']) 
            {
              var indexVal = categorySlugs.indexOf(element.slug);
              if(indexVal == -1){
                let obj = {}
                obj['slug']=element.slug;
                if(element.language === 'en'){
                  obj['english']={'id': element._id, 'name': element.name};
                }else{
                  obj['hindi']={'id': element._id, 'name': element.name};
                }
                newData.push(obj);
                categorySlugs.push(element.slug);
              }else{
                if(element.language === 'en'){
                  newData[indexVal]['english']={'id': element._id, 'name': element.name};
                }else{
                  newData[indexVal]['hindi']={'id': element._id, 'name': element.name};
                }
              }
            }
          
            newData.forEach((o, i) => {
              this.categoryFormArray['english'].push(this.fb.group
                ({
                  checked: new FormControl(null),
                  slug: o.slug,
                  id: o['english'].id,
                  name: o['english'].name
                })
              );
              this.categoryFormArray['hindi'].push(this.fb.group
                ({
                  checked: new FormControl(null),
                  slug: o.slug,
                  id: o['hindi'].id,
                  name: o['hindi'].name
                })
              );
            });
                
            if(this.formType == 'add')
            {
              this.clearFormArray(this.seasonFields('english'));
              this.clearFormArray(this.seasonFields('hindi'));
  
              this.seasonFields('english').push(
                this.seasonDefaultFieldFormBuilder('english', 1)
              );
  
              this.seasonFields('hindi').push(
                this.seasonDefaultFieldFormBuilder('hindi', 1)
              );
            }

            // this.seasonFields('english')['controls'][0].patchValue({
            //   'categorList': this.categoryFormArray['english']
            // })
            
            this.categoryList=newData;  

            // console.log(this.seasonFields('english').value)
            
        }
      });
  }

  // view show detail
  viewShowDetail(slug){
    if(!!slug)
    {
      let url = Constants.url.viewShowDetail+'?slug='+slug;
      this.apiService.getApiData(url).subscribe(response =>{
        if(response['status'] == 200)
        {
          if(!!response['data']['showData'])
          {
            console.log(response['data']);
            
            let resdata=this.storedData=response['data']['showData'];
            this.s3Url=response['data']['s3Url'];
            
            // genre and sub genre
            // response['data']['seasonData']['english'].forEach((element, index) => {
            //   this.allGenreList.season.push({'selectedData': index==0?resdata['english']['subGenreList']:element['genreList']});  
            // });
            // console.log(this.allGenreList.season);
            
            // store id and slug detail
            this.storeDetail.english._id=resdata['english']['_id'];
            this.storeDetail.hindi._id=resdata['hindi']['_id'];
            this.storeDetail.slug=resdata['english']['slug'];
            
            this.setValueIntoForm('english', resdata);
            this.setValueIntoForm('hindi', resdata);

            // this.setValueOfCategoryList('english', resdata['english']['categoryList'], 0);


            // this.setImagesIntoForm('english',  resdata);
            // this.setLabelValueIntoForm('english',  resdata);
            
            this.clearFormArray(this.seasonFields('english'));
            this.clearFormArray(this.seasonFields('hindi'));
            
            // set values into season form builder --------------------------
            // response['data']['seasonData']['english'].forEach(element => {
            //   this.seasonFields('english').push(
            //     this.seasonFieldFormBuilder(element, 'english')
            //   );
            // });
            

            // season form builder and video data
            response['data']['seasonData']['english'].forEach((seasonElement, seasonIndex) => {
              // set values into season form builder for english --------------------------
              this.seasonFields('english').push(
                this.seasonFieldFormBuilder(seasonElement, 'english')
              );

              // set value category list
              this.setValueOfCategoryList('english', seasonIndex==0?resdata['english']['categoryList']:seasonElement['categoryList'], seasonIndex);

              // genre and sub-genre
              this.allGenreList.season['season'+seasonElement.order]={'selectedData': seasonIndex==0?resdata['english']['subGenreList']:seasonElement['genreList'], 'formData':{}};  

              // episode video data for english and hindi both
              let hinSeasonIndex = response['data']['seasonData']['hindi'].findIndex(x=> x.order == seasonElement.order);
              
              this.videoList.season['season'+seasonElement.order]={
                'collectionVideo':[],
                'peripheralVideo':[]
              }
              
              // image gradient data for english and hindi
              this.imageGradientColor.season['season'+(seasonElement.order)]={
                'english': seasonElement.gradients,
                'hindi': response['data']['seasonData']['hindi'][hinSeasonIndex]['gradients']
              }

              // episode data
              seasonElement['episodeData'].forEach((element, eIndex) => {
                let hinEpiosdeIndex=response['data']['seasonData']['hindi'][hinSeasonIndex]['episodeData'].findIndex(x=> x.slug == element.slug)

                this.videoList.season['season'+seasonElement.order]['collectionVideo'].push({
                    isUsed:true,
                    sourceLink: element.sourceLink,
                    hlsSourceLink: element.hlsSourceLink,
                    viewCount: element.viewCount,
                    slug :element.slug,
                    duration: element.duration,
                    tempThumbnail:false,
                    randomOrder: !!element.randomOrder ? element.randomOrder: 0,
                    english:{
                      title: element.title,
                      description: element.description,
                      artistList: !!element.artistList==true?element.artistList:[],
                      thumbnail: element.thumbnail
                    },
                    hindi:{
                      title: response['data']['seasonData']['hindi'][hinSeasonIndex]['episodeData'][hinEpiosdeIndex]['title'],
                      description: response['data']['seasonData']['hindi'][hinSeasonIndex]['episodeData'][hinEpiosdeIndex]['description'],
                      artistList: !!response['data']['seasonData']['hindi'][hinSeasonIndex]['episodeData'][hinEpiosdeIndex].artistList==true?response['data']['seasonData']['hindi'][hinSeasonIndex]['episodeData'][hinEpiosdeIndex].artistList:[],
                      thumbnail: response['data']['seasonData']['hindi'][hinSeasonIndex]['episodeData'][hinEpiosdeIndex]['thumbnail']
                    }
                })
              });

              // peripheral data
              seasonElement['mediaList'].forEach((element, eIndex) => {
                let hinEpiosdeIndex=response['data']['seasonData']['hindi'][hinSeasonIndex]['mediaList'].findIndex(x=> x.slug == element.slug)

                this.videoList.season['season'+seasonElement.order]['peripheralVideo'].push({
                  id:element.id,
                  type:element.type,
                  isUsed:true,
                  sourceLink: element.sourceLink,
                  hlsSourceLink: element.hlsSourceLink,
                  viewCount: element.viewCount,
                  duration: element.duration,
                  tempThumbnail: element.thumbnail,
                  selectedPeripheralStatus:element.selectedPeripheralStatus,
                  english:{
                    title: element.title,
                    thumbnail: element.thumbnail
                  },
                  hindi:{
                    title: response['data']['seasonData']['hindi'][hinSeasonIndex]['mediaList'][hinEpiosdeIndex]['title'],
                    thumbnail: response['data']['seasonData']['hindi'][hinSeasonIndex]['mediaList'][hinEpiosdeIndex]['thumbnail']
                  }
                })
              });

              // set artist list
              this.showArtistList['english'][seasonIndex]=[];
              this.showArtistList['english'][seasonIndex]=seasonElement['artistList'];

            });

            // for hindi
            response['data']['seasonData']['hindi'].forEach((seasonElement, seasonIndex) => {
              // set values into season form builder for hindi --------------------------
              this.seasonFields('hindi').push(
                this.seasonFieldFormBuilder(seasonElement, 'hindi')
              );

              // set value category list
              this.setValueOfCategoryList('hindi', seasonIndex==0?resdata['hindi']['categoryList']:seasonElement['categoryList'], seasonIndex);

              // set artist list
              this.showArtistList['hindi'][seasonIndex]=[];
              this.showArtistList['hindi'][seasonIndex]=seasonElement['artistList'];
            })
            
            console.log('form vlaue', this.tForm.value)
            
            this.allGenreList.showGenre=true;
            this.viewDataLoaded=true;

            this.validateForm();
          }
        }
      });
    }
    else
    {
      // need to set the genre sub-genre
      this.allGenreList.showGenre=true;
      this.viewDataLoaded=true;
    }
  }

  // set label value into form
  setLabelValueIntoForm(lang, labelName){
    if(!!labelName)
      return this.labels.filter(x=> x[lang]==labelName)[0];
    else
      return '';
  }  

  // change the selected language
  changeSelectedLang(lang)
  {
    console.log(this.allGenreList.season)
    if(this.selectedLang != lang)
    {
      let prevLang=this.selectedLang;
      this.selectedLang=lang;
      this.seasonFields(lang).value.forEach((seasonElement, seasonIndex) => {
        this.copyCategoryDataToAnother(seasonIndex)
      });

      console.log(this.allGenreList.season)

    }
  }

  // form valsidate function
  validateForm(){
    if(this.tForm.get('english').valid)
      this.formStatus['english']= true;
    else
       this.formStatus['english']= false;

    if(this.tForm.get('hindi').valid)
      this.formStatus['hindi']= true;
    else
      this.formStatus['hindi']= false;
  }

  checkEpisodeStatus(){
    let count = 0;
    this.videoList.season.forEach(seasonElem => {
      console.log(seasonElem.collectionVideo.length, seasonElem.peripheralVideo.length) 
      if(seasonElem.collectionVideo.length > 0 && seasonElem.peripheralVideo.length > 0)
        count++;
    });

    if(count > 0 && count == this.videoList.season.length)
      return true;
    return false;
  }

  //  Save data as draft for both add/edit
  saveApiCall(lang, status){
    
    if(this.tForm.get(lang+'.slug').invalid)
    {
      this.tForm.get(lang+'.slug').markAllAsTouched();
      this.tForm.get(lang+'.title').markAllAsTouched();
      this.toastr.info('Please enter a valid show title.');
      return false;
    }

    let invalidSlugCount=0;
    this.seasonFields(lang)['controls'].forEach(element => {
      if(element['controls'].slug.invalid)
      {
        element['controls'].title.markAllAsTouched();
        element['controls'].slug.markAllAsTouched();
        invalidSlugCount++;
      }
    });

    if(invalidSlugCount>0)
    {
      this.toastr.info('Please enter a valid title of all the seasons.');
      return false;
    }


    // api call to save as draft
      let tempArr:any={};
      tempArr['seasons']={
        'english':[],
        'hindi':[]
      };

      let episodeCount = 0;
      let peripheralCount = 0;
      let seasonCount = this.seasonFields('english').value.length;
      
      // season request data creation
      this.seasonFields('english').value.forEach((element, index) => {
        tempArr['seasons']['english'].push(this.createSeasonArray(element, 'english', status, index+1, this.videoList.season['season'+(index+1)]));
        episodeCount= episodeCount+this.videoList.season['season'+(index+1)]['collectionVideo'].length;
        peripheralCount= peripheralCount+this.videoList.season['season'+(index+1)]['peripheralVideo'].length;
      });

      this.seasonFields('hindi').value.forEach((element, index) => {
        tempArr['seasons']['hindi'].push(this.createSeasonArray(element, 'hindi', status, index+1, this.videoList.season['season'+(index+1)]));
      });

      // show request data creation
      if(tempArr['seasons']['english'].length > 0 || tempArr['seasons']['english'].length > 0)
      {
        tempArr['english'] = this.createShowDataArray('english', tempArr['seasons']['english'][0], status, episodeCount, peripheralCount, seasonCount);
        tempArr['hindi'] = this.createShowDataArray('hindi',  tempArr['seasons']['hindi'][0],  status, episodeCount, peripheralCount, seasonCount);
      }
      else
      {
        this.toastr.info("Select atleast one season.");
      }

      console.log('req data', tempArr);

      this.apiService.postData(Constants.url.updateShowDetail, tempArr).subscribe(response =>{
        if(response['status'] == 200)
        {
          // store/update show id in form and array
          this.storeDetail.english._id=response['data']['showId']['en'];
          this.storeDetail.hindi._id=response['data']['showId']['hin'];
          this.tForm.patchValue({
            'english':{
              "_id": response['data']['showId']['en'],
            }
          });

          this.tForm.patchValue({
            'hindi':{
              "_id": response['data']['showId']['hin'],
            }
          });

          // season form builder and video data
          response['data']['seasonId']['en'].forEach((seasonElement, seasonIndex) => {
            // set values into season form builder for english --------------------------
            this.seasonFields('english')['controls'][seasonElement.order-1].patchValue({
              '_id': seasonElement.seasonId
            });
          })

          response['data']['seasonId']['hin'].forEach((seasonElement, seasonIndex) => {
            // set values into season form builder for english --------------------------
            this.seasonFields('hindi')['controls'][seasonElement.order-1].patchValue({
              '_id': seasonElement.seasonId
            });
          })

          console.log(this.seasonFields('english'))

          this.storedData = tempArr;
          
          this.toastr.success('Data saved successfully');
          
          if(status=='completed' && this.selectedLang=='english')
          {
            window.scrollTo(0, 0);
            this.changeSelectedLang('hindi');
          }
          else if(status=='completed' && this.selectedLang=='hindi')
          {
            if(this.formType=='add')
              this.router.navigate(['../listing/show'], { queryParams: {'type': 'completed'}, relativeTo: this.route})
            else
              this.router.navigate(['../../listing/show'], { queryParams: {'type': 'completed'}, relativeTo: this.route})
          }
        }
      }); 

  }

  // set image into form
  setImagesIntoForm(lang, resdata){
    this.tForm.patchValue({
      [lang]:{
        'horizontal_large': '',
        'square': ''
      }
    })

    this.selectedImages = {
      "horizontal_large": {
          file: null,
          progPer: null,
          imgURL: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['showPath']+Constants.image.horizontalMedium+resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:null,
          status: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?'success':'empty',
          sourceLink: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:null
      },
      "square": {
        file: null,
        progPer: null,
        imgURL: !!resdata[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['showPath']+Constants.image.squareMedium+resdata[lang]['thumbnail']['square']['ratio1']['sourceLink']:null,
        status: !!resdata[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?'success':'empty',
        sourceLink: !!resdata[lang]['thumbnail']['square']['ratio1']['sourceLink']==true?resdata[lang]['thumbnail']['square']['ratio1']['sourceLink']:null
      }
    }
  }

  // set patch values from old array or response data into form
  setValueIntoForm(lang, arrData){
    this.tForm.patchValue({
      [lang]:{
        "_id": arrData[lang]['_id'],
        "title": arrData[lang]['title'],
        "slug": arrData[lang]['slug'],
        "description": arrData[lang]['description'],
        "language": arrData[lang]['language'],
        // "tags": !!arrData[lang]['tags'] == true ? arrData[lang]['tags'].split(',') : [],
        // "gradient": arrData[lang]['thumbnail']['horizontal']['ratio1']['gradient'], //setting 
        "metaTitle": !!arrData[lang]['metaTitle'] == true ? arrData[lang]['metaTitle'] : '',
        "metaKeyword": !!arrData[lang]['metaKeyword'] == true ? arrData[lang]['metaKeyword'].split(',') : [],
        "metaDescription": !!arrData[lang]['metaDescription'] == true ? arrData[lang]['metaDescription'] : '',
        "randomOrder": arrData[lang]['randomOrder']
      }
    });    
  }

  // set values in category list
  setValueOfCategoryList(lang, list, index){
    let formArray = this.seasonFields(lang).controls[index]['controls']['categoryList'] as FormArray;

    list.forEach(element => {
      let index = formArray.value.findIndex(x=> x.id == element.id)
      if(index > -1)
      {
        formArray.at(index).patchValue({
          checked: true,
          slug: formArray.value[index].slug,
          id: formArray.value[index].id,
          name: formArray.value[index].name
        })
      }
    });
  }

   //creating a show detail form array and with remaining detail of sesaon 1st
  createShowDataArray(lang, seasonOneData, status, episodeCount, peripheralCount, seasonCount){
    var hinValidate = false;
    if(status=='completed' && this.selectedLang=='hindi'){
      hinValidate = true;
    } else if (status == 'forReview' || status == 'publish'){
      hinValidate = true;
    }

    return {
      "_id": !!this.tForm.get(lang+'._id').value?this.tForm.get(lang+'._id').value:0,
      "title": this.tForm.get(lang+'.title').value,
      "description": this.tForm.get(lang+'.description').value,
      "thumbnail": seasonOneData.thumbnail,//season 1
      "tags": seasonOneData.tags,//season 1
      "slug": this.tForm.get(lang+'.slug').value,
      "mediaList": seasonOneData.mediaList, //season 1
      "genreList": seasonOneData.genreList, //season 1
      "subGenreList": seasonOneData.subGenreList, //season 1
      "seasonCount": seasonCount,
      "status": ((status == 'completed' && this.storedData[lang].status == 'completed') || (status == 'completed' && this.selectedLang == 'hindi')) ? 'completed' : (status == 'publish' || status == 'forReview') ? status :'draft',
      "artistList": seasonOneData.artistList, //season 1
      "contributionField": "",
      "duration": "",
      "selectedPeripheral": seasonOneData.selectedPeripheral,
      "categoryList": seasonOneData.categoryList, //season 1
      "label":  seasonOneData.label, //season 1
      "language": this.tForm.get(lang+'.language').value,
      "episodeCount": episodeCount, //all seasons episode count
      "peripheralCount": peripheralCount, //all seasons peripheral counts
      "metaTitle": this.tForm.get(lang+'.metaTitle').value,
      "metaKeyword": this.tForm.get(lang+'.metaKeyword').value.join(','),
      "metaDescription": this.tForm.get(lang+'.metaDescription').value,
      "activity": {
        "action": !this.storedData[lang]['slug']==true?'created':'updated',
        "writerName": this.userData.firstName,
        "roleId": this.userData.roleId,
        "updatedAt": "" //from backend
      },
      "displayLanguage": lang=='english'?'en':'hin',
      "englishValidated": (status == 'completed' || status == 'forReview' || status == 'publish') ? true : false,
      "hindiValidated": hinValidate,
      "randomOrder": !!this.tForm.get(lang+'.randomOrder').value?this.tForm.get(lang+'.randomOrder').value:0,
    }
  }

  //creating a form array and 
  createSeasonArray(element, lang, status, seasonIndex, episodeData){
    return {
      "_id": !!element._id?element._id:0,
      "title": element.title,
      "label": !!element.label?element.label[lang]:'',
      "tags":!!element['tags'] == true ? element['tags'].join(',') : "",
      "description": element.description,
      "slug": element.slug,
      "status": "active",
      "artistList": !!this.showArtistList[lang][seasonIndex-1]?this.showArtistList[lang][seasonIndex-1]:[],
      "thumbnail": {
        "horizontal": {
            "ratio1": { "sourceLink": element.horizontal_large.fileName, "gradient": element.gradient },
            "ratio2": { "sourceLink": '', "gradient": '' },
            "ratio3": { "sourceLink": "", "gradient": "" }
        },
        "vertical": {
            "ratio1": { "sourceLink": "", "gradient": "" }
        },
        "square": {
            "ratio1": { "sourceLink": element.square.fileName, "gradient": element.gradient }
        }
      },
      'gradients': !!this.imageGradientColor.season['season'+seasonIndex][lang]?this.imageGradientColor.season['season'+seasonIndex][lang]:[],
      "genreList": !!this.allGenreList.season['season'+seasonIndex].formData['dGenreList'] ? this.allGenreList.season['season'+seasonIndex].formData['dGenreList'][lang]: [],
      "subGenreList": !!this.allGenreList.season['season'+seasonIndex].formData['dSubGenreList'] ? this.allGenreList.season['season'+seasonIndex].formData['dSubGenreList'][lang]:[],
      "categoryList" : this.createRequestCategoryArr(element.categoryList),
      "viewCount": 0,
      "language": this.tForm.get(lang+'.language').value,
      "order": seasonIndex,
      "selectedPeripheral": this.createSelectedPeripheralData(seasonIndex, lang),
      "episodeCount": episodeData['collectionVideo'].length,
      "showId":  !!this.tForm.get(lang+'._id').value?this.tForm.get(lang+'._id').value:0,
      "showSlug": this.tForm.get(lang+'.slug').value,
      "displayLanguage": lang=='english'?'en':'hin',
      "contributionField": "",
      "episodes": this.createEpisodeDataArr(element, episodeData['collectionVideo'], lang, this.allGenreList.season['season'+seasonIndex].formData),
      "mediaList": this.createMediaList(episodeData['peripheralVideo'], lang)
      }
  }

  // create media list array
  createMediaList(peripheralData, lang){
    let dataArr=[];
    peripheralData.forEach(element => {
      if(element['isUsed'])
      { 
        dataArr.push({
            "id" : element.id,
            "type" : element.type,
            "sourceLink" : element.sourceLink,
            "hlsSourceLink" : element.hlsSourceLink,
            "viewCount" : element.viewCount,
            "duration": element.duration,
            "selectedPeripheralStatus": element.selectedPeripheralStatus,
            "thumbnail" : element[lang].thumbnail,
            "title" : element[lang].title
        })
      }
    });
    return dataArr;
  }

  createEpisodeDataArr(seasonData, episodeData, lang, genreSubGenre){
    let reqData=[];
    episodeData.forEach(element => {
      reqData.push({
        "_id": 0,
        "title": element[lang].title,
        "description": element[lang].description,
        "thumbnail": {
            "horizontal": {
                "ratio1": {
                    "sourceLink": element[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'],
                    "gradient": seasonData.gradient
                },
                "ratio2": { "sourceLink": "", "gradient": "" },
                "ratio3": { "sourceLink": "", "gradient": "" }
            },
            "vertical": { "ratio1": { "sourceLink": "", "gradient": "" } },
            "square": { "ratio1": { "sourceLink": element[lang]['thumbnail']['square']['ratio1']['sourceLink'], "gradient": seasonData.gradient } }
        },
        "tags": !!seasonData.tags?seasonData.tags.join(','):'',
        "sourceLink": element.sourceLink,
        "hlsSourceLink": element.hlsSourceLink,
        "caption": "",
        "duration": element.duration,
        "slug": element.slug,
        "status": "active",
        "genreList": genreSubGenre['dGenreList'][lang],
        "subGenreList": genreSubGenre['dSubGenreList'][lang],
        "artistList": element[lang]['artistList'],
        "contributionField": "",
        "language": this.tForm.get(lang+'.language').value,
        "displayLanguage": lang=='english'?'en':'hin',
        "order": 1,
        "showId": !!this.tForm.get(lang+'._id').value?this.tForm.get(lang+'._id').value:0,
        "seasonId": 0,
        "collectionId": 0,
        "collectionSlug": "",
        "showSlug": this.tForm.get(lang+'.slug').value,
        "seasonSlug": "",
        "isExclusive": 0,
        "isExclusiveOrder": 0,
        "label": "",
        "location": "",
        "tg": "",
        "mood": "",
        "theme": "",
        "type": "season",
        "viewCount": element.viewCount,
        "randomOrder": !!element.randomOrder ? element.randomOrder: 0,
        "parentDetail": {}
      })
    });

    return reqData;
  }

  // createShowArtistList(lang){
  //   let allArtist=[];
  //   let list=Object.keys(this.showArtistList[lang]);

  //   list.forEach(indexKeys => {
  //     if(indexKeys=='0')
  //       allArtist=this.showArtistList[lang][indexKeys]['artistList'];
  //     else
  //     {
  //       this.showArtistList[lang][indexKeys]['artistList'].forEach(element => {
  //         let fIndex = allArtist.findIndex(x=> x.id == element.id);
  //         if(fIndex > -1)
  //         {
  //           allArtist.push(element);
  //         }
  //       });
  //       // allArtist.findIndex

  //     }
  //   });
  // }

  // create requested data of category list on basis of checked flag status in array.
  createRequestCategoryArr(list){
    let reqData=[];
    list.forEach(element => {
      if(element.checked==true)
      {
        reqData.push({
          'id': element.id,
          'name': element.name
        })
      }
    });

    return reqData;    
  }

  // set selectedPeripheralStatus to true
  changePeripheralStatus(event, seasonIndex, videoIndex) {
    if(event.srcElement.checked)
    {
       this.videoList.season['season'+(seasonIndex+1)].peripheralVideo.forEach((element, loopIndex) => {
           if(element.selectedPeripheralStatus)
             element.selectedPeripheralStatus=false;
           if(loopIndex == videoIndex)
             element.selectedPeripheralStatus=true;
       });
    }
    else
     this.videoList.season['season'+(seasonIndex+1)].peripheralVideo[videoIndex].selectedPeripheralStatus=false;
  }

  // create req data of selected periphral status
  createSelectedPeripheralData(seasonIndex, lang){
    if(!!this.videoList.season['season'+seasonIndex])
    {
      if(this.videoList.season['season'+seasonIndex].peripheralVideo.length > 0)
      {
        let selectedElement =  this.videoList.season['season'+seasonIndex].peripheralVideo.find(x=> x.selectedPeripheralStatus == true);
        if(!!selectedElement)
        {
          return {
            'type': selectedElement.type,
            'title': selectedElement[lang].title,
            'sourceLink': selectedElement.sourceLink,
            'hlsSourceLink': selectedElement.hlsSourceLink,
            'viewCount': selectedElement.viewCount,
            'thumbnail': selectedElement[lang].thumbnail,
            'duration': selectedElement.duration
          }
        }
        else
         return {};
      }
      else
        return {};
    }
    else
      return {};
  }

  sendToCorrection(status, type) {
    this.apiService.getApiData(Constants.url.sendToCorrection + '?type='+type+'&status=' + status+'&slug=' + this.storeDetail.slug).subscribe(response => {
      if (response['status'] == 200 ) {
        console.log(response)
      }
    })
  }

}
