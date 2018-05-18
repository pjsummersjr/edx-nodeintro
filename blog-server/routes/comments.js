var express = require('express')
const random = require('random-js')
const posts = require('../store/post-store.js')
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

comments.put('/:commentId', (req, res) => {
    let postIndex = null
    posts.forEach((val, i) => {
        if(val.id == req.params.postId){
            let commentIndex = null
            let cId = req.params.commentId
            posts[i].comments.forEach((cVal, cI) => {
                if(cVal.id == cId) {
                    let comment = req.body
                    comment.id = cId
                    posts[i].comments[cI] = comment                    
                }
            })
        }
    })
    res.status(200).send(req.params.commentId)
})

comments.delete('/:commentId', (req, res) => {
    posts.forEach((val, i) => {
        if(val.id == req.params.postId){
            posts[i].comments.forEach((cVal, cI) => {
                if(cVal.id == req.params.commentId){
                    posts[i].comments.splice(cI,1)
                }
            })
        }
    })
    res.status(200).send(req.params.commentId)
})

module.exports = comments