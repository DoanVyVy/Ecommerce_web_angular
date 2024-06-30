const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("mock-api-data.json");
const middlewares = jsonServer.defaults({ noCors: true });

server.use(middlewares);
server.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

server.use(router);
server.listen(3000, () => {
  console.log("Mock api server listening at localhost:4200");
});
