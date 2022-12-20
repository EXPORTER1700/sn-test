import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsers1670945645324 implements MigrationInterface {
  private type = 'user_status_enum';
  private table = 'users';
  private seq = 'users_id_seq';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.createType());
    await queryRunner.query(this.createTable());
    await queryRunner.query(this.createSeq());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.dropType());
    await queryRunner.query(this.dropTable());
    await queryRunner.query(this.dropSeq());
  }

  private createType(): string {
    return `CREATE TYPE ${this.type} AS ENUM ('NOT_CONFIRMED', 'ACTIVATED', 'BANNED');`;
  }

  private dropType(): string {
    return `DROP TYPE ${this.type}`;
  }

  private createTable(): string {
    return `CREATE TABLE ${this.table}
            (
                id                 SERIAL PRIMARY KEY,
                username           VARCHAR(36) UNIQUE  NOT NULL,
                email              VARCHAR(128) UNIQUE NOT NULL,
                password           VARCHAR(128)        NOT NULL,
                post_count         INT                 NOT NULL DEFAULT (0),
                subscriber_count   INT                 NOT NULL DEFAULT (0),
                subscription_count INT                 NOT NULL DEFAULT (0),
                status             user_status_enum    NOT NULL DEFAULT ('NOT_CONFIRMED'),
                created_at         TIMESTAMP           NOT NULL DEFAULT now(),
                updated_at         TIMESTAMP           NOT NULL DEFAULT now()
            );`;
  }

  private dropTable(): string {
    return `DROP TABLE ${this.table}`;
  }

  private createSeq(): string {
    return `create sequence if not exists ${this.seq};`;
  }

  private dropSeq(): string {
    return `drop sequence if exists ${this.seq};`;
  }
}
