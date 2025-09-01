const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    category: { type: String, enum: ["Bug", "Feature", "Improvement"] },
    createdAt: { type: Date },

})

const FeedbackModel = mongoose.model("feedback", FeedbackSchema)
module.exports = FeedbackModel