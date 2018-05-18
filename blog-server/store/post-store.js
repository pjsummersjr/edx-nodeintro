const EventEmitter = require('events')

class BlogStore {
    

    constructor(){
        this.posts = []
    }

    getPosts(callback) {
        if(this.posts){
            callback(this.posts)
        }
        else {
            callback({msg: 'No posts available'}) 
        }        
    }

    addPost(post, callback){
        this.posts.push(post)
        callback(post.id)
    }

    getPost(id, callback) {

        let postIndex = this.posts.findIndex((value, index) => {return value.id == id})
        if(postIndex >= 0){
            callback(this.posts[postIndex])
        }
        else {
            callback({msg:`Post with id ${id} not found`})
        }
    }

    updatePost(id, post, callback){
        let postIndex = this.posts.findIndex((value, index) => { return value.id == id})
        if(postIndex >= 0){
            this.posts[postIndex] = post
            callback(post)
        }
        else {
            callback({msg:`Could not locate post with id ${id}. No changes applied.`})
        }
    }

    deletePost(id, callback){
        let postIndex = this.posts.findIndex((value, index) => { return value.id == id})
        if(postIndex >= 0){
            this.posts.splice(postIndex,1)
            callback()
        }
        else {
            callback({msg: `Could not locate post with id ${id}. No changes made.`})
        }
    }

/*     addComment(postId, comment){
        let index = null
        this.posts.forEach((value, i) => {
            if(value.id == postId){
                index = i
                break
            }
        })
        if(index){
            this.posts[index].comments.push(comment)
            this.emit('done', {postId:`${postId}`, comment: `${comment}`})
        }
        else {
            this.emit('error', `Could not locate post with id ${postId}. Comment not added.`)
        }
    } */


}

// let posts = []

module.exports = BlogStore