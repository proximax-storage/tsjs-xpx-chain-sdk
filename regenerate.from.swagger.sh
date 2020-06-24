openapi-gen-ts-sdk.sh ../js-xpx-chain-rest/swagger.yaml src/infrastructure

rm \
src/infrastructure/.gitignore \
src/infrastructure/.openapi-generator-ignore \
src/infrastructure/git_push.sh

for i in `find src/infrastructure -type f -name "*ts"`;do sed -i "s/http.ClientResponse/http.IncomingMessage/g;s/Array<Array>/Array<number>/g;s/Array<string | Array | number>/Array<string | Array<number> | number>/g" $i;done


