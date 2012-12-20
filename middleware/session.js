

module.exports = require('connect').session({ secret: process.env.SESSION_SECRET || 'secret123' });