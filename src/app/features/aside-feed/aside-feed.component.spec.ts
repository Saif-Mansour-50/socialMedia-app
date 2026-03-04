import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideFeedComponent } from './aside-feed.component';

describe('AsideFeedComponent', () => {
  let component: AsideFeedComponent;
  let fixture: ComponentFixture<AsideFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
