import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import _ from 'lodash';

@Injectable()
export class CleanDtoPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || typeof value === 'boolean') {
      // console.log(value);
      return value;
    }

    /** Multiple Files upload will be in array so just return it. */
    if (_.isArray(value)) return value;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    return Object.fromEntries(Object.entries(value).filter(([_, val]) => val !== null));
  }
}
