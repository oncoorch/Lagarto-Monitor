import path from "node:path";

const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
