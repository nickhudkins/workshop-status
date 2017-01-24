export default (sq, { STRING }) => {
  const Workshop = sq.define('workshop', {
    name: {
      type: STRING,
    },
    slug: {
      type: STRING,
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        Workshop.belongsToMany(models.user, { through: 'workshop_student' })
      }
    }
  });
  return Workshop;
};
