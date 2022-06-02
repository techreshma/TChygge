import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payslip-preview',
  templateUrl: './payslip-preview.component.html',
  styleUrls: ['./payslip-preview.component.scss']
})
export class PayslipPreviewComponent implements OnInit {
  id:any;
  data={
    address:true,
    department:true,
    designation:true,
    passport:true,
    template:true,
    count:0
  }
  constructor(public route:ActivatedRoute) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
  }

}
