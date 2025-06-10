import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateEdgeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  node1_alias: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  node2_alias: string;
}
