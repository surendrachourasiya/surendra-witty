import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
// import * as AWS.S3 from 'aws-sdk/s3/managed_upload';
import * as S3 from 'aws-sdk/clients/s3';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor() { }

  private uploadStatusSource = new Subject<{}>();
  // Observable string streams
  uploadStatus = this.uploadStatusSource.asObservable();

  FOLDER='new-cms-test/';

    async uploadFile(file, arrayName): Promise<any>{
    // const headers = new HttpHeaders();
    // headers.set('enctype', 'multipart/form-data');
    
    const contentType = file.type;
    AWS.config.httpOptions.timeout = 0;
    const bucket = new AWS.S3(
          {
              accessKeyId: 'AKIAZKE5U3OBXHFBCK7M',
              secretAccessKey: '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',
              region: 'ap-south-1'
          }
      );
      const params = {
          Bucket: 'stage-videos',
          Key: this.FOLDER + file.name +'-'+ Date.now(),
          Body: file,
          ACL: 'public-read',
          ContentType: contentType,
      };
      // bucket.upload(params, function (err, data) {
      //     if (err) {
      //         console.log('There was an error uploading your file: ', err);
      //         return false;
      //     }
      //     console.log('Successfully uploaded file.', data);
      //     return true;
      // });
        //for upload progress 
        var opts = {queueSize: 1, partSize: 1024 * 1024 * 1000};

        return new Promise(resolve => {
          bucket.upload(params, opts).on('httpUploadProgress', (evt) => {
                  
                  console.log((evt.loaded/evt.total)*100 + ' %');
                  // var time = this.toHHMMSS(evt['timeStamp']);
                  // console.log((evt['timeStamp']));
                  // console.log(evt);
                  // return ({'loaded': evt.loaded, 'total': evt.total});
                  // resolve ({'loaded': evt.loaded, 'total': evt.total});
                  this.uploadStatusSource.next({'objName': 'pheripheral', 'objIndex':0, 'loaded': evt.loaded, 'total': evt.total});
              }).send(function (err, data) {
                  if (err) {
                      console.log('There was an error uploading your file: ', err);
                      resolve (false);
                      // return false;
                  }
                  console.log('Successfully uploaded file.', data);
                  // alert('Successfully');
                  // return true;
                  resolve (true);
        });
      });
    }


    // single file upload
    async uploadSingleFile(file, fileName, folderName, arrayName): Promise<any>{
    
      const contentType = file.type;
      AWS.config.httpOptions.timeout = 0;
      const bucket = new AWS.S3(
            {
                accessKeyId: 'AKIAZKE5U3OBXHFBCK7M',
                secretAccessKey: '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',
                region: 'ap-south-1'
            }
        );
        
        const params = {
            Bucket: 'stage-videos',
            Key: 'temp/'+folderName +'/'+ fileName,
            Body: file,
            ACL: 'public-read',
            ContentType: contentType,
        };
          //for upload progress 
          var opts = {queueSize: 1, partSize: 1024 * 1024 * 1000};
  
          return new Promise(resolve => {
            bucket.upload(params, opts).on('httpUploadProgress', (evt) => {
                    this.uploadStatusSource.next({'objName': arrayName, 'loaded': evt.loaded, 'total': evt.total});

                }).send(function (err, data) {
                    if (err) {
                        console.log('There was an error uploading your file: ', err);
                        resolve (false);
                    }
                    console.log('Successfully uploaded file.', data);
                    resolve (true);
          });
        });
      }

    async uploadFileToBucket(file, fileName, folderName, arrayName, arrayIndex): Promise<any>{      
      const contentType = file.type;
      AWS.config.httpOptions.timeout = 0;
      const bucket = new AWS.S3(
            {
                accessKeyId: 'AKIAZKE5U3OBXHFBCK7M',
                secretAccessKey: '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',
                region: 'ap-south-1'
            }
        );
        const params = {
            Bucket: 'stage-videos',
            //Key: 'temp/'+folderName+'/'+ fileName +'-'+ Date.now(),
            Key: folderName + '/' + fileName,
            Body: file,
            ACL: 'public-read',
            ContentType: contentType,
        };
          var opts = {queueSize: 1, partSize: 1024 * 1024 * 1000};
  
          return new Promise(resolve => {
            bucket.upload(params, opts).on('httpUploadProgress', (evt) => {
                    
                    console.log((evt.loaded/evt.total)*100 + ' %');
                    this.uploadStatusSource.next({'objName': arrayName, 'objIndex':arrayIndex, 'loaded': evt.loaded, 'total': evt.total});
                }).send(function (err, data) {
                    if (err) {
                        console.log('There was an error uploading your file: ', err);
                        resolve (false);
                    }
                    console.log('Successfully uploaded file.', data);
                    resolve (true);
          });
        });
      }


    toHHMMSS(timestamp) {
        var sec_num = parseInt(timestamp, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
        if (hours   < 10) {hours   = 0+hours;}
        if (minutes < 10) {minutes = 0+minutes;}
        if (seconds < 10) {seconds = 0+seconds;}
        return hours+':'+minutes+':'+seconds;
    }
    
}


// https://aws.amazon.com/blogs/developer/announcing-the-amazon-s3-managed-uploader-in-the-aws-sdk-for-javascript/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html