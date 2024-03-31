namespace = "production"
serviceName = "jobber-review"
service = "Jobber Reviews"

pipeline {
    agent {
        label "Jenkins-Agent"
    }

    tools {
        nodejs "NodeJS@18"
        docker "Docker"
    }

    environment {
        DOCKER_CREDENTIALS = credentials()
    }
}
