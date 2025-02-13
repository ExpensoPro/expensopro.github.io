import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { LoginService } from '../services/login.service';
import { GroupService } from '../services/group.service';
import { SpentService } from '../services/spent.service';
import swal from 'sweetalert2'
import * as $ from "jquery";


interface user{
  id:any,
  username:any,
  firstname:any,
  lastname:any
}
interface Group{
  id: number,
  groupName : String,
  groupDescription : String,
  groupOwner: any;
  dateCreated:any;
}
interface spent{
  id:any,
  amount:any,
  user:user,
  group:any,
  description:any,
  spentDate:String,
  totalContributors:any,
  dateCreated:any
}
interface GroupUser{
  id:any,
  group:any,
  user:user;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
border = { width: 2, color: 'red'};

  dataSource!: Object;
  summaryDataSource!: Object;
  chargedDataSource!: Object;
  constructor(private loginService: LoginService, private groupService:GroupService, private spentService:SpentService) {
    

   }
  public chartData: any []=[];
  public chargedChartData: any []=[];
  public summaryChartData: any []=[];
  public primaryXAxis: any; 
  groups: Group[]=[];
  spents: spent[]=[];
  public user={
    id:'',
    username:'',
    firstname:'',
    lastname: String
  }
  public grp={
    id: 0
  }
  public group={
    id: '',
    groupName : '',
    groupDescription : '',
    groupOwner: this.user,
    dateCreated: ''
  }
  public spent ={
    id:'',
    amount:'',
    user:this.user,
    group: this.group,
    description:'',
    spentDate:'',
    totalContributors:0,
    dateCreated:''
  }

  currentUser:any;
  selected:any=0;
  selectedId:any=0;
  guser!: any[];
  selectedGroupId:any;
  selectedgrp:any=this.selected;

  
  source: any = {
    chart: {
      caption: "User Spent Graph", //Set the chart caption
      subCaption: "", //Set the chart subcaption
      xAxisName: "User", //Set the x-axis name
      yAxisName: "Spent", //Set the y-axis name
      numberSuffix: ' Rs',//'&#8377;
      theme: "fusion", //Set the theme for your chart
      xaxislinecolor: "#5d62b5",
      yaxislinecolor: "#5d62b5",
      showxaxisline: "2",
      showyaxisline: "2",
      toolTipBorderColor: "#60cfe8",//c96eee
      toolTipBgColor: "#d4edf2",//#ffa8b5f5
      toolTipBgAlpha: "80",
      showToolTipShadow: "1",
      plotToolText: "Spent By: $label <br> Amount (<i>&#8377;</i>): $value"
    },
    data: this.chartData,
    
  };

  summarySource: any = {
    chart: {
      caption: "Spent Summary Graph", //Set the chart caption
      subCaption: "", //Set the chart subcaption
      xAxisName: "User", //Set the x-axis name
      yAxisName: "<- (-)  Amount (+) ->", //Set the y-axis name
      numberSuffix: ' Rs',//'&#8377;
      theme: "fusion", //Set the theme for your chart
      xaxislinecolor: "#5d62b5",
      yaxislinecolor: "#5d62b5",
      showxaxisline: "2",
      showyaxisline: "2",
      toolTipBorderColor: "#c96eee",//c96eee
      toolTipBgColor: "#ffcad2f5",//#ffa8b5f5
      toolTipBgAlpha: "80",
      showToolTipShadow: "1",
      plotToolText: "Contributor: $label <br> Contribution (<i>&#8377;</i>): $value"
      
    },
    data: this.summaryChartData,
    
  };

