import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class EdgeObject {
  @Field(() => ID)
  id: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;

  @Field()
  capacity: string;

  @Field()
  node1_alias: string;

  @Field()
  node2_alias: string;

  @Field()
  edge_peers: string;
}
