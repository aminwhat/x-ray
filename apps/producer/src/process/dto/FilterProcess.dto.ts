import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FilterProcessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
