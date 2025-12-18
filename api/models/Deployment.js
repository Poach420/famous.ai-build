import mongoose from 'mongoose';

const deploymentSchema = new mongoose.Schema({
  appId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'App',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  provider: {
    type: String,
    enum: ['vercel', 'render', 'netlify', 'railway', 'aws', 'gcp'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'building', 'deploying', 'success', 'failed'],
    default: 'pending'
  },
  url: {
    type: String
  },
  buildLogs: {
    type: String
  },
  errorMessage: {
    type: String
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: 'production'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
deploymentSchema.index({ appId: 1, createdAt: -1 });
deploymentSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Deployment', deploymentSchema);
