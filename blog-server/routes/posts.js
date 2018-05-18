const express = require('express')
const random = require('random-js')
const postStore = require('../data/post-store.js')
var posts = new postStore()
var router = express.Router()

router.use((req, res, next) => {
    //Router middleware. Does nothing right now but want to captuer the syntax
    console.log(`${req.method}: ${req.url}`)
    next()
})

router.get('/', (req, res) => {
    posts.getPosts((data) => {
        res.status(201).send(data)
    })
})

router.get('/:postId', (req, res) => {
    posts.getPost(req.params.postId, (data) => {
        res.status(200).send(data)
    })
})

router.post('/', (req, res) => {
    //console.log(req.body)
    let post = req.body
    post.id = random.integer(0,100000)(random.engines.nativeMath)
    post.comments = []
    
    posts.addPost(post, (data) => {   
        console.log(data)     
        res.status(200).send({id:post.id})
    })  
})

router.put('/:postId', (req, res) => {
    let post = req.body
    post.id = req.params.postId
    posts.updatePost(post.id, post, (data) => {
        res.status(200).send(data)
    })
})

router.delete('/:postId', (req, res) => {
    let postId = req.params.postId
    posts.deletePost(postId, (e) => { 
        if(!e){
            res.sendStatus(200)
        }        
        else {
            res.status(500).send(e.msg)
        }
    })
})


module.exports = router