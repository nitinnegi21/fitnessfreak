"""
Course data — acts as the static data layer.
Swap this out for a DB model (SQLAlchemy / Beanie) later without touching routes.
"""

from typing import Optional
from pydantic import BaseModel


class Course(BaseModel):
    name: str
    emoji: str
    tag: str
    price: str
    desc: str


COURSES: list[Course] = [
    Course(
        name="Zumba",
        emoji="💃",
        tag="Dance • Cardio",
        price="₹399/month",
        desc=(
            "High-energy dance cardio set to Latin & international music. "
            "60-minute sessions, all fitness levels welcome. Burns 400–600 kcal/session."
        ),
    ),
    Course(
        name="Yoga",
        emoji="🧘",
        tag="Flexibility • Mind",
        price="₹299/month",
        desc=(
            "Breath-led movement and stillness. Beginner to advanced tracks covering "
            "Hatha, Vinyasa, and Yin styles. Great for stress, posture, and mobility."
        ),
    ),
    Course(
        name="Strength Training",
        emoji="🏋️",
        tag="Power • Muscle",
        price="₹499/month",
        desc=(
            "Progressive overload programming to build real, lasting strength. "
            "Includes compound lifts, periodisation plans, and nutrition guidance."
        ),
    ),
    Course(
        name="Fitness Training",
        emoji="🔥",
        tag="Conditioning • All-round",
        price="₹399/month",
        desc=(
            "Full-body conditioning blending HIIT, mobility work, and functional "
            "movements. Ideal if you want overall fitness without specialising."
        ),
    ),
]


def get_all_courses() -> list[Course]:
    return COURSES


def find_course_by_text(text: str) -> Optional[Course]:
    """Match by number (1-4) or partial course name."""
    t = text.strip().lower()
    if t in {"1", "2", "3", "4"}:
        return COURSES[int(t) - 1]
    for course in COURSES:
        if course.name.lower() in t:
            return course
    return None
