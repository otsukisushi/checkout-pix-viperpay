const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/gerar-pagamento', async (req, res) => {
  const externalId = 'pedido_' + Date.now();
  const totalAmount = 4970; // R$49,70

  try {
    const response = await axios.post('https://api.viperpay.tech/v1/transactions', {
      external_id: externalId,
      total_amount: totalAmount,
      payment_method: 'PIX',
      webhook_url: 'https://seusite.com/webhook',
      items: [
        {
          id: 'curso_xyz',
          title: 'Curso XYZ',
          description: 'Acesso completo ao Curso XYZ',
          price: totalAmount,
          quantity: 1,
          is_physical: false
        }
      ],
      ip: req.ip,
      customer: {
        name: 'Cliente',
        email: 'cliente@example.com',
        phone: '31999999999',
        document_type: 'CPF',
        document: '12345678900'
      }
    }, {
      headers: {
        'api-secret': process.env.API_SECRET
      }
    });

    const { pix } = response.data;
    res.json({ qr_code: pix.payload, copia_cola: pix.payload });

  } catch (error) {
    console.error('Erro ao gerar pagamento:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao gerar pagamento' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});