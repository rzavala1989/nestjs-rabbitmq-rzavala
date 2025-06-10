import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('edges') // Specifies the table name in the database
export class Edge {
  /**
   * The unique identifier for the edge.
   * Generated automatically as a UUID.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The timestamp when the edge was created.
   * Managed automatically by TypeORM.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  /**
   * The timestamp when the edge was last updated.
   * Managed automatically by TypeORM.
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  /**
   * The capacity of the edge.
   * This will be a number between 10,000 and 1,000,000.
   */
  @Column('integer')
  capacity: number;

  /**
   * The alias of the first node in the edge.
   */
  @Column()
  node1_alias: string;

  /**
   * The alias of the second node in the edge.
   */
  @Column()
  node2_alias: string;
}
