import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordResetFields1791365375810 implements MigrationInterface {
    name = 'AddPasswordResetFields1791365375810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "resetPasswordOtp" character varying`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "resetPasswordOtpExpiresAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "resetPasswordOtpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "resetPasswordOtp"`);
    }

}
