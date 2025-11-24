import { PartialType } from '@nestjs/mapped-types';
import { CreateSuscriptionDto } from './create-suscription.dto';

export class UpdateSuscriptionDto extends PartialType(CreateSuscriptionDto) {}
