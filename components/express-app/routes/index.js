const express = require('express')
const posts = require('./posts.js')
const comments = require('./comments.js')


posts.use('/:postId/comments', comments)


module.exports = posts
