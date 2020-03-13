.PHONY: download build upload-assets deploy clean

slug = TK

build:
	rm -rf dist/*
	npm run build

upload-assets:
	aws s3 rm s3://spectator-static-assets/$(slug)/ --recursive --exclude "*" --include "*" --profile=spec
	aws s3 cp dist/ s3://spectator-static-assets/$(slug)/ --recursive --exclude "*" --include "*" --acl=public-read --profile=spec

deploy-arc: build upload-assets
