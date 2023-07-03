import serial
from serial.serialutil import SerialException
from asgiref.sync import async_to_sync
import json
from random import randint
from time import sleep
from threading import Thread
import time
import datetime
# from time import strftime, gmtime
import pytz
import re
import asyncio
import random


# from .models import ChannelLogStatus, DataLog
# from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer



# class WSConsumer(WebsocketConsumer):
#     def connect(self):
#         self.accept()

#         self.serial = serial.Serial(
#             port='/dev/ttyUSB0',
#             baudrate=9600,
#             bytesize=serial.EIGHTBITS,
#             parity=serial.PARITY_NONE,
#             stopbits=serial.STOPBITS_ONE,
#             timeout=1
#         )

#         # start a thread to read data from serial port and send over WebSocket
#         self.read_data_thread = Thread(target=self.read_data)
#         self.read_data_thread.daemon = True
#         self.read_data_thread.start()

#     # closes the serial port when the WebSocket connection is closed
#     def disconnect(self, close_code):
#         self.serial.close()

#     # start function
#     def read_data(self):
#     # set the timezone to Europe/London
#         tz = pytz.timezone('Europe/London')
#         while True:
#             data = self.serial.readline().decode().rstrip()
#             # print(type(data))
#             result = data.replace("00/00/00 00:00:00,", "")
#             # result2 = result.replace("*", "")
#             if data:
#                 print(f'data ---> {data}')
#             else:
#                 print("Waiting data from CP4")

#             # Get the current date and time
#             now = datetime.datetime.now(tz)
#             date_time = now.strftime("%m/%d/%Y %H:%M:%S")

#             result_dict = {}

#             data_values = result.split(',')

#             for value in data_values:
#                 # Check if value is a number with optional decimal point followed by optional alarm code
#                 match = re.match(r'^(\d+(\.\d+)?)[A-Z]?(\s[A-Z]\d)?$', value.strip())
#                 # print(f'match ---> {match}')
                
#                 # channel_nums = []
#                 if match:
#                     # Extract the numeric value and alarm code (if present)
#                     num_value1 = match.group(1)
#                     num_O = num_value1 + 'O'
#                     num_value = float(match.group(1))
#                     alarm_code = match.group(3)
#                     channel_nums = []  # List to store all channel numbers where num_0 is found
#                     for i, item in enumerate(data_values):
#                         if num_O in item:
#                             print(f'num_0 ---> {num_O} index ---> {i}')
#                             channel_num = i + 1
#                             channel_nums.append(channel_num)
#                             if alarm_code:
#                                 result_dict.setdefault(f'alarm_sensor_{channel_num}', alarm_code.strip())
#                         else:
#                             print('no matched item')
#                     for channel_num in channel_nums:
#                         result_dict[f'level_{channel_num}'] = num_value                
#                 # Check if value is VO, CA, SW, FA, LA, F, or VL
#                 elif value.strip() in ['VO', 'CA', 'SW', 'FA', 'LA', 'F', 'VL']:
#                     result_dict[value.strip().lower()] = value.strip()
                    
#                 print(f'Last update: {date_time} dict ---> {result_dict}')
            
#             # store data_time inside the result_dict
#             result_dict['date_time'] = date_time
            
#             json_result_dict = json.dumps({'message': result_dict})
#             self.send(json_result_dict)
#             time.sleep(60)

    # end function

# data structure from CP4 need for testing for serial port simulation
custom_data = {
    "meta": {
        "method": "POST",
        "target": "QBED"
    },
    "headers": {
        "Content-Type": "json",
        "Sender": "CP4->ZSFIQ"
    },
    "data": {
        "Channels": {
            "ch_1": "",
            "ch_2": "",
            "ch_3": "",
            "ch_4": ""
        },
        "Chan Num": 2,
        "GPIO": "0x01010101",
        "Accessory": "0000",
        "Valve": "VC",
        "Fan": "FC",
        "Alarm": "Normal"
    }
}



class WSConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        self.simulation_mode = True  # Set this flag to True for simulation mode

        # # uncomment out when read from serial port
        # try:
        #     self.serial = serial.Serial(
        #         port='/dev/ttyUSB0',
        #         baudrate=9600,
        #         bytesize=serial.EIGHTBITS,
        #         parity=serial.PARITY_NONE,
        #         stopbits=serial.STOPBITS_ONE,
        #         timeout=1
        #     )
        # except SerialException as e:
        #     # Handle the exception (e.g., log the error, send a message to the WebSocket, etc.)
        #     await self.send(f"Error opening serial port: {str(e)}")
        #     return

        # # Start a task to read data from the serial port and send over WebSocket
        # asyncio.create_task(self.read_data())

        # Start a task to read data from send_custom_data function and send over WebSocket
        # Comment out when read from serial port
        asyncio.create_task(self.send_custom_data())

    async def disconnect(self, close_code):
        if hasattr(self, 'serial'):
            self.serial.close()

    
    ## read_data fucntion when use real serial port/ uncomment out when read from serial
    # async def read_data(self):
    #     tz = pytz.timezone('Europe/London')
    #     try:
    #         while True:
    #             data = self.serial.readline().decode().rstrip()


    #             if data:
    #                 print(f'raw msg from CP4 ---> {data}')
    #             else:
    #                 print("Waiting for data from CP4...")

    #             now = datetime.datetime.now(tz)
    #             iso_string = now.isoformat()
    #             date_time = now.strftime("%m/%d/%Y %H:%M:%S")

    #             result_dict = {}

    #             result_dict['date_time'] = date_time
    #             result_dict['data'] = data
    #             # result_dict['date_time'] = iso_string

    #             json_result_dict = json.dumps({'message': result_dict})
    #             await self.send(json_result_dict)

    #             await asyncio.sleep(60)
    #     except serial.serialutil.PortNotOpenError as e:
    #         # Handle the exception (e.g., log the error, send a message to the WebSocket, etc.)
    #         await self.send(f"Serial port is not open: {str(e)}")

    # #send_custom_data function for testing when simulate serial port read / Comment out when read from serial port 
    async def send_custom_data(self):
        if self.simulation_mode:
            tz = pytz.timezone('Europe/London')
            while True:
                numbers_array = []
                optionsIdentifier = ["O", "CO", "LN", "H", "Ar"]
                for ch_key in custom_data["data"]["Channels"]:         
                    if random.random() < 0.8:  # 80% chance to generate a random value
                        number = round(random.uniform(0, 24), 1)
                        numbers_array.append(number)
                        value = f"{number} {random.choice(optionsIdentifier)}"
                        # value = f"{number} O"
                    else:
                        value = "0 *"
                    custom_data["data"]["Channels"][ch_key] = value
                    print(f'from consumer.py numbers_array --> {numbers_array}')
                
                # Update Alarm value based on numbers_array
                if any(number >= 20.8 or number <= 19.5 for number in numbers_array):
                    custom_data["data"]["Alarm"] = "Critical"
                else:
                    custom_data["data"]["Alarm"] = "Normal"

                now = datetime.datetime.now(tz)
                date_time = now.strftime("%m/%d/%Y %H:%M:%S")

                result_dict = {}

                result_dict['date_time'] = date_time
                result_dict['data'] = json.dumps(custom_data)
                print(f'result dict --> {result_dict}')

                json_result_dict = json.dumps({'message': result_dict})
                await self.send(json_result_dict)

                await asyncio.sleep(15)


    
