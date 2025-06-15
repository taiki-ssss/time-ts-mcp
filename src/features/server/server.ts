import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function createStdioServer(): McpServer {
  const server = new McpServer({
    name: "calculator",
    version: "1.0.0",
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Register the "add" tool
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
  );

  return server;
};