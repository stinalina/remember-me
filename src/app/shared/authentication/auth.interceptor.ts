// //TODO use interceptor Function. Blueprint for hasura jwt
// @Injectable() //JWT-Token bei API-Anfragen mitsenden; TODO Use this in app.config
// export class AuthenticationInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthenticationService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return from(this.authService.getIdToken()).pipe(
//       switchMap(token => {
//         if (token) {
//           const cloned = req.clone({
//             headers: req.headers.set('Authorization', `Bearer ${token}`)
//           });
//           return next.handle(cloned);
//         } else {
//           return next.handle(req);
//         }
//       })
//     );
//   }
// }