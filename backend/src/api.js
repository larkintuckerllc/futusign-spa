import { Router } from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import jwt from 'jwt-simple';
import multer from 'multer';
import { PDFImage } from 'pdf-image';
import bcrypt from 'bcrypt-nodejs';
import fs from 'fs';
import path from 'path';
import db from './models';
import { uploadFile, deleteFile } from './s3';

const router = new Router();

// make sure that we have the static directory available
(function buildStaticDirectory() {
  try { return fs.mkdirSync('static'); } catch (error) { return null; }
}());

const secret = 'not so secret';
function localStrategyVerify(username, password, done) {
  db.User.findAll({ where: { username } }).then(users => {
    if (users.length !== 1) return done(null, false);
    const user = users[0];

    return bcrypt.compare(password, user.password, (error, result) => {
      if (!result) return done(null, false);

      return done(null, jwt.encode({
        username: user.username,
        organizationId: user.organizationId,
      }, secret));
    });
  });
}
function bearerStrategyVerify(token, done) {
  try {
    return done(null, jwt.decode(token, secret));
  } catch (error) {
    return done(null, false);
  }
}

// eslint-disable-next-line
const logError = (error) => console.error(error);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

passport.use(new LocalStrategy(localStrategyVerify));
passport.use(new BearerStrategy(bearerStrategyVerify));
router.use(passport.initialize());

function loginHandler(request, response) {
  response.send({ token: request.user });
}

function loginStatusHandler(request, response) {
  response.json({ authenticated: true, user: request.user });
}

function createScreenHandler(request, response) {
  const { name, description, parentId } = request.body;
  const { xCoordinate, yCoordinate } = request.body;
  if (name == null || name.length === 0 || description == null) {
    response.status(400).send('Name and description are required.');
    return;
  }
  if (parentId == null && (xCoordinate != null || yCoordinate != null)) {
    response.status(400).send('x- and y-coordinates make no sense without a parentId.');
    return;
  }

  db.Screen.create({
    organizationId: request.user.organizationId,
    name,
    description,
    parentId,
    xCoordinate,
    yCoordinate,
  }).then(screen => (
    response.json(screen.serialized)
  )).catch(error => {
    logError(error);
    response.status(500).send('Error creating the screen.');
  });
}

