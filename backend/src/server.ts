import { createServer } from "node:http";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { setupSocketServer } from "./realtime/socket.js";

const httpServer = createServer(app);

setupSocketServer(httpServer);

httpServer.listen(env.port, () => {
  console.log(`FitBoard API listening on port ${env.port}`);
});
