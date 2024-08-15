import express from "express";
import { initializeDatabase } from "./database";
import userRoutes from "./routes/userRoutes";
import storyRoutes from "./routes/storyRoutes";
import translateRoute from "./routes/translateRoutes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/language", translateRoute);

const PORT = process.env.PORT || 8080;

initializeDatabase()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on" + PORT);
    });
  })
  .catch((error: any) => console.log(error));
