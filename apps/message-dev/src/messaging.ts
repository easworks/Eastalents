import { DateTime } from 'luxon';
import { Server, Socket } from 'socket.io';

declare const io: Server;

io.on("connection", async (socket) => {
  // ensure that only signed-in user can connect to socket
  {
    const { token } = socket.handshake.auth;
    if (!token) {
      socket.emit('error', 'auth token missing');
      socket.disconnect(true);
    }

    getValidUserOrDisconnect(token, socket);
  }

  socket.on('listRooms', async (
    { token }: {
      token: string;
    },
    callback
  ) => {
    const user = await getValidUserOrDisconnect(token, socket);
    const rooms = await listRoomsForUser(user._id);

    callback({ rooms });
  });

  socket.on('getRoom', async (
    { roomId, token }: {
      roomId: string;
      token: string;
    },
    callback
  ) => {
    const user = await getValidUserOrDisconnect(token, socket);
    const room = await getRoomById(roomId);
    if (!room.users.includes(user._id)) {
      callback({ error: 'you cannot access this room' });
      throw new Error('invalid operation');
    }

    callback({ room });
  });

  socket.on('listMessages', async (
    { roomId, before, max, token }: {
      roomId: string;
      before: DateTime;
      max: number;
      token: string;
    },
    callback
  ) => {
    const user = await getValidUserOrDisconnect(token, socket);
    const room = await getRoomById(roomId);
    if (!room.users.includes(user._id)) {
      callback({ error: 'you cannot access this room' });
      throw new Error('invalid operation');
    }

    const messages = await listMessagesForRoom(roomId, before, max);

    callback({ messages });
  });

  socket.on('sendMessage', async (
    { newMessage, token }: {
      newMessage: MessageInput;
      token: string;
    },
    callback
  ) => {
    const sender = await getValidUserOrDisconnect(token, socket);

    // when client sends recipientType 'room', client is sure that room exists
    // when client sends recipientType 'user', client is not sure that room exists
    // therefore, when client sends recipientType 'user', we should 
    // 1. create a new room if required
    // 2. convert the receiver type to 'room'
    const room = newMessage.recipientType === 'room' ?
      await getRoomById(newMessage.recipient)
        .then(room => {
          if (!room.users.includes(sender._id)) {
            callback({ error: 'you cannot access this room' });
            throw new Error('invalid operation');
          }
          return room;
        }) :
      await getOrCreateDMRoom([sender._id, newMessage.recipient]);
    newMessage.recipientType = 'room';
    newMessage.recipient = room._id;

    let message: Message;
    switch (newMessage.type) {
      case 'text':
        message = await createTextMessage(newMessage);
        break;
      case 'file':
        message = await createFileMessage(newMessage);
        break;
    }

    room.users.forEach(userId => {
      if (userId === sender._id) {
        callback({ message });
      }
      else {
        io.to(userId).emit('receivedMessage', message);
      }
    });
  });
});

function getValidUserOrDisconnect(token: string, socket: Socket) {
  return validateTokenAndGetUser(token)
    .catch(e => {
      socket.emit('error', 'auth token invalid');
      socket.disconnect(true);
      throw e;
    });
}

// these are functions that are assumed to exist

declare function validateTokenAndGetUser(token: string): Promise<User>;

declare function listRoomsForUser(userId: string): Promise<MessageRoom[]>;

declare function getRoomById(roomId: string): Promise<MessageRoom>;

declare function getOrCreateDMRoom(users: string[]): Promise<MessageRoom>;

declare function createTextMessage(message: TextMessageInput): Promise<TextMessage>;

declare function createFileMessage(message: FileMessageInput): Promise<FileMessage>;

declare function listMessagesForRoom(roomId: string, before: DateTime, max: number): Promise<Message[]>;


// These are the tentative typescript types for the data

export interface MessageRoom {
  _id: string;
  users: string[];
  created: DateTime;
  updated: DateTime;
}

interface MessageBase {
  _id: string;
  roomId: string;
  createdAt: DateTime;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface TextMessage extends MessageBase {
  type: 'text';
  content: string;
}

export interface FileMessage extends MessageBase {
  type: 'file';
  content: string;
  fileName: string;
}

export type Message = TextMessage | FileMessage;

interface MessageInputBase {
  recipient: string;
  recipientType: 'room' | 'user';
}

export interface TextMessageInput extends MessageInputBase {
  type: 'text';
  content: string;
}
export interface FileMessageInput extends MessageInputBase {
  type: 'file';
  content: ArrayBuffer;
  fileName: string;
}

export type MessageInput = TextMessageInput | FileMessageInput;


const ROLES = [
  'freelancer',
  'employer',
  'admin'
] as const;

export type Role = typeof ROLES[number];

export interface User {
  _id: string;
  role: Role;
  verified: boolean;
  active: number;
  firstName: string;
  lastName: string;
  email: string;
}
