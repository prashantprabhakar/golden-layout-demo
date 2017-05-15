import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  public count: number = 0;
  
  public add(){
    this.count = this.count + 1;
  }
}