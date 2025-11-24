import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { User } from 'src/users/entities/user.entity';
import { TrainerQualification } from './entities/qualification.entity';

@Injectable()
export class TrainersService {
  
 
  constructor(
    @InjectRepository(Trainer)
    private trainersRepository: Repository<Trainer>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TrainerQualification)
    private qualiRepository: Repository<TrainerQualification>
  ) {}

  async findAll() {
    return this.trainersRepository.find();
  }

  async findOne(id: string) {
    return this.trainersRepository.findOne({ where: { id } });
  }

  async findByName(name: string) {
    return this.trainersRepository.findOne({ where: { name } });
  }

  async create(data: CreateTrainerDto) {

    if (!data.imageUrl) {
      throw new BadRequestException('imageUrl es requerido');
  }

  const trainer = this.trainersRepository.create({
      name: data.name,
      specialization: data.specialization,
      formation: data.formation,
      imageUrl: data.imageUrl,
      available: data.available ?? true,
      qualification: 0
  });

  return await this.trainersRepository.save(trainer);
  }

  async createQuali(idTrainer: string, idUser: any, rating:number) {

    const user = await this.userRepository.findOne({where: {id: idUser}})
    if(!user) throw new NotFoundException("Usuario no encontrado")
    const trainer = await this.trainersRepository.findOne({where: {id: idTrainer}})
    if(!trainer) throw new NotFoundException("Entrenador no encontrado")

    const existQuali = await this.qualiRepository.findOne({
      where: {trainer: {id: trainer.id}, user: {id: user.id}},
      relations: ["user", "trainer"]
    })


    if(existQuali){
      throw new ForbiddenException("Ya has calificado a este entrenador");
    } else {
    
      if(rating < 1 || rating > 5){
      throw new BadRequestException("La calificación debe estar entre 1 y 5");
    }

    const qualiCreate = this.qualiRepository.create({
      user,
      trainer,
      rating
    })

    await this.qualiRepository.save(qualiCreate)


    const qualiVerify = await this.qualiRepository.find({
      where: {trainer: {id: trainer.id}}
    })

    const average = qualiVerify.length ? qualiVerify.reduce((sum, q)=> sum + Number(q.rating)  ,0) / qualiVerify.length : rating;

    trainer.qualification = parseFloat(average.toFixed(1))
    await this.trainersRepository.save(trainer)

    return {
    message: 'Entrenador calificado exitosamente',
    average: trainer.qualification,
    };

    }
  }

  async deleteServiceTrainer(id: string) {
    const trainer = await this.trainersRepository.findOne({where: {id: id}})
    if(!trainer) throw new NotFoundException("Entrenador no encontrado")

    await this.userRepository.update(
      {trainer: {id: trainer.id}},
      {trainer: null as any}
    )  

    return await this.trainersRepository.remove(trainer)
  }

}