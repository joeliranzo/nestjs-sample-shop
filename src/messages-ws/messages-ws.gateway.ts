import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

const logger = new Logger('MessagesWsGateway')
@WebSocketGateway({cors: true, namespace: '/'})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server

	constructor(
		private readonly messagesWsService: MessagesWsService,
		private readonly jwtService: JwtService
	){}

	async handleConnection(client: Socket) {
		const token = client.handshake.headers.authentication as string
		let payload:JwtPayload

		try {
			payload = this.jwtService.verify(token)
			await this.messagesWsService.registerClient(client, payload.id)
		} catch (error) {
			client.disconnect()
			return
		}

		// logger.log("Cliente conectado:", client.id)
		
		//console.log({conectados: this.messagesWsService.getConnectedClients()})

		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
	}

	handleDisconnect(client: Socket) {
		// logger.log("Cliente desconectado:", client.id)
		this.messagesWsService.removeClient(client.id)
		//console.log({conectados: this.messagesWsService.getConnectedClients()})
		this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
	}

	@SubscribeMessage('message-from-client')
	onMessageFromClient(client: Socket, payload: NewMessageDto) {
		//console.log(client.id, payload)

		//! Emite unicamente al cliente
		// client.emit('message-from-server', {
		// 	fullName: 'Soy Yo!',
		// 	message: payload.message || 'no-message',
		// })

		//! Emitir a todos menos, al cliente inicial
		// client.broadcast.emit('message-from-server', {
		// 	fullName: 'Soy Yo!',
		// 	message: payload.message || 'no-message',
		// })
		
		this.wss.emit('message-from-server', {
			fullName: this.messagesWsService.getUserFullName(client.id),
			email: this.messagesWsService.getUserEmail(client.id),
			message: payload.message || 'no-message',
		})
	}
}
