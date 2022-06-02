import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'src/app/service/comman-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { defaultFormat as _rollupMoment } from 'moment';

// const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};
@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class CompanyEditComponent implements OnInit {
  files: File[] = [];
  files2: File[] = [];
  activeLink = 0;
  industryData = [{
    title: 'Agriculture',
    child: [
      'Crop Production',
      'Farming and Ranching',
      'Animal Production and Aquaculture',
      'Fishing, Hunting and Forestry and Logging',
      'Others']
  },
  {
    title: 'Business Services',
    child: [
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
      'Others']
  },
  {
    title: 'Computer and Electronics',
    child: [
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
      'Others']
  },
  {
    title: 'Consumer Services',
    child: [
      'Automotive Repair and Maintenance',
      'Funeral Homes and Services',
      'Laundry and Dry Cleaning',
      'Parking Lots and Garage Management',
      'Personal Care',
      'Photofinishing Services',
      'Others']
  },
  {
    title: 'Education',
    child: [
      'Colleges and Universities',
      'Elementary and Secondary Schools',
      'Libraries, Archives and Museums',
      'Sports, Arts, and Recreation Instruction',
      'Technical and Trade Schools',
      'Test Preparation',
      'Others']
  },
  {
    title: 'Energy and Utilities',
    child: [
      'Alternative Energy Sources',
      'Gas and Electric Utilities',
      'Gasoline and Oil Refineries',
      'Sewage Treatment Facilities',
      'Waste Management and Recycling',
      'Water Treatment and Utilities',
      'Others']
  },
  {
    title: 'Financial Services',
    child: [
      'Banks',
      'Credit Cards and Related Services',
      'Insurance and Risk Management',
      'Investment Banking and Venture Capital',
      'Lending and Mortgage',
      'Personal Financial Planning',
      'Securities Agents and Brokers',
      'Others']
  }, {
    title: 'Government',
    child: [
      'International Bodies and Organizations',
      'Local Government',
      'National Government',
      'State/Provincial Government',
      'Government Holding',
      'Others']
  }, {
    title: 'Health, Pharmaceuticals, and Biotech',
    child: [
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
      'Others']
  }, {
    title: 'Manufacturing',
    child: [
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
      'Others']
  }, {
    title: 'Engineering Works & Services',
    child: [
      'Oil and gas',
      'Chemical',
      'Petrochemical',
      'Energy',
      'Desalination',
      'Food & Beverages',
      'Process Industries',
      'Various',
      'Others']
  }, {
    title: 'Media and Entertainment',
    child: ['Motion Picture Exhibitors',
      'Motion Picture and Recording Producers',
      'Newspapers, Books, and Periodicals',
      'Performing Arts',
      'Radio, Television Broadcasting',
      'Others']
  }, {
    title: 'Non-profit',
    child: [
      'Advocacy Organizations',
      'Charitable Organizations and Foundations',
      'Professional Associations',
      'Religious Organizations',
      'Social and Membership Organizations',
      'Trade Groups and Labor Unions',
      'Others']
  }, {
    title: 'Real Estate and Construction',
    child: [
      'Real Estate Developer',
      'Construction Contractor',
      'Construction Sub-Contractor',
      'Architecture, Engineering and Design',
      'Construction Equipment and Supplies',
      'Property Leasing and Management',
      'Real Estate Agents and Appraisers',
      'Real Estate Investment and Development',
      'Civil Engineering',
      'Others']
  }, {
    title: 'Retail',
    child: [
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
      'Others']
  }, {
    title: 'Software and Internet',
    child: [
      'Data Analytics, Management, and Internet',
      'E-Commerce and Internet Business',
      'Games and Gaming',
      'Software',
      'Others']
  }, {
    title: 'Retail/ Wholesale Trade',
    child: ['Motor Vehicle and Parts Dealers',
      'Furniture and Home Furnishings Stores',
      'Electronics and Appliance Stores ',
      'Building Material and Garden Equipment and Supplies Dealers',
      'Food and Beverage Stores ',
      'Health and Personal Care Stores',
      'Petrol Stations ',
      'Clothing and Clothing Accessories Stores ',
      'Sporting Goods, Hobby, Musical Instrument, and Book Stores ',
      'General Merchandise Stores',
      'Miscellaneous Store Retailers ',
      'Nonstore Retailers ',
      'Telecommunications',
      'Cable and Television Providers',
      'Telecommunications Equipment and Accessories',
      'Telephone Service Providers and Carriers',
      'Video and Teleconferencing',
      'Wireless and Mobile',
      'Others']
  }, {
    title: 'Transportation and Storage',
    child: ['Air Couriers and Cargo Services',
      'Airport, Harbor, and Terminal Operations',
      'Freight Hauling (Rail and Truck)',
      'Marine and Inland Shipping',
      'Moving Companies and Services',
      'Postal, Express Delivery and Couriers',
      'Warehousing and Storage',
      'Others']
  }, {
    title: 'Travel Recreation and Leisure',
    child: ['Amusement Parks and Attractions',
      'Cruise Ship Operations',
      'Passenger Airlines',
      'Rental Cars',
      'Resort',
      'Hotel',
      'Spectator Sports and Teams',
      'Taxi, Buses and Transit Systems',
      'Travel Agents and Services',
      'Others']
  }, {
    title: 'Wholesale and Distribution',
    child: ['Apparel Wholesalers',
      'Automobile Parts Wholesalers',
      'Beer, Wine and Liquor Wholesalers',
      'Chemicals and Plastics Wholesalers',
      'Grocery and Food Wholesalers',
      'Lumber and Construction Materials Wholesalers',
      'Metal and Mineral Wholesalers',
      'Office Equipment and Suppliers Wholesalers',
      'Computer & Electronic Wholesalers',
      'Petroleum Products Wholesalers',
      'Others']
  }, {
    title: 'Oil & Gas',
    child: [
      'Mining, Quarrying, and Oil and Gas Extraction',
      'Oil and Gas Extraction',
      'Mining (except Oil and Gas)',
      'Support Activities for Mining',
      'Others']
  }
  ]
  themeData: any = {
    "companyId": "",
    "company_Name": "",
    "company_Logo": [],
    "company_Address": "",
    "corporate_Email": "",
    "company_Website": "",
    "companyParent_Name": "",
    "company_Locations": "",
    "company_YearEstablished": "",
    "company_BusinessType": "",
    "company_Industry": "",
    "P_ContactName": "",
    "PC_Email": "",
    "Primary_Contact": "",
    "PC_Designation": "",
    "P_Contact": [],
    "company_Contact": "",
    "plan_Name": "",
    "plan_StartDate": "",
    "plan_EndDate": "",
    "license": "",
    "company_UploadContract": "",
    "number_Employee": "1",
    "ip_Address": "12.32.34.33",
    "superAdmin_id": "1",
    "faq": "",
    "privacy_Policy": "",
    "plan_Id": "1",
    mail_Server: '',
    smtp_Port: '',
    userName: '',
    password: '',
    server_Security: '',
    default_Sender: '',
    default_SenderName: '',
    salaryTemplateID: 1,
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
  designationList: any = [];
  planData: any = ['Lite', 'Plus', 'Premium'];
  imgShow: any = '';
  contract: any = '';
  constructor(public router: Router, public _api: CommonServiceService, public ngxService: NgxUiLoaderService, public _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    let url = this.router.url.split('/').pop();
    console.log(url)
    this.getComapny(url);
    this.getDesignation();
  }

  // get Designation list
  async getDesignation() {
    this.ngxService.start();
    await (this._api.designationList().subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.designationList = response.data;
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
  }
  // get company by id
  async getComapny(event) {
    this.ngxService.stop();
    let formData = {
      companyId: event
    }
    await (this._api.showCompanyByID(formData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.themeData = response.data[0];
        this.themeData.company_Logo = [this.themeData.company_Logo]
        this.themeData.P_Contact = response.data[0].P_Contact == '' ? [{ contact: null }] : JSON.parse(response.data[0].P_Contact);
        this.themeData.license = response.data[0].license ? response.data[0].license : 1
        

        this.imgShow = `${this.themeData.company_Logo}`;
        this.contract = `${this.themeData.company_UploadContract}`;
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

      } else {
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


  // Go for next tab

  next(n) {
    this.activeLink = n;
  }

  // Go for previous tab
  prev(n) {
    this.activeLink = n;
  }
  


  // upload logo image
  async onSelect(event) {

    //#region common image uploadcode
    // this.uploadType = event.addedFiles[0].type.split('/')[0]
    if (this.themeData.company_Logo.length === 0) {
      this.ngxService.start();
      if (event.addedFiles.length === 1) {
        for (let item of event.addedFiles) {

          await (this._api.uploadThemeDoc(item, 'logo').subscribe(res => {
            const response: any = res;
            if (response.success == true) {
              this.themeData.company_Logo.push(response.data);
              this.ngxService.stop();
            } else {
              this.openSnackBar(response.message);
            }
          }, err => {
            const error = err.error;
            this.openErrrorSnackBar(error.message);
          }));
        }
      } else {
        this.openErrrorSnackBar('You can upload only single Image / Video');
        this.ngxService.stop();
      }
    }
    else {
      this.openErrrorSnackBar('You can upload only single Image / Video');
      this.ngxService.stop();
    }
  }

  licenseFunction(value: any) {

    this.themeData.license = (value <= 0) ? 1 : value;
  }

  onRemove(event) {
    this.themeData.company_Logo.splice(this.themeData.company_Logo.indexOf(event), 1);
  }

  // upload contract
  async onDocSelect(event) {
    this.files2 = [...event.addedFiles];
    if (event.addedFiles.length > 0) {

      await (this._api.uploadThemeDoc(event.addedFiles[0], 'contract').subscribe(res => {
        this.ngxService.stop();

        
        const response: any = res;
        if (response.success == true) {
          this.themeData.company_UploadContract = response.data;

        } else {
          this.openSnackBar(response.message);
        }
        console.log(res);
      }, err => {
        const error = err.error;
        this.openErrrorSnackBar(error.message);
        this.ngxService.stop();
      }));
    } else {
      this.openErrrorSnackBar('File size is too large');
    }
  }

  onDocRemove(event) {
    console.log(event);
    this.files2.splice(this.files.indexOf(event), 1);
  }

  // edit company
  async editCompany() {
    this.ngxService.start();

    this.themeData.plan_EndDate = moment(this.themeData.plan_EndDate).format("YYYY-MM-DD");
    this.themeData.company_Address = `${this.addressData.building_name}, ${this.addressData.street}, ${this.addressData.office_number},  ${this.addressData.po_box}, ${this.addressData.emirates}, ${this.addressData.city},`
    await (this._api.editCompany(this.themeData).subscribe(res => {
      this.ngxService.stop();
      const response: any = res;
      if (response.success == true) {
        this.openSnackBar(response.message);
        this.router.navigate(['/company']);
      } else {
        this.openErrrorSnackBar(response.message);
      }
      console.log(res);
    }, err => {
      const error = err.error;
      this.openErrrorSnackBar(error.message);
      this.ngxService.stop();
    }));
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
  //add primary contact
  addContact() {
    this.themeData.P_Contact.push({ name: '', email: '', contact: null, designation: '' })
  }

  //remove primary contact
  remContact(i) {
    this.themeData.P_Contact.splice(i, 1)
  }
}
