interface Config {
  apiUrl: string;
}

const development: Config = {
  apiUrl: "http://localhost:8080/api/v1",
};

const production: Config = {
  apiUrl: "https://your-production-url.com/api/v1",
};

const config: Config =
  process.env.NODE_ENV === "development" ? development : production;

export default config;
