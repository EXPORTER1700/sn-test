import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePosts1669724639558 implements MigrationInterface {
  name = 'CreatePosts1669724639558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
