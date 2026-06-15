export interface IHashingService {
  hash(password: string): Promise<string>;
  compare(password: string, passwordHash: string): Promise<boolean>;
}

export const IHashingServiceSymbol = Symbol('IHashingService');
