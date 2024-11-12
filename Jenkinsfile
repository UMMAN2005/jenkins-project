pipeline {
    agent any

    environment {
        ZONE = 'us-central1'
        PROJECT_ID = 'kubernetes-441414'
        DEPLOYMENT = 'jenkins-project'
        CONTAINER = 'jenkins-project'
        IMAGE = 'jenkins-project'
        NAMESPACE = 'default'
    }

    stages {
        stage("Install dependencies") {
            steps {
                sh "sudo yum install python3-pip -y"
                sh "pip3 install -r requirements.txt"
                echo "Dependencies installed successfully"
            }
        }

        stage("Test") {
            steps {
                sh "sudo yum install python3-pytest -y"
                sh "python3 -m pytest"
                echo "Test run successfully"
            }
        }

        stage("Build docker image") {
            steps {
                // Build the Docker image
                sh "sudo docker build -t docker.io/umman2005/jenkins-project:${env.GIT_COMMIT} ."
                echo "Image built successfully"
            }
        }

        stage("Login to Dockerhub") {
            steps {
                // Login to Docker Hub using credentials
                withCredentials([usernamePassword(credentialsId: 'docker-credentials', 
                                                 usernameVariable: 'DOCKER_USERNAME', 
                                                 passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo ${env.DOCKER_PASSWORD} | docker login -u ${env.DOCKER_USERNAME} --password-stdin docker.io"
                    echo "Logged in successfully"
                }
            }
        }

        stage("Push to Dockerhub") {
            steps {
                // Push the image to Docker Hub
                sh "sudo docker push docker.io/umman2005/jenkins-project:${env.GIT_COMMIT}"
                echo "Image pushed to DockerHub successfully"
            }
        }

        stage("Deploy to Dev Cluster") {
            steps {
                // Deploy to GCP Kubernetes cluster
                withCredentials([file(credentialsId: 'gcp-service-account', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh """
                    gcloud auth activate-service-account --key-file "$GOOGLE_APPLICATION_CREDENTIALS"
                    gcloud container clusters get-credentials dev-cluster --zone "${env.ZONE}" --project "${env.PROJECT_ID}"
                    
                    kubectl set image deployment/${env.DEPLOYMENT} ${env.CONTAINER}=umman2005/${env.IMAGE}:${env.GIT_COMMIT} -n ${env.NAMESPACE}
                    kubectl apply -f kubernetes/deployment.yml
                    kubectl apply -f kubernetes/service.yml
                    """
                    echo "Deployed to Dev Cluster successfully"
                }
            }
        }
    }
}
