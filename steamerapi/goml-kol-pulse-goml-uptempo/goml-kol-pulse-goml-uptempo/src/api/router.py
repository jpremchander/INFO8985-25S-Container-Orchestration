
from fastapi import APIRouter, HTTPException, Depends
import json
import asyncio
from typing import List, Dict, Optional, AsyncGenerator
from fastapi.responses import StreamingResponse

from src.services.process import model_output,check_redundancy, process_query, analyze_query_intent,generate_visualization_code, graph_definition
from src.services.table_classes import data_dynamodb, ModelQueryRequest

app = APIRouter()





@app.post("/querying/model_response", tags=["model_query"])
async def model_responses(request:ModelQueryRequest):
    try:
        user_query = request.body.user_query
        org_id = request.body.org_id
        physician_id = request.body.physician_id
        tag_name = request.body.tag_name
        chat_id = request.body.chat_id
        query_intent = await analyze_query_intent(chat_id, user_query)
        print(query_intent)
        items_org,physician_items,physician_private_items = data_dynamodb(org_id,physician_id,tag_name,query_intent)


        if query_intent == 'True':
            return StreamingResponse(
                (chunk async for chunk in generate_visualization_code(user_query, items_org, physician_items,
                                                                      physician_private_items, chat_id)),
                media_type="text/plain"
            )

        else:
            final_response = await model_output(user_query, items_org, physician_items, physician_private_items,
                                                chat_id)
            return StreamingResponse(
                (chunk async for chunk in check_redundancy(chat_id, user_query, final_response)),
                media_type="text/plain"
            )

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Internal server error")



