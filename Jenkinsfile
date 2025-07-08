pipeline {
    agent any

    environment {
        // Define any environment variables here if needed
        INDEX_FILE = 'index.html'
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

    stages {
    
        stage('Build') {
            agent{
                docker {
                    image 'node:18-alpine' // Use Node.js 18 Alpine image
                    reuseNode true // Reuse the node to speed up the build
                }
            }
            steps {
                sh '''
                    echo 'Building the application...'
                    echo 'small change'
                    ls -la
                    node --version
                    npm --version
                    npm ci 
                    npm run build
                    ls -la
                '''
            }
        }
       

        stage('Run Tests') {   
            agent{
                docker {
                        image 'node:18-alpine' // Use Node.js 18 Alpine image
                        reuseNode true // Reuse the node to speed up the build
                }
            }

            steps{
                sh '''
                    echo 'Testing...'
                    test -f build/${INDEX_FILE}
                    npm test
                    '''
            }
            
        }

        stage('Approval'){
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    input message: 'Do you want to proceed with the tests?', ok: 'Yes, proceed'
                }
            }
        }

        stage('AWS Stage Deploy') {
            agent {
                docker {
                    image 'amazon/aws-cli:2.27.49' // Use AWS CLI image
                    reuseNode true // Use the same workspace as the build directory
                    args "--entrypoint=''" // Use AWS CLI image with shell entrypoint
                }
            }
            environment {
                AWS_S3_BUCKET = 'jenkins-2025-07'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws_id', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                        aws s3 sync build s3://$AWS_S3_BUCKET --delete
                        aws s3 ls s3://$AWS_S3_BUCKET
                    '''
                }
            }
        }

        stage('Approval'){
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    input message: 'Do you want to proceed with the tests?', ok: 'Yes, proceed'
                }
            }
        }

        stage('AWS Prod Deploy') {
            agent {
                docker {
                    image 'amazon/aws-cli:2.27.49' // Use AWS CLI image
                    reuseNode true // Use the same workspace as the build directory
                    args "--entrypoint=''" // Use AWS CLI image with shell entrypoint
                }
            }
            environment {
                AWS_S3_BUCKET = 'jenkins-2025-07'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws_id', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                        aws s3 sync build s3://$AWS_S3_BUCKET --delete
                        aws s3 ls s3://$AWS_S3_BUCKET
                    '''
                }
            }
        }

        
    }

    post {
        always {
            junit 'jest-results/junit.xml'
        }
    }
}