# Frontend

- More Functions in IDE, make chnages in UI
  - add buttons
    - download
    - generate Sharable Link
    - upload from file
    - compile and run
- start work on blogs

# Backend

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

- /blog/list?user=""
- /blog/create
- /blog/view/:_id
- /blog/edit/:_id

2. blog
{
    title
    description
    content
    author
    published date
    visibility = public / private
    votes (number)
    comments = [
        {
            p_id
            _id
            author
            comment
            date
        }
    ]
    _id (unique id by mongodb)
}

- /ide
- /ide/view/:_id
- /ide/list?user=""

3. code {
    code
    input
    output
    lang.
    author
    visibility = public / private
    _id (unique id by mongodb)
}
```
