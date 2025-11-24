import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { UpdateActivityDto } from './dtos/update-activity.dto';

@Injectable()
export class ActivitiesService {
    
    constructor(
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
    ) {}


    async filterService(name: string) {
        const query = await this.activityRepository
        .createQueryBuilder("act")
        .leftJoinAndSelect("act.schedules", "schedule")

        if(name){
            const names = Array.isArray(name) ? name : [name];

            query.where("LOWER(act.name) IN(:...name)", {name: names.map(e => e.toLowerCase())})
        }

        const activities = await query.getMany()
        return activities;
    }

    findAll() {
        return this.activityRepository.find({ relations: ['schedules'] });
    }

    findOne(id: string) {
        return this.activityRepository.findOne({
        where: { id },
        relations: ['schedules'],
        });
    }

    findByName(name: string) {
        return this.activityRepository.findOne({ where: { name } });
    }

    create(data: Partial<Activity>) {
        const activity = this.activityRepository.create(data);
        return this.activityRepository.save(activity);
    }

    async updateActivity(
        id: string,
        data: UpdateActivityDto,
    ) {
        const activity = await this.activityRepository.findOne({ where: { id } });
        if (!activity) throw new NotFoundException('Activity not found');
    
        // Si se cambia el nombre, verificamos que no haya otra igual
        if (data.name && data.name !== activity.name) {
            const existing = await this.activityRepository.findOne({
                where: { name: data.name },
            });
            if (existing)
                throw new BadRequestException('There is already an activity with that name');
        }
    
        Object.assign(activity, data);
        return this.activityRepository.save(activity);
    }
    
    async deleteActivity(id: string) {
        const activity = await this.activityRepository.findOne({ where: { id } });
        if (!activity) throw new NotFoundException('Activity not found');
        
        await this.activityRepository.remove(activity);
        return { message: 'Activity deleted successfully' };
    }
}