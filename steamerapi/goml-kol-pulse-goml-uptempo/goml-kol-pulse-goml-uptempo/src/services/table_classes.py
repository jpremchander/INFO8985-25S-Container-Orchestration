import boto3
import json
from decimal import Decimal
import os
from typing import List, Dict, Any
from pydantic import BaseModel
from boto3.dynamodb.conditions import Key,Attr


aws_access_key_id = os.environ.get("AWS_ACCESS_KEY_ID")
aws_secret_access_key= os.environ.get("AWS_SECRET_ACCESS_KEY")


dynamodb_client = boto3.client(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)
dynamodb_resource = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key
)

def data_dynamodb(org_id,physician_id,tag_name,query_intent):
    """
    Args:
        org_id: Organization id
        physician_id: Physician id
        tag_name: Unique tag name

    Returns:
        Data for these respective ids
    """

    org_content_table = dynamodb_resource.Table('organizationContent-dev')
    phy_content_table = dynamodb_resource.Table('physicianContent-dev')
    phy_private_content_table = dynamodb_resource.Table('physicianPrivateContent-dev')

    matched_urls = []
    items_org = []
    physician_items = []
    physician_private_items = []


    if query_intent == 'True':
        selected_columns = "#u,likes,public_metrics,retweets,sentiment,tags,#t,description,#us"
    else:
        selected_columns = "#u,organizationId,likes,media,physicians,public_metrics,quotes,retweets,sentiment,tags,#t,description,#us,detectedText,detectedTextVideo"

    formatted_org_id = ','.join([f"'{id}'" for id in org_id])


    try:
        items = []
        next_token = None
        while True:
            args = {
                "Statement": f"""
                            SELECT tagUrl
                            FROM "organizationContentTag-dev"
                            WHERE organizationId IN ({formatted_org_id})
                        """
            }

            if next_token:
                args["NextToken"] = next_token
            response = dynamodb_client.execute_statement(**args)
            items.extend(response.get('Items', []))
            next_token = response.get('NextToken')
            if not next_token:
                break

        for item in items:
            tag_url_parts = item['tagUrl']['S'].split('|')
            if tag_name:
                if tag_url_parts[0].strip().lower() == tag_name.strip().lower():
                    if len(tag_url_parts) > 1:
                        matched_urls.append(tag_url_parts[1])

        for id in org_id:
            for url in matched_urls:
                response = org_content_table.query(
                    KeyConditionExpression=Key('organizationId').eq(id) &
                                           Key('url').eq(url),
                    ProjectionExpression=selected_columns,
                    ExpressionAttributeNames={"#u": "url","#t": "text","#us": "user"}
                )
                items_org.extend(response['Items'])
        if physician_id:
            response_physician = phy_content_table.query(
                KeyConditionExpression=Key('physicianId').eq(physician_id),
                ProjectionExpression=selected_columns,
                ExpressionAttributeNames={"#u": "url", "#t": "text", "#us": "user"}
            )
            physician_items.extend(response_physician['Items'])
            for id in org_id:
                orgphyid = id + "|" + physician_id
                response_physician_content = phy_private_content_table.query(
                    KeyConditionExpression=Key('orgIdPhysId').eq(orgphyid),
                    ProjectionExpression=selected_columns,
                    ExpressionAttributeNames={"#u": "url", "#t": "text", "#us": "user"}
                )
                physician_private_items.extend(response_physician_content['Items'])

        return items_org,physician_items,physician_private_items

    except Exception as e:
        print(f"Error fetching data: {e}")
        return None


class RequestBody(BaseModel):
    user_query: str
    org_id: List[str]
    physician_id: str
    tag_name: str
    chat_id: str


class ModelQueryRequest(BaseModel):
    body: RequestBody