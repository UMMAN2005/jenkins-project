pipeline {
    agent any

    environment {
        PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/google-cloud-sdk/bin'
        ZONE = 'us-central1'
        PROJECT_ID = 'kubernetes-441414'
        HARBOR_DOMAIN = '34.42.194.195'
        NAMESPACE = 'default'
        DEPLOYMENT = 'jenkins-project'
        CONTAINER = 'jenkins-project-container'
        IMAGE = "${env.HARBOR_DOMAIN}/jenkins/jenkins-project"
        TAG = "${env.GIT_COMMIT}"
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
                sh "sudo docker build -t ${env.IMAGE}:${env.TAG} ."
                echo "Image built successfully"
            }
        }

        stage("Login to Harbor") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-credentials', 
                                                 usernameVariable: 'HARBOR_USERNAME', 
                                                 passwordVariable: 'HARBOR_PASSWORD')]) {
                    sh "echo ${env.HARBOR_PASSWORD} | docker login -u ${env.HARBOR_USERNAME} --password-stdin ${env.HARBOR_DOMAIN}"
                    echo "Logged in successfully"
                }
            }
        }

        stage("Push to Harbor") {
            steps {
                sh "sudo docker push ${env.IMAGE}:${env.TAG}"
                echo "Image pushed to Harbor successfully"
            }
        }

        stage("Deploy to Dev Cluster") {
            steps {
                withCredentials([file(credentialsId: 'gcp-service-account', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh """
                    gcloud auth activate-service-account --key-file "$GOOGLE_APPLICATION_CREDENTIALS"
                    gcloud container clusters get-credentials dev-cluster --zone "${env.ZONE}" --project "${env.PROJECT_ID}"
                    
                    envsubst < kubernetes/deployment-temp.yml > kubernetes/deployment.yml

                    kubectl delete deployment "${env.DEPLOYMENT}" -n "${env.NAMESPACE}" --ignore-not-found

                    kubectl apply -f kubernetes/deployment.yml -n "${env.NAMESPACE}"
                    kubectl apply -f kubernetes/service.yml -n "${env.NAMESPACE}"
                    """
                    echo "Deployed to Dev Cluster successfully"
                }
            }
        }

        stage("K6 Performance Test") {
            steps {
                script {
                    try {
                        sh """
                        k6 run test.js --out json=k6-results.json
                        """
                        echo "K6 performance test completed successfully"
                    } catch (Exception e) {
                        error("K6 test failed, stopping the pipeline.")
                    }
                }
            }
        }

        stage("Deploy to Prod Cluster") {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                withCredentials([file(credentialsId: 'gcp-service-account', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh """
                    gcloud auth activate-service-account --key-file "$GOOGLE_APPLICATION_CREDENTIALS"
                    gcloud container clusters get-credentials prod-cluster --zone "${env.ZONE}" --project "${env.PROJECT_ID}"

                    envsubst < kubernetes/deployment-temp.yml > kubernetes/deployment.yml

                    kubectl delete deployment "${env.DEPLOYMENT}" -n "${env.NAMESPACE}" --ignore-not-found

                    kubectl apply -f kubernetes/deployment.yml -n "${env.NAMESPACE}"
                    kubectl apply -f kubernetes/service.yml -n "${env.NAMESPACE}"
                    """
                    echo "Deployed to Prod Cluster successfully"
                }
            }
        }
    }
}
