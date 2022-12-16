import { MigrationInterface, QueryRunner } from 'typeorm';

export class createSubscriptions1670946425076 implements MigrationInterface {
  private table = 'subscriptions';
  private seq = 'likes_id_seq';

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
                id         SERIAL PRIMARY KEY,
                user_id1   INT REFERENCES users (id) NOT NULL,
                user_id2   INT REFERENCES users (id) NOT NULL,
                created_at TIMESTAMP                 NOT NULL DEFAULT now(),
                updated_at TIMESTAMP                 NOT NULL DEFAULT now()
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
