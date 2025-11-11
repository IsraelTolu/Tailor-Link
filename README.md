# TailorLink - Connect. Create. Slay Your Style

A modern, responsive landing page for TailorLink - a platform connecting fashion designers with customers who love creativity.

## 🎨 Features

- **Modern Design**: Clean, professional UI with smooth animations and transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Scrolling**: Seamless navigation with smooth scroll effects
- **Interactive Elements**: Hover effects, parallax scrolling, and animated counters
- **Performance Optimized**: Fast loading with optimized images from Unsplash
- **Accessibility**: Semantic HTML and ARIA labels for better accessibility

## 📁 Project Structure

```
Tailor-Link/
├── index.html          # Main landing page
├── bookings.html       # Bookings page
├── browse_tailor.html  # Browse tailors page
├── payment.html        # Payment page
├── portfolio.html      # Portfolio page
├── styles.css          # Main stylesheet (new)
├── style.css           # Legacy stylesheet
├── main.js             # Main JavaScript file (new)
├── script.js           # Legacy JavaScript
├── images/             # Image assets
│   ├── logo.png
│   ├── profile.jpg
│   ├── tailor1.jpg
│   └── tailor2.jpg
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IsraelTolu/Tailor-Link.git
cd Tailor-Link
```

2. Open with a local server:

**Option 1: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Using Node.js (http-server)**
```bash
npx http-server -p 8000
```

**Option 3: Using VS Code Live Server**
- Install the "Live Server" extension
- Right-click on `index.html`
- Select "Open with Live Server"

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 🎯 Pages Overview

### Main Landing Page (index.html)
The main entry point featuring:
- **Hero Section**: Eye-catching header with call-to-action buttons
- **Stats Section**: Key metrics (10K+ Active Tailors, 50K+ Jobs Completed)
- **About Section**: Company information and mission
- **Values Section**: Core values (Mission, Passion, Community)
- **Why Choose Section**: 6 key features with images
- **How It Works**: 4-step process guide
- **For Tailors/Customers**: Separate CTAs for different user types
- **Footer**: Links, social media, and company information

### Other Pages
- **bookings.html**: Booking management interface
- **browse_tailor.html**: Browse and search for tailors
- **payment.html**: Payment processing page
- **portfolio.html**: Tailor portfolio showcase

## 🎨 Design System

### Colors
- **Primary**: `#C4A574` (Gold/Beige)
- **Primary Dark**: `#A68B5B`
- **Secondary**: `#2D3748` (Dark Gray)
- **Text Dark**: `#1A202C`
- **Text Gray**: `#4A5568`
- **Background**: `#FFFFFF`, `#F7FAFC`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700-800 weight
- **Body**: 400-500 weight

### Spacing
- Uses a consistent spacing scale (0.5rem to 4rem)
- Mobile-first responsive design

## 💻 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Interactive features
- **Unsplash API**: High-quality images
- **Google Fonts**: Inter font family

## 🔧 JavaScript Features

### Navigation
- Fixed navbar with scroll effect
- Active link highlighting based on scroll position
- Mobile hamburger menu

### Animations
- Intersection Observer for scroll animations
- Parallax effect on hero section
- Animated counter for statistics
- Smooth scroll to sections

### Performance
- Debounced and throttled event handlers
- Lazy loading for images
- Optimized animations

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔗 Navigation Links

The navigation includes:
- Home
- About us
- How It Works
- Our values

All sections use smooth scrolling with proper offset for the fixed navbar.

## 🎭 Image Sources

All images are sourced from [Unsplash](https://unsplash.com) with proper attribution:
- Fashion and tailoring workspace images
- Designer portraits
- Custom clothing examples
- Team collaboration photos

## 🚧 Future Enhancements

- [ ] Add authentication system
- [ ] Implement booking functionality
- [ ] Create user dashboard
- [ ] Add payment integration
- [ ] Build tailor profile pages
- [ ] Implement search and filtering
- [ ] Add real-time chat feature
- [ ] Create mobile app version

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

For questions or support, please contact:
- Email: support@tailorlink.com
- Website: https://tailorlink.com

## 🙏 Acknowledgments

- Design inspiration from modern fashion platforms
- Images from Unsplash contributors
- Icons and graphics from various open-source projects

---

**Built with ❤️ by the TailorLink Team**