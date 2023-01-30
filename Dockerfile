FROM node:18.12

RUN apt update && apt install openjdk-11-jre -y

RUN groupadd -g 992 jenkins
RUN useradd -u 1002 -g jenkins -d /home/jenkins -m jenkins
RUN chown jenkins:jenkins /home/jenkins
WORKDIR /home/jenkins

RUN npm install -g owasp-dependency-check && npm install -g sonarqube-scanner

USER jenkins
