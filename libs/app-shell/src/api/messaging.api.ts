import { Injectable } from '@angular/core';
import { Role } from '@easworks/models';
import { SocketApi } from './socket.api';

@Injectable({
  providedIn: 'root'
})
export class MessagingApi extends SocketApi {
  async getUsers(input: { role: Role; _id: string; }) {
    return this.send('getUsers', input, 'getUsersResponse');
  }
}
