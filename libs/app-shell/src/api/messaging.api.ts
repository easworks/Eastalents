import { Injectable, inject } from '@angular/core';
import { Role, User } from '@easworks/models';
import { SwSocketService } from '../services/sw.socket';

@Injectable({
  providedIn: 'root'
})
export class MessagingApi {
  private readonly socket = inject(SwSocketService);

  readonly requests = {
    getUsers: (input: { role: Role; _id: string; }) =>
      this.socket.send('getUsers', input, 'getUsersResponse')
        .then(response => {
          return (response.data as any[])
            .find(item => item.key === 'freelancer')
            .freelancers as User[];
        }),
    getRoom: (input: { fromUserId: string, toUserId: string; }) =>
      this.socket.send('createRoom', input, 'createRoomResponse')
  } as const;

  readonly events = {

  } as const;
}
