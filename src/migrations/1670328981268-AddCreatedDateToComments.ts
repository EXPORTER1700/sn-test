import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedDateToComments1670328981268
  implements MigrationInterface
{
  name = 'AddCreatedDateToComments1670328981268';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdAt"`);
  }
}
