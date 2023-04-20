import mongoose, { Schema, model } from 'mongoose';
import { Pool } from 'pg';

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  watched: {
    type: Boolean,
    required: true,
  },
});

// Next.js issue with re-creating models
// https://stackoverflow.com/questions/67042963/cannot-overwrite-mongoose-model-once-compiled-with-nextjs/67044315
const Movie = mongoose.models.Movies || model('Movies', movieSchema, 'Movies');

// Postgres Setup

const pool = new Pool({
  connectionString: process.env.pgURI,
});

export { Movie, pool };