  chargedSource: any = {
    chart: {
      caption: "User Charged Graph", //Set the chart caption
      subCaption: "", //Set the chart subcaption
      xAxisName: "User", //Set the x-axis name
      yAxisName: "Charged", //Set the y-axis name
      numberSuffix: ' Rs',//'&#8377;
      theme: "fusion", //Set the theme for your chart
      xaxislinecolor: "#5d62b5",
      yaxislinecolor: "#5d62b5",
      showxaxisline: "2",
      showyaxisline: "2",
      toolTipBorderColor: "#c96eee",//c96eee
      toolTipBgColor: "#ffcad2f5",//#ffa8b5f5
      toolTipBgAlpha: "80",
      showToolTipShadow: "1",
      plotToolText: "Contributor: $label <br> Charged amount (<i>&#8377;</i>): $value",
      
    },
    data: this.chargedChartData,
    
  };
  ngOnInit(): void {
    this.dataSource = this.source;
    this.chargedDataSource = this.chargedSource;
    this.summaryDataSource = this.summarySource;
    // this.loaduserGroupList(); 
    debugger;
    this.getSelectedGroup();
  }
  
  // loaduserGroupList(){
  //   this.currentUser = this.loginService.getUser();
  //   this.groupService.loadUserList(this.currentUser.id).subscribe(
  //     (data:any)=>{
  //       this.groups = data;
  //     },
  //     (error:any)=>{

  //     })
  // }
  getSelectedGroup(){
    if(localStorage.getItem("topSelectedGrp")!='' && localStorage.getItem("topSelectedGrp")!=null){
      this.selected= localStorage.getItem("topSelectedGrp");
      this.getAllUserSpendsDataForGroup(this.selected);
      this.getAllUserChargedDataForGroup(this.selected);
    }else{
      $("#grp-selector-top").css("border","3px solid red");
      $("#grp-selector-top").find('#grpSelErrorText').remove();
      $("#grp-selector-top").append('<span id="grpSelErrorText" style="color:red;"> Please select group to proceed with dashboard data!</span>');
    }
  }
  onGroupSelected(event:any){
    this.getAllUserSpendsDataForGroup(this.selected);
    this.getAllUserChargedDataForGroup(this.selected);
    
  }
  spentValArr: number[]=[]
  getAllUserSpendsDataForGroup(selectedGroupId:any){
    this.spentService.getAllUserSpendsDataForGroup(selectedGroupId).subscribe(
      (data:any)=>{
        this.chartData=[];
        debugger;
        this.spentValArr = Object.values(data);
        for(var i =0; i<Object.keys(data).length; i++){
          let json = {
            label: Object.keys(data)[i],
            value:this.spentValArr[i].toFixed(2)
          }
          this.chartData.push(json);
        }
        
        this.source.data=this.chartData;
        this.dataSource = this.source;
        
        //this.primaryXAxis = { valueType: 'Category' };
        var i=0;
        setTimeout(function(){
          const interval = setInterval(function(){
            $('[class*="parentgroup"]').next().hide();
            i++;
            if(i>20)
              clearInterval(interval);
          },10);
        },1200);

        
      },(error:any)=>{

      }
    )
  }

arr:number[]=[];
  getAllUserChargedDataForGroup(selectedGroupId:any){
    this.spentService.getAllUserChargedDataForGroup(selectedGroupId).subscribe(
      (data:any)=>{
        this.chargedChartData=[];
        debugger;
        this.arr= Object.values(data);
        for(var i =0; i<Object.keys(data).length; i++){
          
          let json = {
            label: Object.keys(data)[i],
            value:this.arr[i].toFixed(2)
          }
          this.chargedChartData.push(json);
        }
        
        this.chargedSource.data=this.chargedChartData;
        this.chargedDataSource = this.chargedSource;
        this.getSummaryChargedData();
        //this.primaryXAxis = { valueType: 'Category' };
        var i=0;
        setTimeout(function(){
          const interval = setInterval(function(){
            $('[class*="parentgroup"]').next().hide();
            i++;
            if(i>20)
              clearInterval(interval);
          },10);
        },1200);

        
      },(error:any)=>{

      }
    )
  }

  getSummaryChargedData(){
    debugger;
    this.summaryChartData=[];
    for (var i=0; i<this.chartData.length;i++){
      let json ={
        label:this.chartData[i].label,
        value:this.chartData[i].value-this.chargedChartData[i].value
      }
      this.summaryChartData.push(json);
    }
    this.summarySource.data=this.summaryChartData;
    this.summaryDataSource = this.summarySource;
  }
 

}
