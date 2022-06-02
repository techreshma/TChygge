import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AccessServiceService } from 'src/app/service/access-service.service';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  files: File[] = [];
  files2: File[] = [];
  activeLink = 0;
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
  themeData = {
    "companyId":"",
    "company_Name": "",
    "company_Logo": "",
    "company_Address": "",
    "corporate_Email": "",
    "company_Website": "",
    "companyParent_Name": "",
    "company_Locations": "",
    "company_YearEstablished": "",
    "company_BusinessType": "",
    "company_Industry":"",
    "P_ContactName": "",
    "PC_Email": "",
    "Primary_Contact":"",
    "PC_Designation": "",
    "P_Contact": [],
    "company_Contact": "",
    "plan_Name": "",
    "plan_StartDate": "",
    "plan_EndDate": "",
    "company_UploadContract": "",
    "number_Employee": "1",
    "ip_Address": "12.32.34.33",
    "superAdmin_id": "1",
    "faq": "",
    "privacy_Policy": "",
    "plan_Id": "1",
    mail_Server:'',
    smtp_Port:'',
    userName:'',
    password:'',
    server_Security:'',
    default_Sender:'',
    default_SenderName:'',
    salaryTemplateID:1,
  }
  addressData = {
    building_name: '',
    street: '',
    office_number: '',
    po_box: null,
    emirates: '',
    city: ''
  }
  passNotMatched: boolean = false;
  designationList:any = [];
  planData:any=[{id:'JitterBug'},{id:'Swing'},{id:'Jive'}];
  imgShow:any = '';
  contract:any= '';
  accessPermission:any = '';
  workingDay:any;
  constructor( public _access:AccessServiceService, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) {
     //getting access permission
     this.accessPermission = this._access.getRouteAccess('User roles',JSON.parse(localStorage.getItem('userData')).moduleAccess);
  }

  ngOnInit(): void {
    // this.getWorkingDay();
    this. getComapny(JSON.parse(localStorage.getItem('userData')).company_id)
  }

   // get company by id
   async getComapny(event) {
    this.ngxService.stop();
    let formData = {
      companyId:event
    }
    await(this._api.showCompanyByID(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.themeData = response.data[0];
        // console.log(this.themeData.P_Contact)
        this.themeData.P_Contact = response.data[0].P_Contact == ''?[{contact:null}]:JSON.parse(response.data[0].P_Contact);
        this.imgShow = `${environment.apiBaseUrl}${this.themeData.company_Logo}`;
        this.contract = `${environment.apiBaseUrl}${this.themeData.company_UploadContract}`;
        let address = response.data[0].company_Address.split(',')
        this.addressData = {
          building_name: address[0].trim(),
          street: address[1].trim(),
          office_number: address[2].trim(),
          po_box: parseInt(address[3]),
          emirates: address[4].trim(),
          city: address[5].trim()
        }
        this.themeData.companyId = response.data[0].company_id

      }else{
        this.ngxService.stop();
        this.openSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  //get working hour
  // async getWorkingDay(){
  //   this.ngxService.start();
  //     await(this._api.companyWorkingDay().subscribe(res => {
  //       this.ngxService.stop();
  //       const response: any = res;
  //       if (response.success == true){
  //         this.workingDay = response.data;
  //       }else{
  //         this.openErrrorSnackBar(response.message);
  //       }
  //       console.log(res);
  //     },err => {
  //       const error = err.error;
  //       this.ngxService.stop();
  //       this.openErrrorSnackBar(error.message);
  //     }));

  // }

  // edit company
  async editCompany(){
    this.ngxService.start();
    this.themeData.company_Address = `${this.addressData.building_name}, ${this.addressData.street}, ${this.addressData.office_number},  ${this.addressData.po_box}, ${this.addressData.emirates}, ${this.addressData.city},`
    await(this._api.editCompany(this.themeData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true){
        this.openSnackBar(response.message);
      }else{
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }

  // upload logo image
  async onSelect(event) {
    console.log(event);
    this.files = [...event.addedFiles];
    if (event.addedFiles.length > 0){

      await(this._api.uploadThemeDoc(event.addedFiles[0], 'logo').subscribe(res => {
        this.ngxService.stop();
        const response: any = res;
        if (response.success == true){
          this.themeData.company_Logo = response.data;

        }else{
          this.openSnackBar(response.message);
        }
        console.log(res);
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    }else{
      this.openErrrorSnackBar('File size is too large');
    }
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  //update working day

  // async companyWorkingDaySet(){
  //   let d = false;
  //   for(let item of this.workingDay){
  //     if(!item.OnOff){
  //       if(item.inTime === '' || item.outTime=== ''){
  //         d = true;
  //       }
  //     }
  //   }
  //   if(!d){

  //     let data = {
  //       "companyId": JSON.parse(localStorage.getItem('userData')).company_id,
  //       "workingDay":JSON.stringify(this.workingDay)
  //     }
  //     this.ngxService.start();
  //       await(this._api.companyWorkingDaySet(data).subscribe(res => {
  //         this.ngxService.stop();
  //         const response: any = res;
  //         if (response.success == true){
  //           this.openSnackBar(response.message);
  //           this.getWorkingDay()
  //         }else{
  //           this.openErrrorSnackBar(response.message);
  //         }
  //         console.log(res);
  //       },err => {
  //         const error = err.error;
  //         this.ngxService.stop();
  //         this.openErrrorSnackBar(error.message);
  //       }));
  //   }else{
  //     this.openErrrorSnackBar('Please fill the field of the day in which working are on.');
  //   }


  // }
 // employee working hour on off setup
 setOnOff(e, id){
  this.workingDay[id].OnOff = (e == 'true'?true:false)
  }

// alert message after api response success
openSnackBar(msg) {
  this._snackBar.open(msg, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['success-alert']
  });
}
// alert message after api response failure
openErrrorSnackBar(msg) {
  this._snackBar.open(msg, 'Ok', {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['failure-alert']
  });
}
}
