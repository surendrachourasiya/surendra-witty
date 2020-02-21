// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { Constants } from './../other/constants';
// import { ApiService } from '../other/services/api.service';
// import { UploadFileService } from '../other/services/upload-file.service';

// @Component({
//   selector: 'app-upload-video',
//   templateUrl: './upload-video.component.html',
//   styleUrls: ['./upload-video.component.scss']
// })
// export class UploadVideoComponent implements OnInit {
   
//   constructor(private apiService: ApiService, private uploadService:UploadFileService, private fb: FormBuilder) { 
//     uploadService.uploadStatus.subscribe(value => {
//       console.log(value);
//       if(!!value['loaded'])
//       {
//         this[value['objName']]['fileList'][value['objIndex']]['progressPer']= (value['loaded']/value['total'])*100;
//       } 
//     });
//    }

//   selectedType:string=null;
//   videoCategories: any = ['shows', 'collection', 'artist', 'individual'];
//   nameFieldText={
//     'shows':{
//       'text': 'Shows name',
//       'placeholder': 'Shows placeholder here',
//     },
//     'collection':{
//       'text': 'Collection name',
//       'placeholder': 'Collection placeholder here',
//     },
//     'artist':{
//       'text': 'Artist name',
//       'placeholder': 'Artist placeholder here',
//     },
//     'individual':{
//       'text': 'Individual name',
//       'placeholder': 'Individual placeholder here',
//     }
//   }
//   seasonList: any = [{ 'id':'1', 'name':'Season 1'}, { 'id':'2', 'name':'Season 2'}];


//   tForm: FormGroup;
//   enableSubmitButton:boolean=false;

//   showData={
//     slugName:null,
//   }

//   mediaList={
//     fileList:[],
//     folderName: null,
//     count:0
//   }

//   episodeList={
//     fileList:[],
//     folderName: null,
//     count:0
//   }

//   ngOnInit() {
//     this.tForm = new FormGroup({
//         'uploadData' : new FormGroup({
//             'type': new FormControl(null, [Validators.required]),
//             'name' : new FormControl(null, [Validators.required, this.noWhitespaceValidator]),
//             'season':new FormControl(null),
//             'pheripheralVideo': this.fb.array([]),
//             'episodeVideo': this.fb.array([])
//         })
//     });

//     this.tForm.valueChanges.subscribe(result => {
//           console.log(this.tForm.status)
//         if(this.tForm.status === 'INVALID')
//           this.enableSubmitButton= false;
//         else
//         {
//           this.enableSubmitButton=this.validateForm;
//         }
//     });
//   }


//   // Custom validtor to avoid empty spaces.
//   public noWhitespaceValidator(control: FormControl) 
//   {
//     let isWhitespace = !(control.value === null || control.value === '') && (control.value).trim().length === 0; 
//     let isValid = !isWhitespace; 
//     return isValid ? null : { 'whitespace': true }; 
//   }


//   // function to handle the validations
//   get validateForm(){
//     if(this.selectedType == 'shows')
//     {
//       if(!this.tForm.get('uploadData.season').value)
//         return false;
//       else if ((this.mediaList.fileList.length == this.mediaList.count && this.mediaList.count > 0) && 
//                 (this.episodeList.fileList.length == this.episodeList.count && this.episodeList.count > 0))
//         return true;
//       else
//         return false;
//     }
//     else if((this.selectedType == 'collection' || this.selectedType == 'artist') &&
//             (this.mediaList.fileList.length == this.mediaList.count && this.mediaList.count > 0))
//         return true;
//     else if(this.selectedType == 'individual' &&
//            (this.episodeList.fileList.length == this.episodeList.count && this.episodeList.count > 0))
//       return true;
//     else
//         return false;
//   }

//   // change the video category on select and re-initialize it
//   changeVideoCategory(){
//     this.showData={
//       slugName:null,
//     }
    
//     this.mediaList={
//       fileList:[],
//       folderName: null,
//       count:0
//     }
    
//     this.episodeList={
//       fileList:[],
//       folderName: null,
//       count:0
//     }
    
//     this.selectedType = this.tForm.get('uploadData.type').value;
//     this.tForm.patchValue({
//       uploadData:{
//         'type': this.selectedType,
//         'season': null,
//         'name': null,
//         'pheripheralVideo':[],
//         'episodeVideo':[]
//       }
//     });
//     console.log(this.tForm);
//   }

