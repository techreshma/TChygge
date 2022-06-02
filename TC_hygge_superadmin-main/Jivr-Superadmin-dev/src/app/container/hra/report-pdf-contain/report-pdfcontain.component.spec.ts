import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportPdfContainComponent } from './report-pdfcontain.component';



describe('ReportPdfContainComponent', () => {
  let component: ReportPdfContainComponent;
  let fixture: ComponentFixture<ReportPdfContainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPdfContainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPdfContainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
