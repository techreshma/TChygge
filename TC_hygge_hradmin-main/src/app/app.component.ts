import { ChangeDetectorRef, Component, OnDestroy,  ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @ViewChild('drawer') public drawer: MatDrawer;
  mobileQuery: MediaQueryList;
  title = 'hrmd';
  showHeader = true;
  toggleMenu(): void{this.drawer.toggle(); }
  private _mobileQueryListener: () => void;
  constructor(public router: Router,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher){
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  getRoute(url){
    let rute = url.split('/')
    return rute[1];
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
