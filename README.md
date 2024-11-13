# Flask To-Do App CI/CD Pipeline

This repository contains a CI/CD pipeline for a basic Flask-based to-do application. The pipeline automates the deployment process from testing and building Docker images to pushing them to a Harbor registry, followed by deploying to Google Kubernetes Engine (GKE) clusters. It includes performance testing to ensure application stability before deploying to production.

## Project Overview

- **App**: A Flask-based to-do application.
- **Requirements**: Listed in `requirements.txt` (includes Flask, Pytest, and Gunicorn).
- **Dockerfile**: Configures the app's production environment and exposes the app on port 80.
- **Jenkinsfile**: Defines the CI/CD pipeline stages, including testing, building, pushing, and deploying.
  
## Technologies Used

- **Jenkins**: Automates the CI/CD pipeline.
- **Docker**: Containerizes the application for deployment.
- **Kubernetes (GKE)**: Manages deployment in both development and production clusters.
- **Harbor**: Serves as a secure, TLS-enabled Docker registry.
- **k6**: Provides performance testing to validate application stability.

## Pipeline Stages

1. **Check Environment Path**: Verifies the environment path setup.
2. **Install Dependencies**: Installs required dependencies for the application.
3. **Run Tests**: Runs unit tests using `pytest` to ensure application functionality.
4. **Build Docker Image**: Builds a Docker image from the application code.
5. **Login to Harbor**: Authenticates with Harbor to push the Docker image securely.
6. **Push to Harbor**: Pushes the Docker image to the Harbor registry.
7. **Deploy to Dev Cluster**: Deploys the image to the development Kubernetes cluster.
8. **k6 Performance Test**: Executes performance tests to validate stability.
9. **Deploy to Prod Cluster**: Deploys to the production cluster if all stages succeed.

## Key Components

- **Dockerfile**: Configures the application environment, installs dependencies, and sets Gunicorn for production.
- **Jenkinsfile**: Manages the entire CI/CD pipeline, with key steps such as testing, building, and deploying.
- **Kubernetes Deployment**: 
  - **Clusters**: Sets up development and production clusters on GKE in autopilot mode.
  - **Configuration Files**: Kubernetes deployment and service files manage app deployment across environments.

- **Harbor Registry**: 
  - **Registry Setup**: Configured with TLS on Google Compute Engine for secure image storage.
  - **Credentials**: Managed through Jenkins for secure access to the Harbor registry.

- **k6 Load Testing**: Runs performance tests to verify the application can handle expected loads.

## Running the Project Locally

1. **Clone the repository**:
    - Clone the GitHub repository and navigate to the project directory.
  
2. **Build and run the Docker container**:
    - Build the Docker image and run the container locally to test the application.

3. **Run tests locally**:
    - Use `pytest` to run unit tests and verify application functionality.

## Conclusion

This CI/CD pipeline ensures a smooth, automated deployment workflow from development to production, providing testing, secure registry integration, and Kubernetes-based orchestration. The addition of `k6` load testing makes the pipeline reliable and production-ready, ensuring stability before each release.
