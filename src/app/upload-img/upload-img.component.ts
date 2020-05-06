import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.css']
})
export class UploadImgComponent implements OnInit {
  url = 'img.jpg';
  constructor() { }

  ngOnInit() {
  }

    
    readUrl(event:any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.onload = (event:any) => {
      this.url = event.target.result;
         console.log(this.url) ;
    }
   
    reader.readAsDataURL(event.target.files[0]);
  }
}
}
