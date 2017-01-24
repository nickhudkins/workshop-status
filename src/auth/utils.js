import { models } from '../db';

function oauthCallback(accessToken, refreshToken, profile, cb) {
  models.user.findOrCreate({
    where: {
      oauthID: profile.id,
    }
  }).then(([user]) => (
    user.update({
      fullName: profile.displayName,
      avatarURL: profile._json.avatar_url,
    }).then(() => user)
  )).then(user => cb(null, user))
}

export {
  oauthCallback
}
