import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  makeActive(item:any){
    $(".activeTab").removeClass("activeTab");
    $(item.target).addClass("activeTab");
  }

}
