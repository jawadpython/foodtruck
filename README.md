# Food Trucks Maroc - Marketplace Website

A complete responsive Food Truck Marketplace website for "Constructeur de Food Trucks au Maroc" with a public marketplace and admin panel.

## 🚀 Features

### Public Marketplace
- **Homepage**: Hero section, features, testimonials, and call-to-action
- **Marketplace**: Grid of food trucks with filters and search
- **Product Details**: Detailed view with image gallery and specifications
- **About Page**: Company story, team, and values
- **Contact Page**: Contact form, Google Maps integration, and WhatsApp button

### Admin Panel
- **Dashboard**: Overview statistics and recent activity
- **Products Management**: CRUD operations for food trucks
- **Orders Management**: Track and manage customer orders
- **Devis Management**: Handle quote requests and responses
- **Messages Management**: Manage contact form submissions
- **Authentication**: Secure admin login system

## 🛠️ Tech Stack

- **Frontend**: React 19 + Next.js 15 + TypeScript
- **Styling**: TailwindCSS v4 with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **Fonts**: Poppins (headings) + Inter (body)

## 🎨 Design System

- **Colors**: Dark navy/charcoal text, white/light gray backgrounds, teal accent
- **Typography**: Poppins for headings, Inter for body text
- **Components**: Rounded corners, shadows, hover animations
- **Responsive**: Mobile-first design with breakpoints
- **Dark Mode**: Complete dark theme support

## 📱 Responsive Design

- **Desktop**: Full-featured layout with sidebar navigation
- **Tablet**: Optimized grid layouts and touch-friendly interactions
- **Mobile**: Collapsible navigation and stacked layouts

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-truck-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase config to `.env.local`
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

- **URL**: `/admin`
- **Demo Credentials**: 
  - Email: `admin@foodtrucks.ma`
  - Password: `admin123`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── marketplace/       # Public marketplace pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── Navbar.tsx        # Navigation component
│   └── Footer.tsx        # Footer component
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication context
│   └── ThemeContext.tsx  # Dark mode context
├── lib/                  # Utility libraries
│   └── firebase.ts       # Firebase configuration
└── types/                # TypeScript type definitions
    └── index.ts          # Main type definitions
```

## 🎯 Key Features Implemented

### ✅ Public Marketplace
- [x] Responsive homepage with hero section
- [x] Food truck marketplace with filters
- [x] Product detail pages with image galleries
- [x] About page with company story
- [x] Contact page with form and map
- [x] Dark mode toggle
- [x] SEO-optimized meta tags

### ✅ Admin Panel
- [x] Secure authentication system
- [x] Dashboard with statistics
- [x] Products management (CRUD)
- [x] Orders management
- [x] Devis (quotes) management
- [x] Messages management
- [x] Responsive admin interface

### ✅ Technical Features
- [x] TypeScript for type safety
- [x] TailwindCSS for styling
- [x] Framer Motion for animations
- [x] Firebase integration ready
- [x] Responsive design
- [x] Dark mode support
- [x] SEO optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Firebase Hosting**: Direct integration with Firebase
- **AWS Amplify**: Full-stack deployment

## 🔧 Customization

### Adding New Food Trucks
1. Go to Admin Panel → Products
2. Click "Ajouter un Food Truck"
3. Fill in the details and specifications
4. Save to add to the marketplace

### Modifying Design
- **Colors**: Update CSS variables in `globals.css`
- **Fonts**: Modify font imports in `layout.tsx`
- **Components**: Edit component files in `src/components/`

### Adding Features
- **New Pages**: Create in `src/app/`
- **New Components**: Add to `src/components/`
- **New Types**: Define in `src/types/index.ts`

## 📞 Support

For support or questions about this project:
- **Email**: contact@foodtrucks.ma
- **Phone**: +212 5XX XXX XXX
- **WhatsApp**: Available on contact page

## 📄 License

This project is proprietary software for Food Trucks Maroc. All rights reserved.

---

**Built with ❤️ for Food Trucks Maroc**