import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
from datetime import datetime
import geohash

# --- Firebase Initialization ---
try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Failed to initialize Firebase: {e}")
    db = None

app = FastAPI()

# --- Pydantic Models ---
class User(BaseModel):
    id: str = str(uuid.uuid4())
    username: str
    created_at: str = str(datetime.utcnow())

class Yip(BaseModel):
    id: str = str(uuid.uuid4())
    user_id: str
    content: str
    latitude: float
    longitude: float
    geohash: str | None = None
    created_at: str = str(datetime.utcnow())
    upvotes: int = 0
    downvotes: int = 0
    comments: list = []

class Comment(BaseModel):
    id: str = str(uuid.uuid4())
    user_id: str
    content: str
    created_at: str = str(datetime.utcnow())

class Vote(BaseModel):
    user_id: str
    direction: str # "up" or "down"

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"Hello": "YipYap"}

@app.post("/users", response_model=User)
def create_user(user: User):
    if not db:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    user_dict = user.dict()
    db.collection("users").document(user.id).set(user_dict)
    return user

@app.post("/yips", response_model=Yip)
def create_yip(yip: Yip):
    if not db:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
    
    yip.geohash = geohash.encode(yip.latitude, yip.longitude)
    yip_dict = yip.dict()
    db.collection("yips").document(yip.id).set(yip_dict)
    return yip

@app.get("/yips/{geohash_prefix}")
def get_yips_by_location(geohash_prefix: str):
    if not db:
        raise HTTPException(status_code=500, detail="Firebase not initialized")
        
    query = db.collection("yips").where("geohash", ">=", geohash_prefix).where("geohash", "<", geohash_prefix + u"\uf8ff")
    yips_ref = query.stream()
    yips = [yip.to_dict() for yip in yips_ref]
    return yips

@app.post("/yips/{yip_id}/vote")
def vote_on_yip(yip_id: str, vote: Vote):
    if not db:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    yip_ref = db.collection("yips").document(yip_id)
    yip = yip_ref.get()

    if not yip.exists:
        raise HTTPException(status_code=404, detail="Yip not found")

    if vote.direction == "up":
        yip_ref.update({"upvotes": firestore.Increment(1)})
    elif vote.direction == "down":
        yip_ref.update({"downvotes": firestore.Increment(1)})
    else:
        raise HTTPException(status_code=400, detail="Invalid vote direction")

    return {"message": "Vote successful"}

@app.post("/yips/{yip_id}/comments")
def add_comment_to_yip(yip_id: str, comment: Comment):
    if not db:
        raise HTTPException(status_code=500, detail="Firebase not initialized")

    yip_ref = db.collection("yips").document(yip_id)
    yip = yip_ref.get()

    if not yip.exists:
        raise HTTPException(status_code=404, detail="Yip not found")

    yip_ref.update({"comments": firestore.ArrayUnion([comment.dict()])})

    return comment
