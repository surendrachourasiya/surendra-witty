import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/other/services/api.service';
import { Constants } from 'src/app/other/constants';
import { UploadFileService } from 'src/app/other/services/upload-file.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
// import {Observable, of} from 'rxjs';
// import { map } from "rxjs/operators"; 
@Component({
  selector: 'app-update-individual-detail',
  templateUrl: './update-individual-detail.component.html',
  styleUrls: ['./update-individual-detail.component.scss']
})
export class UpdateIndividualDetailComponent implements OnInit {

  constructor(private apiService: ApiService, private fb: FormBuilder, private uploadService: UploadFileService, private router: Router, private route: ActivatedRoute) {
    uploadService.uploadStatus.subscribe(value => {
      if (!!value['loaded']) {
        this.selectedImages[value['objName']].progPer = (value['loaded'] / value['total']) * 100;
      }
    });
  }

  tForm: FormGroup;
  selectedLang: string = 'english';
  currentUrl = '';
  labels = [
    {
      'english': 'new',
      'hindi': 'नया'
    },
    {
      'english': 'viral',
      'hindi': 'वायरल'
    },
    {
      'english': 'trending',
      'hindi': 'चर्चा में'
    }
  ]
  saveApiCalling:boolean = false;

  videoList = {
    all: {
      'collectionVideo': [],
      'peripheralVideo': [],
    },
    selected: {
      'collectionVideo': [],
      'peripheralVideo': [],
    },
    's3Url': {}
  };

  s3Url = {};
  s3UrlIndividual = {};

  individualVideoList=[];
  individualArtistList={
    'english':[],
    'hindi':[]
  };
  imageGradientColorEng = [];
  imageGradientColorHin = [];
  storedData = {
    'english': {
      "thumbnail": {
        "horizontal": {
          "ratio1": {
            "sourceLink": null,
            "gradient": null
          },
          "ratio2": {
            "sourceLink": null,
            "gradient": null
          },
          "ratio3": {
            "sourceLink": "",
            "gradient": ""
          }
        },
        "vertical": {
          "ratio1": {
            "sourceLink": null,
            "gradient": null
          }
        },
        "square": {
          "ratio1": {
            "sourceLink": null,
            "gradient": null
          }
        }
      },
      "activity": {
        "action": "created",
        "writerName": "Kunal",
        "updatedAt": ""
      }
    },
    'hindi': {
      "thumbnail": {
        "horizontal": {
          "ratio1": {
            "sourceLink": null,
            "gradient": null
          },
          "ratio2": {
            "sourceLink": null,
            "gradient": null
          },
          "ratio3": {
            "sourceLink": "",
            "gradient": ""
          }
        },
        "vertical": {
          "ratio1": {
            "sourceLink": null,
            "gradient": null
          }
        },
        "square": {
          "ratio1": {
            "sourceLink": null,
            "gradient": null
          }
        }
      },
      "activity": {
        "action": "created",
        "writerName": "Maverick",
        "updatedAt": ""
      }
    }
  }

  formType: string = 'Create';
  formStatus = {
    'english': false,
    'hindi': false
  }

  storeDetail = {
    'slug': null,
    'english': {
      '_id': 0
    },
    'hindi': {
      '_id': 0
    }
  }

  selecteVideoElement={
    title: null,
    sourceLink: null,
    hlsSourceLink: null,
    duration: null,
    thumbnail: null,
    id:null
  };

  allGenreList = {
    showGenre: false,
    allListData: [],
    selectedData: [],
    formData: {}
  }

  categoryList = [];

  selectedImages = {
    "horizontal_large": {
      file: null,
      progPer: null,
      imgURL: null,
      status: 'empty',
      sourceLink: null,
      widthRatio: 16,
      heightRatio: 9
    },
    "square": {
      file: null,
      progPer: null,
      imgURL: null,
      status: 'empty',
      sourceLink: null,
      widthRatio: 1,
      heightRatio: 1
    },
    "vertical": {
      file: null,
      progPer: null,
      imgURL: null,
      status: 'empty',
      sourceLink: null,
      widthRatio: 9,
      heightRatio: 16
    },
    "horizontal_small": {
      file: null,
      progPer: null,
      imgURL: null,
      status: 'empty',
      sourceLink: null,
      widthRatio: 3,
      heightRatio: 2
    }
  }

