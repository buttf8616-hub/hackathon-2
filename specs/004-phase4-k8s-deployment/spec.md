# Feature Specification: Phase IV – Local Kubernetes Deployment

**Feature Branch**: `004-phase4-k8s-deployment`
**Created**: 2026-02-12
**Status**: Draft
**Input**: Phase IV of the Evolution of Todo Project — containerization and local Kubernetes deployment of all services (Frontend, Backend, AI Chatbot)

## Overview

This specification defines Phase IV of the Evolution of Todo Project, introducing containerization and local Kubernetes deployment of the full system. All three services (Frontend, Backend, and AI Chatbot) must be containerized using Docker, deployed on a local Minikube Kubernetes cluster, and managed using Helm charts. The external Neon PostgreSQL database remains unchanged and is accessed via environment variables.

### Goals

- Containerize all application services (Frontend, Backend, Chatbot)
- Deploy the complete system to a local Minikube Kubernetes cluster
- Use Helm charts for declarative deployment management
- Ensure service-to-service communication inside the cluster
- Demonstrate AI-assisted Kubernetes operations via kubectl-ai and kagent

### Non-Goals

- Cloud deployment (reserved for Phase V)
- Auto-scaling or production-grade high availability
- Multi-cluster configuration
- CI/CD pipelines
- Modifying existing application logic or features from Phases I–III

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Containerize All Services (Priority: P1)

A developer wants to package the Frontend, Backend, and Chatbot services into Docker containers so they can run consistently across environments without manual dependency setup.

**Why this priority**: Containerization is the foundational prerequisite for all Kubernetes deployment. Nothing else can proceed without working Docker images.

**Independent Test**: Can be fully tested by building each Docker image and running the containers locally with `docker run`, verifying each service responds correctly on its exposed port.

**Acceptance Scenarios**:

1. **Given** the project codebase with Phase III complete, **When** a developer runs `docker build` for the backend Dockerfile, **Then** a `todo-backend` image is created that starts the FastAPI server on the configured port
2. **Given** the project codebase, **When** a developer runs `docker build` for the frontend Dockerfile, **Then** a `todo-frontend` image is created that serves the Next.js application on the configured port
3. **Given** the project codebase, **When** a developer runs `docker build` for the chatbot Dockerfile, **Then** a `todo-chatbot` image is created that provides the AI chatbot endpoint on the configured port
4. **Given** a built Docker image for any service, **When** a developer runs the container with required environment variables, **Then** the service starts successfully and responds to health checks

---

### User Story 2 - Deploy to Local Kubernetes via Helm (Priority: P1)

A developer wants to deploy all services to a local Minikube cluster using a single Helm command so the entire system runs in Kubernetes with proper service discovery and networking.

**Why this priority**: Helm-based Kubernetes deployment is the core deliverable of Phase IV and depends on containerization being complete.

**Independent Test**: Can be fully tested by starting Minikube, building images, running `helm install todo-app ./helm/todo-app`, and verifying all pods reach Running state with services accessible.

**Acceptance Scenarios**:

1. **Given** Minikube is running and Docker images are built, **When** a developer runs `helm install todo-app ./helm/todo-app`, **Then** all three services are deployed as Kubernetes Deployments with corresponding Services
2. **Given** a Helm-deployed system, **When** a developer checks pod status with `kubectl get pods`, **Then** all pods show status "Running" with 1/1 containers ready
3. **Given** a Helm-deployed system, **When** services communicate internally, **Then** the Frontend can reach the Backend and Chatbot via Kubernetes service names (e.g., `http://todo-backend:8000`)
4. **Given** a Helm-deployed system, **When** a developer accesses the Frontend via the exposed NodePort, **Then** the full Todo application is functional including AI chatbot

---

### User Story 3 - Manage Deployment Configuration via Helm Values (Priority: P2)

A developer wants to customize deployment parameters (image names, ports, replica counts, environment variables) by editing a single `values.yaml` file without modifying Kubernetes manifests directly.

**Why this priority**: Configuration flexibility is important for maintainability but the system must work with defaults first.

**Independent Test**: Can be tested by modifying values in `values.yaml` (e.g., changing a port or replica count), running `helm upgrade`, and verifying the changes take effect.

**Acceptance Scenarios**:

1. **Given** a `values.yaml` with default configuration, **When** a developer modifies the backend replica count to 2, **Then** `helm upgrade` creates 2 backend pods
2. **Given** a `values.yaml` with environment variables, **When** a developer changes the database URL, **Then** the backend pods use the updated connection string
3. **Given** a deployed system, **When** a developer runs `helm uninstall todo-app`, **Then** all Kubernetes resources created by the chart are removed cleanly

---

### User Story 4 - AI-Assisted Kubernetes Operations (Priority: P3)

A developer wants to use AI-powered tools (kubectl-ai and kagent) to query cluster state, debug issues, and manage Kubernetes resources using natural language commands.

**Why this priority**: AI tooling enhances the developer experience but is not required for the system to function.

**Independent Test**: Can be tested by installing kubectl-ai, running a natural language query like "show me all running pods", and verifying it returns correct cluster information.

**Acceptance Scenarios**:

1. **Given** kubectl-ai is installed and configured, **When** a developer types a natural language query about cluster state, **Then** kubectl-ai translates it to the appropriate kubectl command and returns results
2. **Given** kagent is installed, **When** a developer asks it to analyze a failing pod, **Then** kagent provides diagnostic information and suggested fixes
3. **Given** the deployed system, **When** a developer uses kubectl-ai to scale a deployment, **Then** the deployment scales as requested