function updateScreenHandler(request, response) {
  const { name, description, parentId } = request.body;
  const { xCoordinate, yCoordinate } = request.body;
  if (name == null || name.length === 0 || description == null) {
    response.status(400).send('Name and description are required.');
    return;
  }
  if (parentId == null && (xCoordinate != null || yCoordinate != null)) {
    response.status(400).send('x- and y-coordinates make no sense without a parentId.');
    return;
  }

  db.Screen.findById(request.params.id, {
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(screen => (
    screen.update({
      name,
      description,
      parentId,
      xCoordinate,
      yCoordinate,
    }).then(() => response.json(screen.serialized))
  )).catch(error => {
    logError(error);
    response.status(500).send('Error updating the screen.');
  });
}

function getScreensHandler(request, response) {
  db.Screen.findAll({
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(screens => {
    response.json(screens.map(screen => screen.serialized));
  }).catch(error => {
    logError(error);
    response.status(500).send('Error fetching screens.');
  });
}

function deleteScreenHandler(request, response) {
  db.Screen.findById(request.params.id, {
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(screen => {
    const serialized = screen.serialized;
    return screen.destroy().then(() => response.json(serialized));
  }).catch(error => {
    logError(error);
    response.status(500).send('Error deleting screens.');
  });
}

const imageFilter = (request, file, callback) => (
  callback(null,
    ['.png', '.gif', '.jpg', '.jpeg']
      .indexOf(path.extname(file.originalname) > -1))
);
const multerFolderUpload = multer({ dest: 'static/', fileFilter: imageFilter });
function createFolderHandler(request, response) {
  const { name, parentId } = request.body;
  if (name == null || name.length === 0) {
    response.status(400).send('Name is required.');
    return;
  }
  const mapUrl = request.file ? request.file.path : undefined;

  uploadFile(mapUrl, { ContentType: 'image/jpeg' }).then(mapKey => (
    db.Folder.create({
      organizationId: request.user.organizationId,
      name,
      parentId,
      mapKey,
    })
  )).then(folder => (
    folder.refreshSignedUrls().then(() => (
      response.json(folder.serialized)
    ))
  )).catch(error => {
    logError(error);
    response.status(500).send('Error creating the folder.');
  });
}

function getFoldersHandler(request, response) {
  db.Folder.findAll({
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(folders => (
    Promise.all(folders.map(folder => folder.refreshSignedUrls()))
  )).then(folders => (
    response.json(folders.map(folder => folder.serialized))
  )).catch(error => {
    logError(error);
    response.status(500).send('Error fetching folders.');
  });
}

function deleteFolderHandler(request, response) {
  db.Folder.findById(request.params.id, {
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(folder => {
    const serialized = folder.serialized;
    return deleteFile(folder.mapKey).then(() => (
      folder.destroy().then(() => (
        response.json(serialized)
      ))
    ));
  }).catch(error => {
    logError(error);
    response.status(500).send('Error deleting folders.');
  });
}

const pdfFilter = (request, file, callback) => (
  callback(null, path.extname(file.originalname) === '.pdf')
);
const multerPlayableUpload = multer({ dest: 'static/', fileFilter: pdfFilter });
function createPlayableHandler(request, response) {
  const { name, description, slideDuration } = request.body;
  if (
    name === undefined ||
    name.length === 0 ||
    description === undefined ||
    slideDuration === undefined ||
    request.file === undefined
  ) {
    response.status(400).send('Name, description, slideDuration, and a pdf file are required.');
    return;
  }

  const url = request.file.path;
  const pdfImage = new PDFImage(url);
  // this monkey patches in the extra convert options because pdf-image doesn't let you
  // choose the order of the options
  const size = 64;
  pdfImage.constructConvertOptions = () => (
    `-thumbnail ${size}x${size} -background white -alpha remove -background transparent` +
    ` -gravity center -extent ${size}x${size}`
  );
  pdfImage.convertPage(0).then(thumbnailUrl => (
    uploadFile(url, { ContentType: 'application/pdf' }).then(key => (
      uploadFile(thumbnailUrl, { ContentType: 'image/jpeg' }).then(thumbnailKey => (
        db.Playable.create({
          organizationId: request.user.organizationId,
          name,
          description,
          slideDuration: parseInt(slideDuration, 10),
          key,
          thumbnailKey,
        })
      ))
    ))
  )).then(playable => (
    playable.refreshSignedUrls().then(() => (
      response.json(playable.serialized)
    ))
  )).catch(error => {
    logError(error);
    response.status(500).send('Error creating the playable.');
  });
}

function getPlayableHandler(request, response) {
  db.Playable.findAll({
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(playables => (
    Promise.all(playables.map(playable => playable.refreshSignedUrls()))
  )).then(playables => (
    response.json(playables.map(playable => playable.serialized))
  )).catch(error => {
    logError(error);
    response.status(500).send('Error fetching playables.');
  });
}

function deletePlayableHandler(request, response) {
  db.Playable.findById(request.params.id, {
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(playable => {
    const serialized = playable.serialized;
    return deleteFile(playable.key).then(() => (
      deleteFile(playable.thumbnailKey)
    )).then(() => (
      playable.destroy().then(() => {
        response.json(serialized);
      })
    ));
  }).catch(error => {
    logError(error);
    response.status(500).send('Error deleting playable.');
  });
}

function getScreensPlayablesHandler(request, response) {
  db.Screen.findAll({
    include: [{
      model: db.Playable,
      as: 'playables',
      though: 'screens_playables',
    }],
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(screens => {
    const screensPlayables = [];
    screens.forEach(screen => screen.playables.forEach(playable => (
      screensPlayables.push({ screenId: screen.id, playableId: playable.id })
    )));
    response.json(screensPlayables);
  }).catch(error => {
    logError(error);
    response.status(500).send('Error getting screens_playables.');
  });
}

function postScreensPlayablesHandler(request, response) {
  const { screenId, playableId } = request.body;
  db.Screen.findById(screenId, {
    include: [{
      model: db.Playable,
      as: 'playables',
      through: 'screens_playables',
    }],
    where: {
      organizationId: request.user.organizationId,
    },
  }).then(screen => (
    db.Playable.findById(playableId, {
      where: {
        organizationId: request.user.organizationId,
      },
    }).then(playable => {
      if (screen == null || playable == null) {
        return response.status(400).send('Invalid screenId or playableId.');
      }
      const existingAssociations = screen.playables.filter(p => p.id === playableId);
      if (existingAssociations.length > 0) {
        return response.status(409).send('There is already an existing association.');
      }

      screen.addPlayable(playable);
      return screen.save().then(() => (
        response.json({ screenId, playableId })
      ));
    })
  )).catch(error => {
    logError(error);
    response.status(500).send('Error setting playing.');
  });
}

function updateScreensPlayablesHandler(request, response) {
  const screenIds = request.body.screenIds || [];
  const addPlayableIds = request.body.addPlayableIds || [];
  const removePlayableIds = request.body.removePlayableIds || [];

  Promise.all(addPlayableIds.map(playableId => (
    db.Playable.findById(playableId, {
      where: {
        organizationId: request.user.organizationId,
      },
    })
  )))
  .then(addPlayables => (
    Promise.all(screenIds.map(screenId =>
      db.Screen.findById(screenId, {
        include: [{
          model: db.Playable,
          as: 'playables',
          through: 'screens_playables',
        }],
        where: {
          organizationId: request.user.organizationId,
        },
      }).then(screen => {
        // first we remove the old playable
        const replacementPlayables = screen.playables.filter(playable => (
          removePlayableIds.indexOf(playable.id) === -1
        ));
        // now add any that need to be added
        addPlayables.forEach(playable => {
          if (replacementPlayables.filter(p => p.id === playable.id).length === 0) {
            replacementPlayables.push(playable);
          }
        });

        screen.setPlayables(replacementPlayables);
        return screen.save();
      })
    ))
  )).then(() => (
    response.json({ screenIds, addPlayableIds, removePlayableIds })
  )).catch(error => {
    logError(error);
    response.status(500).send('Error updating screens playables, likely invalid ids.');
  });
}


// simple endpoint to check that responses can be served
router.get('/ping', (request, response) => {
  response.send('pong');
});

// actual endpoints
router.post('/login',
  passport.authenticate('local', { session: false }),
  loginHandler);

router.get('/login_status',
  passport.authenticate('bearer', { session: false }),
  loginStatusHandler);

router.post('/screens',
  passport.authenticate('bearer', { session: false }),
  createScreenHandler);

router.put('/screens/:id',
  passport.authenticate('bearer', { session: false }),
  updateScreenHandler);

router.get('/screens',
  passport.authenticate('bearer', { session: false }),
  getScreensHandler);

router.delete('/screens/:id',
  passport.authenticate('bearer', { session: false }),
  deleteScreenHandler);

router.post('/folders',
  passport.authenticate('bearer', { session: false }),
  multerFolderUpload.single('file'),
  createFolderHandler);

router.get('/folders',
  passport.authenticate('bearer', { session: false }),
  getFoldersHandler);

router.delete('/folders/:id',
  passport.authenticate('bearer', { session: false }),
  deleteFolderHandler);

router.post('/playables',
  passport.authenticate('bearer', { session: false }),
  multerPlayableUpload.single('file'),
  createPlayableHandler);

router.get('/playables',
  passport.authenticate('bearer', { session: false }),
  getPlayableHandler);

router.delete('/playables/:id',
  passport.authenticate('bearer', { session: false }),
  deletePlayableHandler);

router.get('/screens_playables',
  passport.authenticate('bearer', { session: false }),
  getScreensPlayablesHandler);

router.post('/screens_playables',
  passport.authenticate('bearer', { session: false }),
  postScreensPlayablesHandler);

router.post('/actions/update_screens_playables',
  passport.authenticate('bearer', { session: false }),
  updateScreensPlayablesHandler);

export default router;