  userData = { "_id": "", "email": "", "roleId": 0, "firstName": "", "lastName": "", "lastLogin": "" };

  ngOnInit() {
    this.tForm = new FormGroup({
      'english': new FormGroup({
        'title': new FormControl('', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
        'description': new FormControl('', [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
        'language':new FormControl('', [Validators.required]),
        'artistList':new FormControl([], [Validators.required]),
        'label': new FormControl('', [Validators.required]),
        'categoryList': new FormArray([]),
        'tags': new FormControl([], [Validators.required]),
        'gradient': new FormControl('#fffff', [Validators.required]),
        // 'gradient': new FormControl('#ffffff'),
        'metaTitle': new FormControl('', [Validators.maxLength(50)]),
        'metaKeyword': new FormControl([]),
        'metaDescription': new FormControl('', [Validators.maxLength(500), this.noWhitespaceValidator]),
        'horizontal_large': new FormControl(''),
        'square': new FormControl(''),
        'vertical': new FormControl(''),
        'horizontal_small': new FormControl(''),
        'gradients': new FormControl(''),
        'randomOrder': new FormControl(0)
      }),
      'hindi': new FormGroup({
        'title': new FormControl('', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]),
        'description': new FormControl('', [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]),
        'language':new FormControl('', [Validators.required]),
        'artistList':new FormControl([], [Validators.required]),
        'label': new FormControl('', [Validators.required]),
        'categoryList': new FormArray([]),
        'tags': new FormControl([], [Validators.required]),
        'gradient': new FormControl('#fffff', [Validators.required]),
        // 'gradient': new FormControl('#ffffff'),
        'metaTitle': new FormControl('', [Validators.maxLength(50)]),
        'metaKeyword': new FormControl([]),
        'metaDescription': new FormControl('', [Validators.maxLength(500), this.noWhitespaceValidator]),
        'horizontal_large': new FormControl(''),
        'square': new FormControl(''),
        'vertical': new FormControl(''),
        'horizontal_small': new FormControl(''),
        'gradients': new FormControl(''),
        'randomOrder': new FormControl(0)
      })
    });

    // subscribtion for form validation
    this.tForm.valueChanges.subscribe(result => {
      this.validateForm();
    });
    
    this.route.params.subscribe(params => {
      if (!!params['slug']) {
        this.formType = 'edit';
        this.storeDetail.slug = params['slug'];
      }
    });

    // API call for category and genre sub-genre listing
    this.getCategoryList();
    this.getGenreList();
    this.getIndividualVideoList();
    this.getArtistList();

    var retrievedObject = localStorage.getItem('userdata');
    this.userData = JSON.parse(retrievedObject);

    if(this.route['_routerState'].snapshot.url.match('dashboard/review-publish')) {
      this.currentUrl = 'review-publish';
    } else if(this.route['_routerState'].snapshot.url.match('dashboard/content')) {
      this.currentUrl = 'content';
    }
  }

  // Custom validtor to avoid empty spaces.
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = !(control.value === null || control.value === '' || control.value === undefined) && (control.value).trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  // copy artist language in both the arrays
  copyDataFromOneLangToOther(fieldName) {
    let value = this.tForm.get(this.selectedLang + '.' + fieldName).value;
    if (this.selectedLang == 'english')
      this.tForm.patchValue({
        'hindi': {
          [fieldName]: value
        }
      })
    else
      this.tForm.patchValue({
        'english': {
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
    // this.imagePath = files;
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      var self = this;
      this.checkImageDimension(_event, self,this.selectedImages[objName].widthRatio, this.selectedImages[objName].heightRatio,function (res) {
        if(res)
        {
          self.selectedImages[objName].imgURL = reader.result;
          self.selectedImages[objName].status = 'uploading';
          let imageFileName = 'episodeImage-' + Date.now() + '.' + file.name.split('.')[1];
          self.uploadService.uploadSingleFile(file, imageFileName, 'episode', objName).then(response => {
            if (response) { 
              // API call for uploading/change image
              self.apiService.getApiData(Constants.url.uploadImage + '?type=episode&format=' + objName + '&imageName=' + imageFileName).subscribe(response => {
                if (response['status'] == 200) {
                  self.selectedImages[objName].fileName = imageFileName;
                  self.selectedImages[objName].sourceLink = imageFileName;
                  self.selectedImages[objName].status = 'success';
                  if(self.selectedImages[objName].widthRatio === 1 && self.selectedImages[objName].heightRatio === 1 && self.selectedLang == 'english') {
                    self.imageGradientColorEng = [];
                    self.imageGradientColorEng = response['data']['gradientColor'];

                    if(self.imageGradientColorEng.length > 0){
                      self.setImageColor(self.imageGradientColorEng[0])
                    }
                  }

                  if(self.selectedImages[objName].widthRatio === 1 && self.selectedImages[objName].heightRatio === 1 && self.selectedLang == 'hindi') {
                    self.imageGradientColorHin = [];
                    self.imageGradientColorHin = response['data']['gradientColor'];

                    if(self.imageGradientColorHin.length > 0){
                      self.setImageColor(self.imageGradientColorHin[0])
                    }
                  }

                  self.validateForm();
                  
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
          alert("Image aspect ratio should be " + self.selectedImages[objName].widthRatio +':'+ self.selectedImages[objName].heightRatio);
        }
        self.validateForm();
      })
    }

  }

  checkImageDimension(e, classObj, widthRatio, heightRatio, callback){
    var isValid = false;
    var image = new Image();
    image.src = e.target['result'];
    let self = this;
    image.onload = function (): any {
      if ((image.width*heightRatio/widthRatio) === (image.height)) {
        isValid = true;
        callback(isValid);
      }else{
        callback(isValid);
      }
    };
  }

  checkSlugApi() {
    let reqSlug = '';
    if (!this.storeDetail.english._id) {
      if (this.tForm.get('english.title').valid) {
        reqSlug = this.convertToSlug(this.tForm.get('english.title').value);
        this.apiService.getApiData(Constants.url.checkSlug + '?type=episode&slug=' + reqSlug).subscribe(response => {
          if (response['status'] == 200 && response['data']['exists'] == false) {
            this.storeDetail.slug = reqSlug;
          }else{
            alert("Title already exist");
          }
        });
      }
    }
  }

  // slug convertor
  convertToSlug(text) {
    return text
      .toLowerCase()
      .replace(/\s\s+/g, ' ')
      .replace(/ +/g, '-');
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
    // console.log(this.tForm.get('english.gradient').value);
    // console.log(this.tForm.get('hindi.gradient').value);
  }

  // get genre list
  getGenreList() {
    this.apiService.getApiData(Constants.url.getGenreSubGenreList).subscribe(response => {
      if (response['status'] == 200) {
        this.allGenreList.allListData = response['data']['genreSubGenre'];
        // call if slug is available
        this.viewIndividualDetail(this.storeDetail.slug);
      }
    });
  }

  // public requestAutocompleteItems = (text: string): Observable<Response> => {
  //   return this.apiService.getApiData(Constants.url.getIndividualArtistListing).pipe(map(res => res['data']['artistData']));
  // }

  // get Artist Video list
  getArtistList(){
    this.apiService.getApiData(Constants.url.getIndividualArtistListing).subscribe(response =>{
      if(response['status'] == 200)
      {
        // this.individualArtistList=response['data']['artistData'];
        response['data']['artistData'].map((item) => {
          if(item.displayLanguage == 'en'){
            return this.individualArtistList['english'].push({ 'id': item._id, 'firstName': item.firstName, 'lastName': item.lastName, 'callingName': item.callingName, 'name': item.firstName +' '+item.lastName, 'order': 0, 'city': item.city, 'profilePic':item.profilePic, 'slug': item.slug, 'status': item.status})
          }
          else{
            return this.individualArtistList['hindi'].push({ 'id': item._id, 'firstName': item.firstName, 'lastName': item.lastName, 'callingName': item.callingName, 'name': item.firstName +' '+item.lastName, 'order': 0, 'city': item.city, 'profilePic':item.profilePic, 'slug': item.slug, 'status': item.status})
          }
        })
      }
    });
  }

  // add artist to hindi lang
  addArtistToOther(tag:any){
    let artistHinIndex = this.individualArtistList['hindi'].findIndex(x=>(x.slug == tag.slug));
    if(artistHinIndex > -1)
    {
      let value = this.tForm.get('hindi.artistList').value;
      value.push(this.individualArtistList['hindi'][artistHinIndex])

      this.tForm.patchValue({
        'hindi': {
          'artistList': value
        }
      });
    }
  }

  // remove artist to other lang
  removeArtistToOther(tag:any){
    let otherLang = this.selectedLang == 'english'?'hindi':'english';

    let value = this.tForm.get(otherLang+'.artistList').value;
    let valueIndex = value.findIndex(x => x.slug == tag.slug);
    value.splice(valueIndex, 1);

    this.tForm.patchValue({
      [otherLang]: {
        'artistList': value
      }
    });
  }

  // remove artist to other lang
  // removeArtistToOther(tag:any, formIndex){
  //   let otherLang = this.selectedLang == 'english'?'hindi':'english';

  //   let value = this.detailFields('hindi')['controls'][formIndex]['controls']['artistList'].value;
  //   let valueIndex = value.findIndex(x => x.slug == tag.slug);
  //   value.splice(valueIndex, 1);

  //   this.detailFields(otherLang)['controls'][formIndex].patchValue({
  //     'artistList': value
  //   });
  // }

  // get Artist Video list
  getIndividualVideoList(){
    if(this.individualVideoList.length <= 0)
    {
      this.apiService.getApiData(Constants.url.getIndividualVideoList).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.individualVideoList=response['data']['episodeVideo'];
          this.s3UrlIndividual = response['data']['s3Url'];
          this.s3Url = response['data']['s3Url'];

        }
      });
    }
  }

   // bind/unbind the artis Story
   bindUnbindArtistStory(item){
    if(!item)
    {
      this.selecteVideoElement={
        title: null,
        sourceLink: null,
        hlsSourceLink: null,
        duration: null,
        thumbnail: null,
        id: null
      };
      // this.storedData.english.mediaList = [];
      // this.storedData.hindi.mediaList  = [];
    }
    else{
      item.id = Math.floor(Math.random() * 100) + 1;
      this.selecteVideoElement = item;
      // this.storedData.english.mediaList.push(item);
      // this.storedData.hindi.mediaList.push(item);
    }
      

    this.validateForm();
  }

  // get category list
  getCategoryList() {
    this.apiService.getApiData(Constants.url.getCategoryList).subscribe(response => {
      if (response['status'] == 200) {
        let newData = [];
        let categorySlugs = [];
        for (let element of response['data']['categories']) {
          var indexVal = categorySlugs.indexOf(element.slug);
          if (indexVal == -1) {
            let obj = {}
            obj['slug'] = element.slug;
            if (element.language === 'en') {
              obj['english'] = { 'id': element._id, 'name': element.name };
            } else {
              obj['hindi'] = { 'id': element._id, 'name': element.name };
            }
            newData.push(obj);
            categorySlugs.push(element.slug);
          } else {
            if (element.language === 'en') {
              newData[indexVal]['english'] = { 'id': element._id, 'name': element.name };
            } else {
              newData[indexVal]['hindi'] = { 'id': element._id, 'name': element.name };
            }
          }
        }

        newData.forEach((o, i) => {
          let formArray = this.tForm.get('english' + '.categoryList') as FormArray;
          let hinFormArray = this.tForm.get('hindi' + '.categoryList') as FormArray;
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
        this.categoryList = newData;
      }
    });
  }

  // view collection detail
  viewIndividualDetail(slug) {
    if (!!slug) {
      let url = Constants.url.viewIndividualDetail + '?slug=' + slug;
      this.apiService.getApiData(url).subscribe(response => {
        if (response['status'] == 200) {
          if (!!response['data']['episodeData']) {
            let resdata = this.storedData = response['data']['episodeData'];
            this.s3Url = response['data']['s3Url'];
            this.allGenreList.selectedData = resdata['english']['subGenreList'];
            this.allGenreList.showGenre = true;

            // store id and slug detail
            this.storeDetail.english._id = resdata['english']['_id'];
            this.storeDetail.hindi._id = resdata['hindi']['_id'];
            this.storeDetail.slug = resdata['english']['slug'];

            // set up video
            this.selecteVideoElement.sourceLink=resdata['english']['sourceLink'];
            this.selecteVideoElement.hlsSourceLink=resdata['english']['hlsSourceLink'];
            this.selecteVideoElement.duration=resdata['english']['duration'];

            resdata['english']['gradient']= !!resdata['english']['gradient']==true?resdata['english']['gradient']:'#ffffff';
            resdata['hindi']['gradient']=!!resdata['hindi']['gradient']==true?resdata['hindi']['gradient']:'#ffffff';

            resdata['english']['gradients']= !!resdata['english']['gradients']==true?resdata['english']['gradients']:'#ffffff';
            resdata['hindi']['gradients']=!!resdata['hindi']['gradients']==true?resdata['hindi']['gradients']:'#ffffff';
            // console.log(resdata['english']['gradients']);
            // console.log(resdata['hindi']['gradients']);
            

            this.imageGradientColorEng = !!resdata['english']['gradients'] == true ? resdata['english']['gradients'] : [];
            this.imageGradientColorHin = !!resdata['hindi']['gradients'] == true ? resdata['hindi']['gradients'] : [];

            this.setValueIntoForm('english', resdata);
            this.setValueIntoForm('hindi', resdata);
            this.setValueOfCategoryList('english', resdata['english']['categoryList']);
            this.setImagesIntoForm('english', resdata);
            this.setLabelValueIntoForm('english', resdata);

            this.validateForm();
          }
        }
      });
    }
    else {
      this.allGenreList.showGenre = true;
    }
  }

  setLabelValueIntoForm(lang, resdata) {
    if (!!resdata[lang]['label']) {
      this.labels.forEach(element => {
        if (element[lang] == resdata[lang]['label']) {
          this.tForm.patchValue({
            [lang]: {
              'label': element
            }
          })
        }
      });
      this.copyDataFromOneLangToOther('label');
    }
  }

  changeSelectedLang(lang) {
    if (this.selectedLang != lang) {
      // this.tForm.reset();
      let prevLang = this.selectedLang;
      this.selectedLang = lang;
      // this.imageGradientColor = [];
      // this.imageGradientColor = !!this.storedData[lang]['gradients'] == true ? this.storedData[lang]['gradients'] : []
      
      this.setValueIntoForm(lang, this.storedData);
      this.setValueIntoForm(prevLang, this.storedData);

      // this.setValueOfCategoryList(lang, this.storedData[prevLang]['categoryList']);

      this.setImagesIntoForm(lang, this.storedData);

      this.validateForm();
    }
  }

  // form validate function
  validateForm() {
    if (this.tForm.get('english').valid && this.validateImages && !!this.selecteVideoElement.sourceLink)
      this.formStatus['english'] = true;
    else
      this.formStatus['english'] = false;

    if (this.tForm.get('hindi').valid && this.validateImages && !!this.selecteVideoElement.sourceLink)
      this.formStatus['hindi'] = true;
    else
      this.formStatus['hindi'] = false;
  }

  // validate  iamge status
  get validateImages() {
    if (this.selectedImages.horizontal_large.status != 'success' || this.selectedImages.square.status != 'success' || this.selectedImages.vertical.status != 'success' || this.selectedImages.horizontal_small.status != 'success')
      return false;
    return true;
  }

  //  Save data as draft for both add/edit
  saveApiCall(lang, status) {
    
    if (this.tForm.get(lang + '.title').invalid) {
      this.tForm.get(lang + '.title').markAllAsTouched();
    }
    // api call to save as draft
    else {
      
      this.saveApiCalling=true;
      if (!this.formStatus[lang] && status == 'completed'){
        this.validateAllFormFields(this.tForm, lang);
        this.saveApiCalling=false;
        return false;
      }
      // return false;

      let tempArr: any = {};
      tempArr['english'] = this.createRequestArray('english', status);
      tempArr['hindi'] = this.createRequestArray('hindi', status);
      tempArr['episodes'] = [];

      tempArr['english']['gradients'] = this.imageGradientColorEng;
      tempArr['hindi']['gradients'] = this.imageGradientColorHin;

      this.apiService.postData(Constants.url.updateIndividualDetail, tempArr).subscribe(response => {
        if (response['status'] == 200) {
          this.storeDetail.english._id = response['data']['episodeId']['en'];
          this.storeDetail.hindi._id = response['data']['episodeId']['hin'];
          
          this.storedData = tempArr;
          window.scrollTo(0, 0)
          if (status == 'completed' && this.selectedLang == 'english') {
            this.changeSelectedLang('hindi');
          }
          else if (status == 'completed' && this.selectedLang == 'hindi') {
            if (this.formType == 'Create')
              this.router.navigate(['../listing/individual'], { queryParams: { 'type': 'completed' }, relativeTo: this.route })
            else
              this.router.navigate(['../../listing/individual'], { queryParams: { 'type': 'completed' }, relativeTo: this.route })
          } else if(status == 'publish') {
            this.router.navigate(['../../listing/review'], { queryParams: { 'type': 'individual' }, relativeTo: this.route })
          }
        }
        this.saveApiCalling=false;
      });

    }
  }

  // function for mark field as validate -------------------
  validateAllFormFields(formGroup: FormGroup, lang:string) {         
    Object.keys(formGroup.controls[lang]['controls']).forEach(field => {  
    
        const control = formGroup.controls[lang].get(field);             
          if (control instanceof FormControl) {      
            // console.log(field);
            // console.log(formGroup.controls[lang].get(field).status);
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {        
            this.validateAllFormFields(control, lang);            
          }
      });
    }

  // set image into form
  setImagesIntoForm(lang, resdata) {
    this.tForm.patchValue({
      [lang]: {
        'horizontal_large': '',
        'square': '',
        'vertical': '',
        'horizontal_small': ''
      }
    })

    this.selectedImages = {
      "horizontal_large": {
        file: null,
        progPer: null,
        imgURL: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'] == true ? this.s3Url['basePath'] + this.s3Url['episodePath'] + Constants.image.horizontalMedium + resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'] : null,
        status: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'] == true ? 'success' : 'empty',
        sourceLink: !!resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'] == true ? resdata[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'] : null,
        widthRatio: 16,
        heightRatio: 9
      },
      "square": {
        file: null,
        progPer: null,
        imgURL: !!resdata[lang]['thumbnail']['square']['ratio1']['sourceLink'] == true ? this.s3Url['basePath'] + this.s3Url['episodePath'] + Constants.image.squareMedium + resdata[lang]['thumbnail']['square']['ratio1']['sourceLink'] : null,
        status: !!resdata[lang]['thumbnail']['square']['ratio1']['sourceLink'] == true ? 'success' : 'empty',
        sourceLink: !!resdata[lang]['thumbnail']['square']['ratio1']['sourceLink'] == true ? resdata[lang]['thumbnail']['square']['ratio1']['sourceLink'] : null,
        widthRatio: 1,
        heightRatio: 1
      },
      "vertical": {
        file: null,
        progPer: null,
        imgURL: !!resdata[lang]['thumbnail']['vertical']['ratio1']['sourceLink'] == true ? this.s3Url['basePath'] + this.s3Url['episodePath'] + Constants.image.verticalMedium + resdata[lang]['thumbnail']['vertical']['ratio1']['sourceLink'] : null,
        status: !!resdata[lang]['thumbnail']['vertical']['ratio1']['sourceLink'] == true ? 'success' : 'empty',
        sourceLink: !!resdata[lang]['thumbnail']['vertical']['ratio1']['sourceLink'] == true ? resdata[lang]['thumbnail']['vertical']['ratio1']['sourceLink'] : null,
        widthRatio: 9,
        heightRatio: 16
      },
      "horizontal_small": {
        file: null,
        progPer: null,
        imgURL: !!resdata[lang]['thumbnail']['horizontal']['ratio3']['sourceLink'] == true ? this.s3Url['basePath'] + this.s3Url['episodePath'] + Constants.image.horizontalSmall + resdata[lang]['thumbnail']['horizontal']['ratio3']['sourceLink'] : null,
        status: !!resdata[lang]['thumbnail']['horizontal']['ratio3']['sourceLink'] == true ? 'success' : 'empty',
        sourceLink: !!resdata[lang]['thumbnail']['horizontal']['ratio3']['sourceLink'] == true ? resdata[lang]['thumbnail']['horizontal']['ratio3']['sourceLink'] : null,
        widthRatio: 3,
        heightRatio: 2
      }
    }
  }

  // set patch values from old array or response data into form
  setValueIntoForm(lang, arrData) {
  
    if(arrData[lang]['artistList'].length > 0){
      arrData[lang]['artistList'].map((item) => {
        return item['display'] = item['name']
      })
    }
    
    this.tForm.patchValue({
      [lang]: {
        "title": arrData[lang]['title'],
        "description": arrData[lang]['description'],
        "tags": !!arrData[lang]['tags'] == true ? arrData[lang]['tags'].split(',') : [],
        // "gradient": arrData[lang]['thumbnail']['horizontal']['ratio1']['gradient'], //setting 
        "gradient": arrData[lang]['gradient'],
        "metaTitle": arrData[lang]['metaTitle'],
        "language": arrData[lang]['language'],
        "metaKeyword": !!arrData[lang]['metaKeyword'] == true ? arrData[lang]['metaKeyword'].split(',') : [],
        "metaDescription": arrData[lang]['metaDescription'],
        "artistList": arrData[lang]['artistList'],
        'randomOrder': arrData[lang]['randomOrder']
      }
    });
  }

  setValueOfCategoryList(lang, list) {
    let formArray = this.tForm.get(lang + '.categoryList') as FormArray;
    list.forEach(element => {
      let index = formArray.value.findIndex(x => x.id == element.id)
      if (index > -1) {
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
  createRequestArray(lang, status) {
    
    var hinValidate = false;
     if (status == 'completed' && this.selectedLang == 'hindi') {
       hinValidate = true
     } else if (status == 'forReview' || status == 'publish') {
       hinValidate = true
     }

    return {
      "_id": this.storeDetail[lang]._id,
      "title": this.tForm.get(lang + '.title').value,
      "label": this.tForm.get(lang + '.label').value[lang],
      "description": this.tForm.get(lang + '.description').value,
      "status": ((status == 'completed' && this.storedData[lang]['status'] == 'completed') || (status == 'completed' && this.selectedLang == 'hindi')) ? 'completed' : (status == 'publish' || status == 'forReview') ? status : 'draft',
      "language": this.tForm.get(lang+'.language').value,
      "tags": this.tForm.get(lang + '.tags').value.join(','),
      "slug": this.storeDetail.slug,
      "thumbnail": {
        "horizontal": {
          "ratio1": {
            "sourceLink": lang == this.selectedLang ? this.selectedImages.horizontal_large.sourceLink : this.storedData[lang]['thumbnail']['horizontal']['ratio1']['sourceLink'],
            "gradient": this.tForm.get(lang + '.gradient').value
          },
          "ratio3": {
            "sourceLink": lang == this.selectedLang ? this.selectedImages.horizontal_small.sourceLink : this.storedData[lang]['thumbnail']['horizontal']['ratio3']['sourceLink'],
            "gradient": this.tForm.get(lang + '.gradient').value
          },
          "ratio2": {
            "sourceLink": "",
            "gradient": ""
          }
        },
        "vertical": {
          "ratio1": {
            "sourceLink": lang == this.selectedLang ? this.selectedImages.vertical.sourceLink : this.storedData[lang]['thumbnail']['vertical']['ratio1']['sourceLink'],
            "gradient": this.tForm.get(lang + '.gradient').value
          }
        },
        "square": {
          "ratio1": {
            "sourceLink": lang == this.selectedLang ? this.selectedImages.square.sourceLink : this.storedData[lang]['thumbnail']['square']['ratio1']['sourceLink'],
            "gradient": this.tForm.get(lang + '.gradient').value
          }
        }
      },
      "sourceLink": this.selecteVideoElement['sourceLink'],
      "hlsSourceLink": this.selecteVideoElement['hlsSourceLink'],
      "duration": this.selecteVideoElement['duration'],
      "genreList": this.allGenreList.formData['dGenreList'][lang],
      "subGenreList": this.allGenreList.formData['dSubGenreList'][lang],
      "artistList": this.tForm.get(lang + '.artistList').value,
      "categoryList": this.createRequestCategoryArr(lang),
      "gradient": this.tForm.get(lang + '.gradient').value,
      "gradients": lang == this.selectedLang ? this.imageGradientColorEng : this.imageGradientColorHin,
      "mediaList": [],
      "selectedPeripheral": {},
      "mediaCount": 0,
      "episodeCount": 0,
      "metaTitle": this.tForm.get(lang + '.metaTitle').value,
      "metaKeyword": this.tForm.get(lang + '.metaKeyword').value.join(','),
      "metaDescription": this.tForm.get(lang + '.metaDescription').value,
      // "activity": {
      //   "action": this.formType == 'add' ? 'created' : 'updated',
      //   "writerName": "Maverick",
      //   "updatedAt": "" //from backend
      // },
      "activity": {
        "action": !this.storedData[lang]['slug']==true?'created':'updated',
        "writerName": this.userData.firstName,
        "roleId": this.userData.roleId,
        "updatedAt": "" //from backend
      },
      "displayLanguage": lang == 'english' ? 'en' : 'hin',
      "englishValidated": (status == 'completed' || status == 'forReview') ? true : false,
      "hindiValidated": hinValidate,
      "randomOrder": !!this.tForm.get(lang + '.randomOrder').value?this.tForm.get(lang + '.randomOrder').value:0
    }
  }

  // create requested data of category list on basis of checked flag status in array.
  createRequestCategoryArr(lang) {
    let reqData = [];
    this.tForm.get(lang + '.categoryList').value.forEach(element => {
      if (element.checked == true) {
        reqData.push({
          'id': element.id,
          'name': element.name
        })
      }
    });

    return reqData;
  }

  sendToCorrection(status, type) {
    this.saveApiCalling = true;
    this.apiService.getApiData(Constants.url.sendToCorrection + '?type='+type+'&status=' + status+'&slug=' + this.storeDetail.slug).subscribe(response => {
      if (response['status'] == 200 ) {
        if(status === 'draft') {
          this.router.navigate(['../../listing/review'], { queryParams: { 'type': 'individual' }, relativeTo: this.route })
        }
        this.saveApiCalling = false;
      }
    })
  }

}
