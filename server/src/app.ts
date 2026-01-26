import cors from "cors";
import express from "express";

class Application {
  private app: express.Application;
  port!: number;
  name?: string;

  constructor(port: number, name?: string) {
    this.app = express();
    this.port = port;
    this.name = name;
  }

  init() {
    this.app.use(express.json());
    console.log(process.env.CLIENT_URL);
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      })
    );
  }

  getApp() {
    return this.app;
  }

  useRouter({ path, router }: { path: string; router: express.Router }) {
    this.app.use(path, router);
  }

  start(cb: () => void) {
    
    this.app.listen(this.port, cb);
  }

  stop(cb: () => void) {
    process.on("SIGINT", cb);
  }
}

export default Application;
