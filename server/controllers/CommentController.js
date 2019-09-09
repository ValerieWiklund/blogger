
import express from 'express'
import CommentService from "../services/CommentService"
import { Authorize } from "../middleware/authorize.js"

let _cs = new CommentService().repository

export default class CommentController {

  constructor() {
    this.router = express.Router()
      .get('', this.getAll)
      .use(Authorize.authenticated)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }

  async getAll(req, res, next) {
    try {
      let data = await _cs.find({}).populate("author", "name")
      return res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      req.body.author = req.session.uid
      let data = await _cs.create(req.body)
      res.send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await _cs.findOneAndUpdate({ _id: req.params.id, author: req.session.uid }, req.body, { new: true }).populate("author", "name")
      if (data) {
        return res.send(data)
      }
      throw new Error("Invalid Id")
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      let data = await _cs.findOneAndRemove({ _id: req.params.id, author: req.session.uid })
      if (!data) {
        throw new Error("Invalid Id")
      }
      res.send("Comment deleted")
    } catch (error) { next(error) }

  }

























}