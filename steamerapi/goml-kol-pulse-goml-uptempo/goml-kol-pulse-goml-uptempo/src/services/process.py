import asyncio
import traceback
from dotenv import load_dotenv
import tiktoken
import anthropic
import boto3
import os
import io
from llama_index.embeddings.bedrock import BedrockEmbedding
from llama_index.llms.bedrock import Bedrock
from llama_index.core import VectorStoreIndex, Settings
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import aiofiles
import base64
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from collections import Counter
import pandas as pd
from adjustText import adjust_text

from src.services.table_classes import data_dynamodb

load_dotenv()

aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID")
aws_secret_access_key= os.environ.get("AWS_SECRET_ACCESS_KEY")

Settings.llm = Bedrock(
    model="anthropic.claude-3-5-sonnet-20240620-v1:0",
    region_name="us-east-1",
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key)



Settings.embed_model = BedrockEmbedding(
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name="us-east-1",

)


bedrock_client = boto3.client('bedrock-runtime', region_name="us-east-1", aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

CHAT_HISTORY_DIR = "chat_histories"
def ensure_chat_history_dir():
    """Ensure that the chat history directory exists."""
    if not os.path.exists(CHAT_HISTORY_DIR):
        os.makedirs(CHAT_HISTORY_DIR)

def get_chat_history_path(chat_id: str) -> str:
    """Get the file path for a chat history."""
    return os.path.join(CHAT_HISTORY_DIR, f"{chat_id}.json")

async def store_query_and_response(chat_id: str, user_query: str):
    """
    Store the user query and SQL query in a JSON file.

    Args:
        chat_id (str): The unique identifier for the chat session.
        user_query (str): The query asked by the user.
        response (str): The response extracted from the model's response.
    """
    ensure_chat_history_dir()
    file_path = get_chat_history_path(chat_id)

    # Load existing history or create a new one
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            history = json.load(f)
    else:
        history = []

    # Append new query and response
    history.append({
        "user_query": user_query,
        "timestamp": datetime.now().isoformat()
    })

    # Save updated history
    with open(file_path, 'w') as f:
        json.dump(history, f, indent=2)


async def get_chat_history(chat_id: str):
    file_path = get_chat_history_path(chat_id)
    try:
        async with aiofiles.open(file_path, 'r') as f:
            content =await f.read()
            history = json.loads(content)
        return [entry["user_query"] for entry in history]
    except (FileNotFoundError, json.JSONDecodeError):
        return []

async def invoke_model(prompt):
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4096,
        "temperature": 0,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    }

    body_json = json.dumps(body)

    response = bedrock_client.invoke_model(
        modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
        body=body_json.encode('utf-8'),
        contentType="application/json"
    )

    response_body = response['body'].read().decode('utf-8')
    response_json = json.loads(response_body)
    return response_json['content'][0]['text']

async def invoke_model_stream(prompt):
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 4096,
        "temperature": 0,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    }

    body_json = json.dumps(body)


    streaming_response = bedrock_client.invoke_model_with_response_stream(
        modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
        body=body_json.encode('utf-8'),
        contentType="application/json"
    )

    for event in streaming_response["body"]:
        chunk = json.loads(event["chunk"]["bytes"])
        if chunk["type"] == "content_block_delta":
            yield chunk["delta"].get("text", "")
