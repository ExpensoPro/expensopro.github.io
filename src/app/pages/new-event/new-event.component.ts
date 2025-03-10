import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {
  title = 'Google Maps in Angular';
  lat = 51.678418;  // Latitude of the map center
  lng = 7.809007;   // Longitude of the map center
  zoom = 10;        // Zoom level
  constructor() { }

  ngOnInit(): void {
  }
  openLocationPopup(){

  }

}
