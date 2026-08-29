import type { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAttendanceIndex1787913037810 implements MigrationInterface {
    name = 'AlterAttendanceIndex1787913037810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ff05fd5159e6d9d99514d46531"`);
        await queryRunner.query(`ALTER TABLE "attendance" ADD CONSTRAINT "UQ_adac35f71a137b6aaaa26119dbe" UNIQUE ("user_id", "date")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attendance" DROP CONSTRAINT "UQ_adac35f71a137b6aaaa26119dbe"`);
        await queryRunner.query(`CREATE INDEX "IDX_ff05fd5159e6d9d99514d46531" ON "attendance" USING btree ("date") `);
    }

}
