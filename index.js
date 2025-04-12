# Gerando o arquivo index.js ajustado com:
# - Valor correto (10000 centavos = R$100)
# - Remoção da chave Pix explícita
# - Estrutura de item bem formatada
# - Tratamento de erro detalhado

index_code_final = """
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/gerar-pagamento', async (req, res) => {
  const externalId = 'pedido_' + Date.now();
  const totalAmount = 10000; // R$100,00

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
          id: 'pix100',
          title: 'Pix de R$100',
          description: 'Pagamento rápido via Pix',
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
    console.error('❌ Erro ao gerar pagamento:', {
      message: error.message,
      data: error.response?.data,
      status: error.response?.status
    });

    res.status(500).json({
      error: 'Erro ao gerar pagamento',
      detalhes: error.response?.data || error.message,
      raw: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
"""

index_path = "/mnt/data/index.js"
with open(index_path, "w") as f:
    f.write(index_code_final.strip())

index_path
