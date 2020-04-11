deploy:
	gcloud functions deploy jma-xml-weather-info-update \
		--project=weatherbox-217409 \
		--region=asia-northeast1 \
		--trigger-topic=jma-xml-weather-info-update \
		--runtime=nodejs8 \
		--entry-point=handler
