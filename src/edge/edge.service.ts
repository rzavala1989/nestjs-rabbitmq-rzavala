import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edge } from './edge.entity';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { CreateEdgeInput } from './dto/create-edge.input';

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

  /**
   * @param createEdgeInput The DTO containing the new edge data.
   * @returns The saved Edge entity.
   */
  async create(createEdgeInput: CreateEdgeInput): Promise<Edge> {
    const { node1_alias, node2_alias } = createEdgeInput;

    const newEdge = this.edgeRepository.create({
      id: uuidv4(),
      node1_alias, // Use the destructured variable
      node2_alias, // Use the destructured variable
      capacity: Math.floor(Math.random() * (1000000 - 10000 + 1)) + 10000,
    });

    const savedEdge = await this.edgeRepository.save(newEdge);

    this.client.emit('edge_created', savedEdge);

    return savedEdge;
  }
}
