import passport from 'passport';
import createGitubStrategy from './github';
import passportSocketIo from 'passport.socketio';
import session from 'express-session';
import _SequelizeStore from 'connect-session-sequelize';
import cookieParser from 'cookie-parser';
import { sequelize } from '../db';

const { GITHUB_CALLBACK_URL, SECRET } = process.env;
const SequelizeStore = _SequelizeStore(session.Store);
const sessionStore = new SequelizeStore({
  secret: SECRET,
  db: sequelize,
})
sessionStore.sync();

function useAuth(app, io) {
  app.use(cookieParser())
  app.use(session({
    store: sessionStore,
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 2419200000
    },
  }))
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(createGitubStrategy())
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  app.get('/auth/login', (req, res) => {
    res.send('<a href="/auth/github">Login</a>');
  });
  app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
  app.get(GITHUB_CALLBACK_URL , passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/')
    }
  );

  // Share Session with WebSocket!
  io.use(passportSocketIo.authorize({
    key: 'connect.sid',
    passport,
    cookieParser,
    store: sessionStore,
    secret: SECRET,
  }))
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  const redirect = `/auth/login`
  res.redirect(redirect);
}

function ensureAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) { return next(); }
  res.redirect('/auth/login');
}

export {
  useAuth,
  ensureAuthenticated,
  ensureAdmin
};
