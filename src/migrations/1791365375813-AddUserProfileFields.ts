import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileFields1791365375813 implements MigrationInterface {
  name = 'AddUserProfileFields1791365375813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
      ADD COLUMN "fullName" character varying,
      ADD COLUMN "phoneNumber" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
      DROP COLUMN "phoneNumber",
      DROP COLUMN "fullName"
    `);
  }
}
