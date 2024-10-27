import express, { Request, Response } from "express";
import path from "path";

import cors, { CorsOptions } from "cors";

const app = express();
const PORT = Number(process.env.PORT) | 3000;

const whitelist = ["http://localhost:5173", ""];
const corsOptions: CorsOptions = {
  origin: (origin: any, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("^/$|index(.html)?", require("./routes/root.ts"));

app.use("/api/todo-list", require("./routes/api/todos.ts"));

app.listen(PORT, () => {
  console.log(`Server is listening on port:${PORT}`);
});
