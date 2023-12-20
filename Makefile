.PHONY: all advanced-tools redirects usdc-bridge token-bridge


all:
	act --artifact-server-path /tmp/act-artifacts pull_request -s GITHUB_TOKEN=${GITHUB_TOKEN} -P=xlabs-large-runner=catthehacker/ubuntu:act-latest --container-options "--memory=10G"
advanced-tools:
	act --artifact-server-path /tmp/act-artifacts pull_request -j advanced-tools  -s GITHUB_TOKEN=${GITHUB_TOKEN} -P=xlabs-large-runner=catthehacker/ubuntu:act-latest --container-options "--memory=12g"
redirects:
	act --artifact-server-path /tmp/act-artifacts pull_request -j redirects
usdc-bridge:
	act --artifact-server-path /tmp/act-artifacts pull_request -j usdc-bridge -s GITHUB_TOKEN=${GITHUB_TOKEN}
token-bridge:
	act --artifact-server-path /tmp/act-artifacts pull_request -j token-bridge -s GITHUB_TOKEN=${GITHUB_TOKEN}
rewards-dashboard:
	act --artifact-server-path /tmp/act-artifacts pull_request -j rewards-dashboard -s GITHUB_TOKEN=${GITHUB_TOKEN}
