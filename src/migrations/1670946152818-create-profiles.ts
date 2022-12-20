import { MigrationInterface, QueryRunner } from 'typeorm';

export class createProfiles1670946152818 implements MigrationInterface {
  private table = 'profiles';
  private seq = 'profiles_id_seq';
  private idx = 'profile_user_id_idx';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.createTable());
    await queryRunner.query(this.createSeq());
    await queryRunner.query(this.createIndex());
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(this.dropTable());
    await queryRunner.query(this.dropSeq());
    await queryRunner.query(this.dropIndex());
  }

  private createTable(): string {
    return `CREATE TABLE ${this.table}
            (
                id         SERIAL PRIMARY KEY,
                first_name VARCHAR(128),
                last_name  VARCHAR(128),
                photo      TEXT,
                user_id    INT REFERENCES users (id) ON DELETE CASCADE NOT NULL,
                created_at TIMESTAMP                                   NOT NULL DEFAULT now(),
                updated_at TIMESTAMP                                   NOT NULL DEFAULT now()
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

  private createIndex() {
    return `CREATE INDEX ${this.idx} ON ${this.table} ("user_id")`;
  }

  private dropIndex() {
    return `DROP INDEX ${this.idx}`;
  }
}
