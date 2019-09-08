import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
  title: { type: String, maxlength: 60, required: true },
  summary: { type: String, maxlength: 120 },
  imgURL: { type: String },
  body: { type: String, required: true },
  creatorId: { type: ObjectId, ref: 'User', required: true }
}, { timestamps: true })

export default class BlogService {
  get repository() {
    return mongoose.model('blog', _model)
  }
} 