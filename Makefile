build:
	docker build -t limaoimdocs .
deploy:
	docker build -t limaoimdocs  .
	docker tag limaoimdocs registry.cn-shanghai.aliyuncs.com/limao/limaoimdocs:latest
	docker push registry.cn-shanghai.aliyuncs.com/limao/limaoimdocs:latest