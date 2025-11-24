// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: { origin: '*' }, 
// })
// export class MaintenanceGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;

//   // Este método se ejecuta cuando un cliente se conecta
//   async handleConnection(client: Socket) {
//     client.emit('maintenance_message', {
//       message: '¡Hola, sabemos que nos estás buscando!',
//       description: 'Estamos renovando nuestro sitio web para ofrecerte la mejor experiencia. Por lo pronto, puedes escribirnos a trainxproject@gmail.com',
//       services: [
//         'gestionar membresías',
//         'reservas de clases', 
//         'planes de entrenamiento',
//         'programación de entrenadores',
//         'actividades de miembros'
//       ]
//     });
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   async sendMaintenanceStatus(isActive: boolean) {
//     return this.server.emit('maintenance', { active: isActive });
//   }
// }
import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MaintenanceService } from './maintenance.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MaintenanceGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly maintenanceService: MaintenanceService) {}

  async handleConnection(client: Socket) {
    const isActive = await this.maintenanceService.getStatus();

    // Enviar estado actual al conectar
    client.emit('maintenance', { active: isActive });
  }

  // Emitir cuando el admin cambia el estado
  async sendMaintenanceStatus(isActive: boolean) {
    this.server.emit('maintenance', { active: isActive });
  }
}
