const express = require('express');
const router = express.Router();

const Blog = require('../models/blog.model');

router.get('/', (req, res) => {
    Blog.find((err, data) => {
        if (err) {
            return res.json("error !!");
        }
        else {
            res.json(data);
        }
    })
});

router.get('/get/user/:username', (req, res) => {
    Blog.find({
        author: req.params.username,
    },
        (err, data) => {
            if (err) {
                return res.json("error !!");
            }
            else {
                res.json(data);
            }
        });
});

router.post('/create', (req, res) => {
    console.log("create blog");
    Blog.create({
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        description: req.body.description,
        published: req.body.published
    },
        (err, data) => {
            if (err) {
                return res.json('error !!');
            }
            else {
                return res.json(data);
            }
        });
});

router.get('/get/:id', (req, res) => {
    console.log("get blog request");
    Blog.findById(req.params.id, (err, data) => {
        if (err) {
            return res.json("error !!");
        }
        else {
            return res.json(data);
        }
    });
});

router.put('/update/:id', (req, res) => {
    console.log("update blog");
    Blog.findOneAndUpdate({
        _id: req.params.id
    },
        {
            $set: {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
            }
        },
        (err, data) => {
            if (err) {
                return res.json("error !!");
            }
            else {
                return res.json(data);
            }
        });
});

router.delete('/delete/:id', (req, res) => {
    console.log("delete blog request");
    Blog.findOneAndDelete({
        _id: req.params.id,
    },
        (err, data) => {
            if (err) {
                return res.json({ _id: '-1' });
            }
            else {
                return res.json(data);
            }
        });
});

router.post('/add/comment/:blog_id', (req, res) => {
    console.log("add comment request");
    Blog.findOneAndUpdate({
        _id: req.params.blog_id
    },
        {
            $push: {
                comments: {
                    author: req.body.comment.author,
                    content: req.body.comment.content,
                    published: req.body.comment.published,
                    _id: new Date()
                }
            }
        },
        (err, data) => {
            if (err) {
                return res.json("error !!");
            }
            else {
                return res.json(data);
            }
        });
});

router.delete('/delete/comment/:blog_id/:comment_id', async (req, res) => {
    // console.log("delete comment request");
    // console.log("blog id:", req.params.blog_id);
    // console.log("comment id:", req.params.comment_id);
    try {
        const blog = await Blog.findById({
            _id: req.params.blog_id
        });
        blog.comments = blog.comments.filter((comment) => {
            return comment._id.toISOString() != req.params.comment_id.toString();
        });
        blog.markModified("comments");
        await blog.save();
        return res.json(blog);
    }
    catch(err) {
        console.log(err);
        return res.json({});
    }

    // Blog.findById({
    //     _id: req.params.blog_id
    // },
    //     (err, data) => {
    //         if (err) {
    //             return res.json("error !!");
    //         }
    //         else {
    //             console.log(data);
    //             data.comments.filter((comment) => {
    //                 // console.log(comment._id.toISOString());
    //                 // console.log(req.params.comment_id.toString());
    //                 // console.log(comment._id.toString() != req.params.comment_id.toString());
    //                 return comment._id.toISOString() != req.params.comment_id.toString();
    //             });
    //             data.save();
    //             return res.json(data);
    //         }
    //     });
});
module.exports = router;