//   // check the avaibility of slug
//   checkShowNameAvaibility(){
//     let showName= this.tForm.get('uploadData.name').value;
//     if(!!showName)
//     {
//       let currentSlug = this.convertToSlug(showName);
//       let url = Constants.url.checkSlugExistence+'?type='+this.selectedType+'&slug='+currentSlug;
//       this.apiService.getApiData(url).subscribe(response =>{
//         if(response['status'] == 200)
//         {
//           console.log(response['data']['exists']);
//           this.showData.slugName = currentSlug;
//         }
        
//       });
//     }
//   }

//   convertToSlug(Text)
//   {
//       return Text
//           .toLowerCase()
//           .replace(/[^\w ]+/g,'')
//           .replace(/ +/g,'-')
//           ;
//   }

//   // select the video from the episode and pheripheral
//   changeVideo(event, arrayName) {
//     // let obj = this.tForm.get('uploadData.pheripheralVideo') as FormArray;
//     let files = event.target.files;
//     if (files) {
//         for (let file of files) {
//             // let reader = new FileReader();
//             // reader.onload = (e: any) => {
//                 // this.pheripheralFormValue.push(this.createItem({
//                 //     file,
//                 //     url: e.target.result,
//                 //     name: file.name,
//                 //     size: file.size,
//                 //     type: file.type
//                 // }));
//                 // obj.push(this.seasonPheripheralObj({
//                 //     file,
//                 //     url: e.target.result  //Base64 string for preview image
//                 // }));

//                 let newFileName = file.name.split('.');


//                 this[arrayName]['fileList'].push({
//                   file: file,
//                   name: newFileName[0]+'-'+ Date.now()+'.'+newFileName[1],
//                   fileInitName:newFileName[0],
//                   size: file.size,
//                   type: file.type,
//                   progressPer: 0,
//                   status: 'created'
//                 });

                
//             // }
//             // reader.readAsDataURL(file);
//         }

//         if(this[arrayName]['fileList'].length > 0)
//         {
//           this[arrayName]['folderName']= arrayName+Date.now();

//           this.initiateMultipleVideosUpload(arrayName);
//         }
//     }

//     console.log('files', this[arrayName]['fileList']);
//   }



//   initiateMultipleVideosUpload(arrayName){
    
//     this[arrayName]['fileList'].forEach((element, index) => {
//       element.status='uploading';
//       this.uploadService.uploadFileToBucket(element.file, element.name, this[arrayName]['folderName'], arrayName, index).then( response =>{
//         console.log('image upload', response);
//         if(response)
//         {
//           console.log(response);
//           element.status='success';
//         } 
//         else
//         {
//           element.status='failed';
//           console.log(response);
//         }

//         this[arrayName]['count']++;
//         if(this[arrayName]['fileList'].length == this[arrayName]['count'])
//         {
//           alert('all files uploaded');
//           this.enableSubmitButton=this.validateForm;
//         }

//       }, error =>{
//         console.log(error);
//       })
//     });
//   }


//   onSubmit(){
//     let url = Constants.url.uploadVideo;
//     let data={
//         "type": this.selectedType,
//         "action" : "create",
//         "slug": this.showData.slugName,
//         "title": this.tForm.get('uploadData.name').value,
//         "seasonNumber": this.tForm.get('uploadData.season').value,
//         "mediaFolderName" : this.mediaList.folderName,
//         "episodeFolderName" : this.episodeList.folderName,
//         "mediaList": [],
//         "episodeList": []
//     }

//     this.mediaList.fileList.forEach(element => {
//       if(element.status == 'success')
//       {
//         data.mediaList.push({
//             "id": this.randomNumber,
//             "type": "",
//             "sourceLink": element.name,
//             "hlsSourceLink": element.fileInitName+'.m3u8',
//             "viewCount": 0,
//             "duration": 1,
//             "selectedPeripheralStatus": false,
//             "thumbnail": {
//                 "horizontal": {
//                     "sourceLink": ""
//                 },
//                 "vertical": {
//                     "sourceLink": ""
//                 },
//                 "square": {
//                     "sourceLink": ""
//                 }
//             }
//         })
//       }
//     });

//     this.episodeList.fileList.forEach(element => {
//       if(element.status == 'success')
//       {
//         data.episodeList.push({
//             "episodeSlug": element.fileInitName+this.randomNumber,
//             "sourceLink": element.name,
//             "hlsSourceLink": element.fileInitName+'.m3u8',
//             "duration": 1
//         })
//       }
//     });
    
//     console.log(data);

//     this.apiService.postData(url, data).subscribe(response =>{
//       if(response['status'] == 200)
//       {
//         response['data'];
        
//       }
//     })

//   }


//   get randomNumber(){
//     return Math.floor(1000 + Math.random() * 9000);
//   }
  

// }
