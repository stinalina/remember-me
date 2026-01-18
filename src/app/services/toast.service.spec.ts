import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
    jasmine.clock().install(); // Fake Timer aktivieren
  });

  afterEach(() => {
    jasmine.clock().uninstall(); // Fake Timer deaktivieren
  });

  it('should add a toast id when showToast is called', () => {
    expect(service.toastIds()).toEqual([]);
    service.showToast();
    expect(service.toastIds().length).toBe(1);
    expect(service.toastIds()[0]).toBe(1);
  });

  it('should remove the toast id after 3 seconds', () => {
    service.showToast();
    expect(service.toastIds().length).toBe(1);

    jasmine.clock().tick(3000); // Zeit vorspulen

    expect(service.toastIds()).toEqual([]);
  });

  it('should remove a specific toast id', () => {
    service.showToast();
    service.showToast();
    expect(service.toastIds()).toEqual([1, 2]);
    service.remove(1);
    expect(service.toastIds()).toEqual([2]);
  });
});
