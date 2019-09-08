import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({

})

export default class CommentService {
  get repository() {
    return mongoose.model('Comment', _model)
  }
}