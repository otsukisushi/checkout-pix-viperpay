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
      webhook_url: 'https://webhook.site/teste',
      ip: '127.0.0.1',
      customer: {
        name: 'João da Silva',
        email: 'joao.teste@gmail.com',
        phone: '11987654321',
        document_type: 'CPF',
        document: '12345678909'
      },
      items: [
        {
          id: 'pix100',
          title: 'Produto de Teste',
          description: 'Pagamento via Pix de R$100',
          price: totalAmount,
          quantity: 1,
          is_physical: false
        }
      ]
    }, {
      headers: {
        'api-secret': 'sk_36dade9c5ec5d089f547954796a3997c0d871157b8fb8469a42bf4fa402c30f0f9602f547cae4a71ec7ccc3c8036138e2e757c3dbfe20e55a660186aed2c4380'
      }
    });

    const pix = response.data?.pix;

    if (!pix || typeof pix.payload !== 'string') {
      console.error('❌ ViperPay respondeu com erro:', JSON.stringify(response.data, null, 2));
      return res.status(400).json({
        error: 'Pix não gerado pela ViperPay.',
        detalhes: response.data
      });
    }

    res.json({
      qr_code: pix.payload,
      copia_cola: pix.payload
    });

  } catch (error) {
    const rawError = error?.response?.data || error.message || 'Erro desconhecido';
    console.error('❌ Erro ao gerar pagamento:', rawError);

    res.status(500).json({
      error: 'Erro ao gerar pagamento',
      detalhes: rawError
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
