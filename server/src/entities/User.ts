import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Story } from "./Story";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Story, (story) => story.author)
  stories: Story[];
}
