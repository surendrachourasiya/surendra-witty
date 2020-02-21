import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/other/services/api.service';
import { Constants } from 'src/app/other/constants';
import { UploadFileService } from 'src/app/other/services/upload-file.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as $ from "jquery";


@Component({
  selector: 'app-update-artist-detail',
  templateUrl: './update-artist-detail.component.html',
  styleUrls: ['./update-artist-detail.component.scss']
})
export class UpdateArtistDetailComponent implements OnInit {


  constructor(private apiService:ApiService, private uploadService: UploadFileService, private router:Router, private route: ActivatedRoute ) { 
    

    uploadService.uploadStatus.subscribe(value => {
      if(!!value['loaded'])
      {
        this.selectedImageElement.progPer= (value['loaded']/value['total'])*100;
        //console.log('test >>', this.selectedImageElement.progPer)
      } 
    });
  }
    
  tForm: FormGroup;
  artistVideoList=[];
  s3Url={};
  formType:string='add';
  currentUrl = '';

  formStatus={
    'english': false,
    'hindi': false
  }
  
  selecteVideoElement={
    title: null,
    sourceLink: null,
    hlsSourceLink: null,
    duration: null,
    thumbnail: null,
    id:null,
    selectedPeripheralStatus: false

  };

  selectedImageElement={
    file: null,
    progPer: null,
    imgURL: null,
    status: 'empty',
    fileName: null
  }

  allGenreList={
    showGenre:false,
    allListData:[],
    selectedData:[],
    formData:{}
  }

  imageGradientColor = [];
  currentDate = ((new Date()).getFullYear() - 15) + "-12-31" ;

  oldDataArr:any={
    "english": {
        "_id": 0,
        "firstName": "",
        "lastName": "",
        "middleName": "",
        "callingName": "",
        "description": "",
        "gender": "",
        "dob": "",
        "state": "",
        "city": "",
        "artistLanguage": "",
        "genreList": [],
        "subGenreList": [],
        "tags": "",
        "profilePic": "",
        "gradientColor": "#ffffff",
        "status": "draft",
        "slug": "",
        "language": [],
        "mediaList": [],
        "bio": "",
        "story": {
            "title": "",
            "sourceLink": "",
            "hlsSourceLink": "",
            "duration": 0,
            "thumbnail": "",
            "id":0
        },
        "displayLanguage": "en",
        "englishValidated": false,
        "hindiValidated": false,
        "activity": {
            "action": "created",
            "writerName": "Kunal",
            "updatedAt": ""
        }
    },
    "hindi": {
        "_id": 0,
        "firstName": "",
        "lastName": "",
        "middleName": "",
        "callingName": "",
        "description": "",
        "gender": "",
        "dob": "",
        "state": "",
        "city": "",
        "genreList": [],
        "subGenreList": [],
        "artistLanguage": "",
        "tags": "",
        "profilePic": "",
        "gradientColor": "#ffffff",
        "status": "draft",
        "slug": "",
        "language": [],
        "mediaList": [],
        "bio": "",
        "story": {
            "title": "",
            "sourceLink": "",
            "hlsSourceLink": "",
            "duration": 0,
            "thumbnail": "",
            "id": ""
        },
        "displayLanguage": "hin",
        "englishValidated": false,
        "hindiValidated": false,
        "activity": {
            "action": "created",
            "writerName": "Maverick",
            "updatedAt": ""
        }
    },
    "peripheral" : {
        "oldName" : "",
        "newName" : ""
    },
    "newImagelStatus" : true
  }

  selectedLang:string='english';
  userData = { "_id": "", "email": "", "roleId": 0, "firstName": "", "lastName": "", "lastLogin": "" };


