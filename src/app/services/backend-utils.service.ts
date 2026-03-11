import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { map, Observable } from 'rxjs';

type UserRegistrationResponse = {
  success: boolean;
  callCount: number;
}

@Injectable({ providedIn: 'root' })
export class BackendUtilsService {
  private readonly httpClient = inject(HttpClient);

  public getUserAsInterestedPartyCount(): Observable<number> {
    const url = `${environment.BACKEND_URL}${environment.SEND_REGISTER_INTERESTED_PARTY_MAIL_URL}?onlyValue=true`;
    return this.httpClient.post<UserRegistrationResponse>(url, {}).pipe(
      map((response: UserRegistrationResponse) => response.callCount));
  }
}
