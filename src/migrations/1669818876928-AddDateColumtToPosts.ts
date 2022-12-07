import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateColumtToPosts1669818876928 implements MigrationInterface {
  name = 'AddDateColumtToPosts1669818876928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "createdAt"`);
  }
}
