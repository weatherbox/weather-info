deploy:
	gcloud functions deploy jma-xml-weather-info \
		--project=weatherbox-217409 \
		--region=asia-northeast1 \
		--trigger-topic=jma-xml-weather-info \
		--runtime=nodejs8 \
		--entry-point=handler
