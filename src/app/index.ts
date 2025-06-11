import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "calculator",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "add",
  "Add two numbers",
  {
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }) => {
    return {
      content: [
        {
          type: "text",
          text: `The sum of ${a} and ${b} is ${a + b}.`,
        }
      ]
    }
  }
)

async function startStdioServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Calculator MCP Server running on stdio");
}

startStdioServer().catch((error) => {
  console.error("Fatal error in startStdioServer():", error);
  process.exit(1);
});