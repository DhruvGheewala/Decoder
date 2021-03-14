const mongoose = require('mongoose');

function dateFormat() {
    let months = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];
    let d = new Date();
    let day = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

const BlogSchema = new mongoose.Schema({
    title: {
        type: String
    },
    author: {
        type: String
    },
    description: {
        type: String
    },
    published: {
        type: String,
        default: dateFormat
        // type: Date,
        // default: Date.now
    },
    content: {
        type: String
    },
    comments: {
        type: Array,
        default: []
    }
}, {
    collection: 'blogs'
});

module.exports = mongoose.model('blog', BlogSchema);