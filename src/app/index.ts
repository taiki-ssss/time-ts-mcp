#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createStdioServer } from "../features/server/index";

const server = createStdioServer();

async function startStdioServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

startStdioServer().catch((error) => {
  console.error("Fatal error in startStdioServer():", error);
  process.exit(1);
});