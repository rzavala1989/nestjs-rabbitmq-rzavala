import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './edge.entity';
import { Channel, Message } from 'amqplib';

@Controller()
export class EdgeController {
  constructor(
    @InjectRepository(Edge)
    private readonly edgeRepository: Repository<Edge>,
  ) {}

  @MessagePattern('edge_created')
  public async handleEdgeCreated(
    @Payload() data: Edge,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef() as Channel;
    const originalMsg = context.getMessage() as Message;

    try {
      console.log(
        `New channel between ${data.node1_alias} and ${data.node2_alias} with a capacity of ${data.capacity} has been created.`,
      );

      const edge = await this.edgeRepository.findOneBy({ id: data.id });

      if (edge) {
        edge.node1_alias = `${edge.node1_alias}-updated`;
        edge.node2_alias = `${edge.node2_alias}-updated`;

        await this.edgeRepository.save(edge);
        console.log(`Successfully updated edge: ${edge.id}`);
      } else {
        console.warn(`Edge not found for update: ${data.id}`);
      }
      channel.ack(originalMsg);
    } catch (error) {
      console.error('Failed to process message', error);
      channel.nack(originalMsg, false, false);
    }
  }
}
