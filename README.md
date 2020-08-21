# Stay At Home

Web application designed during COVID-19 escalation for sharing indoor activities. Developed in two-person team with JIRA and Scrum. My responsibilites: frontend design, implementation, facebook API integration, backend API integration including token storage and websocket integration. This app was hosted on Heroku for 1 week and we got 80 users in total and maximum peak of 40 users logged in at the same time.  
Tech Stack: HTML5, CSS3, React, React Router, Context API, Hooks, styled-components, flexbox, react-bootstrap, JSON Web Token, WebSocket.  
  
**LIVE demo:** https://stayathome.filipogonowski.pl/

## Installation
1. Install npm modules by "npm install" both on /backend and /frontend folder.
2. Additionaly you can configure your own MongoDB database and configure it by providing your own DB_PATH variable in .env file.
3. Run "npm start" on /backend directory.
4. Run "npm start" on /frontend directory. You might need to run "set HTTPS=true&&npm start" instead if issues with facebook login occurs.

## Project structure
/backend/index.js - cors policy and socket configuration  
/backend/startup - database and routes configuration  
/backend/models - database models configuration  
/backend/routes - main API endpoints  
/backend/middleware - middleware token verification  
/backend/common - helper functions  
  
/frontend/src/App.js - main routes configuration, Context API definition  
/frontend/src/components - components separated for possible reusability  
/frontend/src/contants - server URL configuration  
/frontend/src/context - context creation  
/frontend/src/screens - components responsible for individual pages  