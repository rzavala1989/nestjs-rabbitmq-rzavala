import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './edge.entity';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EdgeService {
  constructor(
    @InjectRepository(Edge)
    private readonly edgeRepository: Repository<Edge>,
    @Inject('EDGE_SERVICE_BUS') private readonly client: ClientProxy,
  ) {}

  async findAll(): Promise<Edge[]> {
    return this.edgeRepository.find();
  }

  async findOne(id: string): Promise<Edge | null> {
    return this.edgeRepository.findOneBy({ id });
  }

  async create(node1_alias: string, node2_alias: string): Promise<Edge> {
    const newEdge = this.edgeRepository.create({
      id: uuidv4(),
      node1_alias,
      node2_alias,
      capacity: Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000,
    });

    const savedEdge = await this.edgeRepository.save(newEdge);

    this.client.emit('edge_created', savedEdge);

    return savedEdge;
  }

  // async update(id: string, updateData: Partial<Edge>): Promise<Edge | null> {
  //   const edge = await this.findOne(id);
  //   if (!edge) {
  //     return null;
  //   }
  //
  //   // Update only the provided fields
  //   Object.assign(edge, updateData);
  //
  //   const updatedEdge = await this.edgeRepository.save(edge);
  //
  //   // Emit an event for the update
  //   this.client.emit('edge_updated', updatedEdge);
  //
  //   return updatedEdge;
  // }
}
