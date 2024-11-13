import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './event.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const newEvent = new this.eventModel(eventData);
    return newEvent.save();
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async removeEvent(eventId: string): Promise<Event> {
    return this.eventModel.findByIdAndDelete(eventId).exec();
  }
}
