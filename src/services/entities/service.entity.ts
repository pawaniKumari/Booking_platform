import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// Use type-only import to prevent runtime circular dependency execution crashes
import type { Booking } from '../../bookings/entities/booking.entity';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('int') // Duration in minutes
  duration: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isActive: boolean;

  // Change the type to generic reference to prevent evaluation locking
  @OneToMany('Booking', (booking: any) => booking.service)
  bookings: Booking[];
}
