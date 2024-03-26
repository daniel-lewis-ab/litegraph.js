import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import expressWs from 'express-ws';
import { Deployment, DeploymentDetails, GetDeploymentsResponse, GetRefreshTokensResponse, GetWorkflowsResponse, PostLoginResponse, Workflow, WorkflowDetails, WorkflowExecution } from '../src/api/types';
import { initWebsocket } from './websocket';
import { examplePrompt1, examplePrompt2, examplePrompt3, workflowExecutions } from './workflowExecutions';

const app = express();
const PORT = 3000;

expressWs(app);

app.use(express.json({ limit: '50mb' }));

const JWT_SECRET = 'your_secret_key';

// Middleware for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Function to generate UUID for various entities
const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

// ===== TOKENS

// Generates JWT tokens with configurable lifetimes
const generateTokens = (accessTokenLife: string, refreshTokenLife = '1h') => {
  const access = jwt.sign({}, JWT_SECRET, { expiresIn: accessTokenLife });
  const refresh = jwt.sign({}, JWT_SECRET, { expiresIn: refreshTokenLife });
  return { access, refresh };
};

// Endpoint to generate a new pair of tokens
app.post('/v1/token/pair', (_, res: Response) => {
  const tokens: PostLoginResponse = generateTokens('1h');
  res.status(200).json(tokens);
});

// Endpoint for token refresh
app.post('/v1/token/refresh', (_, res: Response) => {
  const tokens: GetRefreshTokensResponse = generateTokens('1h');
  res.status(200).json(tokens);
});

// ===== WORKFLOWS

// Sample workflows for demonstration
const baseWorkflows: WorkflowDetails[] = [
  {
    id: '1',
    name: 'comfyui_Title01af___a1',
    updated_at: new Date().toISOString(), // Current timestamp
    content: examplePrompt1,
    api_content: '{}',
  },
  {
    id: '2',
    name: 'comfyui_Title01af___a2',
    updated_at: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    content: examplePrompt2,
    api_content: '{}',
  },
  {
    id: '3',
    name: '(Video Tutorial Resources) Picture in Picture Goodness + Canvas Pose',
    updated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    content: examplePrompt3,
    api_content: '{}',
  },
  {
    id: '4',
    name: 'comfyui_Title01af___aEMPTY',
    updated_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), // 1 week ago
    content: '{}',
    api_content: '{}',
  },
];
const workflows = baseWorkflows;

// Endpoint to retrieve workflows
app.get('/v1/workflows', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, err => {
    if (err) return res.sendStatus(403); // Forbidden access if token is invalid
    const resp: GetWorkflowsResponse = { results: workflows, count: workflows.length };
    res.json(resp);
  });
});

// Endpoint to create a new workflow
app.post('/v1/workflows/', (req: Request, res: Response) => {
  const { name } = req.body;
  const newWorkflow: WorkflowDetails = {
    id: generateUUID(),
    name,
    content: '{}',
    api_content: '{}',
    updated_at: new Date().toISOString(),
  };
  workflows.unshift(newWorkflow);
  res.status(201).json(newWorkflow);
});

// Endpoint to retrieve a specific workflow by ID
app.get('/v1/workflows/:workflowId', (req: Request, res: Response) => {
  const { workflowId } = req.params;
  const workflow = workflows.find(w => w.id === workflowId);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found.' });
  }
  res.json(workflow);
});

// Endpoint to update a specific workflow
app.put('/v1/workflows/:workflowId', (req: Request, res: Response) => {
  const { workflowId } = req.params;
  const { name, content, api_content } = req.body;

  const index = workflows.findIndex(w => w.id === workflowId);
  if (index === -1) return res.status(404).json({ error: 'Workflow not found.' });

  // Updating the workflow with new values. Only update fields that are provided.
  if (name !== undefined) workflows[index].name = name;
  if (content !== undefined) workflows[index].content = content;
  if (api_content !== undefined) workflows[index].api_content = api_content;
  workflows[index].updated_at = new Date().toISOString(); // Update the 'updated_at' field to the current time

  res.json(workflows[index]);
});

// Endpoint to delete a specific workflow
app.delete('/v1/workflows/:workflowId', (req: Request, res: Response) => {
  const { workflowId } = req.params;
  const index = workflows.findIndex(w => w.id === workflowId);
  if (index === -1) return res.status(404).json({ error: 'Workflow not found.' });

  workflows.splice(index, 1);
  res.json({ success: true });
});

// ===== DEPLOYMENTS

