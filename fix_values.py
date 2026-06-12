content = """# Default values for todo-app Helm chart

backend:
  name: todo-backend
  image:
    repository: todo-backend
    tag: latest
    pullPolicy: Never
  replicas: 1
  port: 8000
  service:
    type: NodePort
    port: 8000
    nodePort: 30001
  env:
    DATABASE_URL: "YOUR_NEON_DATABASE_URL_HERE"
    GEMINI_API_KEY: "YOUR_GEMINI_API_KEY_HERE"
    GEMINI_MODEL: "gemini-2.5-flash"
    CORS_ORIGINS: "http://localhost:3000,http://todo-frontend:3000"

frontend:
  name: todo-frontend
  image:
    repository: todo-frontend
    tag: latest
    pullPolicy: Never
  replicas: 1
  port: 3000
  service:
    type: NodePort
    port: 3000
    nodePort: 30000
  env:
    NEXT_PUBLIC_API_URL: "http://192.168.49.2:30001"
"""

with open('/tmp/myvalues.yaml', 'w') as f:
    f.write(content)

print('done')
