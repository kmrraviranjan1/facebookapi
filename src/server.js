const express = require('express');
const cors = require('cors')
const connect = require('./configs/db')

const postController = require('./controller/post.controller')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/posts',postController)
app.listen(2345, async ()=>{
    await connect()
    console.log('listening on port 2345')
})