---

### Edge Cases

- What happens when Minikube is not running and `helm install` is attempted? The system must provide a clear error message.
- What happens when a Docker image fails to build due to missing dependencies? The Dockerfile must fail with descriptive error output.
- What happens when a required environment variable (e.g., DATABASE_URL) is not set? The pod must fail to start with a clear log message rather than silently failing.
- What happens when inter-service communication fails (e.g., backend service unavailable)? The dependent service must handle the error gracefully and retry or report the issue.
- What happens when `helm uninstall` is run? All Kubernetes resources must be cleanly removed with no orphaned resources.

## Requirements *(mandatory)*

### Functional Requirements

#### Containerization

- **FR-001**: Each service (Frontend, Backend, Chatbot) MUST have a dedicated Dockerfile in its respective directory
- **FR-002**: Each Docker image MUST use a production-ready build process (multi-stage builds where appropriate)
- **FR-003**: Each Docker image MUST accept configuration via environment variables, not hardcoded values
- **FR-004**: Each Docker image MUST expose only the required application port
- **FR-005**: Docker images MUST be named `todo-frontend`, `todo-backend`, and `todo-chatbot`

#### Kubernetes Deployments

- **FR-006**: Each service MUST be defined as a Kubernetes Deployment resource
- **FR-007**: Each Deployment MUST specify replica count (default: 1), container image, container port, environment variables, and restart policy
- **FR-008**: The Backend Deployment MUST include environment variables for DATABASE_URL, GEMINI_API_KEY, GEMINI_MODEL, and CORS_ORIGINS
- **FR-009**: The Frontend Deployment MUST include environment variables for the backend API URL
- **FR-010**: The Chatbot Deployment MUST include environment variables for GEMINI_API_KEY, GEMINI_MODEL, and backend API URL

#### Kubernetes Services

- **FR-011**: Each Deployment MUST have a corresponding Kubernetes Service
- **FR-012**: Backend and Chatbot Services MUST use ClusterIP type for internal-only access
- **FR-013**: Frontend Service MUST use NodePort type to allow browser access from outside the cluster
- **FR-014**: Services MUST use descriptive names (`todo-frontend`, `todo-backend`, `todo-chatbot`) for service discovery

#### Helm Chart

- **FR-015**: All Kubernetes resources MUST be packaged into a single Helm chart at `helm/todo-app/`
- **FR-016**: The Helm chart MUST include a `values.yaml` defining: image names, image tags, ports, environment variables, and replica counts for all services
- **FR-017**: The Helm chart MUST use templates for all Deployment and Service resources
- **FR-018**: The system MUST be deployable via `helm install todo-app ./helm/todo-app`
- **FR-019**: The system MUST be removable via `helm uninstall todo-app`
- **FR-020**: Configuration changes MUST be applicable via `helm upgrade todo-app ./helm/todo-app`

#### Inter-Service Communication

- **FR-021**: Services MUST communicate using Kubernetes service names (not IP addresses or localhost)
- **FR-022**: The Frontend MUST reach the Backend via `http://todo-backend:<port>`
- **FR-023**: The Frontend MUST reach the Chatbot via `http://todo-chatbot:<port>` (or Backend proxies chatbot requests)
- **FR-024**: The Backend MUST connect to the external Neon PostgreSQL database via the DATABASE_URL environment variable

#### Infrastructure Rules

- **FR-025**: No manual configuration inside running containers or clusters is permitted
- **FR-026**: All infrastructure MUST be defined declaratively via Helm charts and Dockerfiles
- **FR-027**: Secrets and sensitive configuration MUST be passed via environment variables, never hardcoded in images or manifests

### Key Entities

- **Docker Image**: A packaged, runnable unit containing one service and its dependencies
- **Kubernetes Deployment**: A declarative specification for running pods with a desired replica count and configuration
- **Kubernetes Service**: A stable network endpoint for accessing a set of pods
- **Helm Chart**: A package of templated Kubernetes manifests with configurable values
- **Helm Values**: A YAML file containing configuration parameters that are injected into chart templates

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All three Docker images build successfully from their Dockerfiles without errors
- **SC-002**: Each containerized service starts and responds to requests within 30 seconds of container launch
- **SC-003**: Running `helm install todo-app ./helm/todo-app` deploys all services and all pods reach Running state within 2 minutes
- **SC-004**: The complete Todo application (including AI chatbot) is fully functional when accessed through the Kubernetes-deployed Frontend
- **SC-005**: A developer can go from a fresh Minikube start to a fully running system in under 5 minutes using the documented commands
- **SC-006**: `helm uninstall todo-app` removes all created resources with zero orphaned Kubernetes objects
- **SC-007**: Modifying `values.yaml` and running `helm upgrade` applies configuration changes without requiring redeployment from scratch
- **SC-008**: All inter-service communication works via Kubernetes service names without any hardcoded IP addresses

## Assumptions

- Minikube, Docker, Helm, kubectl are pre-installed on the developer's machine
- The Neon PostgreSQL database remains external and accessible from the Minikube cluster
- The Gemini API key is valid and has available quota
- kubectl-ai and kagent are installable via their respective installation methods
- The developer has sufficient system resources to run Minikube (minimum 2 CPU, 4GB RAM)
- The existing Phase III application code does not require modification for containerization beyond configuration changes

## Dependencies

- Phase III (AI Chatbot) must be complete — all services must be functional before containerization
- External Neon PostgreSQL database must be accessible from Minikube's network
- Docker must be available and compatible with Minikube's container runtime
- Gemini API must be accessible from within the Kubernetes cluster
