from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.preferences import Preferences
from app.schemas.preferences import PreferencesUpdate

async def get_preferences(db: AsyncSession, user_id: int) -> Preferences | None:
    q = await db.execute(select(Preferences).filter_by(user_id=user_id))
    return q.scalars().first()

async def create_preferences(db: AsyncSession, user_id: int) -> Preferences:
    prefs = Preferences(user_id=user_id)
    db.add(prefs)
    await db.commit()
    await db.refresh(prefs)
    return prefs

async def update_preferences(
    db: AsyncSession,
    user_id: int,
    data: PreferencesUpdate,
) -> Preferences:
    prefs = await get_preferences(db, user_id) or await create_preferences(db, user_id)
    updates = data.dict(exclude_unset=True, by_alias=True)
    for field, value in updates.items():
        setattr(prefs, field, value)
    await db.commit()
    await db.refresh(prefs)
    return prefs
