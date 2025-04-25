from pydantic import BaseModel, ConfigDict
from typing import Optional, List


# Helper to convert snake_case to camelCase
def to_camel(string: str) -> str:
    parts = string.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])

# Job schema
class JobBase(BaseModel):
    company: Optional[str]
    job_title: Optional[str]
    job_description: Optional[str]
    salary_range: Optional[str]
    location: Optional[str]
    experience: Optional[str]
    work_type: Optional[str]
    skills: Optional[List[str]] = []

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

# JobCreate schema
class JobCreate(JobBase):
    pass

# JobUpdate schema
class JobUpdate(JobBase):
    pass

# JobOut schema
class JobOut(JobBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True
    )
