import os
from flask import Flask, json, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from src.utils.logger import init_logger
from src.db.db import db,EventModel
from flask_marshmallow import Marshmallow

app = Flask(__name__)

# injects environment variable here
env_config = os.getenv("APP_SETTINGS", "config.DevelopmentConfig")
app.config.from_object(env_config)

# connect db with our app
db.init_app(app)
ma = Marshmallow(app)

class EventModelSchema(ma.Schema):
    class Meta:
        fields = ('eid','name','eventtype','contactnumber','startdate','enddate','address','host','description','chatId')

event_model_schema = EventModelSchema()
events_model_schema = EventModelSchema(many=True)

@app.before_first_request
def create_table():
    db.create_all()
    logger.info("Events relation created")

@app.route("/",methods=["GET"])
def index():
    return jsonify("Welcome to events service")

@app.route('/api/events/',methods = ["POST"])
def createNewEvent():
    eventInfo = request.get_json()
    try:
        add_new_event(eventInfo)
        return jsonify(eventInfo)
    except:
        return jsonify("Something went wrong. Please check the data and try again")


@app.route('/api/events/',methods = ["GET"])
def getEvents():
    events = EventModel.query.all()
    result = events_model_schema.dump(events)
    return jsonify(result)

@app.route('/api/events/<int:eid>',methods = ["GET"])
def getEventbyId(eid):
    event = EventModel.query.filter_by(eid=eid).first()
    result = event_model_schema.dump(event)
    return jsonify(result)

@app.route('/api/events/<int:eid>/update',methods = ["POST"])
def updateEvent(eid):
    try:    
        eventInfo = request.get_json()
        event = EventModel.query.filter_by(eid=eid).first()
        if event:
            # delete th event first from the database
            db.session.delete(event)
            db.session.commit()
            add_new_event(eventInfo)
            return jsonify(eventInfo)
    except:
        return jsonify("Something went wrong. Please check the data and try again")

@app.route('/api/events/<int:eid>/delete', methods=['DELETE'])
def delete(eid):
    event = EventModel.query.filter_by(eid=eid).first()
    if event:
        db.session.delete(event)
        db.session.commit()
        return jsonify("Successfully delete event: "+str(event.name))
    return jsonify("Could not find the event to delete!")

@app.route('/api/events/<int:eid>/chat', methods=['POST'])
def createChat(eid):
    event = EventModel.query.filter_by(eid=eid).first()
    if event:
        event.chatId = event.eid
        db.session.commit()
        return jsonify("Successfully created chat "+str(event.chatId))
    return jsonify("Could not find the event")

@app.route('/api/events/<int:eid>/chat', methods=['DELETE'])
def deleteChat(eid):
    event = EventModel.query.filter_by(eid=eid).first()
    if event:
        id = event.chatId
        event.chatId = None
        db.session.commit()
        return jsonify("Successfully deleted chat "+str(id))
    return jsonify("Could not find the chat to delete!")

def add_new_event(eventInfo):
    # extract all the data from json body
    name = eventInfo["name"]
    eventtype = eventInfo["eventtype"]
    contactnumber = eventInfo["contactnumber"]
    startdate = eventInfo["startdate"]
    enddate = eventInfo["enddate"]
    address = eventInfo["address"]
    host = eventInfo["host"]
    description = eventInfo["description"]
            
    # write new event data to the db
    new_event = EventModel(name=name,eventtype=eventtype,contactnumber=contactnumber,startdate=startdate,enddate=enddate,address=address,host=host,description=description)
    db.session.add(new_event)
    db.session.commit()

if __name__ == '__main__':
    logger = init_logger(__name__, testing_mode=False)
    app.run(host="localhost",port="5000",debug=app.config.get("DEBUG"))