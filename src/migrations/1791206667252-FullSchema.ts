import type { MigrationInterface, QueryRunner } from 'typeorm';

export class FullSchema1791206667252 implements MigrationInterface {
  name = 'FullSchema1791206667252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "project_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_7a75a94e01d0b50bff123db1b87" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE TABLE "task_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "status" character varying NOT NULL, "dueDate" TIMESTAMP NOT NULL, "projectId" integer, CONSTRAINT "PK_0385ca690d1697cdf7ff1ed3c2f" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_entity" ADD CONSTRAINT "FK_ea4982b0ce8cb41f951c0954cbd" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "task_entity" ADD CONSTRAINT "FK_059bf296d2b45a7c930faa15d7f" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task_entity" DROP CONSTRAINT "FK_059bf296d2b45a7c930faa15d7f"`,
    );

    await queryRunner.query(
      `ALTER TABLE "project_entity" DROP CONSTRAINT "FK_ea4982b0ce8cb41f951c0954cbd"`,
    );

    await queryRunner.query(`DROP TABLE "task_entity"`);
    await queryRunner.query(`DROP TABLE "project_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
