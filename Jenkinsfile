pipeline {
    agent any

    stages {
        stage("Install dependencies") {
            steps {
                sh "pip install -r requirements.txt"
                echo "Dependencies installed successfully"
            }
        }

        stage("Test") {
            steps {
                sh "pytest"
                echo "Test run successfully"
            }
        }

        stage("Build docker image") {
            steps {
                sh "docker build -t umman2005/jenkins-project:${env.GIT_COMMIT} ."
                echo "Image built successfully"
            }
        }

        stage("Login to Dockerhub") {
            steps {
                                withCredentials([usernamePassword(credentialsId: 'docker-credentials', 
                                                 usernameVariable: 'DOCKER_USERNAME', 
                                                 passwordVariable: 'DOCKER_PASSWORD')]) {
                sh "echo ${env.DOCKER_PASSWORD} | docker login -u ${env.DOCKER_USERNAME} --password-stdin"
                echo "Logged in successfully"
                                                 }
            }
        }

        stage("Push to Dockerhub") {
            steps {
                sh "docker push umman2005/jenkins-project:${env.GIT_COMMIT}"
                echo "Image pushed to DockerHub successfully"
            }
        }
    }
}
