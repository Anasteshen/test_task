## Start up / Usage

Use following commands to start the app

To install all necessary dependencies

```bash
$ npm install
```

## Seed data

```bash
$ npm run seed -- <filePath>
```

###### `note` where filePath is ./dump.txt

## Running the app

###### `note` Before running the app, ensure that Docker, npm, and Node.js are pre-installed.

```bash
$ make start
```

## Environment variables

| Name                | Value Type Options | Default Value | Description                 |
| :------------------ | :----------------- | :------------ | :-------------------------- |
| `APP_PORT`          | `Number`           | `3000`        | Default port                |
| `NODE_ENV`          | `String`           | `DEVELOPMENT` | Default port                |
| `POSTGRES_DB`       | `String`           | `test_task`   | Default database name       |
| `POSTGRES_PORT`     | `Number`           | `5432`        | Default database name       |
| `POSTGRES_HOST`     | `String`           | `localhost`   | Default Postgresql host     |
| `POSTGRES_USER`     | `String`           | `postgres`    | Default Postgresql user     |
| `POSTGRES_PASSWORD` | `String`           | `postgres`    | Default Postgresql password |

## Questions

Objective: demonstrate that the design desicions you made were solid by
answering the questions.

1.  How to change the code to support different file versions?

        In case of schemas changing, the system should be updated by modifying existing entities and DTOs.
        If the data in the file is updated, the system already has implemented version support for entities.
        The funcionality can be expanded to operate with different versions of entities and generate a variety of reports.

        Due to version support, we can track data changes depending on the version (generate reports based on timestamp).
        If the format of the file is changed - only the parser`s code should be changed/replaced.

2.  How the import system will change if data on exchange rates disappears from the file, and it will need to be received asynchronously (via API)?

        The system automatically converts all currencies into USD. If rates were to be removed from the file, the system would send an API request to get rates either before or during the conversion process.

        We should store all monetary values in a specific currency for future use in SQL queries.
        If the original currency is important, functionality can be expanded with additional columns (`origin_value`, `origin_currency`), and conversion to USD can be performed through update after data insertion.

3.  In the future the client may want to import files via the web interface,
    how can the system be modified to allow this?

        Can be implemented by providing url path to the file location.
        The current API supports file uploads.

        - POST `/parse/file` - upload file to import data to the db.

    Additionally, there is a console command to import data to the database. See: [Seed Data](#seed-data)
