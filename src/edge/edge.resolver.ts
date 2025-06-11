import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EdgeService } from './edge.service';
import { EdgeObject } from './graphql/edge.model';
import { Edge } from './edge.entity';
import { CreateEdgeInput } from './dto/create-edge.input';

/**
 * GQL resolver for the Edge entity.
 * This class handles all incoming GraphQL queries and mutations,
 * and delegates the business logic to the EdgeService.
 */
@Resolver(() => EdgeObject)
export class EdgeResolver {
  constructor(private readonly edgeService: EdgeService) {}

  /**
   * fetch all edges.
   * @returns An array of EdgeObject.
   */
  @Query(() => [EdgeObject], { name: 'getEdges' })
  async getEdges(): Promise<EdgeObject[]> {
    const edges = await this.edgeService.findAll();
    // Convert the database entities to GraphQL objects
    return edges.map((edge) => this.toEdgeObject(edge));
  }

  /**
   * fetch a single edge by its ID.
   * @param id The UUID of the edge to fetch.
   * @returns A single EdgeObject or null if not found.
   */
  @Query(() => EdgeObject, { name: 'getEdge', nullable: true })
  async getEdge(@Args('id') id: string): Promise<EdgeObject | null> {
    const edge = await this.edgeService.findOne(id);
    if (!edge) {
      return null;
    }
    // Convert the database entity to a GraphQL object
    return this.toEdgeObject(edge);
  }

  /**
   * create a new edge
   * @param createEdgeInput The DTO containing the arguments.
   * @returns The newly created EdgeObject.
   */
  @Mutation(() => EdgeObject, { name: 'createEdge' })
  async createEdge(
    // Use the DTO as the single source for arguments
    @Args('createEdgeInput') createEdgeInput: CreateEdgeInput,
  ): Promise<EdgeObject> {
    // Pass the whole object to the service
    const newEdge = await this.edgeService.create(createEdgeInput);
    return this.toEdgeObject(newEdge);
  }

  /**
   * A private helper method to map a database Edge entity
   * @param edge The Edge entity from the database.
   * @returns The EdgeObject for the GraphQL response.
   */
  private toEdgeObject(edge: Edge): EdgeObject {
    return {
      id: edge.id,
      created_at: edge.created_at.toISOString(),
      updated_at: edge.updated_at.toISOString(),
      capacity: String(edge.capacity),
      node1_alias: edge.node1_alias,
      node2_alias: edge.node2_alias,
      edge_peers: `${edge.node1_alias}-${edge.node2_alias}`,
    };
  }
}
