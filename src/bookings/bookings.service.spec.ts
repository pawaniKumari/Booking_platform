import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { ServiceEntity } from '../services/entities/service.entity';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('BookingsService Unit Tests', () => {
  let service: BookingsService;
  let bookingRepositoryMock: any;
  let serviceRepositoryMock: any;

  beforeEach(async () => {
    bookingRepositoryMock = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    serviceRepositoryMock = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: bookingRepositoryMock,
        },
        {
          provide: getRepositoryToken(ServiceEntity),
          useValue: serviceRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should throw BadRequestException if target appointment date parameters reside in the past', async () => {
    serviceRepositoryMock.findOne.mockResolvedValue(new ServiceEntity()); // Fake active service instance

    const mockPayload = {
      customerName: 'Test',
      customerEmail: 'test@en2h.com',
      customerPhone: '+12345',
      serviceId: 'some-service-id',
      bookingDate: '2020-01-01',
      bookingTime: '12:00',
    };

    await expect(service.create(mockPayload)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw ConflictException if exact targeting slot allocations record overlapping data', async () => {
    serviceRepositoryMock.findOne.mockResolvedValue(new ServiceEntity());
    bookingRepositoryMock.findOne.mockResolvedValue(new Booking()); // Simulates finding a duplicate booking

    const mockPayload = {
      customerName: 'Test',
      customerEmail: 'test@en2h.com',
      customerPhone: '+12345',
      serviceId: 'active-service-id',
      bookingDate: '2026-12-25', 
      bookingTime: '14:00',
    };

    await expect(service.create(mockPayload)).rejects.toThrow(
      ConflictException,
    );
  });
});
