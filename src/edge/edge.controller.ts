import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './edge.entity';

@Controller()
export class EdgeController {
  constructor(
    @InjectRepository(Edge)
    private readonly edgeRepository: Repository<Edge>,
  ) {}

  @MessagePattern('edge_created')
  public async handleEdgeCreated(
    @Payload() payload: unknown, // Use unknown to ensure type safety
  ) {
    try {
      // Type guard to ensure payload is a valid Edge
      const isEdge = (data: unknown): data is Edge => {
        return (
          data !== null &&
          typeof data === 'object' &&
          'id' in data &&
          'node1_alias' in data &&
          'node2_alias' in data &&
          'capacity' in data
        );
      };

      if (!isEdge(payload)) {
        throw new Error('Invalid edge data received');
      }

      console.log(
        `New channel between ${payload.node1_alias} and ${payload.node2_alias} with a capacity of ${payload.capacity} has been created.`,
      );

      const edge = await this.edgeRepository.findOneBy({ id: payload.id });

      if (edge) {
        // Create a new object with updated values to ensure type safety
        const updatedEdge = {
          ...edge,
          node1_alias: `${edge.node1_alias}-updated`,
          node2_alias: `${edge.node2_alias}-updated`,
        };
        await this.edgeRepository.save(updatedEdge);
      }

      // Acknowledge the message was processed successfully
    } catch (error) {
      console.error('Failed to process message', error);
      // In a real app, you might requeue the message or move it to a dead-letter queue
    }
  }
}
