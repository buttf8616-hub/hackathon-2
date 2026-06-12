# Quickstart: Phase IV – Local Kubernetes Deployment

**Feature**: `004-phase4-k8s-deployment` | **Date**: 2026-02-12

## Prerequisites

- Docker installed and running
- Minikube installed (`minikube version` works)
- Helm 3 installed (`helm version` works)
- kubectl installed (`kubectl version` works)
- Minimum 2 CPU, 4GB RAM available for Minikube

## Step-by-Step Deployment

### 1. Start Minikube

```bash
minikube start --driver=docker --cpus=2 --memory=4096
```

### 2. Configure Docker to Use Minikube's Docker Daemon

```bash
eval $(minikube docker-env)
```

> This makes `docker build` put images directly into Minikube's image store.

### 3. Build Docker Images

```bash
# From repository root
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
```

### 4. Get Minikube IP

```bash
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"
```

### 5. Deploy with Helm

```bash
helm install todo-app ./helm/todo-app \
  --set backend.env.DATABASE_URL="<your-neon-database-url>" \
  --set backend.env.GEMINI_API_KEY="<your-gemini-api-key>" \
  --set frontend.env.NEXT_PUBLIC_API_URL="http://$MINIKUBE_IP:30001"
```

### 6. Verify Deployment

```bash
# Check all pods are Running
kubectl get pods

# Expected output:
# NAME                             READY   STATUS    RESTARTS   AGE
# todo-backend-xxxxx               1/1     Running   0          30s
# todo-frontend-xxxxx              1/1     Running   0          30s

# Check services
kubectl get services
```

### 7. Access the Application

```bash
# Option A: Use minikube service command
minikube service todo-frontend

# Option B: Access directly via NodePort
echo "Frontend: http://$MINIKUBE_IP:30000"
echo "Backend:  http://$MINIKUBE_IP:30001"
```

## Common Operations

### Update Configuration

```bash
helm upgrade todo-app ./helm/todo-app \
  --set backend.replicas=2
```

### View Logs

```bash
kubectl logs -l app=todo-backend
kubectl logs -l app=todo-frontend
```

### Check Health

```bash
# Backend health
curl http://$MINIKUBE_IP:30001/health

# Frontend
curl http://$MINIKUBE_IP:30000
```

### Uninstall

```bash
helm uninstall todo-app
```

### Stop Minikube

```bash
minikube stop
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Pod in CrashLoopBackOff | `kubectl logs <pod-name>` — check env vars |
| ImagePullBackOff | Ensure `eval $(minikube docker-env)` was run before `docker build` |
| Cannot access from browser | Run `minikube tunnel` or use NodePort URL |
| Database connection failed | Verify DATABASE_URL is correct and Neon DB allows external access |
| Frontend shows "Network Error" | Check NEXT_PUBLIC_API_URL points to accessible backend URL |
