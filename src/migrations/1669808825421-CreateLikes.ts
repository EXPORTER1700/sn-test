import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLikes1669808825421 implements MigrationInterface {
  name = 'CreateLikes1669808825421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_liked_posts" ("usersId" integer NOT NULL, "postsId" integer NOT NULL, CONSTRAINT "PK_323ea9d7cf1f17959942d944301" PRIMARY KEY ("usersId", "postsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_95bdaeb12a846d72a312cbf63e" ON "users_liked_posts" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecf726248159919a504b7e0ba7" ON "users_liked_posts" ("postsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "likeCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_liked_posts" ADD CONSTRAINT "FK_95bdaeb12a846d72a312cbf63e4" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_liked_posts" ADD CONSTRAINT "FK_ecf726248159919a504b7e0ba79" FOREIGN KEY ("postsId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_liked_posts" DROP CONSTRAINT "FK_ecf726248159919a504b7e0ba79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_liked_posts" DROP CONSTRAINT "FK_95bdaeb12a846d72a312cbf63e4"`,
    );
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "likeCount"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ecf726248159919a504b7e0ba7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_95bdaeb12a846d72a312cbf63e"`,
    );
    await queryRunner.query(`DROP TABLE "users_liked_posts"`);
  }
}
