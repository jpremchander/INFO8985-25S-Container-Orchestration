import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class AWSParams:
    """
    Class to handle AWS related parameters.
    
    Attributes:
        AWS_ACCESS_KEY_ID (str): Access key ID for AWS.
        AWS_SECRET_ACCESS_KEY (str): Secret access key for AWS.
        AWS_SESSION_TOKEN (str): Session token for AWS.
        REGION (str): AWS region.
        PROFILE_NAME (str): AWS profile name, default is 'seeded_home'.
    """
    AWS_ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID", os.getenv("AWS_ACCESS_KEY_ID"))
    AWS_SECRET_ACCESS_KEY = os.getenv("SECRET_ACCESS_KEY", os.getenv("AWS_SECRET_ACCESS_KEY"))
    AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
    REGION = os.getenv("REGION")
    PROFILE_NAME = os.getenv("PROFILE_NAME", "seeded_home")


class ModelParams:
    """
    Class to handle model related parameters.
    
    Attributes:
        EMBEDDING_MODEL_NAME (str): Name of the embedding model.
        RANKING_MODEL_NAME (str): Name of the ranking model.
        MODEL_ID (str): Model identifier.
    """
    EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME")
    RANKING_MODEL_NAME = os.getenv("RANKING_MODEL_NAME")
    MODEL_ID = os.getenv("MODEL_ID")


class MongoDBParams:
    """
    Class to handle MongoDB related parameters.
    
    Attributes:
        URL (str): URL for MongoDB.
        DB_NAME (str): Database name for MongoDB.
        COLLECTION_NAME (str): Collection name for MongoDB.
    """
    URL = os.getenv("MONGODB_URL")
    DB_NAME = os.getenv("MONGODB_DB_NAME")
    COLLECTION_NAME = os.getenv("MONGODB_COLLECTION_NAME")
