import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { summarizeText } from './llm.js';
import { validateInput } from './validate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend HTML file
app.use(express.static(join(__dirname, '../client')));

// ── API route ──
app.post('/api/summarize', async (req, res) => {
  const text = req.body?.text?.trim() ?? '';

  const validationError = validateInput(text);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const result = await summarizeText(text);
    return res.json(result);
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message || 'Failed to summarize text.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Server running at http://localhost:${PORT}`);
  console.log(`   Open that URL in your browser to use the app.\n`);
});