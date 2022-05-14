import { TestBed } from '@angular/core/testing';

import { ExternalUrlServiceService } from './external-url-service.service';

describe('ExternalUrlServiceService', () => {
  let service: ExternalUrlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalUrlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
