import App from '../models/App.js';
import User from '../models/User.js';

// Get all apps for current user
export const getApps = async (req, res, next) => {
  try {
    const apps = await App.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      apps
    });
  } catch (error) {
    next(error);
  }
};

// Get single app
export const getApp = async (req, res, next) => {
  try {
    const app = await App.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).lean();

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({
      success: true,
      app
    });
  } catch (error) {
    next(error);
  }
};

// Create app
export const createApp = async (req, res, next) => {
  try {
    const { name, description, features, entities, targetAudience, framework, styling } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'App name is required' });
    }

    const app = new App({
      userId: req.user.userId,
      name,
      description,
      features: features || [],
      entities: entities || [],
      targetAudience,
      framework: framework || 'react',
      styling: styling || 'tailwind'
    });

    await app.save();

    res.status(201).json({
      success: true,
      app: app.toObject()
    });
  } catch (error) {
    next(error);
  }
};

// Update app
export const updateApp = async (req, res, next) => {
  try {
    const { name, description, features, entities, targetAudience, framework, styling, generatedCode } = req.body;

    const app = await App.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        name,
        description,
        features,
        entities,
        targetAudience,
        framework,
        styling,
        generatedCode,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({
      success: true,
      app: app.toObject()
    });
  } catch (error) {
    next(error);
  }
};

// Delete app
export const deleteApp = async (req, res, next) => {
  try {
    const app = await App.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }

    res.json({
      success: true,
      message: 'App deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
