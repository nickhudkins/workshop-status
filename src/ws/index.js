import { models } from '../db';

function receiveStatus({ user, status, slug, adminWS }) {

  models.workshop.findOne({
    where: {
      slug,
    }
  }).then(w => (
    models.workshopstatus.findOrCreate({
      where: {
        userId: user.id,
        workshopId: w.id
      }
    })
  )).then(([ statusObj ]) => (
    statusObj.update({
      name: status,
    })
  )).then(() => {
    adminWS.emit('statusUpdate', {
      oauthID: user.oauthID,
      fullName: user.fullName,
      avatarURL: user.avatarURL,
      slug,
      status,
    });
  });
}

export default (io, adminWS) => {
  adminWS.use((socket, next) => {
    const { isAdmin } = socket.request.user;
    if (isAdmin) return next();
    next(new Error('AUTH_ERROR'));

  })
  io.on('connection', (socket) => {
    const { user } = socket.request;
    socket.on('status', ({ status, slug }) => receiveStatus({ user, status, slug, adminWS }))
  })
  io.on('disconnect', (socket) => {
    console.log('DISCONNECTED', socket.id);
  })
}
