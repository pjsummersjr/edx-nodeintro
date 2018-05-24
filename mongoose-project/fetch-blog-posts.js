const config = require('./config.js')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect(config.databaseUrl + '/' + config.databaseName, {useMongoClient: true})

const Post = mongoose.model('Post',
    {
        name: String,
        url: String,
        text: String,
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
    }
)

const Comment = mongoose.model('Comment', {
    text: String
})

let ca = [{text: 'Cruel…..var { house, mouse} = No type optimization at all'},
  {text: 'I think you’re undervaluing the benefit of ‘let’ and ‘const’.'},
  {text: '(p1,p2)=>{ … } ,i understand this ,thank you !'}
].map((comment) => {
    const c = new Comment(comment)
    c.save()
    return c._id
})

console.log(ca)

var post = new Post({
    name: 'Top 10 ES6 Features every Web Developer must know',
    url: 'https://webapplog.com/es6',
    text: 'This essay will give you a quick introduction to ES6. If you don’t know what is ES6, it’s a new JavaScript implementation.',
    comments: ca
})

post.save(function (err) {
    if(err) console.log(err)
    else {
        console.log('The post was saved:\n', post.toJSON())
        console.log('*****************************************')
        Post.findOne({name: /Top 10 ES6/i})
            .populate('comments')
            .exec(function (error, result) {
                if(error) console.log('Error retrieving the post')
                else {
                    console.log(`Here be your post: ${result}`)
                    mongoose.disconnect()
                }
            })
    } 
})
