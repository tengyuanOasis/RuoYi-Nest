// pipes/comma-separated-ids.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class CommaSeparatedIdsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): number[] {
    if (!value) {
      return [];
    }
    
    // 如果已经是数组，直接返回
    if (Array.isArray(value)) {
      return value.map(id => parseInt(id, 10));
    }
    
    // 如果是字符串，按逗号分割
    if (typeof value === 'string') {
      return value
        .split(',')
        .map(id => id.trim())
        .filter(id => id !== '')
        .map(id => {
          const num = parseInt(id, 10);
          if (isNaN(num)) {
            throw new BadRequestException(`Invalid ID: ${id}`);
          }
          return num;
        });
    }
    
    throw new BadRequestException('Invalid userIds format');
  }
}