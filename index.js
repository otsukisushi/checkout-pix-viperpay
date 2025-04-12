const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/gerar-pagamento', async (req, res) => {
  const externalId = 'pedido_' + Date.now();
  const totalAmount = 10000; // R$100,00 em centavos

  try {
    const response = await axios.post('https://api.viperpay.tech/v1/transactions', {
      external_id: externalId,
      total_amount: totalAmount,
      payment_method: 'PIX',
      items: [
        {
          id: 'curso_xyz',
          title: 'Curso XYZ',
          description: 'Acesso completo ao Curso XYZ',
          price: totalAmount,
          quantity: 1,
          is_physical: false
        }
      ]
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
