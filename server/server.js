import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

const resend = new Resend(process.env.RESEND_API_KEY);

app.disable('x-powered-by');

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

app.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email requis' 
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'VoxiCode <contact@voxicode.fr>',
      to: email,
      subject: 'Bienvenue sur notre liste d\'attente !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Merci de vous être inscrit !</h1>
          <p>Nous sommes ravis de vous compter parmi nos premiers utilisateurs.</p>
          <p>Nous vous tiendrons informé des dernières actualités et du lancement de notre projet.</p>
          <br/>
          <p>À bientôt !</p>
          <p>L'équipe de VoxiCode.</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(500).json({ 
        success: false,
        message: error.message || 'Erreur lors de l\'envoi de l\'email' 
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Inscription réussie',
      data: data || {}
    });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email',
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
