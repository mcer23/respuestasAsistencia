import { ComponentFixture, TestBed } from '@angular/core/testing';
import { protectedComponent } from './protected.component';


describe('ProtectedComponent', () => {
  let component: protectedComponent;
  let fixture: ComponentFixture<protectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [protectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(protectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
