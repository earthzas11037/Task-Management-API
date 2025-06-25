import { Global, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestContext } from 'nestjs-request-context';
import axiosRetry from 'axios-retry';
import { getRequestIdContext } from 'src/common/utilities/request-context.utility';
// import { LogService } from 'src/application/services/log/log.service';

axiosRetry(axios, {
  retries: 10,
  shouldResetTimeout: true,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition(error) {
    console.log('retryCondition', error.code, error);

    if ([408].includes(error.status)) return true;

    if (['ERR_BAD_REQUEST'].includes(error.code)) {
      return false;
    }

    return true;
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retrying request attempt ${retryCount}`);
  },
});
@Global()
@Injectable()
export class AxiosService {
  constructor(
    private readonly httpService: HttpService,
    // private readonly logService: LogService, // Inject LogService to handle logging
  ) {}

  // GET method
  get<Res>(url: string, options?: AxiosRequestConfig): Observable<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'GET';
    const query = options?.params; // Example of query params in a GET request

    return this.httpService.get<Res>(url, options).pipe(
      tap((response) => {
        this.logOutbound(requestId, method, url, response, null, null, query);
      }),
    );
  }

  async getAsync<Res>(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'GET';
    const query = options?.params; // Example of query params in a GET request

    return axios
      .get(url, options)
      .then((response) => {
        this.logOutbound(requestId, method, url, response, null, null, query);
        return response;
      })
      .catch((error) => {
        this.logOutbound(requestId, method, url, error, query); // Pass the body data
        return error;
      });
  }

  async postAsync<Req, Res>(url: string, data: Req, options?: any): Promise<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'POST';

    try {
      const response = await axios.post(url, data, options);
      this.logOutbound(requestId, method, url, response, data); // Pass the body data
      return response;
    } catch (error) {
      this.logOutbound(requestId, method, url, error, data); // Pass the body data
      throw error;
    }
  }

  // POST method
  post<Req, Res>(url: string, data: Req, options?: any): Observable<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'POST';

    return this.httpService
      .post<Res>(url, data, {
        ...options,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'axios-retry': {
          retries: 3,
          retryCondition: (error) => {
            console.log('RETRY XX');
            console.log(error);
            return true;
          },
        },
      })
      .pipe(
        tap((response) => {
          this.logOutbound(requestId, method, url, response, data); // Pass the body data
        }),
      );
  }

  // POST method
  postForm<Req, Res>(url: string, data: Req, options?: AxiosRequestConfig): Observable<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'POST_FORM';

    return this.httpService.postForm<Res>(url, data, options).pipe(
      tap((response) => {
        this.logOutbound(requestId, method, url, response, data); // Pass the body data
      }),
    );
  }

  async postFormAsync<Req, Res>(url: string, data: Req, options?: AxiosRequestConfig): Promise<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'POST_FORM';
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const response = await axios.postForm(url, data, { ...options, headers: { 'Content-Type': 'multipart/form-data' } });
      this.logOutbound(requestId, method, url, response, data); // Pass the body data
      return response;
    } catch (error) {
      this.logOutbound(requestId, method, url, error, data); // Pass the body data
      throw error;
    }
  }

  // PUT method
  put<Req, Res>(url: string, data: Req, options?: any): Observable<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'PUT';

    return this.httpService.put<Res>(url, data, options).pipe(
      tap((response) => {
        this.logOutbound(requestId, method, url, response, data); // Pass the body data
      }),
    );
  }

  // PATCH method
  patch<Req, Res>(url: string, data: Req, options?: any): Observable<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'PATCH';

    return this.httpService.patch<Res>(url, data, options).pipe(
      tap((response) => {
        this.logOutbound(requestId, method, url, response, data); // Pass the body data
      }),
    );
  }

  // DELETE method
  delete<Res>(url: string, options?: any): Observable<AxiosResponse<Res>> {
    const requestId = this.getRequestId();
    const method = 'DELETE';
    const query = options?.params; // Example of query params in DELETE request

    return this.httpService.delete<Res>(url, options).pipe(
      tap((response) => {
        this.logOutbound(requestId, method, url, response, null, null, query);
      }),
    );
  }

  // Utility method to log outbound requests
  private logOutbound(
    requestId: string,
    method: string,
    url: string,
    response: AxiosResponse<any>,
    requestData?: any, // request data can be body or query
    params?: any,
    query?: any,
  ): void {
    const logMessage = `${method} ${url} - Status: ${response.status}`;
    const logMetadata = {
      requestId,
      timestamp: new Date(),
      message: logMessage,
      url,
      statusCode: response.status,
      response: response.data,
      request: requestData,
      params: params || {}, // Add params if available
      query: query || {}, // Add query if available
    };
    console.log('--- Logging logOutbound() ---');
    console.log(logMetadata);

    // const log = new OutboundLogEntity();
    // log.createOutboundLog(logMetadata);
    // await this.logService.logOutbound(log);
  }

  // Generate a unique requestId
  private getRequestId(): string {
    return getRequestIdContext() || 'unknown-request-id';
  }
}
