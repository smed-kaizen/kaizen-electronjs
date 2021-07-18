// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const Op = Sequelize.Op;
const { BadRequest } = require('@feathersjs/errors');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tasks = sequelizeClient.define('tasks', {
    title: {
      type: DataTypes.CITEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title should not be empty'
        }
      }
    },
    doneAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: ['easy',  'medium', 'hard'],
          msg: 'The difficulty should be either easy, medium or hard'
        }
      },
      defaultValue: 'easy'
    }

  }, {
    hooks: {
      beforeCount(options){
        options.raw = true;
      },
      async beforeSave(instance, options) {
        instance.title = instance.title.trim();
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();
        const sameTitleExists = await tasks.findAll({
          where: {
            createdAt: {
              [Op.gte]: TODAY_START,
              [Op.lte]: NOW
            },
            title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', instance.title)
          }});
        if (sameTitleExists.length > 0) {
          throw new BadRequest('You already have a task with this name for today');
        }
      },
      beforeUpdate(instance, options){
        return this.beforeSave(instance, options);
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  tasks.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return tasks;
};
