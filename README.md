# NovaMart - Complete E-commerce Platform

A modern, production-ready e-commerce platform built with React, TypeScript, Supabase, and Tailwind CSS. Features a complete storefront and admin dashboard with AI-powered insights.

## Features

### Storefront
- 🛍️ Modern product catalog with categories and search
- 🛒 Real-time shopping cart with optimistic updates
- 💳 Free checkout options (Cash on Delivery, Bank Transfer)
- 👤 User authentication with Google OAuth and email
- ⭐ Product reviews and ratings
- 💝 Wishlist functionality
- 📱 Fully responsive design with dark mode

### Admin Dashboard
- 📊 Real-time analytics and KPIs
- 📦 Product and inventory management
- 🛍️ Order processing and fulfillment
- 👥 Customer management with RFM analysis
- 📧 Marketing campaigns and email automation
- 🤖 AI Copilot for data-driven insights
- 💰 Competitor price tracking
- 🔄 Automated cron jobs for data processing

### Technical Features
- 🔒 Row Level Security (RLS) for data protection
- 🔄 Real-time updates with Supabase Realtime
- 🗄️ File storage for product images and avatars
- ⚡ Edge functions for serverless processing
- 🔍 Hybrid search (keyword + semantic with pgvector)
- 📈 Event tracking and analytics
- 🎯 A11y compliant with WCAG guidelines

## Quick Start

1. **Set up Supabase Project**
   - Create a new Supabase project
   - Click "Connect to Supabase" in the top right of this interface
   - Run the migrations to set up the database schema

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and keys
   - Configure SMTP settings for email notifications

3. **Install and Run**
   ```bash
   npm install
   npm run dev
   ```

4. **Create Admin User**
   - Sign up through the UI
   - Manually update your profile role to 'admin' in Supabase dashboard
   - Access admin panel at `/admin`

## Database Schema

The platform uses a comprehensive schema with the following main entities:

- **Products & Catalog**: Products, categories, variants, images
- **Shopping**: Carts, cart items, orders, order items
- **Users**: Profiles, wishlists, reviews, legal acceptances
- **Marketing**: Campaigns, subscriptions, events
- **Analytics**: Trending products, competitor tracking, embeddings

## Payment Integration

### Default (Free Mode)
- Cash on Delivery
- Bank Transfer
- Manual payment processing

### Optional Paid Features
To enable Stripe payments:
1. Add Stripe keys to environment variables
2. Uncomment Stripe components in checkout flow
3. Deploy Stripe webhook handlers

## Email System

Uses SMTP for transactional emails:
- Order confirmations
- Marketing campaigns
- Password resets

Configure your SMTP provider in environment variables.

## AI Features

### Free Mode (Default)
- Rule-based analytics and recommendations
- Keyword search with basic similarity
- Automated trending product detection

### Paid Mode (Optional)
To enable LLM features:
1. Add OpenAI API key to environment
2. Update embedding generation to use OpenAI
3. Enable advanced copilot features

## Deployment

The application is designed to run on any platform supporting Node.js:

1. **Frontend**: Deploy to Vercel, Netlify, or similar
2. **Backend**: Supabase handles all backend services
3. **Edge Functions**: Automatically deployed with Supabase
4. **Cron Jobs**: Configured in Supabase dashboard

## Cron Schedules

- **Trending Products**: Every 6 hours
- **Competitor Prices**: Hourly  
- **Marketing Campaigns**: Weekly (Wednesday 9 AM)

Configure schedules in the Supabase dashboard under Edge Functions.

## Security

- Row Level Security (RLS) on all tables
- JWT-based authentication
- Secure file uploads with signed URLs
- Input validation and sanitization
- CORS protection on API endpoints

## Performance

- Optimized for Lighthouse scores >90
- Image optimization and lazy loading
- Efficient database queries with proper indexing
- Caching strategies for static content
- Progressive loading and skeleton states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions and support:
- Check the documentation in `/docs`
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using modern web technologies.