import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerificationFields1791365375812
  implements MigrationInterface
{
  name = 'AddEmailVerificationFields1791365375812';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
      ADD COLUMN "isEmailVerified" boolean NOT NULL DEFAULT false,
      ADD COLUMN "emailVerificationOtp" character varying,
      ADD COLUMN "emailVerificationOtpExpiresAt" TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
      DROP COLUMN "emailVerificationOtpExpiresAt",
      DROP COLUMN "emailVerificationOtp",
      DROP COLUMN "isEmailVerified"
    `);
  }
}
