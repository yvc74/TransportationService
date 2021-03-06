import { inject, injectable } from 'inversify';
import { ITruckService } from '../../application/services/itruck.service';
import { TYPES } from '../../di/types';
import { Truck } from '../../domain/truck';
import { MessageHandlerProvider } from '../di/di.config';
import { IMessageHandler } from '../messaging/imessage.handler';
import { MessageType } from '../messaging/message.types';
import { RabbitMQExchange } from '../rabbitmq/rabbitmq.exchanges';
import { RabbitMQQueue } from '../rabbitmq/rabbitmq.queues';

@injectable()
export class MessageBrokerHandlerTruckService {
  private messageHandler: IMessageHandler;
  constructor(
    @inject(TYPES.MessageHandlerProvider)
    private messageHandlerProvider: MessageHandlerProvider,
    @inject(TYPES.ITruckService) private truckService: ITruckService
  ) {}

  public async postInit() {
    this.messageHandler = await this.messageHandlerProvider(
      RabbitMQExchange.Default,
      RabbitMQQueue.Default
    );

    console.log('Starting message handling, (handling outstanding events)');
    await this.messageHandler.start(this.handleMessage.bind(this));
    console.log('Message handling started, (new events)');
  }

  private async handleMessage(type: MessageType, body?: any) {
    if (!body) {
      // We cant handle anything without a body
      throw new Error(
        `Expected body for message type: ${MessageType.toString(type)}`
      );
    }

    switch (type) {
      case MessageType.ShipContainerLoaded:
        await this.handleTruckContainerUnloaded(body);
        break;
      case MessageType.ShipContainerUnloaded: {
        await this.handleTruckContainerLoaded(body);
        break;
      }
      case MessageType.TruckCleared: {
        await this.handleTruckCleared(body);
      }
    }
  }

  private async handleTruckContainerLoaded(body: any) {
    const truck = new Truck(body);

    if (truck.container == null) {
      // do not do anything
      return;
    }

    return this.truckService.containerLoaded(
      truck.licensePlate,
      truck.container
    );
  }

  private async handleTruckContainerUnloaded(body: any) {
    const truck = new Truck(body);

    return this.truckService.containerUnloaded(truck.licensePlate);
  }

  private async handleTruckCleared(body?: any) {
    const truck = new Truck(body);

    return this.truckService.cleared(truck.licensePlate);
  }
}
