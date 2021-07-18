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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
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
        const sameTitleExistsToday = await instance.titleExistsInSameDay()
        if (sameTitleExistsToday) {
          throw new BadRequest('You already have a task with this name for today');
        }
      },
      async beforeUpdate(instance, options){
        await this.beforeSave(instance, options);
      },
      async beforeBulkUpdate (args) {
        args.individualHooks = true
      }
    }
  });

  // eslint-disable-next-line no-unused-vars
  tasks.associate = function (models) {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  tasks.prototype.titleExistsInSameDay = async function () {
    const TASK_DAY_START = new Date(this.createdAt).setHours(0, 0, 0, 0);
    const TASK_DAY_END = new Date(TASK_DAY_START).setHours(23,59, 59, 999);
    const sameTitleExists = await tasks.findAll({
      where: {
        createdAt: {
          [Op.gte]: TASK_DAY_START,
          [Op.lte]: TASK_DAY_END
        },
        title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', this.title)
      }});

    return sameTitleExists.length > 0
  }

  return tasks;
};
