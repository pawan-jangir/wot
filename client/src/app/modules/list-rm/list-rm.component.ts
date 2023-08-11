import { Component, OnInit,Renderer2 ,Inject,ElementRef } from '@angular/core';
import { Guid } from 'guid-typescript';
import {RegisterService} from '../../services/register.service';
import {CommonService} from '../../services/common.service';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import $ from "jquery";

@Component({
  selector: 'app-list-rm',
  templateUrl: './list-rm.component.html',
  styleUrls: ['./list-rm.component.css']
})
export class ListRmComponent implements OnInit {
  public showLoading = false
  public rmList:any=[]
  dtOptions: any = {};
  constructor(
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document,
    private elementRef:ElementRef,
    private register: RegisterService,
    private auth: AuthService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.auth.listRM({}).subscribe((res) => {
      this.showLoading = false;
      if(res.success === true){
        this.rmList= res.data
      }else{
        this.toastr.error(res.message);
      }
    },
    (error) => {
      //this.router.navigateByUrl('/dashboard');
      console.log(error)
      //this.toastr.error(error);
      this.showLoading = false;
    }
    )
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu : [5, 10, 25],
      processing: true
    };
    
  }
  ngAfterViewInit() {

    var s3 = document.createElement("script");
    s3.type = "text/javascript";
    s3.src = "assets/js/jquery.dataTables.min.js";
    this.elementRef.nativeElement.appendChild(s3);

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "assets/js/data-table.js";
    this.elementRef.nativeElement.appendChild(s);

    
  }

}