async def model_output(user_query, items_org, physician_items, physician_private_items,chat_id):
    """

    Args:
        user_query: Query asked by the user
        items_org: Organization Content Data
        physician_items: Physician Content Data
        physician_private_items: Physician Private Content Data

    Returns:
        Response generated from the model
    """
    chunk_size = 100  # Adjust based on model token limit
    all_items = items_org + physician_items + physician_private_items

    chunks = [all_items[i:i + chunk_size] for i in range(0, len(all_items), chunk_size)]

    responses = []

    chat_history = await get_chat_history(chat_id)
    chat_history = chat_history[-3:]
    formatted_history = "\n".join([f"Previous Query: {query}" for query in chat_history])
    for i, chunk in enumerate(chunks):
        # Modify the prompt to handle only the current chunk
        prompt = f"""
            Chat History (Last 3 queries):
            {formatted_history}
            
            USER_QUERY: {user_query}
            
            Determine Query Type:
            - New Query: If the USER_QUERY is a standalone question that doesn't appear to relate to recent chat topics, treat it as independent.
            - Follow-up Query: If the USER_QUERY builds on, clarifies, or seems connected to any of the recent formatted history queries, consider it a follow-up.
            
           Handling New Queries:
            - Answer based on the content of the USER_QUERY alone, without referring to prior conversation history.
            - Avoid adding any context or continuity from past queries if it’s not explicitly mentioned.
            
           Handling Follow-up Queries:
            - Review the last 3 exchanges from the formatted history to identify relevant context.
            - Interpret and respond to the USER_QUERY as a continuation of this recent context.
            - Ensure consistency with any details, instructions, or themes from the previous queries to maintain smooth conversation flow.

            # Content Source - Chunk {i + 1}
            CONTENT: {chunk}

            You are provided with a list of tweets and transcripts of videos in the healthcare space, including content details and author information.
            The user’s query may contain precise instructions or questions about specific topics or content within these tweets and videos.

            Carefully analyze the USER_QUERY and identify any specific topics, keywords, or requirements.
            - If the `detectedText` key is present ,check the `text` field within `detectedText` to determine if it relates to the USER_QUERY. If a relation is found, ALWAYS include all the required `imageUrl` from `detectedText` in the response.
            - If the `detectedTextVideo` key is present:
                - Analyze each text field within the nested `detectedTextVideo` dictionary
                - Compare each text entry against the USER_QUERY for semantic relevance.
                - If a relevant match is found:
                   - Always extract the YouTube URL which is the key in the 'detectedTextVideo' dictionary.
                   - Extract the start timestamp (in seconds) from the matching segment
                   - Format and return the timestamped YouTube URL using the format:
                     youtube_url&t=start_time_in_seconds
                     For eg : https://www.youtube.com/watch?v=E4koqChmz_g&t=19
            - If the query specifies a particular trial, content theme, or sentiment, limit the response strictly to matching items. Summarize only the relevant content, mentioning the author when available.
            - If the query does not specify a particular trial or topic, include all relevant information from the provided content.

            Summarize only the relevant content, mentioning the author when available.
            Do not include any information, content, or details that are unrelated to the query.
            If asked to create a table, add all the items that are specified by the user in the USER_QUERY.

            Always:
            - Provide a concise response, directly answering the query without adding unrelated information.
            - Include a link to the source tweet or video if available (no duplicates).
            - Format responses in markdown.
            - Avoid adding any introductory or closing statements—just give the response.
            - Provide information on a specific topic or trial only once; avoid splitting relevant information across multiple sections.
            - For any analysis, if presenting information in a table format, **combine all relevant data into a single table**. Do not create multiple tables for the same query. Each query should result in only one table if tabular data is required.
            - In cases where the analysis requires detailed data on multiple attributes, organize all attributes within the same table, ensuring clarity and completeness without redundancy.
        """

        response_text = await invoke_model(prompt)
        responses.append(response_text)

    # Combine all responses
    final_response = "\n\n".join(responses)

    return final_response


async def check_redundancy(chat_id,user_query,final_response):
    """
    Args:
        user_query: Query asked by the user
        final_response: Response Generated from the model

    Returns:
        Refined final response that will be passed to end user
    """
    refinement_prompt = f"""
            USER_QUERY = {user_query}
            
            Here is a summary generated from a previous model output:

            {final_response}

            Your task is to refine the model output by removing any redundant or repetitive information without altering or adding any new details.
            - Do **not** hallucinate, change, or reinterpret any information provided.
            - Ignore any concluding statements indicating a lack of information if `final_response` contains relevant details above that statement. Focus only on the information that directly addresses the user query.
            - Always use the information present in `final_response` as the basis of your response, even if it seems only partially relevant.
            - Maintain all unique details exactly as they are, simply ensuring each point is mentioned only once.
            - Structure the response in markdown format and, if relevant, use a **single table format** for any tabular data.
            - Avoid adding any introductory or closing statements—just give the response. Do not give any explanation if you are not able to provide any response
            - If the `final_response` does not fully align with the user query's requirements (e.g., if a table was requested but not provided, or if formatting does not match the query’s specifics), reformat or reorganize the output to directly match the user's query.
            - if any introductory statement is present then remove that from the response.
            - Do not remove necessary information from the final response(tweets,links etc).
            - Only state "there is no relevant information available" if the `final_response` truly contains **no information** relevant to the user query. Otherwise, use the provided content in `final_response` to generate the answer without adding any new information.
            - If the `final_response` does not contain relevant information for the user query or lacks specific comments that directly address the query, simply state that there is no relevant information available.
              Do not attempt to create an answer or add any information on your own.
              
            The output should be a concise, streamlined version of the original response, preserving all original content without modification.
        """

    # response_text = invoke_model(refinement_prompt)
    # await store_query_and_response(chat_id, user_query)
    # return response_text
    async for chunk in invoke_model_stream(refinement_prompt):
        yield chunk

    await store_query_and_response(chat_id, user_query)


