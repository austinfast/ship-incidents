#!/usr/bin/env sh

set -e

# staging or production?
BUCKET="dev"
# deploy path, graphics or storytelling-embed
DEPLOY_PATH="usatoday/graphics"
CDN_AUTH=$CDN_AUTH

CDN_SPACE="gs://experiments-www-gannett-cdn-com/experiments/$DEPLOY_PATH"
PUBLIC_PATH="https://www.gannett-cdn.com/experiments/$DEPLOY_PATH"
CDN_PATH="https://$CDN_AUTH@www.gannett-cdn.com/experiments/$DEPLOY_PATH"
while [ "$1" != "" ]; do
	case $1 in
		--staging )
			shift
			BUCKET="dev"
			;;

		--production )
			shift
			BUCKET="master"
			;;

		--storytelling-embed )
			shift
			DEPLOY_PATH="storytelling-embed"
			CDN_SPACE="gs://experiments-www-gannett-cdn-com/experiments/$DEPLOY_PATH/$BUCKET"
			PUBLIC_PATH="https://www.gannett-cdn.com/experiments/$DEPLOY_PATH/$BUCKET"
			CDN_PATH="https://$CDN_AUTH@www.gannett-cdn.com/experiments/$DEPLOY_PATH/$BUCKET"
			;;

		* ) shift;;
	esac
done

echo "Deploying to $BUCKET ..."


PROJECT_SLUG="$(basename $(pwd))"
PROJECT_FOLDER="./public"

PUBLIC_URL="$PUBLIC_PATH/$PROJECT_SLUG/index.html"

gsutil -m rsync -r $PROJECT_FOLDER "$CDN_SPACE/$PROJECT_SLUG"

for filename in $(cd $PROJECT_FOLDER && find *); do
	# echo "purging file: $PUBLIC_PATH/$PROJECT_SLUG/$filename"
	curl -X PURGE "$CDN_PATH/$PROJECT_SLUG/$filename"
done

# Add AllUsers:R to the project folder
gsutil -m acl ch -u AllUsers:R  -r "$CDN_SPACE/$PROJECT_SLUG"

wait
echo "Deployed:"
echo $PUBLIC_URL

