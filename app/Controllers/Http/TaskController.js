'use strict'

const Task = use('App/Models/Task')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ params, request }) {
    const { page } = request.get()

    const tasks = await Task.query()
      .where('project_id', params.projects_id)
      .with('user')
      .paginate(page)

    return tasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ params, request }) {
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])

    const task = await Task.create({ ...data, project_id: params.projects_id })

    return task
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const task = await Task.findOrFail(params.id)

    return task
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])
    const task = await Task.findOrFail(params.id)

    task.merge(data)

    await task.save()

    return task
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const task = await Task.findOrFail(params.id)

    await task.delete()
  }
}

module.exports = TaskController
