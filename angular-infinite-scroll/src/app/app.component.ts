import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { map, pairwise, filter, throttleTime, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('scroller')
  scroller!: CdkVirtualScrollViewport;
  loading = false;

  title = 'angular-infinite-scroll';
  listItems: Item[] = [];

  constructor(private ngZone: NgZone) {}
  ngAfterViewInit(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.fetchMore();
        });
      });
  }

  ngOnInit() {
    this.fetchMore();
  }

  fetchMore(): void {
    this.loading = true;
    const images = [
      'IuLgi9PWETU',
      'fIq0tET6llw',
      'xcBWeU4ybqs',
      'YW3F-C5e8SE',
      'H90Af2TFqng',
    ];

    const newItems: Item[] = [];
    for (let i = 0; i < 20; i++) {
      const randomListNumber = Math.round(Math.random() * 100);
      const randomPhotoId = Math.round(Math.random() * 4);
      newItems.push({
        title: 'List Item ' + randomListNumber,
        content:
          'This is some description of the list - item # ' + randomListNumber,
        image: `https://source.unsplash.com/${images[randomPhotoId]}/50x50`,
      });
    }
    timer(1000).subscribe(() => {
      this.loading = false;
      this.listItems = this.listItems.concat(newItems);
    });
  }
}

export class Item {
  constructor() {
    this.title = ``;
    this.content = ``;
    this.image = ``;
  }
  public title: string;
  public content: string;
  public image: string;
}
