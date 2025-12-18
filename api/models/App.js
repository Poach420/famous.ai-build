import mongoose from 'mongoose';

const appSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  features: [{
    type: String
  }],
  entities: [{
    name: String,
    fields: [String]
  }],
  targetAudience: {
    type: String,
    trim: true
  },
  framework: {
    type: String,
    enum: ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt'],
    default: 'react'
  },
  styling: {
    type: String,
    enum: ['tailwind', 'css', 'scss', 'styled-components', 'emotion'],
    default: 'tailwind'
  },
  generatedCode: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'generated', 'deployed', 'archived'],
    default: 'draft'
  },
  deploymentUrl: {
    type: String
  },
  version: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appSchema.index({ userId: 1, createdAt: -1 });
appSchema.index({ userId: 1, status: 1 });

export default mongoose.model('App', appSchema);
