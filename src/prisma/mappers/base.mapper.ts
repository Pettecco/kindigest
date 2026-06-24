export abstract class DomainMapper<TPrisma, TDomain> {
  abstract toDomain(prisma: TPrisma): TDomain;
}
