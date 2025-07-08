pipeline {
    agent any

    environment {
        // Define any environment variables here if needed
        INDEX_FILE = 'index.html'
        REACT_APP_VERSION = "1.0.$BUILD_ID"
        // aws access key and secret key 

    }

    stages {
        stage('AWS'){
            agent{
                docker {
                    image 'amazon/aws-cli:2.27.49' // Use AWS CLI image
                    args "--entrypoint=''" // Use AWS CLI image with shell entrypoint
                }
            }
            steps{
                withCredentials([usernamePassword(credentialsId: 'aws_id', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                        aws --version
                        aws s3 ls
                    '''
                }
            }
        }
    
        stage('Build') {
            agent{
                docker {
                    image 'node:18-alpine' // Use Node.js 18 Alpine image
                    reuseNode true // Reuse the node to speed up the build
                }
            }
            steps {
                sh '''
                    npm install netlify-cli jq
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

        stage('Approval'){
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    input message: 'Do you want to proceed with the tests?', ok: 'Yes, proceed'
                }
            }
        }




        stage('Run Tests') {
            parallel{
                
                stage('E2E'){
                    agent{
                        docker {
                            image 'my-playwright-app' // Use Playwright image
                            reuseNode true // Reuse the node to speed up the build
                        }
                    }

                    steps {
                        sh '''
                            serve -s build &
                            sleep 10
                            npx playwright test --report=html
                        '''
                    }
                }

                stage('Unit Test'){
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
            }
        }

        
    }

    post {
        always {
            junit 'jest-results/junit.xml'
        }
    }
}