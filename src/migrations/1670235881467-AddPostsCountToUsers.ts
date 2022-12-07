import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostsCountToUsers1670235881467 implements MigrationInterface {
  name = 'AddPostsCountToUsers1670235881467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "postsCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "postsCount"`);
  }
}
