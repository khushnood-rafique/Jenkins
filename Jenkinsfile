pipeline {
    agent any

    environment {
        // Define any environment variables here if needed
        INDEX_FILE = 'index.html'
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
                    ls -la
                    node --version
                    npm --version
                    npm ci 
                    npm run build
                    ls -la
                '''
            }
        }
        stage('Test'){
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

        stage('E2E'){
            agent{
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy' // Use Playwright image
                    reuseNode true // Reuse the node to speed up the build
                }
            }
            steps {
                sh '''
                    npm install -g serve
                    serve -s build
                    npx playwright test
                '''
            }
        }
    }

    post {
        always {
            junit 'test-results/junit.xml'
        }
    }
}