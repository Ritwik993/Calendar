import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from './event.schema';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() eventData: Partial<Event>): Promise<Event> {
    return this.eventService.createEvent(eventData);
  }

  @Get()
  async getAllEvents(): Promise<Event[]> {
    return this.eventService.getAllEvents();
  }

  @Delete(':id')
  async removeEvent(@Param('id') id: string): Promise<Event> {
    return this.eventService.removeEvent(id);
  }
}
