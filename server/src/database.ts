import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Story } from "./entities/Story";
import { getAwsSecrets } from "./config/aws";

let secrets: any = {};
const getSecrets = async () => {
  secrets = await getAwsSecrets();
};

export let AppDataSource: DataSource;

export const initializeDatabase = async () => {
  try {
    await getSecrets();

    AppDataSource = new DataSource({
      type: "mysql",
      host: secrets.host,
      port: 3306,
      password: secrets.password,
      username: "root",
      database: "cloudstory",
      entities: [User, Story],
      synchronize: true,
    });
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
};
