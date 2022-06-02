import { Component, OnInit } from '@angular/core';

import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/service/alert.service';
import * as _moment from 'moment';


@Component({
  selector: 'app-branch-create',
  templateUrl: './branch-create.component.html',
  styleUrls: ['./branch-create.component.scss']
})
export class BranchCreateComponent implements OnInit {
  industryData = [{title:'Agriculture',
    child:[
'Crop Production',
'Farming and Ranching',
'Animal Production and Aquaculture',
'Fishing, Hunting and Forestry and Logging',
'Others']},
{title:'Business Services',
child:[
'Accounting and Tax Preparation',
'Advertising, Marketing and PR',
'Data and Records Management',
'Facilities Management and Maintenance',
'HR and Recruiting Services',
'Legal Services',
'Management Consulting',
'Payroll Services',
'Sales Services',
'Security Services',
'Others']},
{title:'Computer and Electronics',
child:[
'Audio, Video and Photography',
'Computers, Parts and Repair',
'Consumer Electronics, Parts and Repair',
'IT and Network Services and Support',
'Instruments and Controls',
'Network Security Products',
'Networking equipment and Systems',
'Office Machinery and Equipment',
'Peripherals Manufacturing',
'Semiconductor and Microchip Manufacturing',
'Others']},
{title:'Consumer Services',
child:[
'Automotive Repair and Maintenance',
'Funeral Homes and Services',
'Laundry and Dry Cleaning',
'Parking Lots and Garage Management',
'Personal Care',
'Photofinishing Services',
'Others']},
{title:'Education',
child:[
'Colleges and Universities',
'Elementary and Secondary Schools',
'Libraries, Archives and Museums',
'Sports, Arts, and Recreation Instruction',
'Technical and Trade Schools',
'Test Preparation',
'Others']},
{title:'Energy and Utilities',
child:[
'Alternative Energy Sources',
'Gas and Electric Utilities',
'Gasoline and Oil Refineries',
'Sewage Treatment Facilities',
'Waste Management and Recycling',
'Water Treatment and Utilities',
'Others']},
{title:'Financial Services',
child:[
'Banks',
'Credit Cards and Related Services',
'Insurance and Risk Management',
'Investment Banking and Venture Capital',
'Lending and Mortgage',
'Personal Financial Planning',
'Securities Agents and Brokers',
'Others']},{title:'Government',
child:[
'International Bodies and Organizations',
'Local Government',
'National Government',
'State/Provincial Government',
'Government Holding',
'Others']},{title:'Health, Pharmaceuticals, and Biotech',
child:[
'Biotechnology',
'Diagnostic Laboratories',
'Doctors and Health Care Practitioners',
'Hospitals',
'Medical Devices',
'Medical Supplies and Equipment',
'Outpatient Clinic',
'Personal Health Care Products',
'Pharmaceuticals',
'Care Facilities',
'Veterinary Clinics and Services',
'Others']},{title:'Manufacturing',
child:[
'Food and Dairy Product Manufacturing and Packaging',
'Beverage and Tobacco Product',
'Textile Mills',
'Textile Product Mills',
'Textiles, Apparel and Accessories',
'Concrete, Glass and Building Materials',
'Wood Product',
'Paper & Paper Product',
'Printing and Related Support Activities',
'Petroleum and Coal Products',
'Chemical',
'Plastics and Rubber Products',
'Nonmetallic Mineral Product',
'Metal & Metal Fabrication',
'Light and Heavy Machinery',
'Computer and Electronic Product',
'Electrical Equipment, Appliance, and Component',
'Transportation Equipment',
'Furniture and Related Product',
'Water, beverage & Packaging',
'Automobiles, Boats and Motor Vehicles',
'Packaging ',
'Others']},{title:'Engineering Works & Services',
child:[
'Oil and gas',
'Chemical',
'Petrochemical',
'Energy',
'Desalination',
'Food & Beverages',
'Process Industries',
'Various',
'Others']},{title:'Media and Entertainment',
child:['Motion Picture Exhibitors',
'Motion Picture and Recording Producers',
'Newspapers, Books, and Periodicals',
'Performing Arts',
'Radio, Television Broadcasting',
'Others']},{title:'Non-profit',
child:[
'Advocacy Organizations',
'Charitable Organizations and Foundations',
'Professional Associations',
'Religious Organizations',
'Social and Membership Organizations',
'Trade Groups and Labor Unions',
'Others']},{title:'Real Estate and Construction',
child:[
'Real Estate Developer',
'Construction Contractor',
'Construction Sub-Contractor',
'Architecture, Engineering and Design',
'Construction Equipment and Supplies',
'Property Leasing and Management',
'Real Estate Agents and Appraisers',
'Real Estate Investment and Development',
'Civil Engineering',
'Others']},{title:'Retail',
child:[
'Automobile Dealers',
'Automobile Parts and Supplies',
'Clothing and Shoe Stores',
'Department Stores',
'Florist',
'Furniture Stores',
'Gasoline Stations',
'Grocery and Specialty Stores',
'Hardware and Building Material Dealers',
'Jewelry, Luggage, and Leather Goods',
'Office Supplies Stores',
'Restaurants and Bars',
'Sporting Goods, Hobby, Books and Music Stores',
'E-Retailer',
'Others']},{title:'Software and Internet',
child:[
'Data Analytics, Management, and Internet',
'E-Commerce and Internet Business',
'Games and Gaming',
'Software',
'Others']},{title:'Retail/ Wholesale Trade',
child:['Motor Vehicle and Parts Dealers',
'Furniture and Home Furnishings Stores' ,
'Electronics and Appliance Stores ',
'Building Material and Garden Equipment and Supplies Dealers' ,
'Food and Beverage Stores ',
'Health and Personal Care Stores' ,
'Petrol Stations ',
'Clothing and Clothing Accessories Stores ',
'Sporting Goods, Hobby, Musical Instrument, and Book Stores ',
'General Merchandise Stores' ,
'Miscellaneous Store Retailers ',
'Nonstore Retailers ',
'Telecommunications',
'Cable and Television Providers',
'Telecommunications Equipment and Accessories',
'Telephone Service Providers and Carriers',
'Video and Teleconferencing',
'Wireless and Mobile',
'Others']},{title:'Transportation and Storage',
child:['Air Couriers and Cargo Services',
'Airport, Harbor, and Terminal Operations',
'Freight Hauling (Rail and Truck)',
'Marine and Inland Shipping',
'Moving Companies and Services',
'Postal, Express Delivery and Couriers',
'Warehousing and Storage',
'Others']},{title:'Travel Recreation and Leisure',
child:['Amusement Parks and Attractions',
'Cruise Ship Operations',
'Passenger Airlines',
'Rental Cars',
'Resort',
'Hotel',
'Spectator Sports and Teams',
'Taxi, Buses and Transit Systems',
'Travel Agents and Services',
'Others']},{title:'Wholesale and Distribution',
child:['Apparel Wholesalers',
'Automobile Parts Wholesalers',
'Beer, Wine and Liquor Wholesalers',
'Chemicals and Plastics Wholesalers',
'Grocery and Food Wholesalers',
'Lumber and Construction Materials Wholesalers',
'Metal and Mineral Wholesalers',
'Office Equipment and Suppliers Wholesalers',
'Computer & Electronic Wholesalers',
'Petroleum Products Wholesalers',
'Others']},{title:'Oil & Gas',
child:[
'Mining, Quarrying, and Oil and Gas Extraction',
'Oil and Gas Extraction',
'Mining (except Oil and Gas)',
'Support Activities for Mining',
'Others']}
  ]

