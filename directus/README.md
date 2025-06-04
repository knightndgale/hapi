# Deploying to AWS

Preparation

- Check your AWS credentials are set up and see if you're using the correct aws profile using the command `aws configure list`
- Build the docker image using the command `docker build -t hapi .`

### Pushing to AWS Lightsail

```bash
aws lightsail push-container-image --region ap-southeast-1 --service-name hapi --label hapi --image hapi:latest
```

## For different profile use this command

```bash
aws lightsail push-container-image --region ap-southeast-1 --service-name hapi --label hapi --image hapi:latest --profile [profile-name]
```
