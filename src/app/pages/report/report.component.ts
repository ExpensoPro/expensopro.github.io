import { Component, OnInit } from '@angular/core';
import { Double } from '@syncfusion/ej2-angular-charts';
import { GroupService } from 'src/app/services/group.service';
import { LoginService } from 'src/app/services/login.service';
import { ReportService } from 'src/app/services/report.service';
import swal from 'sweetalert2'
import * as $ from "jquery";

interface user{
  id:any,
  username:any,
  firstName:any,
  lastName:any
}
interface Group{
  id: number,
  groupName : String,
  groupDescription : String,
  groupOwner: any;
  dateCreated:any;
}
interface ReportData{
  userName: string,
  spentAmt: string,
  chargedAmt: string,
  debtAmt: string,
  settlement: string
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private groupService: GroupService, private loginService: LoginService, private reportService: ReportService) {}
  groups: Group[]=[];
  reportDataList: ReportData[]=[];
  public user={
    id:'',
    username:'',
    firstName:'',
    lastName: ''
  }
  public group={
    id: '',
    groupName : '',
    groupDescription : '',
    groupOwner: this.user,
    dateCreated: ''
  }
  public reportData={
    userName:'',
    spentAmt:'',
    chargedAmt:'',
    debtAmt:'',
    settlement:''
  }
  settlementTextList!: any[];
  currentUser:any;
  selected:any=0;
  ngOnInit(): void {
    // this.loaduserGroupList();
    this.getSelectedGroup();
  }
  // loaduserGroupList(){
  //   debugger;
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
          this.showSettlementData(this.selected);
        }else{
          $("#grp-selector-top").css("border","3px solid red");
          $("#grp-selector-top").find('#grpSelErrorText').remove();
          $("#grp-selector-top").append('<span id="grpSelErrorText" style="color:red;"> Please select group to proceed with reports data!</span>');
        }
      }
  onGroupSelected(event:any){
    this.showSettlementData(this.selected);
  }
  showSettlementData(selected:any){
      this.reportService.getSettlementDashboardData(this.selected).subscribe(
        (data:any)=>{
          debugger;
          if(data!=null){
            this.settlementTextList=data.settlementText;
            for(var i=0; i<data.usersList.length;i++){
              let reportObject = {} as ReportData;
              reportObject.userName = data.usersList[i];
              reportObject.spentAmt = (Math.round(data.totalIndividualSpend [i] * 100) / 100).toFixed(2);
              reportObject.chargedAmt = (Math.round(data.totalIndividualCharged[i] * 100) / 100).toFixed(2);
              reportObject.debtAmt = (Math.round(data.resList[i] * 100) / 100).toFixed(2);
              reportObject.settlement = data.settlementText[i];
              this.reportDataList[i]=reportObject;

            }
          }

        },
        (error:any)=>{

        }
      )
  }
  downloadExcelReport(){
    this.reportService.downloadExcelReport(this.selected).subscribe(
      (data:any)=>{
        swal.fire("Success","Report downloaded successfuly !!", "success");
      },(error:any)=>{

      }
    )
  }

}
