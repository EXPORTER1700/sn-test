import { MigrationInterface, QueryRunner } from 'typeorm';

export class createComments1670947134693 implements MigrationInterface {
  private table = 'comments';
  private seq = 'comments_id_seq';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.createTable());
    await queryRunner.query(this.createSeq());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.dropTable());
    await queryRunner.query(this.dropSeq());
  }

  private createTable(): string {
    return `CREATE TABLE ${this.table}
            (
                id         BIGSERIAL PRIMARY KEY,
                text       VARCHAR(256)                                   NOT NULL,
                post_id    BIGINT REFERENCES posts (id) ON DELETE CASCADE NOT NULL,
                user_id    INT REFERENCES users (id) ON DELETE CASCADE    NOT NULL,
                reply_to   BIGINT                                         REFERENCES comments (id) ON DELETE SET NULL,
                created_at TIMESTAMP                                      NOT NULL DEFAULT now(),
                updated_at TIMESTAMP                                      NOT NULL DEFAULT now()
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
