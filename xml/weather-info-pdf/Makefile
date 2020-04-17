deploy:
	gcloud functions deploy jma-xml-weather-info-pdf \
		--project=weatherbox-217409 \
		--region=asia-northeast1 \
		--trigger-topic=weather-info-hourly \
		--runtime=nodejs8 \
		--entry-point=handler
