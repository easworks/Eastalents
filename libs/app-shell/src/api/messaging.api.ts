import { Injectable, inject } from '@angular/core';
import { MessageRoom, Role, User } from '@easworks/models';
import { SwSocketService } from '../services/sw.socket';

@Injectable({
  providedIn: 'root'
})
export class MessagingApi {
  private readonly socket = inject(SwSocketService);

  readonly requests = {
    getUsers: (input: {
      _id: string;
      role: Role;
    }) => this.socket.send('getUsers', input, 'getUsersResponse')
      .then(response => {
        return (response.data as any[])
          .find(item => item.key === 'freelancer')
          .freelancers as User[];
      }),

    getRoom: (input: {
      fromUserId: string;
      toUserId: string;
    }) => this.socket.send('createRoom', input, 'createRoomResponse')
      .then(response => response.room as MessageRoom),

    getRoomMessages: (input: {
      chatRoomId: string;
    }) => this.socket.send('getRoomMessages', input, 'getRoomMessagesResponse')
      .then(response => response.messages as any[]),

    sendTextMessage: (input: {
      chatRoomId: string;
      userId: string;
      message: string;
    }) => this.socket.send('sendTextMessage', input, 'sendTextMessageResponse')
  } as const;

  readonly events = {
  } as const;
}
