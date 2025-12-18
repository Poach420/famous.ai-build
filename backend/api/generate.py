from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional
from config import settings
import openai

from models.schemas import GenerateCodeRequest
from api.auth import get_current_user

router = APIRouter()

# Initialize OpenAI client
if settings.OPENAI_API_KEY:
    openai.api_key = settings.OPENAI_API_KEY

@router.post("/")
async def generate_code(
    request: GenerateCodeRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate code using OpenAI GPT-4."""
    
    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables."
        )
    
    try:
        # Build prompt from app specification
        prompt = build_generation_prompt(request.app_spec, request.custom_prompt)
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert full-stack developer. Generate production-ready, well-structured React code with TypeScript and Tailwind CSS."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=3000
        )
        
        generated_code = response.choices[0].message.content
        
        return {"generated_code": generated_code}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Code generation failed: {str(e)}"
        )

def build_generation_prompt(app_spec, custom_prompt: Optional[str] = None) -> str:
    """Build a detailed prompt for code generation."""
    
    features_list = "\n".join([f"- {feature}" for feature in app_spec.features])
    entities_list = "\n".join([
        f"- {entity.name}: {', '.join(entity.fields)}"
        for entity in app_spec.entities
    ])
    
    base_prompt = f"""
Generate a complete {app_spec.framework.upper()} application with the following specifications:

**App Name:** {app_spec.name}
**Description:** {app_spec.description}
**Target Audience:** {app_spec.target_audience}

**Features:**
{features_list}

**Data Entities:**
{entities_list}

**Framework:** {app_spec.framework}
**Styling:** {app_spec.styling}

Requirements:
1. Use TypeScript for type safety
2. Use {app_spec.styling} for styling
3. Create reusable, well-organized components
4. Include proper state management
5. Add error handling and loading states
6. Make it responsive and accessible
7. Include comments for complex logic
8. Follow best practices and clean code principles

Generate the complete App.tsx file with all necessary components inline.
"""
    
    if custom_prompt:
        base_prompt += f"\n\n**Additional Requirements:**\n{custom_prompt}"
    
    return base_prompt
