# SkyFleet Rentals - Drone Rental Web Application

A production-level web application for renting drones, featuring user management, drone listings with images, bookings, and an admin panel.

## 🚁 Features

### Frontend (React)
- **Modern UI/UX**: Professional design with Bootstrap and custom CSS
- **Responsive Design**: Mobile-first approach with responsive layouts
- **User Authentication**: Login/Register with JWT token management
- **Drone Catalog**: Browse, search, and filter available drones
- **Booking System**: Complete booking flow with date selection and pricing
- **User Dashboard**: Manage bookings, view history, and profile
- **Admin Panel**: Comprehensive admin dashboard for managing users, bookings, and drones
- **Real-time Updates**: Toast notifications and loading states
- **Image Gallery**: High-quality drone images with lazy loading

### Backend (Spring Boot)
- **RESTful APIs**: Complete CRUD operations for all entities
- **JWT Authentication**: Secure token-based authentication
- **Database Integration**: JPA/Hibernate with H2 and MySQL support
- **File Upload**: Image upload and management
- **Email Integration**: Booking confirmations and notifications
- **Security**: Role-based access control and input validation
- **Pagination**: Efficient data pagination for large datasets

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Bootstrap 5** - CSS framework
- **FontAwesome** - Icons
- **React Router** - Navigation
- **Axios** - HTTP client
- **Formik & Yup** - Form handling and validation
- **React Toastify** - Notifications

### Backend
- **Spring Boot 3.1** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **H2/MySQL** - Database
- **JWT** - Token-based authentication
- **Maven** - Build tool
- **Lombok** - Code generation

## 📁 Project Structure

```
skyfleet-rentals/
├── src/                          # React Frontend
│   ├── components/               # React components
│   │   ├── auth/                # Authentication components
│   │   ├── layout/              # Layout components
│   │   ├── pages/               # Page components
│   │   └── admin/               # Admin components
│   ├── context/                 # React context providers
│   ├── services/                # API services
│   ├── assets/                  # Static assets
│   └── index.js                 # App entry point
├── backend/                     # Spring Boot Backend
│   ├── src/main/java/          # Java source code
│   ├── src/main/resources/     # Configuration files
│   └── pom.xml                 # Maven configuration
├── public/                      # Public assets
├── package.json                 # Frontend dependencies
└── README.md                    # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Java 17 or higher
- Maven 3.6 or higher

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Access H2 Console** (Development)
   - URL: http://localhost:8080/h2-console
   - JDBC URL: jdbc:h2:mem:skyfleetdb
   - Username: sa
   - Password: password

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/me` - Get current user

### Drones
- `GET /api/drones` - Get all drones
- `GET /api/drones/{id}` - Get drone by ID
- `POST /api/drones` - Create drone (Admin)
- `PUT /api/drones/{id}` - Update drone (Admin)
- `DELETE /api/drones/{id}` - Delete drone (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Admin
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/bookings` - Get all bookings (Admin)
- `GET /api/admin/dashboard` - Dashboard statistics (Admin)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
REACT_APP_API_URL=http://localhost:8080

# Backend
JWT_SECRET=your-secret-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Database Configuration

For production, update `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/skyfleetdb
    username: your-username
    password: your-password
```

## 📱 Features Overview

### User Features
- **Browse Drones**: View available drones with images and details
- **Search & Filter**: Find drones by category, price, and availability
- **Booking Management**: Create, view, and cancel bookings
- **Profile Management**: Update personal information
- **Booking History**: View past and current bookings

### Admin Features
- **User Management**: View and manage user accounts
- **Booking Management**: Monitor and update booking statuses
- **Drone Management**: Add, edit, and remove drones
- **Dashboard Analytics**: View statistics and reports
- **System Monitoring**: Monitor application health

## 🎨 UI/UX Features

- **Modern Design**: Clean and professional interface
- **Responsive Layout**: Works on all device sizes
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback
- **Image Optimization**: Lazy loading and compression
- **Accessibility**: WCAG compliant design

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: User and admin roles
- **Input Validation**: Server-side validation
- **CORS Configuration**: Secure cross-origin requests
- **Password Hashing**: BCrypt password encryption
- **SQL Injection Prevention**: Parameterized queries

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Backend (Heroku/AWS)
1. Configure database connection
2. Set environment variables
3. Deploy using Maven buildpack

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@skyfleetrentals.com
- Documentation: [Wiki](https://github.com/your-repo/wiki)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- FontAwesome for icons
- Spring Boot team for the backend framework
- React team for the frontend library

---

**SkyFleet Rentals** - Experience the sky with premium drone rentals! 🚁✨ 