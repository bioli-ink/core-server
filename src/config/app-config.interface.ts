import { ConfigService } from '@nestjs/config';

export declare type NoInferType<T> = [T][T extends any ? 0 : never];

export declare class AppConfig<
  K = Record<string, any>,
> extends ConfigService<K> {
  get<T = any>(propertyPath: keyof K & string): T | undefined;
  get<T = any>(propertyPath: keyof K & string, defaultValue: NoInferType<T>): T;
}
