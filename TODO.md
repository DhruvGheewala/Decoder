# Frontend

- More Functions in IDE, make chnages in UI
- start work on blogs

# Backend

- complete compile-run in backend


# Flow
```
3 database
1. user
2. blog
3. code

- /profile/username

1. user {
    name (unique)
    email
    password
    info (small description, we can display in profile page)
}

- /blog/list
- /blog/create
- /blog/view/:_id
- /blog/edit/:_id

2. blog {
    title
    description
    content
    author
    published date
    votes (number)
    _id (unique id by mongodb)
}

- /ide
- /ide/view/:_id
- /ide/list

3. code {
    code
    input
    output
    author
    _id (unique id by mongodb)
}
```