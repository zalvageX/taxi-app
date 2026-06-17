import { BiTaxi } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import { FaRoute } from "react-icons/fa";



// NAVIGATION
export const NAV_LINKS = [
  { href: '#home', key: 'home', label: 'Home' },
  { href: '#about', key: 'about', label: 'About' },
  { href: '#services', key: 'services', label: ' OurServices' },
];

export const statistics = [
    { value: '10', tag:"+", label: 'Years experience' },
    { value: '100', tag:"%", label: 'Licensed company' },
    { value: '2000', tag:"+", label: 'Happy Customers' },
];

export const city = [
    { image: '/checkBox.svg', label: 'Comfortable long-distance travel between cities' },
    { image: '/checkBox.svg', label: 'Door-to-door service with flexible scheduling' },
    { image: '/checkBox.svg', label: 'No shared rides — enjoy private, direct transport' },
    { image: '/checkBox.svg', label: 'Great for weekend getaways, family visits, or business trips' },
];

export const chauffer = [
    { image: '/checkBox.svg', label: 'On-demand access to professional chauffeurs' },
    { image: '/checkBox.svg', label: 'Premium vehicles for executive and VIP transport' },
    { image: '/checkBox.svg', label: 'Discreet, courteous service with attention to detail' },
    { image: '/checkBox.svg', label: 'Perfect for weddings, corporate events, or luxury travel' },
];

export const airport = [
    { image: '/checkBox.svg', label: 'Seamless pick-up and drop-off at all major airports' },
    { image: '/checkBox.svg', label: 'Real-time flight tracking and driver coordination' },
    { image: '/checkBox.svg', label: 'Meet-and-greet service available on request' },
    { image: '/checkBox.svg', label: 'Always on time, stress-free travel' },
];

export const hourly = [
    { image: '/checkBox.svg', label: 'Flexible hourly bookings for errands, meetings, or sightseeing' },
    { image: '/checkBox.svg', label: 'Full-day hire for events, tours, or business needs' },
    { image: '/checkBox.svg', label: 'Professional drivers at your service throughout the day' },
    { image: '/checkBox.svg', label: 'Ideal for personalized, uninterrupted travel' },
];

export const choose = [
    {
        // imgURL: "/safetyIc.svg",
        icon: BsShieldCheck,
        label: "Safety first",
        subtext: "Your safety is our top priority. Every ride is backed by rigorous safety protocols, including real-time tracking and emergency support. Whether you're commuting to work or heading out late at night, you can ride with confidence knowing we’ve got your back."
    },
    {
        // imgURL: "/chauffer1.svg",
        icon: FaRoute,
        label: "Verified driver",
        subtext: "We only work with licensed, background-checked drivers who meet our high standards for professionalism and courtesy. Each driver undergoes regular training and performance reviews to ensure your journey is smooth, safe, and respectful."
    },
    {
        // imgURL: "/distance.svg",
        // imgURL: "/distance1.svg",
        icon: BiTaxi,
        label: "Private travel solution",
        subtext: "Enjoy the comfort and privacy of your own vehicle with every ride. No shared seats, no detours — just direct, personalized transport tailored to your schedule. Whether it’s a quick city hop or a long-distance trip, we make private travel simple and stress-free."
    },
]

export const testimonials = [
    {
        subtext: "“De vock is the most reliable driver I’ve ever used in Belgium. He picked me up from Brussels Airport at 6 AM and got me to my meeting in Antwerp right on time. The car was spotless, and his knowledge of the routes saved me from morning traffic. Highly recommended!”",
        label: "- Marie Laurent, Buisness Traveler, Brussels",
        imgURL: "/fourStar.svg",
    },
    {
        subtext: "“Booking with Taxi Belgium was so easy. Dvock drove my family from Ghent to Bruges for a weekend trip. He was friendly,         patient with the kids, and even suggested anice local stop along the way. We felt safe and comfortable the entire ride. We’ll definitely use him again!”",
        label: "- Thomas & Sophie Dubois, Ghent",
        imgURL: "/fourStar.svg",
    },
    {
        subtext: "“As a frequent visitor to Belgium, I always call Dvock now. He’s punctual, professional, and knows every corner of the country. Last month he took me from Liège to Charleroi Airport late at night — smooth and stressfree. True one-man reliability!”",
        label: "- Pieter Jansen, Regular Client, Liège",
        imgURL: "/fiveStar.svg",
    },
]