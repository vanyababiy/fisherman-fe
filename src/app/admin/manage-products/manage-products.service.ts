import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

interface SignedUrl {
  url: string;
}

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((signedUrl) => {
        console.log(signedUrl);

        return this.http.put(signedUrl.url, file, {
          headers: {
            /* eslint-disable */
            ['Access-Control-Allow-Headers']: 'Content-Type',
            ['Access-Control-Allow-Origin']: '*',
            ['Access-Control-Allow-Methods']: 'OPTIONS,GET,POST,PUT',
          },
        });
      })
    );
  }

  private getPreSignedUrl(fileName: string): Observable<SignedUrl> {
    const url = this.getUrl('import', 'import');

    return this.http.get<SignedUrl>(url, {
      params: {
        name: fileName,
      },
    });
  }
}
