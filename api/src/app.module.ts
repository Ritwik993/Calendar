import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import {ConfigModule} from "@nestjs/config" ;
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://Ritwik:Ritwik@calendar.fxavf.mongodb.net/calendar?retryWrites=true&w=majority&appName=calendar"),
    EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
