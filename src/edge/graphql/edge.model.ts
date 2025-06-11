import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Represents a connection between two nodes.' })
export class EdgeObject {
  /** The unique identifier for the edge. */
  @Field(() => ID)
  id: string;

  /** The date and time the edge was created. */
  @Field()
  created_at: string;

  /** The date and time the edge was last updated. */
  @Field()
  updated_at: string;

  /** The capacity of the edge, as a string. */
  @Field()
  capacity: string;

  /** The alias of the first node in the edge. */
  @Field()
  node1_alias: string;

  /** The alias of the second node in the edge. */
  @Field()
  node2_alias: string;

  /** A combined string representing the two connected nodes. */
  @Field()
  edge_peers: string;
}
