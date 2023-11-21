# ChainSeeker app

## Project Description

ChainSeeker is my first ever full-stack web development project, dedicated to creating a utility app tailored for disc golf enthusiasts. As an avid disc golfer myself, I developed this application to meet the unique needs of the disc golf community.

### Key Features:

- **Score Tracking System:** Effortlessly record and monitor your disc golf rounds.

- **Create Friend Profiles:** You can create friend profiles inside the app so that you can play together and keep track of everyone's scores.

- **Performance Statistics:** Track and review your performance and see how well you are doing against your friends.

- **Mobile-First Design:** This project was created using a mobile-first approach as the app lends itself to be used typically on the fairway.

- **Responsive Design:** Enjoy the app seamlessly on various devices, making it your go-to companion during disc golf adventures.

- **Technological Showcase:** ChainSeeker showcases my proficiency in full-stack development, incorporating express, nodeJS, Vite, React, Lottie, MongoDB, and Mongo Atlas.

This project is more than just a showcase of my skills; it's a passion project born out of my love for disc golf. ChainSeeker was crafted with the goal of enhancing the disc golf experience, initially for my personal use and that of a few friends. See you on the fairway!

## Table of Contents

- [Project Title](#chainseeker-app)
- [Project Description](#project-description)
- [Table of Contents](#table-of-contents)
- [Live Demo](#demo)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Features](#features)
- [Attribution](#attribution)
- [Contact](#contact)

## Demo

If you'd like to explore the app, you can do so by visiting this link here.

Feel free to create your own account by using an email and password,
or you can use the sample account credentials:

username: Mateo
password: Password123!

## Screenshots

### Homepage

<img src="/client/src/assets/images/phone_newround.png" alt="Homepage" width="500" />

### Dashboard

<img src="/client/src/assets/images/phone_dashboard.png" alt="Dashboard" width="500" />

### Scorecard

<img src="/client/src/assets/images/phone_scorecard.png" alt="Scorecard" width="500" />

### My Stats

<img src="/client/src/assets/images/phone_my_stats.png" alt="My Stats" width="500" />

### Friend List

<img src="/client/src/assets/images/phone_friends.png" alt="Friend List" width="500" />

### Courses

<img src="/client/src/assets/images/phone_courses.png" alt="Courses" width="500" />

### Responsive Design

<img src="/client/src/assets/images/responsive-design.gif" alt="Responsive Design"/>

## Installation

### Preqrequisites

- Ensure you have Node.js and npm installed on your machine.
- You need a MongoDB Atlas account for database connectivity.

### Cloning the repository

1. Clone the repository: `git clone https://github.com/itsdavehimself/disc-golf-scorecard-app.git`

2. Navigate to the project directory: `cd disc-golf-scorecard-app`

### Server Setup

3. Navigate to the server directory and install dependencies: `cd server && npm install`

4. Create a .env file `touch .env`

5. Inside the .env file, create a port variable: `PORT=8080`

6. Next create a URI variable for the MongoDB database: `URI='mongodb+srv://your_username:your_password@cluster0.gnnj1tx.mongodb.net/your_database?retryWrites=true&w=majority&appName=AtlasApp'`

Be sure to replace 'your_username', 'your_password', and 'your_database' with your actualy MongoDB credentials.

7. Lastly, create a SECRET variable used for authenticating logins. It can be any random string of letters, numbers, and symbols, for example: `SECRET='#9XhZ@oD5TjLbN*wR$Gy8p2z!Q6AqFs7UvHc1rKmV'`

8. Navigate back to the parent directory `cd ..`

### Client Setup

9. Navigate to the client directory and install dependencies: `cd client && npm install`

10. Again, create another .env file `touch .env`

11. Inside the .env file, create an API url variable: `VITE_API_BASE_URL=http://localhost:8080/api`

### Starting the App

12. While inside the client directory, you can start the client by running the following code: `npm run dev`

13. In a new terminal, navigate to the server folder `cd server`

14. Start the server `npm run dev`

## Usage

1. Open your browser and navigate to http://localhost:5173

2. You will need to create an account to login if you are running the app locally.

3. When logged in, you will be taken to the dashboard where you can explore the different features. I suggest creating a few scorecards and friends, so that you will get to explore the statistics pages for yourself and the friend profiles.

## Technologies

### Frontend

- React.js
- Tailwind CSS
- Lottie
- Chart.js
- Vite

### Backend

- Express.js
- Node.js

### Database

- MongoDB

### Development Tools

- npm
- Git
- GitHub
- Visual Studio Code
- ESLint
- Prettier

## Features

- User authentication with JWT
- Responsive design for various screen sizes
- CRUD operations for managing user data
- Salting and hashing for encryption of password data

## License

This project is licensed under the [MIT License](LICENSE).

## Attribution

The photos used in this app are sourced from the following photographers. I appreciate their creative work and contributions.

1. [Joshua Choate](https://pixabay.com/users/jatocreate-5529266/)
2. [24173760](https://pixabay.com/users/24173760-24173760/)
3. [Andreas Thöne](https://pixabay.com/users/crosslap-8204922/)
4. [jrbotkin777](https://pixabay.com/users/jrbotkin777-20842270/)
5. [27707](https://pixabay.com/users/27707-27707/)
6. [Ted Johnsson](https://unsplash.com/@ted_johnsson)
7. [Kevin B](https://www.pexels.com/@captainb/)

All photos are used in accordance with their respective licenses.

## Contact

Email: davidsmolen@gmail.com
