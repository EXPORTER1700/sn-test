import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfilesAndRealtionsThemWithUsers1669644240465
  implements MigrationInterface
{
  name = 'CreateProfilesAndRealtionsThemWithUsers1669644240465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', "photo" character varying NOT NULL DEFAULT '', "userId" integer, CONSTRAINT "REL_9c0353760c806d01b6f61657a2" UNIQUE ("userId"), CONSTRAINT "PK_330d3560db0dac16f06a04609bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_9c0353760c806d01b6f61657a2c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_9c0353760c806d01b6f61657a2c"`,
    );
    await queryRunner.query(`DROP TABLE "profile_entity"`);
  }
}
