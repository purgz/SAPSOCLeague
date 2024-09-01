## Snooker and Pool league University of Birmingham

Angular and Spring boot boilerplate generated using JHipster.

## Continuous integration / deployment

Application self-hosted with production accessible at www.uobsapsoc.co.uk.
Secured using nginx reverse proxy and letsencrypt free public certificates.

## Using Docker to simplify development

```
docker-compose -f src/main/docker/postgresql.yml up -d
```

```
docker-compose -f src/main/docker/postgresql.yml down
```

## Dockerize full application

```
npm run java:docker
```

```
docker-compose -f src/main/docker/app.yml up -d
```

- `.yo-rc.json` - Yeoman configuration file
  JHipster configuration is stored in this file at `generator-jhipster` key. You may find `generator-jhipster-*` for specific blueprints configuration.
- `.yo-resolve` (optional) - Yeoman conflict resolver
  Allows to use a specific action when conflicts are found skipping prompts for files that matches a pattern. Each line should match `[pattern] [action]` with pattern been a [Minimatch](https://github.com/isaacs/minimatch#minimatch) pattern and action been one of skip (default if ommited) or force. Lines starting with `#` are considered comments and are ignored.
- `.jhipster/*.json` - JHipster entity configuration files

## Development

npm run start to launch frontend.
./mvnw to launch backend

### Packaging as jar

To build the final jar and optimize the SapsocLeague application for production, run:

```
./mvnw -Pprod clean verify
```

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

```
java -jar target/*.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Refer to [Using JHipster in production][] for more details.

### Packaging as war

To package your application as a war in order to deploy it to an application server, run:

```
./mvnw -Pprod,war clean verify
```

## Testing

To launch your application's tests, run:

```
./mvnw verify
```

### Client tests

Unit tests are run by [Jest][]. They're located in [src/test/javascript/](src/test/javascript/) and can be run with:

```
npm test
```

For more information, refer to the [Running tests page][].
