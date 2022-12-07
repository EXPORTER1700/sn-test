import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostContentsAndRelationThemWithPosts1669726443615
  implements MigrationInterface
{
  name = 'CreatePostContentsAndRelationThemWithPosts1669726443615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_9c0353760c806d01b6f61657a2c"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_contents_type_enum" AS ENUM('image', 'video')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_contents" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "type" "public"."post_contents_type_enum" NOT NULL, "postId" integer, CONSTRAINT "PK_0d6f5f06a8a11c1f3d2dde7fc3c" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "post_contents" ADD CONSTRAINT "FK_28f2c395b5cef5b54f7f1e59af8" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_contents" DROP CONSTRAINT "FK_28f2c395b5cef5b54f7f1e59af8"`,
    );

    await queryRunner.query(`DROP TABLE "post_contents"`);
    await queryRunner.query(`DROP TYPE "public"."post_contents_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_9c0353760c806d01b6f61657a2c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
