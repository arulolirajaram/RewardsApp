# Customer Rewards Points Calculator (Full-Stack)

<p align="center">
  <img src="https://img.shields.io/badge/built%20with-React-61DAFB?logo=react" alt="Built with React">
  <img src="https://img.shields.io/badge/backend-Node.js-339933?logo=nodedotjs" alt="Backend with Node.js">
  <img src="https://img.shields.io/badge/database-MySQL-4479A1?logo=mysql" alt="Database with MySQL">
  <img src="https://img.shields.io/badge/license-ISC-blue.svg" alt="License">
</p>

A full-stack React and Node.js application for calculating and tracking customer reward points. The React frontend consumes a Node.js API to perform CRUD (Create, Read, Update, Delete) operations on a MySQL database.



---

## 📋 Table of Contents

- [Features](#-features)
- [Reward Calculation Logic](#-reward-calculation-logic)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)

---

## ✨ Features

* *View Customers:* Displays a list of all customers and their transactions from the database.
* *Dynamic Reward Calculation:* Automatically calculates reward points for each transaction.
* *Full CRUD Operations:* Users can *Add, **Edit, or **Delete* any transaction, with changes persisted in the MySQL database.
* *Filtering:* Filter transactions by *Month* and *Year* to see rewards for specific periods.
* *Total Rewards:* Calculates and displays the total reward points for the filtered set of transactions.

---

## 🧮 Reward Calculation Logic

The core business logic for calculating points is defined in src/utils/calculateRewards.js. Points are awarded as follows:

* *2 points* for every dollar spent over $100 in a single transaction.
* *1 point* for every dollar spent between $50 and $100 in a single transaction.

*Example:*
* A *$120* transaction earns *90 points*:
    * (2 points * ($120 - $100)) = 40 points
    * (1 point * ($100 - $50)) = 50 points
* A *$75* transaction earns *25 points*:
    * (1 point * ($75 - $50)) = 25 points
* A *$50* transaction earns *0 points*.

---

## 🛠 Tech Stack

* *Frontend:* [React](https://reactjs.org/) (using functional components and Hooks)
* *Backend:* [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
* *Database:* [MySQL](https://www.mysql.com/)
* *Development:* [Create React App](https://create-react-app.dev/)
* *Styling:* Plain CSS (App.css and component-specific styles)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You must have the following software installed on your computer:

1.  *Node.js:*
    * You can download and install Node.js (which includes npm) from the [official Node.js website](https://nodejs.org/).

2.  *MySQL Server:*
    * You need a running MySQL server. You can install it from the [official MySQL Community Server downloads page](https://dev.mysql.com/downloads/mysql/).

### Installation

1.  *Clone the repository:*
    bash
    git clone [https://github.com/arulolirajaram/RewardsApp.git](https://github.com/arulolirajaram/RewardsApp.git)
    
2.  *Navigate to the project directory:*
    bash
    cd RewardsApp
    
3.  *Install dependencies:*
    This command will install all dependencies for both the React app and the Node.js server.
    bash
    npm install
    
4.  *Backend & Database Setup:*
    * Create a .env file in the root of the project. You can copy the .env.example file if one exists.
        bash
        cp .env.example .env
        
    * Edit the .env file with your MySQL database credentials:
        ini
        DB_HOST=localhost
        DB_USER=your_mysql_username
        DB_PASS=your_mysql_password
        DB_NAME=rewards_app_db
        
    * Create the database (rewards_app_db) in your MySQL server.
    * Import the database schema. (You may need to run a .sql file or a migration command).
        bash
        # Example: mysql -u your_username -p rewards_app_db < schema.sql
        

### Running the Application

Once everything is installed and configured, you can start the application with a single command:

```bash
npm start
