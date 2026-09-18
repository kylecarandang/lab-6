# Lab Activity No. 6: Cloud Integration (Firebase)
**CPSOFT30L – Software Design Laboratory**  
**National University - Fairview**  
**Instructor:** Engr. Benedict Zurbito  
**Student:** Kyle Carandang  

## Project Overview
This project implements user authentication and a user profile management system integrated with **Firebase Authentication** and **Firebase Realtime Database**.

### Features & Modules
- **Sign-Up Form (`sign-up/`)**: User registration with input validations (Philippine mobile, postal code, min-8 password, email format) and Firebase Auth account creation.
- **Login Screen (`login/`)**: Split-screen 50/50 responsive layout with show/hide password toggle and Firebase Authentication.
- **Main Dashboard (`mainDashboard/`)**: Protected route displaying metric cards, dynamic greeting, navigation, and logout functionality.
- **Profile Dashboard (`mainDashboard/profile_dashboard.html`)**: Complete profile management loading and writing personal, contact, and address details to Firebase Realtime Database (`users/{UID}/profile`).

## Tech Stack
- HTML5
- CSS3 (Responsive Grid & Flexbox)
- JavaScript (Modular ES SDK v12)
- Firebase Authentication (Email/Password)
- Firebase Realtime Database
