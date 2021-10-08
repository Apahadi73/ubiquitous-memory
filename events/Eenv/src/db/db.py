from flask_sqlalchemy import SQLAlchemy
from datetime import datetime


db = SQLAlchemy()

# our Event model
class EventModel(db.Model):
    
    __tablename__ = "users"
    
    eid = db.Column('eid', db.Integer, primary_key = True, autoincrement = True)
    chatId = db.Column(db.Integer)
    name = db.Column(db.String(100))
    eventtype = db.Column(db.String(50))  
    contactnumber = db.Column(db.String(50))  
    startdate = db.Column(db.String(50))  
    enddate = db.Column(db.String(50))  
    address = db.Column(db.String(200))
    host = db.Column(db.String(200))
    description = db.Column(db.String(500))
    datecreated = db.Column(db.DateTime,default=datetime.utcnow)
    
    def __init__(self,name,eventtype,contactnumber,startdate,enddate,address,host,description):
        self.name = name
        self.eventtype = eventtype
        self.contactnumber = contactnumber
        self.startdate = startdate
        self.enddate = enddate
        self.address = address
        self.host = host
        self.description = description
        
    
    def __repr__(self) -> str:
        return f"{self.name}:{self.eid}"


