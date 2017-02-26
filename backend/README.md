# Signage Backend Server

## Deployment

Deployments are handled by tasks specified in `shipitfile.js`.

 - `shipit (staging|production) deploy` - Does the full deployment process including transpilation, updating `yarn.lock`, backing up the existing deployment and database, copying over the new build, updating dependencies, and restarting the backend process.
 - `shipit (staging|production) restore` - Restores to the previous deployment, including the database and restarting the backend process.

## Database Migrations

A new migration is generated with `sequelize migration:create --name THE_MIGRATION_NAME`.
You then must manually modify the created migration file to implement the database changes (see: [the sequelize migration documentation(http://docs.sequelizejs.com/en/latest/docs/migrations/)).
The migration will then be run automatically when the server is started (*e.g.* with `node server.js` or `pm2 restart futusign-staging`).
Note that this behavior will need to be modified if we move to multiple server processes in order to avoid race conditions.

The migration script should include both up/down migration functionality and should be included in a single commit with the updated model.

## API Documentation

### /api/login (POST)
#### Arguments
- **username** *(string)*
- **password** *(string*

#### Response
- **token** *(string)* - Authorization bearer token for future requests. This must be included in all other API calls as a header `Authorization: bearer TOKEN`.

### /api/login_status (GET)
#### Arguments
*none*

#### Response
- **authenticated** *(boolean)* - Whether or not the bearer token represents a successful authorization.
- **user** *(object)* - The user that corresponds to the bearer token.


### /api/screens (POST)
Creates a new screen.

#### Arguments
- **name** *(string)*
- **description** *(string)*
- **parentId** *(integer, optional)* - The id of the folder containing the screen.
- **xCoordinate** *(float, optional)* - The fractional x-coordinate of the screen on its parent's map.
- **yCoordinate** *(float, optional)* - The fractional y-coordinate of the screen on its parent's map.

#### Response
- **id** *(integer)*
- **name** *(string)*
- **description** *(string)*
- **parendId** *(integer)*
- **xCoordinate** *(float)*
- **yCoordinate** *(float)*

### /api/screens/:id (PUT)
Modifies an existing screen with the specified `id`.

#### Arguments
- **name** *(string)*
- **description** *(string)*
- **parentId** *(integer, optional)* - The id of the folder containing the screen.
- **xCoordinate** *(float, optional)* - The fractional x-coordinate of the screen on its parent's map.
- **yCoordinate** *(float, optional)* - The fractional y-coordinate of the screen on its parent's map.

#### Response
- **id** *(integer)*
- **name** *(string)*
- **description** *(string)*
- **parendId** *(integer)*
- **xCoordinate** *(float)*
- **yCoordinate** *(float)*

### /api/screens/:id (DELETE)
Deletes an existing screen with the specified `id`.

#### Arguments
*none*

#### Response
- **id** *(integer)*
- **name** *(string)*
- **description** *(string)*
- **parendId** *(integer)*
- **xCoordinate** *(float)*
- **yCoordinate** *(float)*

### /api/screens (GET)
Gets an array of available screens

#### Arguments
*none*

#### Response
- An array of screen objects, each containing:
    - **id** *(integer)*
    - **name** *(string)*
    - **description** *(string)*
    - **parendId** *(integer)*
    - **xCoordinate** *(float)*
    - **yCoordinate** *(float)*


### /api/folders (POST - multipart-form/data)

Creates a new folder.

#### Arguments
- **name** *(string)*
- **parentId** *(integer, optional)* - The id of the folder containing this folder.
- **file** *(file, optional)* - The map file, must have a file extension of '.png', '.gif', '.jpg', or '.jpeg'.

#### Response
- **id** *(integer)*
- **name** *(string)*
- **parendId** *(integer)*
- **mapUrl** *(string)* Url for the map, relative to the parent directory of /api/.

### /api/folders/:id (DELETE)
Deletes an existing folder with the specified `id`.

#### Arguments
*none*

#### Response
- **id** *(integer)*
- **name** *(string)*
- **parendId** *(integer)*
- **mapUrl** *(string)*

### /api/folders (GET)
Gets an array of available folders.

#### Arguments
*none*

#### Response
- An array of folder objects, each containing:
    - **id** *(integer)*
    - **name** *(string)*
    - **parendId** *(integer)*
    - **mapUrl** *(string)*


### /api/playables (POST - multipart-form/data)
Creates a new playable.

#### Arguments
- **name** *(string)*
- **description** *(string)*
- **file** *(file)* - Must have a file extension of '.pdf'.

#### Response
- **id** *(integer)*
- **name** *(string)*
- **description** *(string)*
- **url** *(string)* - Url for the pdf, relative to the parent directory of /api/.
- **thumbnailUrl** *(string)* - Url for the pdf thumbnail, also relative to /api/.

### /api/playables/:id (DELETE)
Deletes an existing playable with the specified `id`.

#### Arguments
*none*

#### Response
- **id** *(integer)*
- **name** *(string)*
- **description** *(string)*
- **url** *(string)*
- **thumbnailUrl** *(string)*

### /api/playables (GET)
Gets an array of available playables.

#### Arguments
*none*

#### Response
- An array of playable objects, each containing:
    - **id** *(integer)*
    - **name** *(string)*
    - **description** *(string)*
    - **url** *(string)*
    - **thumbnailUrl** *(string)*


### /api/screens_playables (POST)
Creates a new association between a screen and a playable.

#### Arguments
- **screenId** *(integer)*
- **playableId** *(integer)*

#### Response
- **screenId** *(integer)*
- **playableId** *(integer)*

### /api/screens_playables (GET)
Gets an array of existing associations between screens and playables.

#### Arguments
*none*

#### Response
- An array of association objects, each containing:
    - **screenId** *(integer)*
    - **playableId** *(integer)*

### /api/actions/update_screens_playables (POST)
Helper method to add and/or remove playables from multiple screens at once.

#### Arguments
- **screenIds** *(array of integers)* - A list of screen ids to modify the associations for.
- **addPlayableIds** *(array of integers, optional)* - A list of playable ids to be associated with all specified screens.
- **removePlayableIds** *(array of integers, optional)* - A list of playable ids to be unassociated from all specified screens.

#### Response
- **screenIds** *(array of integers)*
- **addPlayableIds** *(array of integers)*
- **removePlayableIds** *(array of integers)*
