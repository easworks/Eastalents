import { Platform, TransformContext, Type } from '@mikro-orm/mongodb';
import { DateTime } from 'luxon';

export class LuxonType extends Type<DateTime | null | undefined, Date | null | undefined> {
  override convertToDatabaseValue(value: DateTime<boolean> | null | undefined, platform: Platform, context?: TransformContext): Date | null | undefined {
    return value ? value.toUTC().toJSDate() : value;
  }

  override convertToJSValue(value: Date, platform: Platform): DateTime<boolean> {
    return DateTime.fromJSDate(value);
  }
}
