# Decoder

- start work on blogs
- add IDE functionality
  - user setting

- dhiraj
  - view for code/list, my codes & all codes
  - directory structure
  - check the stdout codeEditor for error & stderr
- dhruv
  - api for code/list, folders and codes
  - refactor runner & code.*.js files
  - create folder.*.js
- kushal
  - complete authentication & autherization
  - email varification
  - password reset
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

### backend user authentication
1. User database(model) is created and under scrunity. 
2. User controller is under development.
3. util file is added for some utility (or you can say repetitive tasks). use this to create any utility.