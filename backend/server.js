const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load env vars if any
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ==========================================
// MODELS
// ==========================================

// --- Product Model ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Wine', 'Beer', 'Whiskey', 'Vodka', 'Rum', 'Tequila'] 
  },
  image: { type: String, required: true },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

// --- User Model ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

// --- Order Model ---
const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  pickupTime: { type: String, required: true },
  cartItems: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true }
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// MIDDLEWARE
// ==========================================

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// ==========================================
// ROUTES & CONTROLLERS
// ==========================================

// --- Auth Routes ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
  const { name, email, dob, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, dob, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.put('/api/auth/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email, dob, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userDobStr = user.dob.toISOString().split('T')[0];
    const inputDobStr = new Date(dob).toISOString().split('T')[0];

    if (userDobStr !== inputDobStr) {
      return res.status(400).json({ message: 'Date of Birth does not match our records' });
    }

    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- Product Routes ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// --- Order Routes ---
app.post('/api/orders', protect, async (req, res) => {
  try {
    const { customerName, phoneNumber, pickupTime, cartItems, totalPrice } = req.body;
    
    const order = new Order({
      customer: req.user._id,
      customerName: req.user.name,
      phoneNumber,
      pickupTime,
      cartItems,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json({
      message: 'Order created successfully',
      orderId: createdOrder._id,
      customerId: createdOrder.customer,
      order: createdOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// UTILITY SCRIPTS & SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/srisailiquor';

const args = process.argv.slice(2);

const sampleProducts = [
  { "name": "Sula Vineyards Shiraz", "price": 1100, "category": "Wine", "image": "images/real_sula.png" },
  { "name": "Grover Zampa La Reserve", "price": 1250, "category": "Wine", "image": "images/real_grover.png" },
  { "name": "Fratelli Sette", "price": 2000, "category": "Wine", "image": "images/real_fratelli.png" },
  { "name": "Big Banyan Merlot", "price": 850, "category": "Wine", "image": "images/real_bigbanyan.png" },
  { "name": "York Arros", "price": 1500, "category": "Wine", "image": "images/real_yorkarros.png" },
  { "name": "Premium Dom Perignon Vintage Wine", "price": 25000, "category": "Wine", "image": "images/real_domperignon.png" },
  { "name": "Kingfisher Premium", "price": 160, "category": "Beer", "image": "images/real_kingfisher.png" },
  { "name": "Haywards 5000", "price": 160, "category": "Beer", "image": "images/real_haywards.png" },
  { "name": "Royal Challenge Beer", "price": 140, "category": "Beer", "image": "images/dl_royal_challenge_beer.png" },
  { "name": "Knock Out", "price": 150, "category": "Beer", "image": "images/real_knockout.png" },
  { "name": "Bira 91 Blonde Summer Lager", "price": 180, "category": "Beer", "image": "images/real_bira.png" },
  { "name": "Budweiser Magnum", "price": 200, "category": "Beer", "image": "images/real_budweiser.png" },
  { "name": "Heineken Lager", "price": 220, "category": "Beer", "image": "images/real_heineken.png" },
  { "name": "Corona Extra", "price": 300, "category": "Beer", "image": "images/real_corona.png" },
  { "name": "Premium Belgian Craft Beer", "price": 850, "category": "Beer", "image": "images/real_belgiancraft.png" },
  { "name": "Magic Moments", "price": 850, "category": "Vodka", "image": "images/real_magicmoments.png" },
  { "name": "Romanov", "price": 700, "category": "Vodka", "image": "images/real_romanov.png" },
  { "name": "White Mischief", "price": 650, "category": "Vodka", "image": "images/real_whitemischief.png" },
  { "name": "Smirnoff", "price": 1500, "category": "Vodka", "image": "images/real_smirnoff.png" },
  { "name": "Absolut", "price": 2500, "category": "Vodka", "image": "images/real_absolut.png" },
  { "name": "Premium Beluga Gold Line Vodka", "price": 12000, "category": "Vodka", "image": "images/real_beluga.png" },
  { "name": "Royal Stag", "price": 1000, "category": "Whiskey", "image": "images/real_royalstag.png" },
  { "name": "McDowell's No.1", "price": 950, "category": "Whiskey", "image": "images/real_mcdowells.png" },
  { "name": "Blenders Pride", "price": 1650, "category": "Whiskey", "image": "images/real_blenderspride.png" },
  { "name": "Officer's Choice", "price": 850, "category": "Whiskey", "image": "images/real_officerschoice.png" },
  { "name": "Imperial Blue", "price": 900, "category": "Whiskey", "image": "images/real_imperialblue.png" },
  { "name": "Amrut Fusion", "price": 3500, "category": "Whiskey", "image": "images/real_amrutfusion.png" },
  { "name": "Paul John Brilliance", "price": 3200, "category": "Whiskey", "image": "images/real_pauljohn.png" },
  { "name": "Johnnie Walker Black Label", "price": 4500, "category": "Whiskey", "image": "images/real_johnniewalker.png" },
  { "name": "Chivas Regal 12 Year Old", "price": 4200, "category": "Whiskey", "image": "images/real_chivasregal.png" },
  { "name": "Jack Daniel's Old No. 7", "price": 4800, "category": "Whiskey", "image": "images/real_jackdaniels.png" },
  { "name": "The Macallan 72 Year Old - Oldest Single Malt", "price": 450000, "category": "Whiskey", "image": "images/real_macallan.png" },
  { "name": "Old Monk XXX", "price": 850, "category": "Rum", "image": "images/real_oldmonk.png" },
  { "name": "McDowell's No.1 Celebration Rum", "price": 750, "category": "Rum", "image": "images/real_mcdowellsrum.png" },
  { "name": "Bacardi White", "price": 1200, "category": "Rum", "image": "images/real_bacardi.png" },
  { "name": "Captain Morgan Spiced", "price": 1100, "category": "Rum", "image": "images/real_captainmorgan.png" }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    if (args.includes('--seed')) {
      console.log('Seeding database...');
      await Product.deleteMany();
      await Product.insertMany(sampleProducts);
      console.log(`Successfully added ${sampleProducts.length} sample products`);
      process.exit(0);
    } else if (args.includes('--dump')) {
      console.log('Dumping database...');
      const products = await Product.find({});
      console.log(JSON.stringify(products, null, 2));
      process.exit(0);
    } else {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
