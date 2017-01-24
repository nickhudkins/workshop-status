export default (sq, { STRING }) => {
  const WorkshopStatus = sq.define('workshopstatus', {
    name: {
      type: STRING,
    },
  }, {
    freezeTableName: true,
    classMethods: {
      associate: (models) => {
        WorkshopStatus.belongsTo(models.workshop);
        WorkshopStatus.belongsTo(models.user);
      }
    }
  });
  return WorkshopStatus;
};
