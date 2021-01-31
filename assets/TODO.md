# Decoder

- try to make onload focus on code editor, exp: user can directly start writing code when he navigates to /ide(new)
- start work on blogs
- add IDE functionality
  - user setting

- dhiraj
  - view for code/list, my codes & all codes
  - directory structure
  - review frontend for login/register
  - animate login/register submit buttons
- dhruv
- kushal
  - password reset
  - alert message in login, register etc...
  - google auth

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
