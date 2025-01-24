require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your Secret Key
const path = require('path'); // Used to work with file and directory paths
const app = express();

// Serve static files (like your HTML, CSS, JS) from the 'public' folder
// app.use(express.static('public'));
app.use(express.json());

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));

app.use(express.static(path.join(__dirname , 'public')))

// Serve the index.html when the root URL is visited
app.get('/', (req, res) => {
    res.render('index', { stripePublicKey: process.env.STRIPE_PUBLIC_KEY });
});


// Route to create checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Sample Product',
                        },
                        unit_amount: 2000, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            success_url: 'https://localhost:4242/success',
            cancel_url: 'https://localhost:4242/cancel',
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(4242, () => console.log('Server running on port 4242'));
