from pydantic import BaseModel, Field

class UserResponse(BaseModel):
    email: str
    fullname: str