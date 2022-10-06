import { TestBed } from '@angular/core/testing';

import { FuseinitializerService } from './fuseinitializer.service';

describe('FuseinitializerService', () => {
  let service: FuseinitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuseinitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
