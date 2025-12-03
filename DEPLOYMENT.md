# Deployment Guide for Real-Time Forum

## Bugs Fixed

1. **Error Handling in users.go** (lines 16, 20)
   - Fixed unused `fmt.Errorf` calls that were creating errors but not returning them
   - Now properly returns HTTP errors to the client

2. **Network Binding Issue in main.go**
   - Changed from `localhost:8081` to `0.0.0.0:8081`
   - This allows the app to accept connections from outside the container

3. **WebSocket Connection Issue in websocket.js**
   - Changed hardcoded `ws://localhost:8080/ws` to dynamic host detection
   - Now uses `window.location.host` to work in any environment
   - Automatically switches between `ws://` and `wss://` based on HTTP/HTTPS

## Quick Start

### Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Using Docker
```bash
# Build the image
docker build -t real-time-forum .

# Run the container
docker run -d -p 8081:8081 --name forum real-time-forum
```

### Access the Application
Open your browser and navigate to: `http://localhost:8081`

## Free Deployment Options

### 1. Railway.app (Recommended - Easiest)
- Free tier: 500 hours/month, $5 credit
- Supports Docker deployments
- Steps:
  1. Sign up at https://railway.app
  2. Create new project > Deploy from GitHub repo
  3. Select your repository
  4. Railway will auto-detect Dockerfile
  5. Set port to 8081 in settings
  6. Deploy!

### 2. Render.com
- Free tier: 750 hours/month
- Steps:
  1. Sign up at https://render.com
  2. New > Web Service
  3. Connect GitHub repository
  4. Environment: Docker
  5. Port: 8081
  6. Free tier will spin down after inactivity

### 3. Fly.io
- Free tier: 3 VMs with 256MB RAM
- Steps:
  ```bash
  # Install flyctl
  curl -L https://fly.io/install.sh | sh

  # Login
  fly auth login

  # Launch app (from project directory)
  fly launch

  # Deploy
  fly deploy
  ```

### 4. Koyeb
- Free tier: 1 web service
- Supports Docker deployments
- Similar to Railway - connect GitHub and deploy

## Production Considerations

1. **Database Persistence**
   - Current setup uses SQLite with file storage
   - For production, mount a volume for `/root/database`
   - Example: `docker run -v $(pwd)/data:/root/database ...`

2. **Environment Variables**
   - Consider using `.env` file for configuration
   - Don't commit sensitive data to git

3. **HTTPS/WSS**
   - Most free platforms provide HTTPS automatically
   - WebSocket code already handles `wss://` protocol

4. **Resource Limits**
   - Monitor memory usage on free tiers
   - Most platforms have 512MB-1GB RAM limits

## Testing Locally

```bash
# Test the build
docker build -t real-time-forum .

# Run with logs
docker run -p 8081:8081 real-time-forum

# Or with docker-compose
docker-compose up
```

## Troubleshooting

- **Can't connect to WebSocket**: Check that port 8081 is exposed and accessible
- **Database errors**: Ensure `/root/database` directory has write permissions
- **Build fails**: Make sure all Go dependencies are in go.mod/go.sum
