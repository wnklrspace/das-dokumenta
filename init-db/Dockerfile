FROM mongo:5.0
ARG DATABASE_URI

ENV DATABASE_URI ${DATABASE_URI}

COPY users.json /users.json
COPY documents.json /documents.json
COPY comments.json /comments.json

CMD mongoimport --uri ${DATABASE_URI} --collection users --file /users.json --jsonArray && \
mongoimport --uri ${DATABASE_URI} --collection documents --file /documents.json --jsonArray && \
mongoimport --uri ${DATABASE_URI} --collection comments --file /comments.json --jsonArray

