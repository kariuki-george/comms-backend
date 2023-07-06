import { Injectable } from '@nestjs/common';
import { SocketStateService } from './socket-state.service';
import { AddMessageEventDto } from './dtos/index.dtos';
import { AuthenticatedSocket } from './types/index.types';

@Injectable()
export class WSService {
  public constructor(private readonly socketStateService: SocketStateService) {}

  public emitAddMessage = (eventInfo: AddMessageEventDto) => {
    const { Chatroom, message } = eventInfo;

    //   Emit to user and agents

    [
      ...this.socketStateService.get(Chatroom.agentId.toString()),
      ...this.socketStateService.get(Chatroom.userEmail),
    ].forEach((socket: AuthenticatedSocket) => {
      socket.emit('chats', message);
    });

    return;
  };
}