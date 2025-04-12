const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/gerar-pagamento', async (req, res) => {
  const externalId = 'pedido_' + Date.now();
  const totalAmount = 10000;

  try {
    const response = await axios.post('https://api.viperpay.tech/v1/transactions', {
      external_id: externalId,
      total_amount: totalAmount,
      payment_method: 'PIX',
      webhook_url: 'https://webhook.site/teste',
      ip: '127.0.0.1',
      customer: {
        name: 'Anonimo',
        email: 'anonimo@anonimo.com',
        phone: '11999999999',
        document_type: 'CPF',
        document: '12345678909'
      },
     items: [
  {
    id: 'ade78fb1-815f-476a-a520-24f7c9ae2f42',
    title: 'Pagamento via Pix',
    description: 'Checkout automático de R$100',
    price: 10000,
    quantity: 1,
    is_physical: false
  }
]
    }, {
      headers: {
        'api-secret': process.env.API_SECRET
      }
    });

    if (!response.data?.pix) {
  console.error('🧨 ViperPay respondeu com erro:', response.data);
  return res.status(400).json({
    error: 'Pix não gerado pela ViperPay',
    detalhes: response.data
  });
}


    res.json({
      qr_code: pix.payload,
      copia_cola: pix.payload
    });

  } catch (error) {
    console.error('❌ Erro ao gerar pagamento:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    });

    res.status(500).json({
      error: 'Erro ao gerar pagamento',
      detalhes: error.response?.data
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
