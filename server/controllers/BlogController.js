import express from 'express'
import BlogService from '../services/BlogService'
import { Authorize } from '../middleware/authorize.js'


let _bs = new BlogService().repository


export default class BlogController {
  constructor() {
    this.router = express.Router()
      .get('', this.getAll)
      .get('/:id', this.getById)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)

  }

  async getAll(req, res, next) {
    try {
      let data = await _bs.find({})
      return res.send(data)
    } catch (error) { next(error) }
  }

  async getById(req, res, next) {
    try {
      let data = await _bs.findById(req.params.id)
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      req.body.creatorId = req.session.uid
      let data = await _bs.create(req.body)
      res.send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await _bs.findOneAndUpdate({ _id: req.params.id, creatorId: req.session.uid }, req.body, { new: true })
      if (data) {
        return res.send(data)
      }
      throw new Error("Invalid Id")
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      let data = await _bs.findOneAndRemove({ _id: req.params.id, creatorId: req.session.uid })
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send("Delete Blog Post")
    } catch (error) { next(error) }

  }










}