import traceback
from django.utils import timezone
import pytz
from pytz import timezone as pytz_timezone
from django.shortcuts import render
from django.http import JsonResponse
from .models import ChannelLogStatus, DataLog, AlarmLog, ConnectionsLostLog
import json
from datetime import datetime, timedelta
from django.utils.timezone import make_aware

from django.views.decorators.csrf import csrf_exempt



def index(request):
    sensors = [
        { 'id': 'channel_1', 'name': 'Sensor 1', 'custom_name': '', 'channel': 'sensor1', "heartbeat": 'heart1', 'update': 'update1', 'active': True },
        { 'id': 'channel_2', 'name': 'Sensor 2', 'custom_name': '', 'channel': 'sensor2', "heartbeat": 'heart2', 'update': 'update2', 'active': True },
        { 'id': 'channel_3', 'name': 'Sensor 3', 'custom_name': '', 'channel': 'sensor3', "heartbeat": 'heart3', 'update': 'update3', 'active': True },
        { 'id': 'channel_4', 'name': 'Sensor 4', 'custom_name': '', 'channel': 'sensor4', "heartbeat": 'heart4', 'update': 'update4', 'active': True },

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



previous_channels_data = {}
last_save_time = None
last_save_time_alarm = None


# convert time to bst
def convert_to_bst_time(bst_time):
    bst_tz = pytz_timezone('Europe/London')
    bst_time = bst_time.astimezone(bst_tz)
    return bst_time.strftime('%Y-%m-%d %H:%M:%S')

# retrive latest channel logs from database get method used in socket.js to pass from views.py to socket.js we define url in urls.py
def get_channel_log_data(request):
    if request.method == 'GET':
        try:
            last_log = ChannelLogStatus.objects.order_by('-created').first()
            
            bst = convert_to_bst_time(last_log.created)
            
            channel_log_data = {'created': bst, 'data': last_log.data}
            return JsonResponse(channel_log_data)
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({'views.py from get_channel_log_data() status --> retrive_data': 'error', 'message': str(e)})
    else:
        return JsonResponse({'views.py from get_channel_log_data() status --> retrive_data': 'error', 'message': 'Invalid request method'})


# CSRF decorator protection is important for forms and other sensitive data submission methods where the server needs to ensure that the request is coming from a legitimate source.
@csrf_exempt
def save_data(request):
    global previous_channels_data
    global last_save_time
    global last_save_time_alarm
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # print(f'views.py from save_data() var --> {data} type --> {type(data)}')
            channels_data = data
            channels_dict = data['data']
            # print(f'views.py from save_data() channel dict --> {channels_dict}')
            alarm_status = data['data']['Alarm']
            channels_status = data['data']['Channels']
            data_time_msg = data['date_time']
            # print(f'views.py from save_data() Channels_data --> {channels_data}')
            # print(f'views.py from save_data() {data_time_msg} alarm_status --> {alarm_status}')
            date_time = datetime.strptime(data['date_time'], '%m/%d/%Y %H:%M:%S')
            aware_date_time = make_aware(date_time)

            if channels_data is None:
                return JsonResponse({'views.py from save_data() status': 'error', 'message': 'No channel data provided'})
            
            alarm_sensors = []
            for ch_key, ch_value in data['data']['Channels'].items():
                value = float(ch_value['value'])
                if value != 0 and (value >= 20.8 or value <= 19.5):
                    alarm_sensors.append(ch_key)
            # print(f'views.py from save_data() alarm_keys_array --> {alarm_sensors}')

            # Combine alarm_status and alarm_array
            data_alarm = {'alarm_status': alarm_status, 'sensors': alarm_sensors}

            channels_log = ChannelLogStatus(created=aware_date_time, data=channels_status)
            data_log = DataLog(created=aware_date_time, data=channels_data)
            alarm_log = AlarmLog(created=aware_date_time, data=data_alarm)

            current_time = datetime.now()
            # print(f'views.py from save_data() {current_time}')
            # print(f'views.py from save_data() {type(current_time)}')
            if channels_dict != previous_channels_data:
                previous_channels_data = channels_dict
                last_save_time = current_time
                channels_log.save()
                data_log.save()
                # print("views.py from save_data() Data will be saved bacause we had a change in status")
            else:
                if current_time - last_save_time >= timedelta(minutes=5):
                    last_save_time = current_time
                    # print(f'views.py from save_data() OLD preavius_channels_data --> {last_save_time} --> {previous_channels_data}')
                    data_log.save()
                    print("views.py from save_data() 5 minutes are passed data will be saved!")
                else:
                    print("views.py 5 minutes are not passed yet data wont be saved!")

            # data_log.save()
            # alarm_log.save()
            
            if alarm_status != 'Normal':
                alarm_log.save()
            else:
                if last_save_time_alarm == None:
                        last_save_time_alarm = current_time
                        alarm_log.save()
                        # print(f'views.py from save_data() last_save_time_alarm --> {last_save_time_alarm}')
                elif current_time - last_save_time_alarm >= timedelta(minutes=5):
                    last_save_time_alarm = current_time
                    alarm_log.save()
                    # print("views.py from save_data() alarm successfully saved!")
                else:
                    print("views.py from save_data() alarm not saved yet!")

            return JsonResponse({'views.py from save_data() status --> save_data': 'success'})
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({'views.py views.py from save_data() status --> save_data': 'error', 'message': str(e)})
    else:
        return JsonResponse({'views.py from save_data() status --> save_data': 'error', 'message': 'Invalid request method'})


@csrf_exempt
def save_connection_lost(request):
    
    if request.method == 'POST':
        try:
            # request.body is in bytes so we need to decode to convert it properly to string with json loads
            # print(f"views.py from save_connection_lost() request body --> {request.body} type --> {type(request.body)}")
            data = json.loads(request.body.decode())

            timestamp_string = data['timestamp']
            timestamp = json.loads(timestamp_string)
            application_closed_value = timestamp['applicationClosed']
            print(f'views.py from save_connection_lost() timestamp powercut application --> {application_closed_value} type --> {type(application_closed_value)}')
            date_time = datetime.strptime(application_closed_value, '%m/%d/%Y, %H:%M:%S')
            aware_date_time = make_aware(date_time)
            powercut = ConnectionsLostLog(created=aware_date_time, data=timestamp)
            powercut.save()
            return JsonResponse({'views.py from save_connection_lost() status -->': 'success'})
        except (json.JSONDecodeError, KeyError) as e:
            return JsonResponse({'views.py from save_connection_lost() status -->': 'error', 'message': str(e)})
    else:
        return JsonResponse({'views.py from save_connection_lost() status -->': 'error', 'message': 'Invalid request method'})










