require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Pokemon Model Schema
const Pokemon = mongoose.model('pokemon', new mongoose.Schema({
  name: String,
  type: String,
  level: Number,
  nature: String
}));

// [READ] GET: Fetch all saved Pokémon
app.get('/api/pokemon', async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pokemon', error: err });
  }
});

// [CREATE] POST: Insert new Pokémon
app.post('/api/pokemon', async (req, res) => {
  try {
    const pokemon = new Pokemon(req.body);
    await pokemon.save();
    res.status(201).json(pokemon);
  } catch (err) {
    res.status(500).json({ message: 'Error saving pokemon', error: err });
  }
});

// [UPDATE] PUT: Modify an existing Pokémon by ID
app.put('/api/pokemon/:id', async (req, res) => {
  try {
    const updatedPokemon = await Pokemon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Returns the modified document
    );
    if (!updatedPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    res.json(updatedPokemon);
  } catch (err) {
    res.status(500).json({ message: 'Error updating pokemon', error: err });
  }
});

// [DELETE] DELETE: Remove a Pokémon by ID
app.delete('/api/pokemon/:id', async (req, res) => {
  try {
    const deletedPokemon = await Pokemon.findByIdAndDelete(req.params.id);
    if (!deletedPokemon) {
      return res.status(404).json({ message: 'Pokemon not found' });
    }
    res.json({ message: 'Pokemon deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting pokemon', error: err });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});