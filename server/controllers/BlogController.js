import express from 'express'
import BlogService from '../services/BlogService'
import { Authorize } from '../middleware/authorize.js'
import CommentService from '../services/CommentService'


let _bs = new BlogService().repository
let _cs = new CommentService().repository


export default class BlogController {
  constructor() {
    this.router = express.Router()
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/comments', this.getComments)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)

  }

  async getAll(req, res, next) {
    try {
      let data = await _bs.find({}).populate("author", "name")
      return res.send(data)
    } catch (error) { next(error) }
  }

  async getById(req, res, next) {
    try {
      let data = await _bs.findById(req.params.id).populate("author", "name")
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send(data)
    } catch (error) { next(error) }
  }

  async getComments(req, res, next) {
    try {
      let data = await _cs.find({ blogId: req.params.id }).populate('comment').populate('author', 'name')
      return res.send(data)
    } catch (error) { next(error) }
  }
  async create(req, res, next) {
    try {
      req.body.author = req.session.uid
      let data = await _bs.create(req.body)
      res.send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await _bs.findOneAndUpdate({ _id: req.params.id, author: req.session.uid }, req.body, { new: true }).populate('author', 'name')
      if (data) {
        return res.send(data)
      }
      throw new Error("Invalid Id")
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      let data = await _bs.findOneAndRemove({ _id: req.params.id, author: req.session.uid })
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send("Delete Blog Post")
    } catch (error) { next(error) }

  }










}