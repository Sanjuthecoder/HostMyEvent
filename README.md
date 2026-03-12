# HostMyEvent 📅

HostMyEvent is a premium, full-stack event management platform designed to make hosting and discovering events effortless. Whether you're an organizer looking to publish a sports tournament or an attendee searching for the next big tech meetup, HostMyEvent provides a seamless, secure, and engaging experience.

## ✨ Key Features

- **Role-Based Access Control**: Secure navigation for Admins (system oversight), Organizers (event management), and Attendees (registration).
- **Dynamic Event Discovery**: Browse events with advanced search and category filtering.
- **Interactive Event Pages**: Detailed views with multimedia (image/video) support.
- **Real-Time Engagement**: Like and share events to boost visibility.
- **Seamless Enrollment**: Easy registration for events with automatic redirect to your intended page after login.
- **Robust Security**: JWT-based authentication with role-based permission enforcement on both frontend and backend.
- **Organizer Dashboard**: Effortless multi-step event creation with media uploads via Pinata (IPFS).

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x (Java)
- **Security**: Spring Security + JWT
- **Database**: MySQL (Optimized for TiDB Cloud)
- **File Storage**: Pinata (IPFS) for decentralized media storage
- **Email**: SMTP integration for OTP-based verification

### Frontend
- **Library**: React 18+ with TypeScript
- **Styling**: Tailwind CSS for a premium, responsive UI
- **Icons**: Lucide React
- **API Client**: Axios with custom interceptors for auth handling

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL Database

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/HostMyEvent.git
   cd HostMyEvent
   ```

2. **Backend Configuration**:
   - Navigate to `hostmyevent-backend`.
   - Create a `.env` file based on `.env.example`.
   - Run the service: `./mvnw spring-boot:run`

3. **Frontend Configuration**:
   - Navigate to `hostmyevent-frontend`.
   - Install dependencies: `npm install`
   - Create a `.env` file with `VITE_API_BASE_URL=http://localhost:8080`.
   - Start the dev server: `npm run dev`

## 📄 License
This project is licensed under the MIT License.
