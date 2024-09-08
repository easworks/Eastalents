import { ObjectId, Platform, TransformContext, Type } from '@mikro-orm/mongodb';
import { DateTime } from 'luxon';

export class StringObjectIdType extends Type<string, ObjectId> {
  override convertToDatabaseValue(value: string, platform: Platform, context?: TransformContext): ObjectId {
    return new ObjectId(value);
  }

  override convertToJSValue(value: ObjectId, platform: Platform): string {
    return value.toString();
  }
}

export class LuxonType extends Type<DateTime, Date> {
  override convertToDatabaseValue(value: DateTime<boolean>, platform: Platform, context?: TransformContext): Date {
    return value.toUTC().toJSDate();
  }

  override convertToJSValue(value: Date, platform: Platform): DateTime<boolean> {
    return DateTime.fromJSDate(value);
  }
}
