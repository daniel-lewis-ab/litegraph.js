const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

app.use(express.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});


const JWT_SECRET = 'your_secret_key';

const refreshTokenLife = '7d'; 

const generateTokens = (accessTokenLife, refreshTokenLife = '1h') => {
  const accessToken = jwt.sign({}, JWT_SECRET, { expiresIn: accessTokenLife });
  const refreshToken = jwt.sign({}, JWT_SECRET, { expiresIn: refreshTokenLife });

  return { accessToken, refreshToken };
};

app.post('/v1/auth/login/firebase', (req, res) => {
  console.log('login');
  const tokens = generateTokens('1h');
  console.log(tokens);
  res.status(200).json(tokens);
});

// Endpoint do odświeżania tokenów
app.post('/v1/auth/refresh/', (req, res) => {
  console.log('calling refresh, sendign new tokens');
  const failure = false;
  if(failure) {
    return res.sendStatus(401);
  }
  const tokens = generateTokens('1h');
  res.status(200).json(tokens);
});


const baseWorkflows = [
  {
    id: '1',
    name: 'comfyui_Title01af___a',
    type: 'image',
    lastEdited: new Date().toISOString(), // Current timestamp
    nodesCount: 33,
  },
  {
    id: '2',
    name: 'comfyui_Title01af___a',
    type: 'controlnet',
    lastEdited: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
    nodesCount: 33,
  },
  {
    id: '3',
    name: '(Video Tutorial Resources) Picture in Picture Goodness + Canvas Pose',
    type: 'image',
    lastEdited: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    nodesCount: 33,
  },
  {
    id: '4',
    name: 'comfyui_Title01af___a',
    type: 'controlnet',
    lastEdited: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), // 1 week ago
    nodesCount: 33,
    imageUrl: 'https://gcdnb.pbrd.co/images/aJIbNBtdViKg.png',
  },
];

const workflows = [
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
  ...baseWorkflows,
];

const TIMEOUT = 0;

app.get('/v1/workflows', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN_HERE

  if (token == null) return res.sendStatus(401); // Brak tokena

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401); // Nieautoryzowany dostęp lub token wygasł
    setTimeout(() => {
      console.log('GOING!');
      res.json(workflows);
    }, TIMEOUT);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
