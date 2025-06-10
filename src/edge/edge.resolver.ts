import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EdgeService } from './edge.service';
import { EdgeObject } from './graphql/edge.model';
import { Edge } from './edge.entity';

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
   * @param node1_alias The alias for the first node.
   * @param node2_alias The alias for the second node.
   * @returns The newly created EdgeObject.
   */
  @Mutation(() => EdgeObject, { name: 'createEdge' })
  async createEdge(
    @Args('node1_alias') node1_alias: string,
    @Args('node2_alias') node2_alias: string,
  ): Promise<EdgeObject> {
    const newEdge = await this.edgeService.create(node1_alias, node2_alias);
    // Convert the new database entity to a GraphQL object
    return this.toEdgeObject(newEdge);
  }

  // /**
  //  * @param updateEdgeInput The input containing the edge ID and fields to update.
  //  * @returns The updated EdgeObject or null if the edge was not found.
  //  */
  // @Mutation(() => EdgeObject, { name: 'updateEdge', nullable: true })
  // async updateEdge(
  //   @Args('updateEdgeInput') updateEdgeInput: UpdateEdgeInput,
  // ): Promise<EdgeObject | null> {
  //   const { id, ...updateData } = updateEdgeInput;
  //   const updatedEdge = await this.edgeService.update(id, updateData);
  //
  //   if (!updatedEdge) {
  //     return null;
  //   }
  //   return this.toEdgeObject(updatedEdge);
  // }

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
