<a name="readme-top"></a>

<!-- PROJECT HEADER-->
<br />
<div align="center">
  <h1 align="center">
    Jobly Backend
  </h1>
</div>


## Built With


![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Nodejs](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)


<!-- GETTING STARTED -->
## Getting Started

## Installation

1. Clone the repo
   ```sh
   git clone git@github.com:shavinski/express-jobly.git
   ```
2. Install dependencies
   ```sh
   npm install 
   ```
3. Set up a database with dummy data (PSQL)
   ```sh
   psql
   CREATE DATABASE jobly;
   (ctrl+d or cmd+d) 
   GO TO PROJECT DIRECTORY AND RUN:
   psql -f jobly-schema.sql
   psql -f jobly-seed.sql
   ```
4. Start the local server
   ```sh
   node server.js
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Add filtering for companies
- [x] Add proper authorization to routes
    - [x] Authorization for companies
    - [x] Authorization for users
- [x] Add job models, routes, tests
- [ ] Add job application logic
- [ ] Add technology requirements for jobs
- [ ] Add technology skills for users 


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Email: shavinski.jakob@gmail.com

LinkedIn: https://www.linkedin.com/in/jakob-shavinski/

<p align="right">(<a href="#readme-top">back to top</a>)</p>
