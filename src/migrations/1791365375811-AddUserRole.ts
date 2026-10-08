import type {  MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1791365375811 implements MigrationInterface {
  name = 'AddUserRole1791365375811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
      ADD "role" character varying NOT NULL DEFAULT 'USER'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
      DROP COLUMN "role"
    `);
  }
}