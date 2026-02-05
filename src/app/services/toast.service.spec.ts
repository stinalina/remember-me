import { TestBed } from '@angular/core/testing';
import { ToastService, ToastType } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should add a toast and remove it after 3 sec when showToast is called', () => {
    expect(service.toastIds()).toEqual([]);
    service.showToast('Test toast', ToastType.Success, 3000);
    expect(service.toastIds().length).toBe(1);
    jasmine.clock().tick(3000);
    expect(service.toastIds()).toEqual([]);
  });
});
