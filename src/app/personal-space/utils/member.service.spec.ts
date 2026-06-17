import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetMemberByIdGQL, UpdatePreferencesGQL, UpdateStatsGQL } from '@hasura/generated';
import { ToastService, ToastType } from '@services/toast.service';
import { MemberService } from './member.service';
import { createEmptyYearStats } from '@app/personal-space/data/stats.model';

const mockToastService = {
  showToast: vi.fn(),
};

describe('MemberService', () => {
  let service: MemberService;
  let mockGetMemberByIdGQL: { fetch: ReturnType<typeof vi.fn> };
  let mockUpdatePreferencesGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockUpdateStatsGQL: { mutate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockGetMemberByIdGQL = {
      fetch: vi.fn().mockReturnValue(
        of({ data: { User: [{ Name: 'Max Mustermann', Preferences: { avatarName: 'Kingston' }, Stats: {} }] } })
      ),
    };

    mockUpdatePreferencesGQL = {
      mutate: vi.fn().mockReturnValue(
        of({ data: { update_User: { returning: [{ Preferences: { avatarName: 'Lyra' } }] } } })
      ),
    };

    mockUpdateStatsGQL = {
      mutate: vi.fn().mockReturnValue(
        of({ data: { update_User: { returning: [{ Stats: {} }] } } })
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        MemberService,
        { provide: ToastService, useValue: mockToastService },
        { provide: GetMemberByIdGQL, useValue: mockGetMemberByIdGQL },
        { provide: UpdatePreferencesGQL, useValue: mockUpdatePreferencesGQL },
        { provide: UpdateStatsGQL, useValue: mockUpdateStatsGQL },
      ],
    });

    service = TestBed.inject(MemberService);
    vi.clearAllMocks();
  });

  describe('loadMember', () => {
    it('should set member signal when user is found', () => {
      expect(service.member()).toBeNull();

      service.loadMember('user-123').subscribe();

      expect(service.member()).toEqual({
        id: 'user-123',
        name: 'Max Mustermann',
        preferences: { avatarName: 'Kingston' },
        stats: {},
      });
    });

    it('should call GetMemberByIdGQL with the provided id', () => {
      service.loadMember('user-123').subscribe();

      expect(mockGetMemberByIdGQL.fetch).toHaveBeenCalledWith({ variables: { id: 'user-123' } });
    });

    it('should set member to null and throw when user is not found', () => {
      mockGetMemberByIdGQL.fetch.mockReturnValue(of({ data: { User: [] } }));

      let thrownError: unknown;
      service.loadMember('unknown-id').subscribe({
        error: (err) => (thrownError = err),
      });

      expect(service.member()).toBeNull();
      expect(thrownError).toBeInstanceOf(Error);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences in the member signal', () => {
      service.member.set({ id: 'user-123', name: 'Max Mustermann', preferences: { avatarName: 'Kingston' }, stats: {} });

      service.updatePreferences('user-123', { avatarName: 'Lyra' }).subscribe();

      expect(service.member()?.preferences).toEqual({ avatarName: 'Lyra' });
    });

    it('should call UpdatePreferencesGQL with the correct arguments', () => {
      service.updatePreferences('user-123', { avatarName: 'Lyra' }).subscribe();

      expect(mockUpdatePreferencesGQL.mutate).toHaveBeenCalledWith({
        variables: { id: 'user-123', preferences: { avatarName: 'Lyra' } },
      });
    });

    it('should not change member signal when member is null', () => {
      service.member.set(null);

      service.updatePreferences('user-123', { avatarName: 'Lyra' }).subscribe();

      expect(service.member()).toBeNull();
    });

    it('should show error toast and return EMPTY on backend error', () => {
      mockUpdatePreferencesGQL.mutate.mockReturnValue(throwError(() => new Error('Network error')));

      let completed = false;
      service.updatePreferences('user-123', { avatarName: 'Lyra' }).subscribe({
        complete: () => (completed = true),
      });

      expect(mockToastService.showToast).toHaveBeenCalledWith(
        'Upss, das hat nicht geklappt. Das Backend ist momentan nicht erreichbar.',
        ToastType.Error
      );
      expect(completed).toBe(true);
    });
  });

  describe('increaseStatsCount', () => {
    it('should increase stats count when year already exists', () => {
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      
      service.member.set({
        id: 'user-123',
        name: 'Max Mustermann',
        preferences: { avatarName: 'Kingston' },
        stats: {
          [currentYear]: {
            '01': 5,
            '02': 3,
            [currentMonth]: 10,
          },
        },
      });

      service.increaseStatsCount().subscribe(() => {
        expect(mockUpdateStatsGQL.mutate).toHaveBeenCalledWith({
          variables: {
            id: 'user-123',
            stats: {
              [currentYear]: {
                '01': 5,
                '02': 3,
                [currentMonth]: 11, // Erhöht von 10 auf 11
              },
            },
          },
        });
      });
    });

    it('should create new year and month when year does not exist', () => {
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      const previousYear = (new Date().getFullYear() - 1).toString();
      
      service.member.set({
        id: 'user-123',
        name: 'Max Mustermann',
        preferences: { avatarName: 'Kingston' },
        stats: {
          [previousYear]: {
            '01': 5,
            '02': 3,
          },
        },
      });

      const emptyYear = createEmptyYearStats();
      const expectedStats = {
        ...{
          [previousYear]: {
            '01': 5,
            '02': 3,
          },
        },
        [currentYear]: {
          ...emptyYear,
          [currentMonth]: 1,
        },
      };

      service.increaseStatsCount().subscribe(() => {
        expect(mockUpdateStatsGQL.mutate).toHaveBeenCalledWith({
          variables: {
            id: 'user-123',
            stats: expectedStats,
          },
        });
      });
    });

    it('should update member signal with new stats after successful mutation', () => {
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      
      service.member.set({
        id: 'user-123',
        name: 'Max Mustermann',
        preferences: { avatarName: 'Kingston' },
        stats: {
          [currentYear]: {
            '01': 5,
            [currentMonth]: 10,
          },
        },
      });

      service.increaseStatsCount().subscribe(() => {
        expect(service.member()?.stats[currentYear][currentMonth]).toBe(11);
      });
    });
  });
});
