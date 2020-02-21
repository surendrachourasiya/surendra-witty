import { Component, OnInit } from '@angular/core';
import { UploadFileService } from '../other/services/upload-file.service';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  selectedFiles:FileList;

  constructor(private uploadService: UploadFileService) {

    uploadService.uploadStatus.subscribe(value => {
      console.log(value);
      if(value['loaded'])
      {
        this.progressPer= (value['loaded']/value['total'])*100;
      } 
    })
   }
  progressPer:any=0;
  ngOnInit() {
  }

  upload() {
    const file= this.selectedFiles.item(0);
    
    return this.uploadService.uploadFile(file, 'arrayName').then( response =>{
      console.log('image upload', response);
      if(response['loaded'])
      {
        this.progressPer= (response['loaded']/response['total'])*100;
      } 
      else
      {
        console.log(response);
      }
    }, error =>{
      console.log(error);
    })

  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

}
