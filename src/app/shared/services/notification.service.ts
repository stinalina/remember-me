import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NotificationService {

  public sendNotification(): Promise<void> {
    return new Promise((resolve) => setTimeout(() => {
      resolve(); //without this the promise never terminates aka resolves
      console.log('Sending notification...');
    } , 1000));
  }
  }
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //   try {
    //     toast.success('Congratulations!\nErinnerung erfolgreich erstellt!', {
    //       position: 'top-right',
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //     });
    //     resolve();
    //   } catch (err: unknown) {
    //     toast.error(`Holy smokes!\n${(err as Error).message}`, {
    //       position: 'top-right',
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //     });
    //   } catch (err: unknown) {
    //     toast.error(`Holy smokes!\n${(err as Error).message}`, {
    //       position: 'top-right',