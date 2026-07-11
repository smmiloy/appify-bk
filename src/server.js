import app from "./app.js";
import fix from "./utils/fix.js";
import { createServer } from "http";
import { PORT } from "./utils/env.js";
import connectToMongoDB from "./databases/connect.mongodb.js";

const startServer = async () => {
  try {
    await connectToMongoDB();

    // await fix();

    const server = createServer(app);

    server.prependListener("request", (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer();
