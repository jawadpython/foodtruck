# Food Trucks Marketplace - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-truck-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Authentication
   NEXT_PUBLIC_ADMIN_EMAIL=admin@foodtrucks.ma
   NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
   JWT_SECRET=your-super-secret-jwt-key

   # Firebase Configuration (Optional)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

   # Email Configuration (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@foodtrucks.ma

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_COMPANY_NAME=Food Trucks Maroc
   NEXT_PUBLIC_COMPANY_EMAIL=contact@foodtrucks.ma
   NEXT_PUBLIC_COMPANY_PHONE=+212 5XX XXX XXX
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration Options

### Firebase Setup (Optional)
The app works with or without Firebase. If you want to use Firebase:

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (optional)
4. Copy your config values to `.env.local`

### Email Setup (Optional)
For production email sending, configure SMTP settings in `.env.local`.

## 📁 Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── admin/             # Admin dashboard pages
│   ├── marketplace/       # Public marketplace pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── Navbar.tsx        # Navigation
│   ├── Footer.tsx        # Footer
│   └── QuoteForm.tsx     # Quote request form
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication
│   └── ThemeContext.tsx  # Theme management
├── hooks/                # Custom hooks
│   └── useDataState.ts   # Data management hook
├── lib/                  # Utilities and services
│   ├── firebase.ts       # Firebase configuration
│   ├── dataService.ts    # Data service layer
│   ├── emailService.ts   # Email service
│   ├── validation.ts     # Form validation
│   └── errorHandler.ts   # Error handling
└── types/                # TypeScript type definitions
    └── index.ts          # Main types
```

## 🎯 Features

### ✅ Implemented
- **Authentication System**: Secure admin login with environment variables
- **Data Persistence**: Firebase Firestore integration with localStorage fallback
- **Form Validation**: Comprehensive client-side validation with French error messages
- **Email Service**: Contact form and quote request email handling
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Loading spinners and skeleton components
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Theme switching with persistence
- **Admin Dashboard**: Complete admin interface for managing:
  - Food trucks (CRUD operations)
  - Orders and quote requests
  - Contact messages
  - Settings
- **Public Marketplace**: Customer-facing pages with:
  - Food truck listings
  - Search and filtering
  - Quote request forms
  - Contact forms

### 🔄 Data Flow
1. **Forms** → **Validation** → **Data Service** → **Firebase/localStorage**
2. **Email Service** → **SMTP/Console logging**
3. **Error Handler** → **User-friendly messages**

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔒 Security Features

- Environment variable configuration
- Input validation and sanitization
- Error handling without sensitive data exposure
- Secure authentication flow
- CORS protection

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email contact@foodtrucks.ma or create an issue in the repository.

---

**Note**: This is a production-ready application with proper error handling, validation, and data persistence. The app gracefully falls back to localStorage when Firebase is not configured, making it easy to get started without external dependencies.