  designationList:any = [];
  formData = {
    company_Id:'',
    company_Contact:'',
    corporate_email:'',
    company_YearEstablished: '',
    company_Address:"",
    ip_Address: "12.32.33.22",
    branch_Type:0,
    access:[{module:'Dashboard',permission:0},
    {module:'Calendar',permission:0},
    {module:'Messaging',permission:0},
    {module:'Employees',permission:0},
    {module:'Leaves',permission:0},
    {module:'Documents',permission:0},
    {module:'Announcement',permission:0},
    {module:'Salary Management',permission:0},
    {module:'Surveys',permission:0},
    {module:'Reports',permission:0},
    {module:'Health & Wellnesss',permission:0},
    {module:'Insurance',permission:0},
    {module:'Rewards',permission:0},
    {module:'Challenges',permission:0},
    {module:'Coaching',permission:0},],
    company_BusinessType:"",
    company_WorkingHours:8,
    company_Industry: "",
    P_firstName:"",
    P_lastName:"",
    branch_Name:"",
    PC_Email:"" ,
    P_Contact: '',
    PC_Designation:"",
    salaryTemplateID:1
  };
  addressData = {
    building_name:'',
    street:'',
    office_number:'',
    po_box:'',
    emirates:'',
    city:''
  }
  userData:any;
  searchUser:any;
  userListDummy:any=[];
  userList:any[] = [];
  constructor(public _alert:AlertService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar, public dialogRef: MatDialogRef<BranchCreateComponent>) { }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('userData'))
    this.formData.company_Id = this.userData.company_id;
    this.getList();
    this.getDesignation();
  }


  // Get Employee List
 async getList(){
  this.ngxService.start();
  await(this._api.getEmployee().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.userList = response.data;
      this.userListDummy = response.data;
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));

}

// get Designation list
async getDesignation(){
  this.ngxService.start();
  await(this._api.designationList().subscribe(res => {
    this.ngxService.stop();
    const response: any = res;
    if (response.success == true){
      this.designationList = response.data;
    }else{
    }
    console.log(res);
  }, err => {
    const error = err.error;
    this.ngxService.stop();
  }));
}

  // add new Branch
  async addBranch(){
    this.formData.company_Address = Object.keys(this.addressData).map((k:any) => {return this.addressData[k]}).join(",");
    this.ngxService.start();
    await(this._api.createBranch(this.formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this._alert.openSnackBar(response.message);
      }else{
        this._alert.openErrrorSnackBar(response.message);
      }
      console.log(res);
      this.dialogRef.close('Close');
    }, err => {
      const error = err.error;
      this._alert.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }


  searchAgeFilter(value){
    if(!value){
      this.userList = this.userListDummy;
    } // when nothing has typed
    this.userList = Object.assign([], this.userListDummy).filter(
      item => (item.first_name|| item.last_name).toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }


  //change permission
  changePermission(event,i){
    this.formData.access[i].permission = event.checked?1:0;
    console.log(this.formData.access[i].permission)
  }

}
