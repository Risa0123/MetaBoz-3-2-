from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import ForeignKey
from datetime import datetime


class Base(DeclarativeBase):
    pass

class ActivitiesHeart(Base):
    __tablename__ = 'activities_heart'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column()
    restingHeartRate: Mapped[int] = mapped_column()

class HeartRateZones(Base):
    __tablename__ = 'heart_rate_zones'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    activity_heart_id: Mapped[int] = mapped_column(ForeignKey("activities_heart.id"))
    name: Mapped[str] = mapped_column()
    min: Mapped[int] = mapped_column()
    max: Mapped[int] = mapped_column()
    minutes: Mapped[int] = mapped_column()
    caloriesOut: Mapped[float] = mapped_column()

class HeartRateIntraday(Base):
    __tablename__ = 'heart_rate_intraday'
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    time: Mapped[str] = mapped_column()
    value: Mapped[int] = mapped_column()


class Purchases(Base):
    __tablename__ = 'purchases'
    purchase_id:Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    purchase_name:Mapped[str] = mapped_column(ForeignKey("customers.customer_id"))
    date:Mapped[datetime] = mapped_column()
 

class PurchaseDetails(Base):
    __tablename__ = 'purchase_details'
    purchase_id:Mapped[int] = mapped_column(ForeignKey("purchases.purchase_id"), primary_key=True)
    item_name:Mapped[str] = mapped_column(ForeignKey("items.item_id"), primary_key=True)
    quantity:Mapped[int] = mapped_column()
 
class Customers(Base):
    __tablename__ = 'customers'
    customer_id: Mapped[str] = mapped_column(primary_key=True)
    customer_name: Mapped[str] = mapped_column()
    age: Mapped[int] = mapped_column()
    gender: Mapped[str] = mapped_column()