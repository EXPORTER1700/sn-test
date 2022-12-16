import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPosts1670946606579 implements MigrationInterface {
  private table = 'posts';
  private seq = 'posts_id_seq';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.createTable());
    await queryRunner.query(this.createSeq());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.dropTable());
    await queryRunner.query(this.dropSeq());
  }

  private createTable(): string {
    return `CREATE TABLE posts
            (
                id            BIGSERIAL PRIMARY KEY,
                title         VARCHAR(256),
                like_count    INT                       NOT NULL DEFAULT (0),
                comment_count INT                       NOT NULL DEFAULT (0),
                user_id       INT REFERENCES users (id) NOT NULL,
                created_at    TIMESTAMP                 NOT NULL DEFAULT now(),
                updated_at    TIMESTAMP                 NOT NULL DEFAULT now()
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
