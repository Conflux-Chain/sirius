/* -*- mode: groovy -*- */
pipeline {
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '50', daysToKeepStr: '60', numToKeepStr: '50')
    disableConcurrentBuilds()
    disableResume()
    durabilityHint 'PERFORMANCE_OPTIMIZED'
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }

  agent none

  stages {
    stage('multiple env') {
      parallel {
        stage('ci env') {
          when {
            beforeAgent true
            anyOf {
              branch 'dev'
              branch 'jenkins-pipeline'
            }
          }
          agent {label 'bounty-backend-test-machine'}
          steps {
            nodejs(nodeJSInstallationName: 'nodejs15') {
              script {
                sh (label: 'build', script: """
yarn && yarn build
"""
                )
              }
            }
            script {
              sh (label: 'move to nginx www', script: """
sudo rm -rf /www/sirius/ || true
sudo cp -r build /www/sirius
""")
            }
          }
        }

        stage('prod env') {
          when {
            beforeAgent true
            allOf {
              branch 'master'
            }
          }
          agent {label 'confluxscan.io'}
          steps {
            nodejs(nodeJSInstallationName: 'nodejs15') {
              script {
                sh (label: 'build', script: """
yarn && yarn build
"""
                )
              }
            }
            script {
              sh (label: 'move builds', script: """
sudo rm -rf /www/sirius/ || true
sudo cp -r build /www/sirius
""")
            }
          }
        }
      }
    }
  }
}