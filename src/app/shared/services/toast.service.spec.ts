import { TestBed } from '@angular/core/testing';
import { ToastService, ToastType } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should add a toast and remove it after 3 sec when showToast is called', () => {
    expect(service.toastIds()).toEqual([]);
    service.showToast('Test toast', ToastType.Success, 3000);
    expect(service.toastIds().length).toBe(1);
    vi.advanceTimersByTime(3000);
    expect(service.toastIds()).toEqual([]);
  });
});