  ngOnInit() {
    this.tForm = new FormGroup({
        'english' : new FormGroup({
            'firstName': new FormControl('', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]),
            'lastName' : new FormControl('', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]),
            'middleName' : new FormControl('', [Validators.maxLength(20), this.noWhitespaceValidator]),
            'callingName' : new FormControl('', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]),
            'description' : new FormControl('', [Validators.required, Validators.maxLength(100)]),
            'bio' : new FormControl('', [Validators.required, Validators.maxLength(500)]),
            'gender' : new FormControl('', [Validators.required]),
            'dob': new FormControl('', [Validators.required]),
            'state': new FormControl('', [Validators.required,  Validators.maxLength(35), this.noWhitespaceValidator]),
            'city': new FormControl('', [Validators.required,  Validators.maxLength(35), this.noWhitespaceValidator]),
            'artistLanguage': new FormControl('', [Validators.required]),
            'language':new FormControl('', [Validators.required]),
            'tags':new FormControl([], [Validators.required]),
            'gradientColor': new FormControl('#fffff', [Validators.required]),
            'profilePic': new FormControl('', []),
            'storyTitle': new FormControl('', [Validators.maxLength(100)]),
            "randomOrder" : new FormControl(0)

        }),
        'hindi' : new FormGroup({
            'firstName': new FormControl('', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]),
            'lastName' : new FormControl('', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]),
            'middleName' : new FormControl('', [Validators.maxLength(20), this.noWhitespaceValidator]),
            'callingName' : new FormControl('', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]),
            'description' : new FormControl('', [Validators.required, Validators.maxLength(100)]),
            'bio' : new FormControl('', [Validators.required, Validators.maxLength(500)]),
            'gender' : new FormControl('', [Validators.required]),
            'dob': new FormControl('', [Validators.required]),
            'state': new FormControl('', [Validators.required,  Validators.maxLength(35), this.noWhitespaceValidator]),
            'city': new FormControl('', [Validators.required,  Validators.maxLength(35), this.noWhitespaceValidator]),
            'artistLanguage': new FormControl('', [Validators.required]),
            'language':new FormControl('', [Validators.required]),
            'tags':new FormControl([], [Validators.required]),
            'gradientColor': new FormControl('#fffff', [Validators.required]),
            'profilePic': new FormControl('', []),
            'storyTitle': new FormControl('', [Validators.maxLength(100)]),
            "randomOrder" : new FormControl(0)
        })
    });

    this.tForm.valueChanges.subscribe(result => {
        this.validateForm();
    });

    this.route.params.subscribe(params => {
      if(!!params['slug'])
      {
        this.formType='edit';
        this.oldDataArr.english.slug=this.oldDataArr.hindi.slug =params['slug'];
      }
    })

    this.getArtistVideoList();
    this.getGenreList();

    var retrievedObject = localStorage.getItem('userdata');
    this.userData = JSON.parse(retrievedObject);

    if(this.route['_routerState'].snapshot.url.match('review-publish')) {
      this.currentUrl = 'review-publish';
    } else if(this.route['_routerState'].snapshot.url.match('content')) {
      this.currentUrl = 'content';
    }
  }


