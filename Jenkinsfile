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
    }
}