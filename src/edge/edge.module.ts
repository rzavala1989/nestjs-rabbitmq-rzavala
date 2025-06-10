import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './edge.entity';
import { EdgeService } from './edge.service';
import { EdgeResolver } from './edge.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EdgeController } from './edge.controller'; // We will create this next

@Module({
  imports: [
    TypeOrmModule.forFeature([Edge]),
    ClientsModule.registerAsync([
      {
        name: 'EDGE_SERVICE_BUS', // Injection token
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://localhost:5672',
              ),
            ],
            queue: 'edge_events_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [EdgeService, EdgeResolver],
  controllers: [EdgeController], // Add the new controller for listening
})
export class EdgeModule {}
