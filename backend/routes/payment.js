
const express = require('express');
const router = express.Router();
require('dotenv').config();
const Stripe = require('stripe');

// Inicializar Stripe com a chave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @route   POST /api/payment/create-intent
 * @desc    Criar intent de pagamento via Stripe
 * @access  Public
 */
router.post('/create-intent', async (req, res) => {
  const { amount, payment_method, order_id } = req.body;
  
  try {
    // Criar intent de pagamento
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Converter para centavos
      currency: 'brl',
      payment_method_types: ['card'],
      metadata: {
        order_id: order_id,
        payment_method: payment_method
      }
    });
    
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Erro ao criar intent de pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/payment/update-intent/:id
 * @desc    Atualizar status de pagamento
 * @access  Public
 */
router.put('/update-intent/:id', async (req, res) => {
  const { payment_status, payment_intent_id } = req.body;
  
  try {
    // Atualizar status do pagamento no banco de dados
    await req.app.locals.pool.query(
      'UPDATE orders SET payment_status = ?, payment_intent_id = ? WHERE id = ?',
      [payment_status, payment_intent_id, req.params.id]
    );
    
    res.json({ success: true, message: 'Status de pagamento atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar status de pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
