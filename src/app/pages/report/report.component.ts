import { Component, OnInit } from '@angular/core';
import { Double } from '@syncfusion/ej2-angular-charts';
import { GroupService } from 'src/app/services/group.service';
import { LoginService } from 'src/app/services/login.service';
import { ReportService } from 'src/app/services/report.service';
import { PaymentService } from 'src/app/services/payment.service';
import { GroupUserService } from 'src/app/services/group-user.service';
import swal from 'sweetalert2'
import * as $ from "jquery";
import baseUrl from 'src/app/services/helper';


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
interface SettlementOBJ{
  userId:any,
  settlementText: string,
  amount: any,
  payee: string,
  receiver: string,
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private groupService: GroupService, private loginService: LoginService, private reportService: ReportService, private paymentService: PaymentService, private groupUserService: GroupUserService) {}
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
  settlementAmounts!: any[];
  settlementOBJList: SettlementOBJ[]=[];
  userIds: number[]=[];
  toUPI = '';
  fromUPI ='';
  currentUser:any;
  selected:any=0;
  map = new Map<string, any>();
  baseURL = baseUrl;
  ngOnInit(): void {
    // this.loaduserGroupList();
    this.getSelectedGroup();
    this.currentUser = this.loginService.getUser();
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
            this.settlementAmounts=data.settlementAmounts;
            for(var i=0; i<data.usersList.length;i++){
              let reportObject = {} as ReportData;
              reportObject.userName = data.usersList[i];
              reportObject.spentAmt = (Math.round(data.totalIndividualSpend [i] * 100) / 100).toFixed(2);
              reportObject.chargedAmt = (Math.round(data.totalIndividualCharged[i] * 100) / 100).toFixed(2);
              reportObject.debtAmt = (Math.round(data.resList[i] * 100) / 100).toFixed(2);
              reportObject.settlement = data.settlementText[i];
              this.reportDataList[i]=reportObject;

            }
            var index=0;
            for(var i = 0; i<this.settlementTextList.length;i++){
              var id = this.settlementTextList[i].split('_/_')[0];
              if(!this.userIds.includes(id)){
                this.userIds[index]=id;
                index++;
              }
              var id2=this.settlementTextList[i].split('_/_')[1];
              if(!this.userIds.includes(id2)){
                this.userIds[index]=id2;
                index++;
              }
            }

          }
          
          this.groupUserService.getGroupUserList(this.selected).subscribe(
            (data:any)=>{
              debugger;
              for(var i = 0; i<data.length;i++){
                this.map.set(data[i].user.id+'',data[i].user);
              }
              for(var i = 0; i<this.settlementTextList.length;i++){
                let settlementOBJ={
                  userId:'',
                  settlementText:'',
                  amount:'',
                  payee:'',
                  receiver:'',
                }
                var from = this.map.get(this.settlementTextList[i].split('_/_')[0]);
                var to = this.map.get(this.settlementTextList[i].split('_/_')[1]);
                var settleText = from.firstName+' '+from.lastName+' will pay Rs '+this.settlementAmounts[i]+ ' to '+ to.firstName+' '+to.lastName;
                settlementOBJ.settlementText = settleText;
                settlementOBJ.amount = this.settlementAmounts[i];
                settlementOBJ.payee = from.upi;
                settlementOBJ.receiver = to.upi;
                settlementOBJ.userId = from.id;
                this.settlementOBJList[i] = settlementOBJ;
              }
              console.log(this.settlementOBJList);

            },(error:any)=>{
      
            }
          )
          console.log(this.settlementOBJList);
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
  generateQR(toUPI:any , amount:any){
    debugger;
    if(toUPI=='' || toUPI==null){
      swal.fire("Error","No UPI available !!", "error");
    }else{
      $("#qr-img").attr("src","http://localhost:8585/payment/generate-upi-qr/upi/"+toUPI+"/amt/"+amount);
      $("#qr-popup").show();
    }
  }
  closeQRPopup(){
    $("#qr-popup").hide();
  }

}