// Predefined deployments for demonstration
export const apiDeployments: DeploymentDetails[] = [
  {
    id: '1',
    name: 'img2parallax1',
    created_at: '2024-03-08T12:35:43.304570Z',
    deployed_at: '2024-03-08T12:35:43.304570Z',
    status: 'PAUSED',
    workflow_id: '1',
    workflow_api_json: '{}',
    workflow_json: '{thatsMyWorkflow: 1}'
  },
  {
    id: '2',
    name: 'img2parallax2',
    created_at: '2024-03-08T12:35:43.304570Z',
    deployed_at: '2024-03-08T12:35:43.304570Z',
    status: 'PAUSED',
    workflow_id: '1',
    workflow_api_json: '{}',
    workflow_json: '{}'
  },
  {
    id: '3',
    name: 'img2parallax3',
    created_at: '2024-03-08T12:35:43.304570Z',
    status: 'ONLINE',
    workflow_id: '1',
    workflow_api_json: '{}',
    workflow_json: '{}'
  },
  {
    id: '4',
    name: 'img2parallax4',
    created_at: '2024-03-08T12:35:43.304570Z',
    deployed_at: '2024-03-08T12:35:43.304570Z',
    status: 'PAUSED',
    workflow_id: '1',
    workflow_api_json: '{}',
    workflow_json: '{}'
  },
  {
    id: '5',
    name: 'img2parallax5',
    created_at: '2024-03-08T12:35:43.304570Z',
    deployed_at: '2024-03-08T12:35:43.304570Z',
    status: 'ONLINE',
    workflow_id: '1',
    workflow_api_json: '{}',
    workflow_json: '{xd: 1}'
  },
];

// Endpoint to retrieve deployments
app.get('/v1/deployments/', (req: Request, res: Response) => {
  const resp: GetDeploymentsResponse = { results: apiDeployments, count: apiDeployments.length };
  res.json(resp);
});

// Endpoint to create a new deployment
app.post('/v1/deployments/', async (req: Request, res: Response) => {
  const { name } = req.body;
  const newDeployment: DeploymentDetails = {
    id: generateUUID(),
    name,
    created_at: new Date().toISOString(),
    deployed_at: new Date().toISOString(),
    status: 'ONLINE',
    workflow_id: '1', // Assume default workflow_id for demo
    workflow_api_json: '{}',
    workflow_json: '{}'
  };

  const SHOW_ERROR = false;
  if(SHOW_ERROR) {
    res.status(400).json({error_code: "deployment_name_exists_error", message: "This workflow name already exists, pick another one"});
    // res.status(400).json({error: "NO!"});
  } else {
    apiDeployments.unshift(newDeployment);
    res.status(201).json(newDeployment);
  }
});

// Endpoint to retrieve a specific deployment by ID
app.get('/v1/deployments/:deploymentId', (req: Request, res: Response) => {
  const { deploymentId } = req.params;
  const deployment = apiDeployments.find(d => d.id === deploymentId);
  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found.' });
  }
  res.json(deployment);
});

// Endpoint to update deployment status
app.put('/v1/deployments/:deploymentId', (req: Request, res: Response) => {
  const ERROR = false;
  const { deploymentId } = req.params;
  const { status } = req.body;
  const deployment = apiDeployments.find(d => d.id === deploymentId);
  if(ERROR) {
    res.status(404).json({ error: 'Deployment not found.' });
  }

  deployment!.status = status;
  if (status === 'ONLINE') deployment!.deployed_at = new Date().toISOString();
  res.json(deployment);
});

// Endpoint to delete a specific deployment
app.delete('/v1/deployments/:deploymentId', (req: Request, res: Response) => {
  const ERROR = false;
  const { deploymentId } = req.params;
  const index = apiDeployments.findIndex(d => d.id === deploymentId);
  if(ERROR) {
    res.status(404).json({ error: 'Deployment not found.' });
  }

  apiDeployments.splice(index, 1);
  res.json({ success: true });
});

// WORKFLOW EXECUTIONS
// Endpoint to retrieve workflow executions for a specific workflow
app.get('/v1/workflows/:workflowId/executions', (req: Request, res: Response) => {
  const { workflowId } = req.params;

  const executionsForWorkflow = workflowExecutions;  //.filter(execution => execution.workflow_id === workflowId);

  const exampleResponse = {
    count: executionsForWorkflow.length,
    next: "http://api.example.org/v1/workflows/1/executions?page=2", // Adjust according to actual pagination logic
    previous: "http://api.example.org/v1/workflows/1/executions?page=1", // Adjust according to actual pagination logic
    results: executionsForWorkflow
  };

  res.json(exampleResponse);
});

app.post('/v1/workflows/:workflowId/executions', (req: Request, res: Response) => {
  const { workflowId } = req.params;

  const newExecution: WorkflowExecution = {
    id: generateUUID(),
    workflow_id: workflowId,
    status: 'loading',
    operation_id: 'xd',
    content: '{}',
    completion_duration: 16,
  };

  workflowExecutions.push(newExecution);

  res.status(201).json(newExecution);
});


// WebSocket endpoint
initWebsocket(app);

// Starting the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
