import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/other/services/api.service';
import { Constants } from 'src/app/other/constants';
import { UploadFileService } from 'src/app/other/services/upload-file.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update-collection-detail',
  templateUrl: './update-collection-detail.component.html',
  styleUrls: ['./update-collection-detail.component.scss']
})
export class UpdateCollectionDetailComponent implements OnInit {

  public constantImg:any;

  constructor(private toastr: ToastrService, private apiService:ApiService, private fb: FormBuilder, private uploadService: UploadFileService, private router:Router, private route: ActivatedRoute) {
    this.constantImg = Constants.image;
    
    uploadService.uploadStatus.subscribe(value => {
      if(!!value['loaded'] && !value['objName']['type'])
      {
        this.selectedImages[value['objName']].progPer= (value['loaded']/value['total'])*100;
      } 
    });
  }

  tForm: FormGroup;
  selectedLang:string='english';
  currentUrl = '';
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

  userData = { "_id": "", "email": "", "roleId": 0, "firstName": "", "lastName": "", "lastLogin": "" };

  individualArtistList={
    'english':[],
    'hindi':[]
  };

  imageGradientColorEng = [];
  imageGradientColorHin = [];

  collectionArtistList={
    'english':[],
    'hindi':[]
  }
  
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
    selected:{
      'collectionVideo':[],
      'peripheralVideo':[],
    },
    's3Url':{}
  };

  s3Url={};
  storedData={
    'english':{
      "thumbnail": {
        "horizontal": {
            "ratio1": {"sourceLink": null,"gradient": null},
            "ratio2": {"sourceLink": null,"gradient": null},
            "ratio3": {"sourceLink": "","gradient": ""}
        },
        "vertical": {
            "ratio1": {"sourceLink": null,"gradient": null}
        },
        "square": {
            "ratio1": {"sourceLink": null,"gradient": null}
        }
      }
    },
    'hindi':{
      "thumbnail": {
        "horizontal": {
            "ratio1": {"sourceLink": null,"gradient": null},
            "ratio2": {"sourceLink": null,"gradient": null},
            "ratio3": {"sourceLink": "","gradient": ""}
        },
        "vertical": {
            "ratio1": {"sourceLink": null,"gradient": null}
        },
        "square": {
            "ratio1": {"sourceLink": null,"gradient": null}
        }
      }
    }
  }

  formType:string='add';
  formStatus={
    'english': false,
    'hindi': false
  }

  markTouched={
    'english':false,
    'hindi':false    
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
    showGenre:false,
    allListData:[],
    selectedData:[],
    formData:{}
  }

  categoryList=[];
  imageGradientColor={
    'english':[],
    'hindi':[]
  }
  
  selectedImages = {
    "horizontal_large": {
        file: null,
        progPer: null,
        imgURL: null,
        status: 'empty',
        sourceLink: null,
        widthRatio:16,
        heightRatio:9,
    },
    "horizontal_medium": {
      file: null,
      progPer: null,
      imgURL: null,
      status: 'empty',
      sourceLink: null,
      widthRatio:4,
      heightRatio:3,
    }
  }

  saveApiCalling:boolean=false;

  ngOnInit() {
  
    this.tForm = new FormGroup({
        'english' : new FormGroup({
            'title': new FormControl('', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
            'slug': new FormControl('', [Validators.required]),
            'description' : new FormControl('', [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
            'language':new FormControl('', [Validators.required]),
            'label' : new FormControl('', [Validators.required]),
            'categoryList' : new FormArray([], [Validators.required]),
            'tags':new FormControl([], [Validators.required]),
            'gradient':new FormControl('#ffffff'),
            'metaTitle' : new FormControl('', [Validators.maxLength(50)]),
            'metaKeyword': new FormControl([]),
            'metaDescription': new FormControl('', [Validators.maxLength(500), this.noWhitespaceValidator]),
            'horizontal_large':new FormControl(''),
            'square':new FormControl(''),
            'horizontal_medium':new FormControl(''),
            'gradients': new FormControl(''),
            'randomOrder': new FormControl(0),
        }),
        'hindi' : new FormGroup({
          'title': new FormControl('', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
          'slug': new FormControl('', [Validators.required]),
          'description' : new FormControl('', [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
          'language':new FormControl('', [Validators.required]),
          'label' : new FormControl('', [Validators.required]),
          'categoryList' : new FormArray([], [Validators.required]),
          'tags':new FormControl([], [Validators.required]),
          'gradient':new FormControl('#ffffff'),
          'metaTitle' : new FormControl('', [Validators.maxLength(50)]),
          'metaKeyword': new FormControl([]),
          'metaDescription': new FormControl('', [Validators.maxLength(500), this.noWhitespaceValidator]),
          'horizontal_large':new FormControl(''),
          'square':new FormControl(''),
          'horizontal_medium':new FormControl(''),
          'gradients': new FormControl(''),
          'randomOrder': new FormControl(0),
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
    this.getGenreList();
    this.getArtistList();
    this.getVideoList('episode', 'collectionVideo');
    this.getVideoList('peripheral', 'peripheralVideo');

    // set userData from local storage
    var retrievedObject = localStorage.getItem('userdata');
    this.userData = JSON.parse(retrievedObject);

    if(this.route['_routerState'].snapshot.url.match('dashboard/review-publish')) {
      this.currentUrl = 'review-publish';
    } else if(this.route['_routerState'].snapshot.url.match('dashboard/content')) {
      this.currentUrl = 'content';
    }
  }

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

  // change image function and api call 
  changeImage(event, objName) {
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
      var self = this;
      this.checkImageDimension(_event, self,this.selectedImages[objName].widthRatio, this.selectedImages[objName].heightRatio,function (res) {
        if(res)
        {
          self.selectedImages[objName].imgURL = reader.result;
          self.selectedImages[objName].status = 'uploading';
          let imageFileName = 'collectionImage-'+Date.now()+'.'+file.name.split('.')[1];
          self.uploadService.uploadSingleFile(file, imageFileName, 'collection', objName).then(response => {
            if (response) {
              // API call for uploading/change image
              self.apiService.getApiData(Constants.url.uploadImage + '?type=collection&format=' + objName + '&imageName=' + imageFileName).subscribe(response => {
                if (response['status'] == 200) {
                  self.selectedImages[objName].fileName = imageFileName;
                  self.selectedImages[objName].sourceLink = imageFileName;
                  self.selectedImages[objName].status = 'success';
                  

                  if(objName == 'horizontal_medium' && self.selectedLang == 'english') {
                    self.imageGradientColorEng = [];
                    self.imageGradientColorEng = response['data']['gradientColor'];

                    if(self.imageGradientColorEng.length > 0){
                      self.setImageColor(self.imageGradientColorEng[0])
                    }
                  }

                  if(objName == 'horizontal_medium' && self.selectedLang == 'hindi') {
                    self.imageGradientColorHin = [];
                    self.imageGradientColorHin = response['data']['gradientColor'];

                    if(self.imageGradientColorHin.length > 0){
                      self.setImageColor(self.imageGradientColorHin[0])
                    }
                  }                  
                  
                }
                else
                  self.selectedImages[objName].status = 'failed';
              });
            }
            else {
              self.selectedImages[objName].status = 'failed';
            }
            self.validateForm();
          }, error => {
            self.selectedImages[objName].status = 'failed';
          })
        }
        else
        {
          self.selectedImages[objName].status = 'failed';
          self.toastr.info("Image aspect ratio should be " + self.selectedImages[objName].widthRatio +':'+ self.selectedImages[objName].heightRatio);
        }
      })
    }
  }

  // check and validate the image dimesions
  checkImageDimension(e, classObj, widthRatio, heightRatio, callback){
    var isValid = false;
    var image = new Image();
    image.src = e.target['result'];
    let self = this;
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

  // function for mark field as validate -------------------
  validateAllFormFields(formGroup: FormGroup, lang:string) {         
    Object.keys(formGroup.controls[lang]['controls']).forEach(field => {  
        const control = formGroup.controls[lang].get(field);             
          if (control instanceof FormControl) { 
                    
            control.markAsTouched({ onlySelf: true });

          } else if (control instanceof FormGroup) { 
            this.validateAllFormFields(control, lang);            
          }
      });
  }

  // API to check the slug
  checkSlugApi(){
    let reqSlug='';
    if(!this.storeDetail.english._id)
    {
      if(this.tForm.get('english.title').valid)
      {
        reqSlug = this.convertToSlug(this.tForm.get('english.title').value);
        this.apiService.getApiData(Constants.url.checkSlug+'?type=collection&slug='+reqSlug).subscribe(response =>{
          if(response['status'] == 200)
          {
            if(response['data']['exists']==false)
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
          else
          {
            this.toastr.error(response['message']);
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

  setImageColor(color){
    if (this.selectedLang == 'english'){
      this.tForm.patchValue({
        'english': {
          ['gradient']: color
        }
      })
    }else{
      this.tForm.patchValue({
        'hindi': {
          ['gradient']: color
        }
      })
    }
  }

  // get genre list
  getGenreList(){
      this.apiService.getApiData(Constants.url.getGenreSubGenreList).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.allGenreList.allListData=response['data']['genreSubGenre'];
          // call if slug is available
          this.viewCollectionDetail(this.storeDetail.slug);
        }
      });
  }
  
  // manage Popup of videoList
  showHideVideoListPopup(type){
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
      $('#video_modal'+type+0).modal('show')
    }, 500);
  }

  // get video list
  getVideoList(type, arrName){
    
    this.videoList['all']['show'+arrName]=false;
    // this.videoList.all.showperipheralVideo = false;
    // this.videoList.all.showcollectionVideo = false;
    this.apiService.getApiData(Constants.url.getVideoList+'?type='+type).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.videoList['s3Url']=response['data']['s3Url'];
          this.s3Url=response['data']['s3Url'];

          if(type == 'peripheral')
          {
            this.videoList.all.dataLoadedPeripheral=true;
            response['data']['collectionVideo'].forEach(element => {   
              this.videoList.all[arrName].push({
                type:element.type,
                isUsed:false,
                sourceLink: element.sourceLink,
                hlsSourceLink: element.hlsSourceLink,
                viewCount: 0,
                duration: element.duration,
                tempThumbnail:element.thumbnail,
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
            response['data']['collectionVideo'].forEach(element => {   
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
                    square:{
                      ratio1:{ gradient:'', sourceLink:''}
                    },
                    vertical:{
                      ratio1:{ gradient:'', sourceLink:''}
                    }
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
                    square:{
                      ratio1:{ gradient:'', sourceLink:''}
                    },
                    vertical:{
                      ratio1:{ gradient:'', sourceLink:''}
                    }
                  }
                }
              })
            });

            // this.videoList.all.showcollectionVideo  = true;
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
              let formArray = this.tForm.get('english'+'.categoryList') as FormArray;
              let hinFormArray = this.tForm.get('hindi'+'.categoryList') as FormArray;
              formArray.push(this.fb.group
                ({
                  checked: new FormControl(null),
                  slug: o.slug,
                  id: o['english'].id,
                  name: o['english'].name
                })
              );
              hinFormArray.push(this.fb.group
                ({
                  checked: new FormControl(null),
                  slug: o.slug,
                  id: o['hindi'].id,
                  name: o['hindi'].name
                })
              );
            });
            this.categoryList=newData;         
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
            return this.individualArtistList['english'].push({ 'id': item._id, 'firstName': item.firstName, 'lastName': item.lastName, 'callingName': item.callingName, 'name': item.firstName +' '+item.lastName, 'order': 0, 'city': item.city, 'profilePic':item.profilePic, 'slug': item.slug, 'status': item.status })
          }
          else
          {
            return this.individualArtistList['hindi'].push({'id':item._id, 'firstName': item.firstName, 'lastName': item.lastName, 'callingName': item.callingName, 'name': item.firstName +' '+item.lastName, 'order': 0, 'city': item.city, 'profilePic':item.profilePic, 'slug': item.slug, 'status': item.status})
          }
        })
      }
    });
  }

  // view collection detail
  viewCollectionDetail(slug){
    if(!!slug)
    {
      let url = Constants.url.viewCollectionDetail+'?slug='+slug;
      this.apiService.getApiData(url).subscribe(response =>{
        if(response['status'] == 200)
        {
          if(!!response['data']['collectionData'])
          {
            // console.log(response['data']['collectionData']);
            
            let resdata=this.storedData=response['data']['collectionData'];
            this.s3Url=response['data']['s3Url'];
            this.allGenreList.selectedData=resdata['english']['subGenreList'];
            this.allGenreList.showGenre=true;

            // store id and slug detail
            this.storeDetail.english._id=resdata['english']['_id'];
            this.storeDetail.hindi._id=resdata['hindi']['_id'];
            this.storeDetail.slug=resdata['english']['slug'];

            // collection artist list
            this.collectionArtistList.english=resdata['english']['artistList'];

            resdata['english']['gradient']= !!resdata['english']['gradient']==true?resdata['english']['gradient']:'#ffffff';
            resdata['hindi']['gradient']=!!resdata['hindi']['gradient']==true?resdata['hindi']['gradient']:'#ffffff';

            resdata['english']['gradients']= !!resdata['english']['gradients']==true?resdata['english']['gradients']:'#ffffff';
            resdata['hindi']['gradients']=!!resdata['hindi']['gradients']==true?resdata['hindi']['gradients']:'#ffffff';

            this.imageGradientColorEng = !!resdata['english']['gradients'] == true ? resdata['english']['gradients'] : [];
            this.imageGradientColorHin = !!resdata['hindi']['gradients'] == true ? resdata['hindi']['gradients'] : [];
            // episode video data
            if(response['data']['episodeData']['english'].length > 0) {
              response['data']['episodeData']['english'].forEach((element, index) => {
                let hinElementIndex = response['data']['episodeData']['hindi'].findIndex(x => x.slug == element.slug)
                this.videoList.selected.collectionVideo.push({
                  isUsed: true,
                  sourceLink: element.sourceLink,
                  hlsSourceLink: element.hlsSourceLink,
                  viewCount: element.viewCount,
                  slug: element.slug,
                  duration: element.duration,
                  tempThumbnail: false,
                  randomOrder: !!element.randomOrder? element.randomOrder:0,
                  english: {
                    title: element.title,
                    description: element.description,
                    artistList: !!element.artistList == true ? element.artistList : [],
                    thumbnail: element.thumbnail
                  },
                  hindi: {
                    title: response['data']['episodeData']['hindi'][hinElementIndex]['title'],
                    description: response['data']['episodeData']['hindi'][hinElementIndex]['description'],
                    artistList: !!response['data']['episodeData']['hindi'][hinElementIndex].artistList == true ? response['data']['episodeData']['hindi'][hinElementIndex].artistList : [],
                    thumbnail: response['data']['episodeData']['hindi'][hinElementIndex]['thumbnail']
                  }
                })
              });
            }
            
            // peripheral video data
            if(response['data']['collectionData']['english']['mediaList'] != []) {
              response['data']['collectionData']['english']['mediaList'].forEach((element, index) => {
                let hinElementIndex = response['data']['collectionData']['english']['mediaList'].findIndex(x=> x.slug == element.slug)
                
                this.videoList.selected.peripheralVideo.push({
                  type:element.type,
                  isUsed:true,
                  sourceLink: element.sourceLink,
                  hlsSourceLink: element.hlsSourceLink,
                  viewCount: 0,
                  duration: element.duration,
                  tempThumbnail:false,
                  selectedPeripheralStatus:element.selectedPeripheralStatus,
                  english:{
                    title: element.title,
                    thumbnail: element.thumbnail
                  },
                  hindi:{
                    title: response['data']['collectionData']['hindi']['mediaList'][hinElementIndex]['title'],
                    thumbnail: response['data']['collectionData']['hindi']['mediaList'][hinElementIndex]['thumbnail']
                  }
                });   
              });
            }
                       
            this.setValueIntoForm('english', resdata);
            this.setValueIntoForm('hindi', resdata);
            this.setValueOfCategoryList('english', resdata['english']['categoryList']);
            this.setImagesIntoForm('english',  resdata);
            this.setLabelValueIntoForm('english',  resdata);
  
            this.validateForm();
          }
        }
      });
    }
    else
    {
      this.allGenreList.showGenre=true;
    }
  }

  setLabelValueIntoForm(lang, resdata){
    if(!!resdata[lang]['label']){
      this.labels.forEach(element => {
        if(element[lang] == resdata[lang]['label'])
        {
          this.tForm.patchValue({
            [lang]:{
              'label': element
            }
          })
        }
      });
      this.copyDataFromOneLangToOther('label');
    }
  }

  changeSelectedLang(lang)
  {
    if(this.selectedLang != lang)
    {
      // this.tForm.reset();
      let prevLang=this.selectedLang;
      this.selectedLang=lang;
  
      this.setValueIntoForm(lang, this.storedData);
      this.setValueIntoForm(prevLang, this.storedData);

      // this.setValueOfCategoryList(lang, this.storedData[prevLang]['categoryList']);

      this.setImagesIntoForm(lang, this.storedData);

      this.validateForm();
    }
  }

  updateEpisodeData(type, values){
    if(type == 'episode')
    {
      this.videoList.selected.collectionVideo = values;
      this.videoList.all.showcollectionVideo=false;  
            
      this.videoList.selected.collectionVideo.forEach(element => {
        
        element['english'].artistList.forEach(tElem => {
          let arrayIndex = this.collectionArtistList['english'].findIndex(x=>x.slug == tElem.slug)
          if(arrayIndex == -1)
          {
            this.collectionArtistList['english'].push(tElem);
          }
        });

        element['hindi'].artistList.forEach(tElem => {
          let arrayIndex = this.collectionArtistList['hindi'].findIndex(x=>x.slug == tElem.slug)
          if(arrayIndex == -1)
          {
            this.collectionArtistList['hindi'].push(tElem);
          }
        });
      });
      
    }
    else
    {
      this.videoList.selected.peripheralVideo = values;
      this.videoList.all.showperipheralVideo=false;
    }

    this.validateForm();
  } 

  // set selectedPeripheralStatus to true
  changePeripheralStatus(event, videoIndex) {
    if(event.srcElement.checked)
    {
       this.videoList.selected.peripheralVideo.forEach((element, loopIndex) => {
           if(element.selectedPeripheralStatus)
             element.selectedPeripheralStatus=false;
           if(loopIndex == videoIndex)
             element.selectedPeripheralStatus=true;
       });
    }
    else
      this.videoList.selected.peripheralVideo[videoIndex].selectedPeripheralStatus=false;

    // this.videoList.selected.peripheralVideo.filter((item, index) => {
    //   console.log(item.selectedPeripheralStatus)
    //   if(item.selectedPeripheralStatus === this.videoList.selected.peripheralVideo[0].selectedPeripheralStatus) {
    //     this.videoList.selected.peripheralVideo[0].selectedPeripheralStatus = event.srcElement.checked;
    //     // this.selecteVideoElement.selectedPeripheralStatus = status;
    //   } else {
    //     this.videoList.selected.peripheralVideo[0].selectedPeripheralStatus = false;
    //   }
    // })
  }

  // remove video from the list
  removeVideo(type, index, item){
    this.apiService.getApiData(Constants.url.removeVideo+'?type='+type+'&sourceLink='+item['sourceLink']).subscribe(response =>{
      if(response['status'] == 200)
      {
        if(type == 'episode')
        {
          this.videoList.selected.collectionVideo[index]['isUsed']=false;
          let pushedItem = this.videoList.selected.collectionVideo[index];
          this.videoList.selected.collectionVideo.splice(index, 1);
          this.videoList.all.collectionVideo.push(pushedItem);
        }
        else
        {
          this.videoList.selected.peripheralVideo[index]['isUsed']=false;
          let pushedItem = this.videoList.selected.peripheralVideo[index];
          this.videoList.selected.peripheralVideo.splice(index, 1);
          this.videoList.all.peripheralVideo.push(pushedItem);
        }
        this.toastr.success('Episode removed successfully.');
      }
      else
      {
        this.toastr.error(response['message']);
      }
    });
  }

  // form valsidate function
  validateForm(){
    if(this.tForm.get('english').valid && this.validateImages && this.videoList.selected.collectionVideo.length > 0)
      this.formStatus['english']= true;
    else
       this.formStatus['english']= false;

    if(this.tForm.get('hindi').valid && this.validateImages && this.videoList.selected.collectionVideo.length > 0)
      this.formStatus['hindi']= true;
    else
      this.formStatus['hindi']= false;
  }

  // validate  image status
  get validateImages(){
    if(this.selectedImages.horizontal_large.status != 'success'  || this.selectedImages.horizontal_medium.status!='success')
      return false;
    return true;
  }

  //  Save data as draft for both add/edit
  saveApiCall(lang, status){
    this.validateForm();

    this.saveApiCalling=true;

    if(this.tForm.get(lang+'.title').invalid && status=='draft')
    {
      this.tForm.get(lang+'.title').markAllAsTouched();
      this.toastr.info('Please enter the title.');
      this.saveApiCalling=false;
    }
    else if(this.tForm.get(lang+'.slug').invalid)
    {
      this.tForm.get(lang+'.slug').markAllAsTouched();
      this.toastr.info('Title already exist');
      this.saveApiCalling=false;
    }
    // api call to save as draft
    else
    {
      // form validate
      if (!this.formStatus[lang] && status == 'completed'){
        this.markTouched[lang]=true;
        this.validateAllFormFields(this.tForm, lang);
        this.saveApiCalling=false;
        this.toastr.info('Please fill out all the mandatory fields.');
        return false;
      }

      let tempArr:any={};
      tempArr['english'] = this.createRequestArray('english', status);
      tempArr['hindi'] = this.createRequestArray('hindi', status);
      tempArr['episodes']={
        'english':{},
        'hindi':{}
      }
      tempArr['episodes']['english'] = this.createEpisodeList('english', this.videoList.selected.collectionVideo);
      tempArr['episodes']['hindi'] = this.createEpisodeList('hindi', this.videoList.selected.collectionVideo);
      
      // console.log('req data', tempArr);
      // return false;

      this.apiService.postData(Constants.url.updateCollectionDetail, tempArr).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.storeDetail.english._id=response['data']['collectionId']['en'];
          this.storeDetail.hindi._id=response['data']['collectionId']['hin'];

          this.storedData = tempArr;
          
          // console.log('store data to array after save', this.storedData)
          
          if(status=='completed' && this.selectedLang=='english')
          {
            this.changeSelectedLang('hindi');
            window.scrollTo(0, 0);
            this.toastr.success('Detail saved successfully.');
          }
          else if(status=='completed' && this.selectedLang=='hindi')
          {
            this.toastr.success('Detail saved successfully and send to completed.');
            if(this.formType=='add')
              this.router.navigate(['../listing/collection'], { queryParams: {'type': 'completed'}, relativeTo: this.route})
            else
              this.router.navigate(['../../listing/collection'], { queryParams: {'type': 'completed'}, relativeTo: this.route})
          }
          else if(status == 'publish') {
            this.toastr.success('Send to publish successfully.')
            this.router.navigate(['../../listing/review'], { queryParams: { 'type': 'collection' }, relativeTo: this.route })
          }
          else
          {
            this.toastr.success('Saved as draft successfully.');
          }

        }
        else
        {
          this.toastr.error(response['message']);
        }
        this.saveApiCalling=false;
      }); 

    }
  }

  // set image into form
  setImagesIntoForm(lang, resdata){
    this.tForm.patchValue({
      [lang]:{
        'horizontal_large': '',
        'square': '',
        'horizontal_medium': ''
      }
    })

    this.selectedImages = {
      "horizontal_large": {
          file: null,
          progPer: null,
          imgURL: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['collectionPath']+Constants.image.horizontalMedium+resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:null,
          status: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?'success':'empty',
          sourceLink: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']==true?resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink']:null,
          widthRatio:16,
          heightRatio:9,
      },
      "horizontal_medium": {
        file: null,
        progPer: null,
        imgURL: !!resdata[lang]['thumbnail']['horizontal']['ratio2']['sourceLink']==true?this.s3Url['basePath']+this.s3Url['collectionPath']+Constants.image.horizontalMedium+resdata[lang]['thumbnail']['horizontal']['ratio2']['sourceLink']:null,
        status: !!resdata[lang]['thumbnail']['horizontal']['ratio2']['sourceLink']==true?'success':'empty',
        sourceLink: !!resdata[lang]['thumbnail']['horizontal']['ratio2']['sourceLink']==true?resdata[lang]['thumbnail']['horizontal']['ratio2']['sourceLink']:null,
        widthRatio:4,
        heightRatio:3,
      }
    }
  }

  // set patch values from old array or response data into form
  setValueIntoForm(lang, arrData){
    this.tForm.patchValue({
      [lang]:{
        "title": arrData[lang]['title'],
        "slug": arrData[lang]['slug'],
        "description": arrData[lang]['description'],
        "language": arrData[lang]['language'],
        "tags": !!arrData[lang]['tags'] == true ? arrData[lang]['tags'].split(',') : [],
        "gradient": arrData[lang]['thumbnail']['horizontal']['ratio1']['gradient'], //setting 
        "metaTitle": arrData[lang]['metaTitle'],
        "metaKeyword": !!arrData[lang]['metaKeyword'] == true ? arrData[lang]['metaKeyword'].split(',') : [],
        "metaDescription": arrData[lang]['metaDescription'],
        "randomOrder": arrData[lang]['randomOrder']
      }
    });    
  }

  setValueOfCategoryList(lang, list){
    let formArray = this.tForm.get(lang+'.categoryList') as FormArray;
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

    this.copyDataFromOneLangToOther('categoryList');
  }

   //creating a form array and 
   createRequestArray(lang, status){ 
     var hinValidate = false;
     if (status == 'completed' && this.selectedLang == 'hindi') {
       hinValidate = true
     } else if (status == 'forReview' || status == 'publish') {
       hinValidate = true
     }
     
    return {
      "_id": this.storeDetail[lang]._id,
      "title": this.tForm.get(lang+'.title').value,
      "label": this.tForm.get(lang+'.label').value[lang],
      "description" : this.tForm.get(lang+'.description').value,
      "status": ((status == 'completed' && this.storedData[lang]['status'] == 'completed') || (status == 'completed' && this.selectedLang == 'hindi')) ? 'completed' : (status == 'publish' || status == 'forReview') ? status : 'draft',
      "language": this.tForm.get(lang+'.language').value,
      "tags": this.tForm.get(lang+'.tags').value.join(','),
      "slug": this.storeDetail.slug,
      "thumbnail": {
          "horizontal": {
              "ratio1": {
                  "sourceLink": lang==this.selectedLang ? this.selectedImages.horizontal_large.sourceLink : this.storedData[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'],
                  "gradient": this.tForm.get(lang+'.gradient').value
              },
              "ratio2": {
                  "sourceLink": lang==this.selectedLang ? this.selectedImages.horizontal_medium.sourceLink : this.storedData[lang]['thumbnail']['horizontal']['ratio2']['sourceLink'],
                  "gradient": this.tForm.get(lang+'.gradient').value
              },
              "ratio3": { "sourceLink": "", "gradient": "" }
          },
          "vertical": {
              "ratio1": { "sourceLink": "", "gradient": "" }
          },
          "square": {
              "ratio1": { "sourceLink": "", "gradient": "" }
          }
      },
      "genreList": this.allGenreList.formData['dGenreList'][lang],
      "subGenreList": this.allGenreList.formData['dSubGenreList'][lang],
      "categoryList": this.createRequestCategoryArr(lang),
      "mediaList": this.createMediaList(lang),
      "artistList": this.collectionArtistList[lang],
      "gradient": this.tForm.get(lang + '.gradient').value,
      "gradients": lang == this.selectedLang ? this.imageGradientColorEng : this.imageGradientColorHin,
      "selectedPeripheral": this.createSelectedPeripheralData(lang),
      "mediaCount": 0,
      "episodeCount": 0,
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
      "englishValidated": (status=='completed' || status=='forReview')? true:false,
      "hindiValidated": hinValidate,
      'randomOrder': !!this.tForm.get(lang+'.randomOrder').value ? this.tForm.get(lang+'.randomOrder').value : 0,
    }
  }

  createEpisodeList(lang, arrayElem){
    let dataArr=[];
    arrayElem.forEach(element => {
      if(element['isUsed'])
      {   
        dataArr.push({
          "_id": 0,
          "title": element[lang].title,
          "description": element[lang].description,
          "thumbnail": element[lang].thumbnail,
          "tags": "",
          "sourceLink": element.sourceLink,
          "hlsSourceLink": element.hlsSourceLink,
          "caption": "",
          "duration": element.duration,
          "slug": element.slug,
          "status": "active",
          "genreList": this.allGenreList.formData['dGenreList'][lang],
          "subGenreList": this.allGenreList.formData['dSubGenreList'][lang],
          "categoryList": this.createRequestCategoryArr(lang),
          "artistList": element[lang].artistList,
          "contributionField": "",
          "language": this.tForm.get(lang+'.language').value,
          "displayLanguage": lang=='english'?"en":'hin',
          "order": 0,
          "showId": 0,
          "seasonId": 0,
          "collectionId": 0,
          "collectionSlug": "",
          "showSlug": "",
          "seasonSlug": "",
          "isExclusive": 0,
          "isExclusiveOrder": 0,
          "label": "",
          "location": "",
          "tg": "",
          "mood": "",
          "theme": "",
          "type": "collection",
          "viewCount": element.viewCount,
          "randomOrder": element.randomOrder,
          "parentDetail": {}
        })
      }
    });
    return dataArr;
  }

  // create media list array
  createMediaList(lang){
    let dataArr=[];
    this.videoList.selected.peripheralVideo.forEach(element => {
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

  // create requested data of category list on basis of checked flag status in array.
  createRequestCategoryArr(lang){
    let reqData=[];
    this.tForm.get(lang+'.categoryList').value.forEach(element => {
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

  // create req data of selected periphral status
  createSelectedPeripheralData(lang){
    if(this.videoList.selected.peripheralVideo.length > 0)
    {
      let selectedElement =  this.videoList.selected.peripheralVideo.find(x=> x.selectedPeripheralStatus == true);
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

  sendToCorrection(status, type) {
    this.saveApiCalling=true;
    this.apiService.getApiData(Constants.url.sendToCorrection + '?type='+type+'&status=' + status+'&slug=' + this.storeDetail.slug).subscribe(response => {
      if (response['status'] == 200 ) {
        console.log(response)
        if(status=='reviewed')
          this.toastr.success('Send to review successfully.');
        else if(status=='draft')
          this.toastr.success('Send for correction successfully.');
        
      }
      else
      {
        this.toastr.error(response['message']);
      }
      this.saveApiCalling=false;
    })
  }

  drop(event: CdkDragDrop<Object[]>) {
    console.log(event.previousIndex, event.currentIndex)
    console.log(this.videoList.selected.collectionVideo);
    // const computedPreviousIndex = datasource.indexOf(event.item.data, 0);
    setTimeout(() => 
    moveItemInArray(this.videoList.selected.collectionVideo, event.previousIndex, event.currentIndex)
    , 500);
    
    
  }

}
