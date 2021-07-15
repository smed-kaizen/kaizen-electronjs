// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import {Sequelize, DataTypes, Model, InstanceUpdateOptions, CreateOptions, Op} from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';
import { BadRequest } from '@feathersjs/errors'

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const tasks = sequelizeClient.define('tasks', {
    title: {
      type: DataTypes.CITEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Should not be empty'
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
        // @ts-ignore
        isIn: {
          args: ['easy',  'medium', 'hard'],
          msg: 'The difficulty should be either easy, medium or hard'
        }
      },
      defaultValue: 'easy'
    }

  }, {
    hooks: {
      beforeCount(options: any): HookReturn {
        options.raw = true;
      },
      async beforeSave(instance: any, options: any): Promise<void> {
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();
        const sameTitleExists = await tasks.findAll({
          where: {
            createdAt: {
              [Op.gte]: TODAY_START,
              [Op.lte]: NOW
            },
            title: instance.title
        }})
        if (sameTitleExists.length > 0) {
          throw new BadRequest('You already have a task with this name for today')
        }
      },
      beforeUpdate(instance: any, options: any): HookReturn {
        // @ts-ignore
        return this.beforeSave(instance, options)
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (tasks as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return tasks;
}
