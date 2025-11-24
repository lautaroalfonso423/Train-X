import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
    
    constructor(
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
    ) {}

    findAll() {
        return this.scheduleRepository.find({ relations: ['activity'] });
    }

    findByActivity(activityId: string) {
        return this.scheduleRepository.find({
        where: { activity: { id: activityId } },
        relations: ['activity'],
        });
    }

    create(data: Partial<Schedule>) {
        const schedule = this.scheduleRepository.create(data);
        return this.scheduleRepository.save(schedule);
    }

    async deleteElement(scheduleId: string) {
        const schedule = await this.scheduleRepository.findOne({where: {id: scheduleId}});
        if(!schedule) throw new ForbiddenException("No existe la clase que deseas borrar")

        return await this.scheduleRepository.remove(schedule)    
    }
}