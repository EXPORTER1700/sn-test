import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptions1669810903073 implements MigrationInterface {
  name = 'CreateSubscriptions1669810903073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_subscriptions_users" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_fea47b19332ae314865649d5b26" PRIMARY KEY ("usersId_1", "usersId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb8ca7bf7cf5137dd618ca75e6" ON "users_subscriptions_users" ("usersId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0204b0dfc5fe89343b87f17df5" ON "users_subscriptions_users" ("usersId_2") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "subscriptionsCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "subscribersCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_subscriptions_users" ADD CONSTRAINT "FK_eb8ca7bf7cf5137dd618ca75e6d" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_subscriptions_users" ADD CONSTRAINT "FK_0204b0dfc5fe89343b87f17df5d" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_subscriptions_users" DROP CONSTRAINT "FK_0204b0dfc5fe89343b87f17df5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_subscriptions_users" DROP CONSTRAINT "FK_eb8ca7bf7cf5137dd618ca75e6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "subscribersCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "subscriptionsCount"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0204b0dfc5fe89343b87f17df5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb8ca7bf7cf5137dd618ca75e6"`,
    );
    await queryRunner.query(`DROP TABLE "users_subscriptions_users"`);
  }
}
