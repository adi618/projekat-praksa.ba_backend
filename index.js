import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createRequire } from "module";
import swaggerDocs from "./utils/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const require = createRequire(import.meta.url);
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/profilePictures", express.static("profilePictures"));
app.use(cors());

app.use("/api", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/posts", postRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongodb"))
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    swaggerDocs(app, PORT);
  })
  .catch((error) => console.log(error.message));
