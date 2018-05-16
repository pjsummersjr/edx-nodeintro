var express = require('express')
const random = require('random-js')
const posts = require('../data/post-store.js')
var comments = express.Router({mergeParams: true})


comments.use((req, res, next) => {
    //Router middleware. Does nothing right now but want to capture the syntax
    next()
})

comments.get('/', (req, res) => {
    posts.forEach((val, i) => {
        let postIndex = null
        if(val.id == req.params.postId){
            postIndex = i
        }
    })
    if(postIndex == null){
        res.status(500).send({msg:'Invalid post id'})
    }
    else {
        res.status(200).send(posts[postIndex].comments)
    }
})

// /posts/:postId/comments
comments.post('/', (req, res) => {
    let postIndex = null
    posts.forEach((val, i) => {
        if(val.id == req.params.postId){
            let comment = req.body
            comment.id = random.integer(0,100000)(random.engines.nativeMath)
            posts[i].comments.push(comment)
            postIndex = i
        }     
    })
    res.status(200).send(posts[postIndex])
})

module.exports = comments