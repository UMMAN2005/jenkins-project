pipeline {
    agent any

    environment {
        PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/google-cloud-sdk/bin'
        ZONE = 'us-central1'
        PROJECT_ID = 'kubernetes-441414'
        DEPLOYMENT = 'jenkins-project'
        CONTAINER = 'jenkins-project'
        IMAGE = 'jenkins-project'
        NAMESPACE = 'default'
    }

    stages {
        stage('Check Env Path') {
            steps {
                sh 'echo $PATH'
            }
        }

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
                sh "sudo docker build -t umman2005/jenkins-project:${env.GIT_COMMIT} ."
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
                sh "sudo docker push umman2005/jenkins-project:${env.GIT_COMMIT}"
                echo "Image pushed to DockerHub successfully"
            }
        }

        stage("Deploy to Dev Cluster") {
            steps {
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
