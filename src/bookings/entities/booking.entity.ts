import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceEntity } from '../../services/entities/service.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  @Column()
  bookingDate: string; // ISO date format YYYY-MM-DD

  @Column()
  bookingTime: string; // Format HH:MM

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => ServiceEntity, (service) => service.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @Column()
  serviceId: string;
}
