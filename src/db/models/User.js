export default (sq, { STRING, BOOLEAN }) => {
  const User = sq.define('user', {
    oauthID: {
      type: STRING,
    },
    fullName: {
      type: STRING,
    },
    avatarURL: {
      type: STRING,
    },
    isAdmin: {
      type: BOOLEAN
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        User.belongsToMany(models.workshop, { through: 'workshop_student' })
      }
    }
  });
  return User;
};
