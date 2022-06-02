import { TestBed } from '@angular/core/testing';

import { AccessServiceService } from './access-service.service';

describe('AccessServiceService', () => {
  let service: AccessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
