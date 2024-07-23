import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  selected = 'group';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  nav(rounteString: string) {
    this.selected = rounteString;

    
    // this.router.navigate([rounteString]);

  }

}
