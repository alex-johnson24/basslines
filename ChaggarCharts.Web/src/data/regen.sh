#! /bin/bash

# Get the path to this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

BASE_URL=http://localhost:5000/swagger/v1/swagger.json

openapi-generator-cli generate -i $BASE_URL --skip-validate-spec --generator-name typescript-fetch --type-mappings DateTimeOffset=string --additional-properties=typescriptThreePlus=true -o ./src