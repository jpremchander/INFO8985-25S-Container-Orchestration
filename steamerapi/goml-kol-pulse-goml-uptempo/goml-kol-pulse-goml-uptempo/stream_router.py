import streamlit as st
import json
from typing import List, Dict, Optional
import asyncio
from time import sleep

# Import your existing services
# Assuming these files are in the correct location
from src.services.process import model_output,check_redundancy
from src.services.table_classes import data_dynamodb, ModelQueryRequest


st.set_page_config(
        page_title="Model Query Interface",
        page_icon="🔍",
        layout="wide"
    )
st.title("Model Query Interface")

# Create a sidebar for input parameters
st.sidebar.header("Query Parameters")

def parse_org_ids(input_str: str) -> List[str]:
    """Convert comma-separated string input to list of strings"""
    if not input_str:
        return []
    # Split by comma and clean up each value
    return [id.strip() for id in input_str.split(',') if id.strip()]

# Input fields
user_query = st.sidebar.text_area("Enter your query:", height=150)
# org_id = st.sidebar.text_input("Organization ID:")
org_id_input = st.sidebar.text_input(
        "Organization IDs",
        help="Enter multiple organization IDs separated by commas (e.g., id1,id2,id3)"
    )
org_id = parse_org_ids(org_id_input)
physician_id = st.sidebar.text_input("Physician ID:")
tag_name = st.sidebar.text_input("Tag Name:")

# Create a submit button
if st.sidebar.button("Submit Query"):
    # if user_query and org_id and physician_id and tag_name:
    try:
        # Show a spinner while processing
        with st.spinner("Processing your query..."):
            # Get data from DynamoDB
            items_org, physician_items, physician_private_items = data_dynamodb(
                org_id, physician_id, tag_name
            )

            # Get model output
            response_text = model_output(
                user_query,
                items_org,
                physician_items,
                physician_private_items
            )
            message_placeholder = st.empty()  # Create new placeholder
            refined_response = ""
            response = check_redundancy(user_query,response_text)

            for chunk in response:
                refined_response += chunk
                message_placeholder.markdown(refined_response + "▌")
                sleep(0.01)  # Optional: add slight delay for visual effect

                # Update with final refined response without cursor
            message_placeholder.markdown(refined_response)

            # print("---------------------")
            # print(response)
            # # Display results
            # st.header("Query Results")
            #
            # # If response is a dictionary or complex object
            # if isinstance(response, (dict, list)):
            #     st.json(response)
            # else:
            #     st.write(response)

            # Add a success message
            st.success("Query processed successfully!")

    except Exception as e:
        st.error(f"An error occurred: {str(e)}")
        st.exception(e)



