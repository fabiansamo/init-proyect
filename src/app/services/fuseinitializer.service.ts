import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONSTANT } from './../constant/app.constant';

@Injectable({
  providedIn: 'root'
})
export class FuseinitializerService {

  constructor(
    private http:HttpClient
  ) { }

    getFuseInit() {
      let url=CONSTANT.URL_SERVICE_FUSE_INITIALIZER;
      this.http.get(url).subscribe(data=>{
        console.warn(data);
      });
    }


}
