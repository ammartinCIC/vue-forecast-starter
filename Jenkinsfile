String branch = "${env.BRANCH_NAME}"
String nexusUser = "cic-commons-nexus"
String sonarKey = "vue-forecast"
String sonarName = "vue-forecast-webapp"
String packageVersion = ""
String skipSonar = "false"
String skipDependencyCheck = "false"
String skipDockerPush = "false"

withFolderProperties {
  skipSonar = "${env.SKIP_SONAR}"
  skipDockerPush = "${env.SKIP_DOCKER_PUSH}"
  skipDependencyCheck = "${env.SKIP_DEPENDENCY_CHECK}"
}

pipeline{
  agent none

  triggers {
    pollSCM(branch == 'develop' ? '0 0 * * *' : '')
  }

  environment {
    NPM_TOKEN = credentials('cic-commons-npm-token')
    GITLAB_TOKEN = credentials('commons-gitlab-token')

    GIT_BRANCH = 'main'
    GIT_AUTHOR_NAME = 'forecast_ci'
    GIT_AUTHOR_EMAIL = 'forecast_ci@cic.es'
    GIT_COMMITTER_NAME = 'forecast_ci'
    GIT_COMMITTER_EMAIL = 'forecast_ci@cic.es'
  }

  stages {

    stage ('BUILD') {
      agent {
        dockerfile {
          filename 'Dockerfile'
          label 'linux'
          args "-v ${OWASP_DEPCHECK_DATA}:/home/jenkins/.dependencyCheck/data"
        }
      }

      stages {
        stage('Configuration') {
          steps{
            sh "npm config set registry https://ic-atenea.corp.cic.es/repository/cic-commons-npm-group/"
            sh "npm config set \'//ic-atenea.corp.cic.es/repository/cic-commons-npm-group/:_authToken=${NPM_TOKEN}\'"
            sh "npm config set \'//ic-atenea.corp.cic.es/repository/cic-commons-npm-releases/:_authToken=${NPM_TOKEN}\'"
          }
        }

        stage('npm-install') {
          steps {
            sh "npm install"
          }
        }

        stage('npm-build') {
          steps {
            sh "npm run build"
          }
        }

        stage('OWASP') {
          when { expression { skipDependencyCheck == 'false' } }

          steps {
            sh "owasp-dependency-check -f XML -d /home/jenkins/.dependencyCheck/data"
            dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
          }
        }

        stage('SonarQube') {
          when { expression { skipSonar == 'false' } }

          steps {
            withSonarQubeEnv(env.SONAR_SERVER) {
              sh "sonar-scanner -Dsonar.projectKey=${sonarKey} -Dsonar.projectName=${sonarName} -Dsonar.sources=src"
            }
          }
        }

        stage('SonarQube Quality Gate') {
          when { expression { skipSonar == 'false' } }

          steps {
            timeout(time: 10, unit: 'MINUTES') {
              waitForQualityGate abortPipeline: true
            }
          }
        }

        stage('Semantic Release') {
          when { expression { branch == 'main' } }

          steps {
            sh 'npx semantic-release'
          }
        }

        stage('Get package version') {
          steps {
            script {
              packageVersion = sh (
                script: "node -e \"console.log(require('./package.json').version);\"",
                returnStdout: true
              )
              packageVersion = packageVersion.trim()
            }
          }
        }
      }
    }

    stage('DOCKER') {
      when { expression { skipDockerPush == 'false' } }

      agent {
        label 'linux'
      }

      stages {
        stage('docker-push') {
          when { expression { branch == 'main' || branch == 'develop' } }
          steps {
            script{
              sh 'cp -R ./dist ./deploy/dist'
              
              if(branch == 'develop') {
                docker.withRegistry('https://ic-atenea.corp.cic.es:5019', nexusUser) {
                  def image = docker.build('vue-forecast', 'deploy')
                  image.push("${packageVersion}.dev")
                  image.push('dev')
                }

                // Envía un POST al webhook del Portainer para que descargue la nueva imagen generada
                httpRequest httpMode: 'POST', validResponseCodes: '204', url: "https://portainer-dev.luca-bds.com/api/webhooks/f491e0fb-a477-4bb3-9e61-9bcda8cbca45"
              } else {
                docker.withRegistry('https://ic-atenea.corp.cic.es:5019', nexusUser) {
                  def image = docker.build('vue-forecast', 'deploy')
                  image.push("${packageVersion}")
                  image.push('latest')
                }
              }
            }
          }
        }

        stage('Docker clean') {
          steps{
            sh "docker rmi -f \$(docker images --quiet ic-atenea.corp.cic.es:5019/*)"
          }
        }
      }
    }
  }

  post {
    cleanup {
      node('linux') {
        deleteDir()
        echo 'Workspace borrado'
      }
    }
  }
}
