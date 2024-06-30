import { TestBed } from '@angular/core/testing';

import { CheckoutNumService } from './checkout-num.service';

describe('CheckoutNumService', () => {
  let service: CheckoutNumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutNumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
