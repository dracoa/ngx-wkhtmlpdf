import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WkhtmltopdfService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  public b64EncodeUnicode(str: string): string {
    if (window
      && 'btoa' in window
      && 'encodeURIComponent' in window) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(('0x' + p1) as any);
      }));
    } else {
      console.warn('b64EncodeUnicode requirements: window.btoa and window.encodeURIComponent functions');
      return null;
    }
  }

  processForm(content: any, options: any): any {
    const keys = ['body', 'header', 'footer'];
    const result = {options: null};
    keys.forEach(k => {
      if (content[k]) {
        result[k] = this.b64EncodeUnicode((content[k]));
      }
    });
    result.options = options;
    return result;
  }

  load(content: any, options: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    const form = this.processForm(content, options);
    return this.http.post('/wkhtmltopdf', form, {headers, responseType: 'blob'})
      .pipe(map(obj => this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(obj))));
  }

  loadWithStyles(body: string, header: string, footer: string, styles: string, options: any) {
    const combinedBody = `<style>${styles}</style>${body}`;
    const content = {
      header, footer, body: combinedBody
    };
    return this.load(content, options);
  }

}
