//  import type { RememberMeNotification } from '@/models'
//   import { computed, ref } from 'vue'
//   import { QuillEditor } from '@vueup/vue-quill'
//   import '@vueup/vue-quill/dist/vue-quill.snow.css';
// import { NotificationService } from '@/services/notification-service';

//   const formRef = ref<HTMLFormElement | null>(null);
//   const editorRef = ref<InstanceType<typeof QuillEditor> | null>(null);
//   const subject = ref('');
//   const content = ref('');
//   const dateTime = ref('');
//   const mail = ref('');
//   const now = ref(getNextDay());

//   const sendingNotification = ref(false);

//   function getNextDay() {
//     const tomorrow = new Date()
//     const pad = (n: number) => n.toString().padStart(2, '0')
//     return (
//       tomorrow.getFullYear() +
//       '-' +
//       pad(tomorrow.getMonth() + 1) +
//       '-' +
//       pad(tomorrow.getDate() + 1) +
//       'T' +
//       '00:30'
//     )
//   }

//   const canSubmitForm = computed(() =>  {
//     return content.value.length > 0 &&
//       dateTime.value.length > 0 &&
//       mail.value.length > 0
//   });

//   function onSubmit() {
//     if (formRef.value && !formRef.value.checkValidity()) {
//       formRef.value.reportValidity();
//       return
//     }

//     subject.value ??= 'RememberMe Erinnerung';
//     const notification = {
//       subject: subject.value,
//       content: content.value.trim(),
//       dateTime: dateTime.value,
//       mail: mail.value
//     } satisfies RememberMeNotification;

//     sendingNotification.value = true;
//     NotificationService.getInstance().sendNotification().then(() => {
//       console.log(JSON.stringify(notification));
//       resetForm();
//     }).catch((err: unknown) => {
//       console.error('Error sending notification:', err);
//     }).finally(() => {
//       sendingNotification.value = false;
//     });
//   }

//   function resetForm() {
//     subject.value = '';
//     content.value = '';
//     dateTime.value = '';
//     mail.value = '';
//     formRef.value?.reset();
//     editorRef.value?.setText('');
//   }

import { NgxEditorComponent, NgxEditorMenuComponent, Editor } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'reme-create-notification',
  templateUrl: 'create-notification.component.html',
  styles: [],
  standalone: true,
  imports: [NgxEditorComponent, NgxEditorMenuComponent, FormsModule],
})
export class CreateNotificationComponent implements OnInit, OnDestroy {
  html = '';
  editor!: Editor;

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}