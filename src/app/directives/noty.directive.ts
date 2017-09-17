import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange, ElementRef, ViewEncapsulation } from '@angular/core';




@Component({
    selector: 'noty',
    template: `
    <div class = "noty col-xs-12 col-sm-4 col-md-3 col-lg-3 alert {{notyType}}" 
    *ngIf="notyShow">
    <button type="button" (click) = "closeNoty()" class="close">&times;</button>
    {{notyMessage}}
  </div>
        `,
        styles: [`
        .noty {
          z-index:1200;
          position:fixed;
          top:15%;
          left:2%;
        }
      `]
      //encapsulation: ViewEncapsulation.None
})
export class Noty implements OnInit, OnChanges {
   @Input() notyMessage : string;
   @Input() notyType : string;
   @Input() notyShow : boolean;

   @Output() close = new EventEmitter<boolean>();
 
   closeNoty() { this.close.next(false); }

    constructor() {}

    ngOnInit() {}
    ngOnChanges() {}

   
}