//   public ngAfterViewInit() {
//     this.cropper = new Cropper(this.imageElement.nativeElement, {
//         zoomable: false,
//         scalable: false,
//         aspectRatio: 1,
//         crop: () => {
//             const canvas = this.cropper.getCroppedCanvas();
//             this.imageDestination = canvas.toDataURL("image/png");
//         }
//     });
// }


  // Custom validtor to avoid empty spaces.
  public noWhitespaceValidator(control: FormControl) 
  {
    let isWhitespace = !(control.value === null || control.value === '' || control.value === undefined) && (control.value).trim().length === 0; 
    let isValid = !isWhitespace; 
    return isValid ? null : { 'whitespace': true }; 
  }

  changeSelectedLang(lang)
  {
    if(this.selectedLang != lang)
    {
      this.tForm.reset();
      this.selectedLang=lang;
      
      this.setValueIntoForm('english', this.oldDataArr);
      this.setValueIntoForm('hindi', this.oldDataArr);
    }
  }

  // set patch values from old array or response data into form
  setValueIntoForm(lang, arrData){
    this.tForm.patchValue({
      [lang]:{
        "firstName": arrData[lang]['firstName'],
        "lastName": arrData[lang]['lastName'],
        "middleName": arrData[lang]['middleName'],
        "callingName": arrData[lang]['callingName'],
        "description": arrData[lang]['description'],
        "artistLanguage": arrData[lang]['artistLanguage'],
        "gender": arrData[lang]['gender'],
        "dob": arrData[lang]['dob'],
        "state": arrData[lang]['state'],
        "city": arrData[lang]['city'], 
        "tags": arrData[lang]['tags'],
        // "profilePic": this.selectedImageElement.fileName,
        "gradientColor": arrData[lang]['gradientColor'],
        "language": arrData[lang]['language'][0],
        "bio": arrData[lang]['bio'],
        "storyTitle": !!arrData[lang]['mediaList'][0] ? arrData[lang]['mediaList'][0]['title'] : '',
        "randomOrder": arrData[lang]['randomOrder']
      }
    });
  }

  // form validate function
  validateForm(){
    //if(this.tForm.get('english').valid && this.selectedImageElement.status == 'success' && !!this.selecteVideoElement.sourceLink)
    if(this.tForm.get('english').valid && this.selectedImageElement.status == 'success')
      this.formStatus['english']= true;
    else
      this.formStatus['english']= false;

    //if(this.tForm.get('hindi').valid && this.selectedImageElement.status == 'success' && !!this.selecteVideoElement.sourceLink)
    if (this.tForm.get('hindi').valid && this.selectedImageElement.status == 'success')
      this.formStatus['hindi']= true;
    else
      this.formStatus['hindi']= false;
  }
  

  // get Artist Video list
  getArtistVideoList(){
    if(this.artistVideoList.length <= 0)
    {
      this.apiService.getApiData(Constants.url.getUnbindArtistVideoList).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.artistVideoList=response['data']['artistVideo'];
          this.s3Url = response['data']['s3Url'];
        }
      });
    }
  }

  
  // get genre list
  getGenreList(){
      this.apiService.getApiData(Constants.url.getGenreSubGenreList).subscribe(response =>{
        if(response['status'] == 200)
        {
          this.allGenreList.allListData=response['data']['genreSubGenre'];
          this.viewArtistDetail(this.oldDataArr.english.slug);
        }
      });
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
        id: null,
        selectedPeripheralStatus: false
      };
      this.oldDataArr.english.mediaList = [];
      this.oldDataArr.hindi.mediaList  = [];
    }
    else{
      item.id = Math.floor(Math.random() * 100) + 1;
      this.selecteVideoElement = item;
      if(this.currentUrl == 'review-publish'){
        this.selecteVideoElement.selectedPeripheralStatus = true;
      }
      item['selectedPeripheralStatus']=true;
      this.oldDataArr.english.mediaList.push(item);
      this.oldDataArr.hindi.mediaList.push(item);
    }

    this.validateForm();
  }

  changePeripheralStatus(event) {
      this.oldDataArr.english.mediaList.filter((item, index) => {
        if(item.thumbnail === this.selecteVideoElement.thumbnail) {
          this.oldDataArr.english.mediaList[index].selectedPeripheralStatus = event.srcElement.checked;
          this.selecteVideoElement.selectedPeripheralStatus = event.srcElement.checked;
        } else {
          this.oldDataArr.english.mediaList[index].selectedPeripheralStatus = false;
        }
      })
  }

  // copy artist language in both the arrays
  copyDataFromOneLangToOther(fieldName){
    setTimeout(() => {
      let value = this.tForm.get(this.selectedLang + '.' + fieldName).value;
      if (this.selectedLang == 'english') {
        this.tForm.patchValue({
          'hindi': {
            [fieldName]: value
          }
        })
      } else {
        this.tForm.patchValue({
          'english': {
            [fieldName]: value
          }
        })
      }
    }, 1000);
  }

  // artist image change 
  changeArtistImage(event){    
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
      this.checkImageDimension(_event, self,function (res) {
        if (res){

          var imageFileName = '';
          if (self.artistImageName == '') {
            var rand = '_' + Math.floor(0 + Math.random() * 10)
            var split = file.name.split('.');
            var name = split[0] + rand +'.'+split[split.length - 1]
            self.artistImageName = name;
            imageFileName = name;
          } else {
            imageFileName = self.artistImageName
          }

          self.uploadService.uploadSingleFile(file, imageFileName, 'artist', 'artistImage').then(response => 
            {
            if (response) {
              console.log(response);
              
              // API call for uploading/change image
              //self.apiService.getApiData(Constants.url.uploadImage + '?type=artist&format=rectangle&imageName=' + imageFileName).subscribe(response => {
              self.apiService.getApiData(Constants.url.uploadImage + '?type=artist&format=square&imageName=' + imageFileName).subscribe(response => {
                if (response['status'] == 200) {
                  self.imageGradientColor = response['data']['gradientColor'];
                  self.selectedImageElement.status = 'success';
                  self.selectedImageElement.fileName = imageFileName;

                  self.selectedImageElement.imgURL = "https://stage-videos.s3.ap-south-1.amazonaws.com/temp/artist/" + imageFileName;
                  // self.selectedImageElement.imgURL = reader.result; 
                  //let imageFileName = 'artistImage_' + Date.now() + '.' + file.name.split('.')[1];

                  if(self.imageGradientColor.length > 0){
                    self.setImageColor(self.imageGradientColor[0])
                  }
                }
                else{
                  self.selectedImageElement.status = 'failed';
                }
              });
            } else {
              self.selectedImageElement.status = 'failed';
            }
            self.validateForm();
          }, error => {
            self.selectedImageElement.status = 'failed';
          })
        } else {
          self.selectedImageElement.status = 'failed';
          //alert("Image aspect ratio should be 2:1 and height and width should be greater than 400px");
          alert("Image aspect ratio should be 1:1 and height and width should be greater than 400px");

        }
      });
    }
  }



   /** on event */
  //  onCrop(e: ImgCropperEvent) {
  //   this.croppedImg = e.dataURL;
  //   console.log('e');
  //   console.log(e);
  // }
  // /** manual crop */
  // getCroppedImg() {
  //   const img = this.imgCropper.crop();
  //   console.log(img);
  //   return img.dataURL;
  // }


   


  checkImageDimension(e, classObj, callback){
    var isValid = false;
    var image = new Image();
    image.src = e.target['result'];
    let self = this;
    image.onload = function (): any {
      if (image.height !== image.width) {
        callback(isValid);
        return false;
      }
      if(image.height < 400){
        callback(isValid);
        return false;
      }
      // else if (image.height === (image.width / 2)) {
      //   isValid = true;
      //   callback(isValid);
      // }
      
      else{
        isValid = true;
        callback(isValid);
      }
    };
  }

  // view arist detail
  viewArtistDetail(slug){
    let url = Constants.url.viewArtistDetail+'?slug='+slug;
    this.apiService.getApiData(url).subscribe(response =>{
      if(response['status'] == 200)
      {
        if(!!response['data']['artistData'])
        {
          let resdata=response['data']['artistData'];
          resdata['english']['tags']=!!resdata['english']['tags'] == true ? resdata['english']['tags'].split(',') : []
          resdata['hindi']['tags']=!!resdata['hindi']['tags'] == true ? resdata['hindi']['tags'].split(',') : []

          resdata['english']['gradientColor']= !!resdata['english']['gradientColor']==true?resdata['english']['gradientColor']:'#ffffff';
          resdata['hindi']['gradientColor']=!!resdata['hindi']['gradientColor']==true?resdata['hindi']['gradientColor']:'#ffffff';

          this.imageGradientColor = !!resdata['english']['gradients'] == true ? resdata['english']['gradients'] : []

          this.setValueIntoForm('english', resdata);
          this.setValueIntoForm('hindi', resdata);
          
          Object.keys(this.oldDataArr['english']).forEach((key, value) =>{
            this.oldDataArr['english'][key] = resdata['english'][key];
          });
          
          Object.keys(this.oldDataArr['hindi']).forEach((key, value) =>{
            this.oldDataArr['hindi'][key] = resdata['hindi'][key];
          });
          
          this.oldDataArr['peripheral']['oldName']=resdata['english']['story']['sourceLink'];
          this.oldDataArr['newImagelStatus']=false;

          // set up image 
          if (resdata['english']['profilePic'] !== ''){
            this.selectedImageElement.fileName = resdata['english']['profilePic'];
            this.selectedImageElement.imgURL = response['data']['s3Url']['basePath'] + response['data']['s3Url']['artistPath'] + '/' + resdata['english']['profilePic'];
            this.selectedImageElement.progPer = 100;
            this.selectedImageElement.status = 'success';
            
            this.checkRectImage(resdata['english']['profilePic'], response['data']['s3Url']['basePath'], response['data']['s3Url']['artistPath']);
          }else{
            this.selectedImageElement.fileName = null;
            this.selectedImageElement.imgURL = null;
            this.selectedImageElement.progPer = null;
            this.selectedImageElement.status = 'empty';
            this.selectedImageElement.file = null;
          }

          // set up video
          if (resdata['english']['mediaList'].length > 0 && resdata['english']['mediaList'][0]['hlsSourceLink'] != undefined)
          {
            this.selecteVideoElement.title=resdata['english']['mediaList'][0]['title'];
            this.selecteVideoElement.sourceLink=resdata['english']['mediaList'][0]['sourceLink'];
            this.selecteVideoElement.duration=resdata['english']['mediaList'][0]['duration'];
            this.selecteVideoElement.thumbnail = resdata['english']['mediaList'][0]['thumbnail'];
            this.selecteVideoElement.id = resdata['english']['mediaList'][0]['id'];
            this.selecteVideoElement.hlsSourceLink = resdata['english']['mediaList'][0]['hlsSourceLink'];
            this.selecteVideoElement.selectedPeripheralStatus = !resdata['english']['mediaList'][0]['selectedPeripheralStatus']?false:true;
          } else if (resdata['hindi']['mediaList'].length > 0 && resdata['hindi']['mediaList'][0]['hlsSourceLink'] != undefined) {
            this.selecteVideoElement.title = resdata['hindi']['mediaList'][0]['title'];
            this.selecteVideoElement.sourceLink = resdata['hindi']['mediaList'][0]['sourceLink'];
            this.selecteVideoElement.duration = resdata['hindi']['mediaList'][0]['duration'];
            this.selecteVideoElement.thumbnail = resdata['hindi']['mediaList'][0]['thumbnail'];
            this.selecteVideoElement.id = resdata['hindi']['mediaList'][0]['id'];
            this.selecteVideoElement.hlsSourceLink = resdata['hindi']['mediaList'][0]['hlsSourceLink'];
            this.selecteVideoElement.selectedPeripheralStatus = !resdata['english']['mediaList'][0]['selectedPeripheralStatus']?false:true;
          }

          if (resdata['english']['mediaList'].length == 1){
            this.selecteVideoElement.selectedPeripheralStatus = true;
          }

          this.allGenreList.selectedData=resdata['english']['subGenreList'];
          this.allGenreList.showGenre=true;

          // validate the form
          this.validateForm();
        }
        else
        {
          this.allGenreList.showGenre=true;
        }
      }
    });
  }

  validateAllFormFields(formGroup: FormGroup, lang: string) {
    Object.keys(formGroup.controls[lang]['controls']).forEach(field => {
      const control = formGroup.controls[lang].get(field);
      console.log(field + " " + control.status);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control, lang);
      }
    });
  }

  //  Save data as draft for both add/edit
  saveAsDraft(lang, status){ 
      // validate the form
      this.validateForm();
      this.validateForm2();

      // calling name is compulsary for draft
      if(this.tForm.get(lang+'.callingName').invalid && status =='draft' && !this.oldDataArr[lang].slug)
      {
        this.tForm.get(lang+'.callingName').markAllAsTouched();
        return false;
      }

      if ((!this.formStatus[lang] && status =='completed')){
        this.validateAllFormFields(this.tForm, lang)
        return false;
      }

      var englishStoryTitle = this.tForm.get('english.storyTitle').value;
      var hindiStoryTitle = this.tForm.get('hindi.storyTitle').value;

      let tempArr:any={};
      tempArr['english'] = this.createFormArray('english', status);
      tempArr['hindi'] = this.createFormArray('hindi', status);

      tempArr["peripheral"] = {
          "oldName" : this.oldDataArr['peripheral']['oldName'],
          "newName" : this.selecteVideoElement['sourceLink']
      }

      if(tempArr['english']['mediaList'].length > 0)
        tempArr['english']['mediaList'][0]['title'] = englishStoryTitle;
      if(tempArr['hindi']['mediaList'].length > 0)
        tempArr['hindi']['mediaList'][0]['title'] = hindiStoryTitle;


    if (this.selectedLang == 'english' && tempArr['english']['mediaList'].length > 0 && (englishStoryTitle == null || englishStoryTitle == '' || englishStoryTitle == undefined)){
        alert("Please enter artist story title in english");
        return false;
      }
      
    if (this.selectedLang == 'hindi' && tempArr['hindi']['mediaList'].length > 0 && (hindiStoryTitle == null || hindiStoryTitle == '' || hindiStoryTitle == undefined)){
        alert("Please enter artist story title in hindi");
        return false;
      }

      tempArr['english']['gradients'] = this.imageGradientColor;
      tempArr['hindi']['gradients'] = this.imageGradientColor;

      // tempArr['english']['story'].title = englishStoryTitle;
      // tempArr['hindi']['story'].title = hindiStoryTitle;

      if(!this.selectedImageElement.fileName)
        tempArr["newImagelStatus"] = false;
      else if(this.selectedImageElement.fileName == this.oldDataArr[lang]['profilePic']) 
        tempArr["newImagelStatus"] = false;
      else
        tempArr["newImagelStatus"] = true;

      //  console.log(tempArr);
      
      //  return false;
      this.apiService.postData(Constants.url.updateArtistDetail, tempArr).subscribe(response =>{
        if(response['status'] == 200)
        {
          tempArr['english']['_id']=response['data']['artistId']['en'];
          tempArr['hindi']['_id']=response['data']['artistId']['hin'];
          tempArr['english']['slug']=tempArr['hindi']['slug']=response['data']['slug'];
          tempArr["peripheral"]["oldName"]=tempArr["peripheral"]["newName"];
          tempArr["english"]["tags"]= tempArr['english']['tags'].split(',');
          tempArr["hindi"]["tags"] = tempArr['hindi']['tags'].split(',');

          this.oldDataArr = tempArr;
          window.scrollTo(0, 0)

          alert('saved successfully');
          if(status=='completed' && this.selectedLang=='english')
          {
            this.changeSelectedLang('hindi');
          }
          else if(status=='completed' && this.selectedLang=='hindi')
          {
            if (this.formType == 'add')
              this.router.navigate(['../listing/artist'], { queryParams: { 'type': 'completed' }, relativeTo: this.route })
            else
              this.router.navigate(['../../listing/artist'], { queryParams: { 'type': 'completed' }, relativeTo: this.route })
          } else if(status == 'publish') {
            this.router.navigate(['../../listing/review'], { queryParams: { 'type': 'artist' }, relativeTo: this.route })
          }
        }
      });      
    //}
  }

  // get createSendGenreData(){
    
  //   let dummyGenreList={
  //     'english':[],
  //     'hindi':[]
  //   };
  //   let dummySubGenreList={
  //     'english':[],
  //     'hindi':[]
  //   };
    
  //   this.allGenreList.allListData.forEach(genreList => {
  //     let count=0;
  //     genreList['subgenre'].forEach(element => {
  //       if(element['checked']==true)
  //       {
  //         count++;
  //         dummySubGenreList['english'].push({
  //           'id':element._id,
  //           'name': element.name
  //         })
  //         dummySubGenreList['hindi'].push({
  //           'id':element._id,
  //           'name': element.hinName
  //         })
  //       }
  //     });    
  //     if(count>0)        
  //     {
  //       dummyGenreList['english'].push({
  //         'id':genreList.id,
  //         'name': genreList.name
  //       })
  //       dummyGenreList['hindi'].push({
  //         'id':genreList.id,
  //         'name': genreList.hindiName
  //       })
  //     }
  //   });

  //   return { dummyGenreList, dummySubGenreList };
  // }
  

  //creating a form array and 
  createFormArray(lang, status){
    var hinValidate = false;
    if(status=='completed' && this.selectedLang=='hindi'){
      hinValidate = true;
    } else if (status == 'forReview' || status == 'publish'){
      hinValidate = true;
    }
    
    return {
      "_id": this.oldDataArr[lang]._id,
      "firstName": this.tForm.get(lang+'.firstName').value,
      "lastName": this.tForm.get(lang+'.lastName').value,
      "middleName": this.tForm.get(lang+'.middleName').value,
      "callingName": this.tForm.get(lang+'.callingName').value,
      "description": this.tForm.get(lang+'.description').value,
      "artistLanguage": this.tForm.get(lang +'.artistLanguage').value,
      "gender": this.tForm.get(lang+'.gender').value,
      "dob": this.tForm.get(lang+'.dob').value,
      "state": this.tForm.get(lang+'.state').value,
      "city": this.tForm.get(lang+'.city').value,
      "genreList": this.allGenreList.formData['dGenreList'][lang],
      "subGenreList": this.allGenreList.formData['dSubGenreList'][lang],
      "tags": this.tForm.get(lang+'.tags').value.join(','),
      "profilePic": this.selectedImageElement.fileName,
      "gradientColor": this.tForm.get(lang+'.gradientColor').value,
      "status": ((status == 'completed' && this.oldDataArr[lang].status == 'completed') || (status == 'completed' && this.selectedLang == 'hindi')) ? 'completed' : (status == 'publish' || status == 'forReview') ? status :'draft',
      "slug": this.oldDataArr[lang].slug,
      "language": [this.tForm.get(lang+'.language').value],
      "mediaList": this.oldDataArr[lang].mediaList,
      "bio": this.tForm.get(lang+'.bio').value,
      "story": this.selecteVideoElement.selectedPeripheralStatus ? {
          "title": this.tForm.get(lang+'.storyTitle').value,
          "sourceLink": this.selecteVideoElement['sourceLink'],
          "hlsSourceLink": this.selecteVideoElement['hlsSourceLink'],
          "duration": this.selecteVideoElement['duration'],
          "thumbnail": this.selecteVideoElement['thumbnail'],
          "id": this.selecteVideoElement['id'],
          "selectedPeripheralStatus":this.selecteVideoElement.selectedPeripheralStatus
      } : {},
      "displayLanguage": lang=='english'?'en':'hin',
      "englishValidated": (status == 'completed' || status == 'forReview' || status =='publish')? true:false,
      "hindiValidated": hinValidate,
      "activity": {
          "action": !this.oldDataArr[lang]['slug']==true?'created':'updated',
          "writerName": this.userData.firstName,
          "roleId": this.userData.roleId,
          "updatedAt": "" //from backend
      },
      "randomOrder": !!this.tForm.get(lang+'.randomOrder').value?this.tForm.get(lang+'.randomOrder').value:0
    }
  }

  checkSlugApi() {
    let reqSlug = '';
    if (!this.oldDataArr.english.slug && this.tForm.get('english.callingName').value.length >= 4) {
      var name = this.tForm.get('english.callingName').value;
      if (name) {
        reqSlug = this.convertToSlug(name);
        this.apiService.getApiData(Constants.url.checkSlug + '?type=artist&slug=' + reqSlug).subscribe(response => {
          if (response['status'] == 200 && response['data']['exists'] == false) {
            this.oldDataArr.english.slug = this.oldDataArr.hindi.slug = reqSlug
          }else{
            alert("Calling Name already exist");
          }
        });
      }
    }
  }

  sendToCorrection(status, type) {
    this.apiService.getApiData(Constants.url.sendToCorrection + '?type='+type+'&status=' + status+'&slug=' + this.oldDataArr['english'].slug).subscribe(response => {
      if (response['status'] == 200 ) {
        if(status === 'draft') {
          this.router.navigate(['../../listing/review'], { queryParams: { 'type': 'artist' }, relativeTo: this.route })
        }

        if(status === 'reviewed'){
          alert("Reviewed successfully");
        }
      }
    })
  }

  convertToSlug(text) {
    return text
      .toLowerCase()
      .replace(/\s\s+/g, ' ')
      .replace(/ +/g, '-');
  }
  
  setImageColor(color){
    this.tForm.patchValue({
      'hindi': {
        ['gradientColor']: color
      }
    })

    this.tForm.patchValue({
      'english': {
        ['gradientColor']: color
      }
    })
  }

  unCheckedRadio(){
    $(".radioButton").prop("checked", false);
  }


  // Image2 Code 
  artistImageName = '';
  selectedImage2Element = {
    file: null,
    progPer: null,
    imgURL: null,
    status: 'empty',
    fileName: null
  }

  // artist image change 
  changeArtistImage2(event) {
    if (event.target.files.length === 0)
      return;

    let file = event.target.files[0];

    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      var self = this;
      this.checkImageDimension2(_event, self, function (res) {
        if (res) {
          var imageFileName = '';
          if (self.artistImageName == ''){
            var rand = '_' + Math.floor(0 + Math.random() * 10)
            var split = file.name.split('.');
            var name = split[0] + rand +'.'+ split[split.length - 1]
            self.artistImageName = name;
            imageFileName = name;
          }else{
            imageFileName = self.artistImageName
          }

          self.uploadService.uploadSingleFile(file, imageFileName, 'artist', 'artistImage').then(response => {
            if (response) {
              // API call for uploading/change image
              self.apiService.getApiData(Constants.url.uploadImage + '?type=artist&format=rectangle&imageName=' + imageFileName).subscribe(response => {
                if (response['status'] == 200) {
                  self.selectedImage2Element.status = 'success';
                  self.selectedImage2Element.fileName = imageFileName;
                  self.selectedImage2Element.imgURL = "https://stage-videos.s3.ap-south-1.amazonaws.com/temp/artist/" + imageFileName;
                }
                else {
                  self.selectedImage2Element.status = 'failed';
                }
              });
            } else {
              self.selectedImage2Element.status = 'failed';
            }
            self.validateForm();
          }, error => {
            self.selectedImage2Element.status = 'failed';
          })
        } else {
          self.selectedImage2Element.status = 'failed';
          alert("Image aspect ratio should be 2:1");
        }
      });
    }
  }

  checkImageDimension2(e, classObj, callback) {
    var isValid = false;
    var image = new Image();
    image.src = e.target['result'];
    let self = this;
    image.onload = function (): any {
      if (image.height !== (image.width / 2)) {
        isValid = true;
        callback(isValid);
      }
      else {
        isValid = true;
        callback(isValid);
      }
    };
  }

  checkRectImage(image, S3url, path){
    this.artistImageName = image;
    this.selectedImage2Element.fileName = image;
    this.selectedImage2Element.imgURL = S3url + path + '/notification_image/rectangle/' + image;
    this.selectedImage2Element.progPer = 100;
    this.selectedImage2Element.status = 'success';
  }

  validateForm2() {
    if (this.tForm.get('english').valid && this.selectedImage2Element.status == 'success')
      this.formStatus['english'] = true;
    else
      this.formStatus['english'] = false;

    if (this.tForm.get('hindi').valid && this.selectedImage2Element.status == 'success')
      this.formStatus['hindi'] = true;
    else
      this.formStatus['hindi'] = false;
  }


}