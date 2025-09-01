const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const FeedbackModel = require('./models/feedback')

const app = express()

let frontend_path = "http://localhost:5173"

app.use(cors({
    origin: frontend_path
}))

app.use(express.json())


mongoose.connect("mongodb+srv://nssharma2000:nama1234@feedback.vtbsa98.mongodb.net/Feedback?retryWrites=true&w=majority&appName=Feedback")
  .then(() => {
    console.log("Connected to MongoDB")
  })
.catch( (error) => {
  console.log(error)
})

app.post('/feedback', async (req, res) => {
    const { title, description, category } = req.body

    const newFeedback = new FeedbackModel({
        title: title,
        description: description,
        category: category,
        createdAt: new Date(),
    })

    try {
        await newFeedback.save()
        await res.json(newFeedback)
    }
    catch (err) {
        console.log(err)
        return res.json({ message: "Error saving feedback" })
    }
})

app.get('/feedback', async (req, res) => {
    try {
        const feedbacks = await FeedbackModel.find().lean()
        await res.json(feedbacks)
    }
    catch (err) {
        return res.error(500).json({ message: "Error fetching feedbacks." })
    }
})

app.listen(3001, () => {
  console.log("Server is running. ")
})  


