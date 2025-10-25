// import { toast } from "vue3-toastify";
// import "vue3-toastify/dist/index.css";

// export class NotificationService {
//   private static instance: NotificationService;

//   private constructor() {}

//   public static getInstance(): NotificationService {
//     if (!NotificationService.instance) {
//       NotificationService.instance = new NotificationService();
//     }
//     return NotificationService.instance;
//   }

//   public sendNotification(): Promise<void> {
//     console.log('Sending notification...');
//     return new Promise((resolve) => {
//       setTimeout(() => {
//       try {
//         toast.success('Congratulations!\nErinnerung erfolgreich erstellt!', {
//           position: 'top-right',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//         });
//         resolve();
//       } catch (err: unknown) {
//         toast.error(`Holy smokes!\n${(err as Error).message}`, {
//           position: 'top-right',
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//         });
//       }}, 2000);
//     });
//   }
// }