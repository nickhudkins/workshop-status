import express from 'express';
import SocketIO from 'socket.io';
import { Server as HTTPServer } from 'http';
import session from 'express-session';
import mustache from 'mustache-express';
import bodyParser from 'body-parser';
import {
  sequelize,
  models
} from './db';
import {
  useAuth,
  ensureAdmin,
  ensureAuthenticated
} from './auth/middleware';
import useWebSocket from './ws';

function initializeApp() {
  const app = express();
  const http = HTTPServer(app);
  const io = SocketIO(http);
  const { SECRET, PORT = 3000 } = process.env;

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())
  useAuth(app, io);

  app.engine('mustache', mustache())
  app.set('view engine', 'mustache');
  app.set('views', __dirname + '/views');
  app.get('/', ensureAuthenticated, (req, res) => res.render('index', { fullName: req.user.fullName }));

  app.get('/workshops/:slug/status', ensureAdmin, (req, res) => {
    const { slug } = req.params;
    models.workshop.findOne({
      where: {
        slug,
      }
    }).then(workshop => {
      if (!workshop) {
        res.status(404).send('Not Found.')
        return;
      };
      models.workshopstatus.findAll({
        where: {
          workshopId: workshop.id
        },
        include: [{
          model: models.user,
        }]
      }).then(statuses => {
        res.render('dashboard', {
          fullName: req.user.fullName,
          class: workshop,
          statuses,
        })
      })
    })
  });

  app.get('/workshops/:slug', ensureAuthenticated, (req, res) => {
    const { slug } = req.params;
    models.workshop.findOne({
      where: {
        slug,
      }
    }).then(workshop => {
      if (!workshop) {
        res.status(404).send('Not Found.');
        return;
      }
      res.render('class', {
        fullName: req.user.fullName,
        class: workshop,
      })
    })
  });


  const adminWS = io.of('/adminUpdates');
  useWebSocket(io, adminWS);

  const server = http.listen(PORT, (err) => {
    if (!err) {
      const { address, port } = server.address();
      console.log(`Listening at http://${address}:${port}`);
    }
  })
}

sequelize
  .sync()
  .then(initializeApp)
  .catch((err) => console.error('DATABASE_CONNECTION_FAILURE', err));
