import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLog1787936867860 implements MigrationInterface {
    name = 'CreateLog1787936867860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "service" text NOT NULL, "action" text NOT NULL, "user_id" text NOT NULL, "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_fields" text array NOT NULL DEFAULT '{}', "changes" jsonb NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "log"`);
    }

}
