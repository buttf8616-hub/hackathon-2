"""OpenAI Agent configuration for the Todo Assistant.

Creates an Agent with tools connected to Phase II REST API.
Uses the OpenAI Agents SDK for orchestration with Google Gemini
via the OpenAI-compatible endpoint.
"""

from __future__ import annotations

import os

from openai import AsyncOpenAI

from agents import Agent, OpenAIChatCompletionsModel

from src.agent.instructions import SYSTEM_INSTRUCTIONS
from src.mcp_tools.server import ALL_TOOLS


def create_agent() -> Agent:
    """Create and return the Todo Assistant agent with all tools."""
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    gemini_client = AsyncOpenAI(
        api_key=gemini_api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
    )

    agent = Agent(
        name="Todo Assistant",
        instructions=SYSTEM_INSTRUCTIONS,
        model=OpenAIChatCompletionsModel(
            model=model_name,
            openai_client=gemini_client,
        ),
        tools=ALL_TOOLS,
    )
    return agent
