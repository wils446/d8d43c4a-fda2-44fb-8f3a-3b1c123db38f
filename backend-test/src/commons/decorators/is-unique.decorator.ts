import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint, IsUniqueInterface } from '../validators';

export function IsUnique(
  property: IsUniqueInterface,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsUniqueConstraint,
    });
  };
}
