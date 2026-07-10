import { TestBed } from '@angular/core/testing';
import { createEmptyYearStats } from '@app/personal-space/data/stats.model';
import { DeleteUserByIdGQL, GetMemberByIdGQL, UpdateNameGQL, UpdatePreferencesGQL, UpdateStatsGQL } from '@hasura/generated';
import { ToastService } from '@services/toast.service';
import { of } from 'rxjs';
import { MemberService } from './member.service';

const mockToastService = {
  showToast: vi.fn(),
};

describe('MemberService', () => {
  let service: MemberService;
  let mockGetMemberByIdGQL: { fetch: ReturnType<typeof vi.fn> };
  let mockUpdatePreferencesGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockUpdateStatsGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockUpdateNameGQL: { mutate: ReturnType<typeof vi.fn> };
  let mockDeleteUserByIdGQL: { mutate: ReturnType<typeof vi.fn> };

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

    mockUpdateNameGQL = {
      mutate: vi.fn().mockReturnValue(
        of({ data: { update_User: { returning: [{ Name: 'Max Mustermann' }] } } })
      ),
    };

    mockDeleteUserByIdGQL = {
      mutate: vi.fn().mockReturnValue(
        of({ data: { delete_User_by_pk: { id: 'user-123' } } })
      ),
    };

    TestBed.configureTestingModule({
      providers: [
        MemberService,
        { provide: ToastService, useValue: mockToastService },
        { provide: GetMemberByIdGQL, useValue: mockGetMemberByIdGQL },
        { provide: UpdatePreferencesGQL, useValue: mockUpdatePreferencesGQL },
        { provide: UpdateStatsGQL, useValue: mockUpdateStatsGQL },
        { provide: UpdateNameGQL, useValue: mockUpdateNameGQL },
        { provide: DeleteUserByIdGQL, useValue: mockDeleteUserByIdGQL },
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
      service.member.set({ id: 'user-123', name: 'Max Mustermann', mail: '', preferences: { avatarName: 'Kingston', subscribeReleaseMails: true }, stats: {} });

      service.updatePreferences('user-123', { avatarName: 'Lyra' }).subscribe();

      expect(service.member()?.preferences).toEqual({ avatarName: 'Lyra', subscribeReleaseMails: true });
    });

    it('should not change member signal when member is null', () => {
      service.member.set(null);

      service.updatePreferences('user-123', { avatarName: 'Lyra' }).subscribe();

      expect(service.member()).toBeNull();
    });
  });

  describe('increaseStatsCount', () => {
    it('should increase stats count when year already exists', () => {
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      
      service.member.set({
        id: 'user-123',
        name: 'Max Mustermann',
        preferences: { avatarName: 'Kingston', subscribeReleaseMails: true },
        mail: '',
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
      const now = new Date();
      const currentYear = now.getFullYear().toString();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      const previousYear = (now.getFullYear() - 1).toString();
      
      service.member.set({
        id: 'user-123',
        name: 'Max Mustermann',
        preferences: { avatarName: 'Kingston', subscribeReleaseMails: true },
        mail: '',
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
      const now = new Date();
      const currentYear = now.getFullYear().toString();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      
      service.member.set({
        id: 'user-123',
        name: 'Max Mustermann',
        preferences: { avatarName: 'Kingston', subscribeReleaseMails: true },
        mail: '',
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
