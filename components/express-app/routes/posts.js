const express = require('express')
const random = require('random-js')
const posts = require('../data/post-store.js')

var router = express.Router()

router.use((req, res, next) => {
    //Router middleware. Does nothing right now but want to captuer the syntax
    console.log(`${req.method}: ${req.url}`)
    next()
})

router.get('/', (req, res) => {
    res.status(201).send(posts)
})

router.get('/:postId', (req, res) => {
    posts.forEach((value, index) => {
        console.log(`${req.params.postId} == ${value.id}`)
        if(req.params.postId == value.id){
            res.status(201).send(value)
            return
        }
    })
    //res.status(500).send({msg: 'Error retrieving post. Post does not exist.'})
})

router.post('/', (req, res) => {
    
    let post = req.body
    post.id = random.integer(0,100000)(random.engines.nativeMath)
    post.comments = []
    posts.push(post)
    res.status(201).send({id:post.id})
})

router.put('/:postId', (req, res) => {
    let post = req.body
    post.id = req.params.postId
    posts.forEach((value, index) => {
        if(value.id == post.id){
            posts[index] = post   
        }
    })
    res.status(201).send(post)
})

router.delete('/:postId', (req, res) => {
    let postId = req.params.postId
    posts.forEach((value) => {
        if(value.id == postId){
            posts[id] = null
        }
    })
    res.sendStatus(201)
})


module.exports = router