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
                res.json(data);
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
            console.log(data);
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
                console.log(data);
                return res.json(data);
            }
        });
});

module.exports = router;