@ECHO OFF
ECHO running backend
start cmd /k "echo Backend && cd backend && nodemon index.js"
ECHO running frontend
start cmd /k "echo Frontend && cd frontend && ng serve -o"
