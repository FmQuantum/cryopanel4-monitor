from django.shortcuts import render

def index(request):
    sensors = [
        { 'id': 'channel_1', 'name': 'Sensor 1', 'channel': 'sensor1', "heartbeat": 'heart1', 'update': 'update1', 'active': True },
        { 'id': 'channel_2', 'name': 'Sensor 2', 'channel': 'sensor2', "heartbeat": 'heart2', 'update': 'update2', 'active': True },
        { 'id': 'channel_3', 'name': 'Sensor 3', 'channel': 'sensor3', "heartbeat": 'heart3', 'update': 'update3', 'active': True },
        { 'id': 'channel_4', 'name': 'Sensor 4', 'channel': 'sensor4', "heartbeat": 'heart4', 'update': 'update4', 'active': True },

        # { 'id': 'channel_5', 'name': 'Sensor 5', 'channel': 'sensor5', "heartbeat": 'heart5', 'update': 'update5', 'active': True },
        # { 'id': 'channel_6', 'name': 'Sensor 6', 'channel': 'sensor6', "heartbeat": 'heart6', 'update': 'update6', 'active': True },
        # { 'id': 'channel_7', 'name': 'Sensor 7', 'channel': 'sensor7', "heartbeat": 'heart7', 'update': 'update7', 'active': True },
        # { 'id': 'channel_8', 'name': 'Sensor 8', 'channel': 'sensor8', "heartbeat": 'heart8', 'update': 'update8', 'active': True },

        # { 'id': 'channel_9', 'name': 'Sensor 9', 'channel': 'sensor9', "heartbeat": 'heart9', 'update': 'update9', 'active': True },
        # { 'id': 'channel_10', 'name': 'Sensor 10', 'channel': 'sensor10', "heartbeat": 'heart10', 'update': 'update10', 'active': True },
        # { 'id': 'channel_11', 'name': 'Sensor 11', 'channel': 'sensor11', "heartbeat": 'heart11', 'update': 'update11', 'active': True },
        # { 'id': 'channel_12', 'name': 'Sensor 12', 'channel': 'sensor12', "heartbeat": 'heart12', 'update': 'update12', 'active': True },
        
    ]
    # sensor4 = [
    #     { 'id': 'channel_4', 'name': 'Sensor 4', 'channel': 'sensor4', "heartbeat": 'heart4', 'update': 'update4', 'active': True }
    # ]
    sensor_amount = len(sensors)
    # sensor_amount = 6
    return render(request, 'index2.html', 
                  context={
                    #   'text': 'Please wait, Data will be fetched within 60 seconds!',
                      'sensors': sensors,
                      # 'sesor4': sensor4,
                      'sensor_amount': sensor_amount
                      })


