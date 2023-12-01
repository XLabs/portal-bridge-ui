# Folder structure

### [apps/connect](./apps/connect/)

Portal Bridge with Connect widget

### [apps/docs](./apps/docs/)

Portal Bridge documentation

## Run Github Actions Locally with Act 

see https://nektosact.com/installation/index.html

### All

```shell
export GITHUB_TOKEN=#your github token

act --artifact-server-path /tmp/act-artifacts -W .github/workflows/preview.yml pull_request -s GITHUB_TOKEN=${GITHUB_TOKEN} -P=xlabs-large-runner=catthehacker/ubuntu:act-latest --container-options "--memory=10G"
```

### advanced-tools job

```shell
export GITHUB_TOKEN=#your github token

act --artifact-server-path /tmp/act-artifacts -W .github/workflows/preview.yml pull_request -j advanced-tools  -s GITHUB_TOKEN=${GITHUB_TOKEN} -P=xlabs-large-runner=catthehacker/ubuntu:act-latest --container-options "--memory=12g"
```

### redirects job

```shell
act --artifact-server-path /tmp/act-artifacts -W .github/workflows/preview.yml pull_request -j redirects
```

### usdc-bridge job

```shell
act --artifact-server-path /tmp/act-artifacts -W .github/workflows/preview.yml pull_request -j usdc-bridge -s GITHUB_TOKEN=${GITHUB_TOKEN} 
```
### token-bridge job

```shell
act --artifact-server-path /tmp/act-artifacts -W .github/workflows/preview.yml pull_request -j token-bridge -s GITHUB_TOKEN=${GITHUB_TOKEN} 
```