pipeline {
    agent any

    environment {
        // Define any environment variables here if needed
        INDEX_FILE = 'index.html'
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

    stages {
        stage(Docker){
            steps{
                sh 'docker build -t my-playwright .'
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
                    npm install netlify-cli node-jq
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
                            image 'mcr.microsoft.com/playwright:v1.39.0-jammy' // Use Playwright image
                            reuseNode true // Reuse the node to speed up the build
                        }
                    }

                    steps {
                        sh '''
                            npm install serve
                            node_modules/.bin/serve -s build &
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