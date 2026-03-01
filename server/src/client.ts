import express from "express";
import path from "path";
import Application from "./app";

const client = new Application(5000, "Flow Map Client");

client.init(process.env.VITE_API_URL);

const app = client.getApp();

let relativePath = "../../client-web/dist";

if (process.env.NODE_ENV?.trim() === "production") {
  relativePath = "../../client-web/dist";
}

const publicPath = path.join(__dirname, relativePath);

app.use(express.static(publicPath));

// SPA fallback
app.use((req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

client.start(() => {
  console.log(
    `${client.name} is running on port:${client.port} in ${process.env.NODE_ENV} mode`,
  );
});
