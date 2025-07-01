import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { insertProjectSchema, insertFileSchema, insertChatMessageSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "sk-fake-key-for-demo"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  app.use((req, res, next) => {
    // Simple session simulation - in production use proper auth
    req.userId = 1; // Default to demo user
    next();
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(req.userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.userId
      });
      
      const project = await storage.createProject(projectData);
      
      // Create default files based on template
      const defaultFiles = getDefaultFiles(project.template, project.id);
      for (const file of defaultFiles) {
        await storage.createFile(file);
      }
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const updates = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(parseInt(req.params.id), updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Files
  app.get("/api/projects/:projectId/files", async (req, res) => {
    try {
      const files = await storage.getFilesByProjectId(parseInt(req.params.projectId));
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/projects/:projectId/files", async (req, res) => {
    try {
      const fileData = insertFileSchema.parse({
        ...req.body,
        projectId: parseInt(req.params.projectId)
      });
      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (error) {
      res.status(400).json({ message: "Invalid file data" });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(parseInt(req.params.id));
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch file" });
    }
  });

  app.patch("/api/files/:id", async (req, res) => {
    try {
      const updates = insertFileSchema.partial().parse(req.body);
      const file = await storage.updateFile(parseInt(req.params.id), updates);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const success = await storage.deleteFile(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // AI Chat
  app.get("/api/projects/:projectId/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessagesByProjectId(parseInt(req.params.projectId));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/projects/:projectId/chat", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const { content } = req.body;
      
      // Save user message
      const userMessage = await storage.createChatMessage({
        projectId,
        role: "user",
        content
      });
      
      // Get AI response
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "You are a helpful coding assistant. Help users with their programming questions, debugging, and code optimization. Be concise but thorough."
          },
          { role: "user", content }
        ],
        max_tokens: 500
      });
      
      const assistantContent = completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
      
      // Save assistant message
      const assistantMessage = await storage.createChatMessage({
        projectId,
        role: "assistant",
        content: assistantContent
      });
      
      res.json({ userMessage, assistantMessage });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Code execution (mocked)
  app.post("/api/projects/:projectId/run", async (req, res) => {
    try {
      // Mock execution - in production this would run in a secure sandbox
      const { fileId } = req.body;
      const file = await storage.getFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Simulate execution result
      const output = {
        success: true,
        output: "✓ Compiled successfully!\nLocal: http://localhost:3000\nNetwork: http://192.168.1.100:3000\nwebpack compiled with 0 warnings",
        error: null,
        executionTime: Math.random() * 2000 + 500
      };
      
      res.json(output);
    } catch (error) {
      res.status(500).json({ message: "Failed to execute code" });
    }
  });

  // User info
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'join_project':
            // Join project room for collaboration
            ws.projectId = data.projectId;
            break;
          case 'file_change':
            // Broadcast file changes to other users in the same project
            wss.clients.forEach(client => {
              if (client !== ws && client.projectId === ws.projectId && client.readyState === ws.OPEN) {
                client.send(JSON.stringify(data));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}

function getDefaultFiles(template: string, projectId: number) {
  const baseFiles = [
    {
      name: "README.md",
      path: "/README.md",
      content: `# ${template} Project\n\nThis is a new ${template} project created with DevStudio.`,
      type: "file",
      projectId,
      parentId: null
    }
  ];

  switch (template) {
    case "React App":
      return [
        ...baseFiles,
        {
          name: "src",
          path: "/src",
          content: "",
          type: "folder",
          projectId,
          parentId: null
        },
        {
          name: "App.js",
          path: "/src/App.js",
          content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Portfolio</h1>
        <p>
          Full-stack developer passionate about creating
          amazing web experiences.
        </p>
        <div className="skills">
          <span className="skill">React</span>
          <span className="skill">Node.js</span>
          <span className="skill">Python</span>
        </div>
      </header>
    </div>
  );
}

export default App;`,
          type: "file",
          projectId,
          parentId: null
        },
        {
          name: "App.css",
          path: "/src/App.css",
          content: `.App {
  text-align: center;
}

.App-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.App-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.App-header p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  line-height: 1.6;
}

.skills {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.skill {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}`,
          type: "file",
          projectId,
          parentId: null
        },
        {
          name: "index.js",
          path: "/src/index.js",
          content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
          type: "file",
          projectId,
          parentId: null
        },
        {
          name: "index.html",
          path: "/public/index.html",
          content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
          type: "file",
          projectId,
          parentId: null
        },
        {
          name: "package.json",
          path: "/package.json",
          content: `{
  "name": "react-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}`,
          type: "file",
          projectId,
          parentId: null
        }
      ];
    
    case "HTML/CSS/JS":
      return [
        ...baseFiles,
        {
          name: "index.html",
          path: "/index.html",
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to My Web Project</h1>
        <p>This is a simple HTML, CSS, and JavaScript project.</p>
        <button onclick="showMessage()">Click me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          type: "file",
          projectId,
          parentId: null
        },
        {
          name: "style.css",
          path: "/style.css",
          content: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(10px);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
}

button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    padding: 1rem 2rem;
    border-radius: 25px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}`,
          type: "file",
          projectId,
          parentId: null
        },
        {
          name: "script.js",
          path: "/script.js",
          content: `function showMessage() {
    alert('Hello from DevStudio! 🚀');
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    console.log('Web project loaded successfully!');
    
    // Add click animation to button
    const button = document.querySelector('button');
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});`,
          type: "file",
          projectId,
          parentId: null
        }
      ];
    
    default:
      return baseFiles;
  }
}

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}
