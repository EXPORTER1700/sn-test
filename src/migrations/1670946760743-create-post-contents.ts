import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPostContents1670946760743 implements MigrationInterface {
  private type = 'post_content_type_enum';
  private table = 'post_contents';
  private seq = 'post_contents_id_seq';

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

  private createTable(): string {
    return `CREATE TABLE ${this.table}
            (
                id         BIGSERIAL PRIMARY KEY,
                post_id    BIGINT REFERENCES posts (id) ON DELETE CASCADE NOT NULL,
                type       post_content_type_enum                         NOT NULL,
                url        TEXT                                           NOT NULL,
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

  private createType(): string {
    return `CREATE TYPE ${this.type} AS ENUM ('video' , 'image');`;
  }

  private dropType(): string {
    return `DROP TYPE ${this.type}`;
  }
}
