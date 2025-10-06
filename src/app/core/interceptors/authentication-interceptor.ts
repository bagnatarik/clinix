import { HttpInterceptorFn } from '@angular/common/http';

// Intercepteur d’authentification: ajoute le header Authorization si un token est présent
export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Définir Content-Type pour les requêtes avec payload si non présent
  const method = req.method?.toUpperCase();
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
  const hasContentType = req.headers.has('Content-Type');
  if (hasBody && !hasContentType) {
    headers['Content-Type'] = 'application/json';
  }

  req = req.clone({ setHeaders: headers });
  return next(req);
};
