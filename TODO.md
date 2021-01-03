# Frontend

- start work on blogs

- add IDE functionality
  - share code
  - user setting

- dhiraj
  - ide/view/:id, frontend
  - ide/view/list, frontend
  - profile/:user, frontend

# Backend

- create database

- Dhruv
  - create api for code sharing,
    - url: */api/code/view/:id
    - data: { author: currentUserName, visibility: public/private }

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
    setting {
        mode, theme, code
    }
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
    theme
    visibility = public / private
    _id (unique id by mongodb)
}
```

### frontend

=> User not logged in
- /ide => compiler
- /code/recent => show all public codes
- /profile/:user => show user profile which show all public codes, blogs and other info

=> user logged in
user can create, delete, update code, blog
- /profile/:user if this is same user as :user we have to display all public, private codes, blogs
    so create api accordingly
- /ide/edit/:id => edit code => backend /api/code/view/:id