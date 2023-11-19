import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private httpService: HttpService) {}

  async post<T>(url: string, body: any): Promise<T> {
    try {
      const observable = this.httpService.post<T>(url, body);
      const response: AxiosResponse<T> = await lastValueFrom(observable);
      console.log("Response received: \r");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async get<T>(url: string): Promise<T> {
    try {
      const observable = this.httpService.get<T>(url);
      const response: AxiosResponse<T> = await lastValueFrom(observable);
      console.log("Response received: \r");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