async def analyze_query_intent(chat_id, user_query: str) -> bool:
    """
    Analyze the user query to determine if it requires a visualization.
    Return True if a visualization is needed, otherwise return False.
    """

    chat_history = await get_chat_history(chat_id)
    chat_history = chat_history[-1:]
    formatted_history = "\n".join([f"Previous Query: {query}" for query in chat_history])
    print(formatted_history)

    intent_prompt = f"""Analyze the following user query to determine if it specifically requires a visualization (such as a chart, graph, dashboard, or any type of interactive or visual representation) or a regular response.

                    Chat History (Last Query):
                    {formatted_history}

                    USER_QUERY: "{user_query}"

                    If the query is explicitly asking for a visualization, including any chart, graph, dashboard, or visual display, return True.
                    If the query is asking for a table, text-based response, or any non-visual information, return False.

                    Only return True or False, considering both the recent query context and the content of USER_QUERY."""

    response_text = await invoke_model(intent_prompt)
    return response_text


async def generate_visualization_code(user_query, items_org, physician_items, physician_private_items, chat_id):
    chat_history = await get_chat_history(chat_id)
    chat_history = chat_history[-1:]
    formatted_history = "\n".join([f"Previous Query: {query}" for query in chat_history])
    prompt = f"""

            Chat History (Last query):
            {formatted_history}
            Query Classification:

            "New Query": Classify as "New" if USER_QUERY is independent and unrelated to previous topics.
            "Follow-up Query": Classify as "Follow-up" if USER_QUERY builds on, clarifies, or relates to the last query in formatted history.

            Response Strategy:

            For "New" queries:

            Generate plain HTML code based solely on the USER_QUERY content, without referencing prior chat history.
            Avoid adding context or continuity unless explicitly specified in the query.
            Use only the available data variables: items_org, physician_items, physician_private_items
            Analyze data structure at runtime

            For "Follow-up" queries:

            Always review the last query in formatted history and adapt the new code as an extension of the previous visualization.
            Preserve the previous component structure where applicable, making only the requested modifications.
            Aim for consistency with the last query's visualization style and data where a relationship exists.
            Modify the existing visualization while maintaining dynamic data handling
            Update data processing logic based on actual data structure

            Generate a Plain HTML that creates an interactive visualization based on the user query using ONLY the following data sources:
            
            USER QUERY: {user_query}

            AVAILABLE DATA:
            {physician_items}
            {physician_private_items}
            {items_org}

            The code can use any javascript library with a consistent color theme, based on the user's specific query and the available data provided below.

            Data Source Integration:
                - Component MUST accept all three data sources as props (physician_items,physician_private_items,items_org) everytime without fail.
                - Process all available data sources, not just one (physician_items,physician_private_items,items_org) everytime.
                - Handle cases where one or more data sources might be empty/null
                - Continue visualization with available data even if some sources are empty
                - Show clear indication of which sources contributed to the visualization
                - No dummy or sample data allowed
                - Use only the provided data sources
                - Key and values used in the data source should be exactly used in the html code for visualization.
                - Never include the data in the HTML code .Instead use the variable provided in the HTML Code(physician_items,physician_private_items,items_org)

            Data Availability Handling:
                - Check each data source independently for availability
                - Process visualization with partial data if some sources are empty
                - Provide visual indication of which sources are included
                - Maintain visualization integrity even with missing sources

            Component Structure:
                - Accept props for all three data sources
                - Process data dynamically at runtime
                - Create visualization based on actual data contents
                - Handle missing or empty data sources gracefully

            Visualization:
                - Use Javascript libraries
                - Choose appropriate chart type based on data
                - Include interactive features (tooltips, hover effects)
                - Show meaningful labels and legends
                - Implement responsive container
                - Give appropriate based on the User Query.

            Error Handling:
                - Handle empty data sources
                - Process malformed data gracefully
                - Provide fallback UI for errors
                - Show loading states if needed
                
            ADDITIONAL CHART SPECIFICATIONS

            ## Column Chart Configurations:
            - Y-Axis Options:
              1. Primary Measurement:
                 - Can be numeric (count, percentage, monetary value)
                 - Support for stacked columns
                 - Option for secondary y-axis for comparative metrics
              2. X-Axis Configurations:
                 - Maximum 10-15 labels to ensure readability
                 - Implement horizontal scrolling for overflow
              3. Interactive Features:
                 - Hover tooltips showing detailed values
                 - Click interactions for drill-down details
                 - Color coding based on value ranges
            
            ## Pie Chart Specifications:
            - Measurement Units:
              - Percentages
              - Absolute numbers
              - Proportional representations
            - Pie Piece Configurations:
              - Maximum 6-8 distinct pieces
              - "Others" category for aggregating smaller segments
            - Labeling Strategy:
              - Percentage display
              - Absolute value option
              - Color-coded segments
              - Hover interactions for detailed information
            - Accessibility:
              - High contrast color schemes
              - Screen reader compatible labels
            
            ## Network Node Diagram/Node Analysis/Network Analysis Parameters:
            - Node Count:
              - Generate approximately 20-30 nodes with a mix of central and peripheral nodes.
            - Node Positioning:
              - Use a force-directed layout to emphasize relationships and connections.
              - Ensure clear spacing between nodes to reduce visual clutter.
              - Group related nodes together in a visually intuitive way, forming clusters or categories.
            - Connection Design:
              - Represent connections with curved or straight lines, clearly indicating relationships.
              - Use multiple line colors to signify different types of connections or interactions.
            - Node Characteristics:
              - Always display nodes as circles.
              - Node size should be proportional to their relative importance or interaction frequency.
              - Always use different colors to distinguish the nodes.
            - Interaction Design:
              - Include hover tooltips to display node details (e.g., name, category, metrics).
              - Allow users to click on nodes to expand and view more details
              - Allow zooming and panning for better navigation of the diagram.
            - Visual Optimization:
              - Use Canvas-based or WebGL rendering for smooth performance
              - Optimize the force-directed simulation for fluid and efficient positioning.
            - Key visualization features:
                - Maintain a clear visual hierarchy with larger, more central nodes for important entities.
                - Use interactive elements to improve usability.
                - Ensure distinct labeling with readable fonts.
                - Add a legend to explain the meanings of node colors, sizes, and connection line types.
                - Curved connection lines
                - Design the layout to minimize overlap while showcasing key relationships and clusters.
            
            ## Bubble Chart Specifications:
            - Axis Measurements:
              - Y-Axis: Quantitative metric (performance, value)
              - X-Axis: Categorical or time-based progression
            - Bubble Characteristics:
              - Size representing magnitude/volume
              - Color indicating additional categorical information
            - Labeling Strategy:
              - Top 15-20 bubbles labeled
              - Hover tooltips for complete details
              - Legends for bubble size and color meaning
            - Interaction Features:
              - Zoom and filter capabilities
              - Dynamic data range adjustments
            
            ## Word Cloud Generation:
            - Text Source: Directly from provided data sources
            - Configuration:
              - Maximum 50-100 words
              - Size proportional to word frequency
              - Color gradient based on word significance
              - Exclude common stopwords
            - Interaction:
              - Hover details
              - Click to filter or drill down
            - Rendering:
              - SVG-based for crisp display
              - Responsive design

            Dont not give any introductory or end statements
            Generate ONLY the HTML code that processes these data sources and creates a visualization.
            Generate the full HTML necessary to render the chart in an html iframe.
            """
    await store_query_and_response(chat_id, user_query)
    visualize_code = ""
    async for chunk in invoke_model_stream(prompt):
        visualize_code += chunk
        yield chunk

    yield "\n --------------------------------------------------------- \n"

    async for detail_chunk in graph_definition(visualize_code):
        yield detail_chunk


async def graph_definition(visualize_code):
    prompt = f"""

            The following HTML Code generates a visualization based on specific business data and user requirements. Your task is to provide a brief, business-oriented explanation of the chart produced, with a focus on how it addresses the user’s query and the value it offers.

            HTML Code :{visualize_code}

            The explanation should include:
            - The main purpose of the visualization in addressing the user’s question or business need.
            - Key metrics, categories, or data points displayed in the chart and how they help to answer the user’s query.
            - Any insights the visualization reveals about the business data, trends, or patterns.
            - Practical use cases or applications of the chart insights for decision-making, strategy, or operational improvement.

            Avoid technical or HTML-related details. Instead, focus on what the visualization communicates from a business perspective and how the user can interpret it to gain value from their data.

    """
    async for chunk in invoke_model_stream(prompt):
        yield f"{chunk}"


async def process_query(user_query: str, items_org, physician_items, physician_private_items, chat_id) -> str:
    """
    Process a user query and generate an react code for an artifact.
    """

    visualize_code, chart_details = await generate_visualization_code(user_query, items_org, physician_items,physician_private_items, chat_id)
    print(visualize_code)
    print(chart_details)
    return visualize_code, chart_details