.PHONY:	clean image publish test vars

ACCOUNT?=$(shell aws sts get-caller-identity | jq -r .Account)
NAME?=voluntree/platform-app
ECR?=${ACCOUNT}.dkr.ecr.eu-west-1.amazonaws.com
REPO?=${ECR}/${NAME}
NODE_VERSION?=$(shell cat .node-version)

BRANCH:=$(shell git rev-parse --abbrev-ref HEAD)
COMMIT:=$(shell git rev-parse --short HEAD)
VERSION:=$(shell sed -n 's/.*"version": "\(.*\)",/\1/p' < package.json )
GITTAG:=$(shell git describe --abbrev=0 )
TAG?=$(shell printf '%s_%s_%08d' ${VERSION} ${COMMIT} ${GITHUB_RUN_NUMBER})

image:
	@echo Building ${NAME}:${TAG} ...
	@docker build \
		--build-arg image_name=${NAME} \
		--build-arg git_branch=${BRANCH} \
		--build-arg git_commit_hash=${COMMIT} \
		--build-arg git_tag=${GITTAG} \
		--build-arg github_run_number=${GITHUB_RUN_NUMBER} \
		--build-arg node_version=${NODE_VERSION} \
		--build-arg yarn_version=${YARN_VERSION} \
		--build-arg version=${VERSION} \
		--tag ${NAME}:${TAG} .
	@docker tag ${NAME}:${TAG} ${NAME}:latest

run:
	@-docker stop regulated-products
	@-docker rm regulated-products && sleep 20
	@docker run -p 3000:3000 --rm --name regulated-products --env-file ./test/docker-configs/rp-config.env ${REPO}:${TAG}

publish: image
	@echo Tagging ${NAME}:${TAG} ...
	@docker tag ${NAME}:${TAG} ${REPO}:${TAG}
	@echo Publishing ${REPO}:${TAG} ...
	@docker push ${REPO}:${TAG}
	@echo Done.

clean:
	@rm -rf .next node_modules coverage

dist:
	@npm install

local: dist
	@npm run dev

tag:
	@echo ${TAG}

test:
	@npm run test

vars:
	@echo NAME:${NAME}
	@echo VERSION:${VERSION}
	@echo BRANCH:${BRANCH}
	@echo COMMIT:${COMMIT}
	@echo REPO:${REPO}
	@echo TAG:${TAG}
