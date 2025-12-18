import OpenAI from 'openai';
import User from '../models/User.js';
import App from '../models/App.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate code using AI
export const generateCode = async (req, res, next) => {
  try {
    const { name, description, features, entities, framework, styling } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'App name is required' });
    }

    // Check AI generation limits
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.aiGenerationsUsed >= user.aiGenerationsLimit) {
      return res.status(403).json({
        error: 'AI generation limit reached',
        message: `You have reached your limit of ${user.aiGenerationsLimit} AI generations. Upgrade your plan for more.`
      });
    }

    // Construct the prompt
    const prompt = `Generate a complete ${framework || 'React'} application with ${styling || 'Tailwind CSS'} styling.

App Name: ${name}
Description: ${description || 'No description provided'}

Features:
${features && features.length > 0 ? features.map((f, i) => `${i + 1}. ${f}`).join('\n') : 'No features specified'}

Data Entities:
${entities && entities.length > 0 ? entities.map(e => `- ${e.name}: ${e.fields.join(', ')}`).join('\n') : 'No entities specified'}

Requirements:
1. Generate production-ready, clean code
2. Include proper component structure
3. Add TypeScript types/interfaces
4. Include state management
5. Add proper styling with ${styling || 'Tailwind CSS'}
6. Include error handling
7. Add loading states
8. Make it responsive
9. Add proper documentation/comments
10. Follow best practices

Provide the complete code for the main app component and necessary files. Make it a fully functional application.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert full-stack developer who creates high-quality, production-ready applications. Generate complete, working code that follows best practices and modern standards.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const generatedCode = completion.choices[0].message.content;

    // Update user's AI generation count
    user.aiGenerationsUsed += 1;
    await user.save();

    res.json({
      success: true,
      code: generatedCode,
      remainingGenerations: user.aiGenerationsLimit - user.aiGenerationsUsed
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    next(error);
  }
};

// Generate component
export const generateComponent = async (req, res, next) => {
  try {
    const { componentName, description, props } = req.body;

    if (!componentName) {
      return res.status(400).json({ error: 'Component name is required' });
    }

    const user = await User.findById(req.user.userId);
    
    if (user.aiGenerationsUsed >= user.aiGenerationsLimit) {
      return res.status(403).json({
        error: 'AI generation limit reached'
      });
    }

    const prompt = `Generate a React component with TypeScript and Tailwind CSS.

Component Name: ${componentName}
Description: ${description || 'No description'}
Props: ${props ? JSON.stringify(props) : 'None'}

Create a reusable, well-documented component with proper TypeScript types.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert React developer. Generate clean, reusable components with TypeScript and Tailwind CSS.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const generatedCode = completion.choices[0].message.content;

    user.aiGenerationsUsed += 1;
    await user.save();

    res.json({
      success: true,
      code: generatedCode,
      remainingGenerations: user.aiGenerationsLimit - user.aiGenerationsUsed
    });
  } catch (error) {
    console.error('Component Generation Error:', error);
    next(error);
  }
};

// Refactor/improve code
export const refactorCode = async (req, res, next) => {
  try {
    const { code, instructions } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const prompt = `Refactor and improve the following code.

Instructions: ${instructions || 'Improve code quality, performance, and maintainability'}

Code:
\`\`\`
${code}
\`\`\`

Provide the refactored code with improvements and explanations.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer and refactoring specialist. Improve code quality while maintaining functionality.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 3000
    });

    const improvedCode = completion.choices[0].message.content;

    res.json({
      success: true,
      code: improvedCode
    });
  } catch (error) {
    console.error('Refactor Error:', error);
    next(error);
  }
};
