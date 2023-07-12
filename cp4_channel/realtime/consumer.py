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

from .models import RawMessageLog
from asgiref.sync import sync_to_async


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
        "GPIO": "0x010101010000",
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

                # Generate a random binary string for "Accessory"
                accessory_digits = [str(random.randint(0, 1)) for _ in range(4)]
                accessory_value = "".join(accessory_digits)
                custom_data["data"]["Accessory"] = accessory_value

                for ch_key in custom_data["data"]["Channels"]:         
                    # if random.random() < 0.8:  # 80% chance to generate a random value
                    #     number = round(random.uniform(0, 24), 1)
                    #     numbers_array.append(number)
                    #     value = f"{number} {random.choice(optionsIdentifier)}"
                    #     # value = f"{number} O"
                    # else:
                    #     value = "0 *"
                    random_value = random.random()
                    if random_value < 0.05:  # 25% chance for the first range
                        number = round(random.uniform(0, 17), 1)
                        numbers_array.append(number)
                        value = f"{number} {random.choice(optionsIdentifier)}"
                    elif random_value < 0.6:  # 25% chance for the second range
                        number = round(random.uniform(18, 22), 1)
                        numbers_array.append(number)
                        value = f"{number} {random.choice(optionsIdentifier)}"
                    elif random_value < 0.05:  # 25% chance for the third range
                        number = round(random.uniform(23, 24), 1)
                        numbers_array.append(number)
                        value = f"{number} {random.choice(optionsIdentifier)}"
                    else:  # remaining 25% chance for the last range
                        value = "0 *"
                    custom_data["data"]["Channels"][ch_key] = value
                    # print(f'Consumer.py: from send_custom_data() numbers_array --> {numbers_array}')

                # Update GPIO values
                gpio_digits = ["0x"] * 12  # Reset GPIO to "0x000000000000"

                # Update alarm channel values (digits 1-4)
                for i, ch_key in enumerate(custom_data["data"]["Channels"]):
                    value_ch = custom_data["data"]["Channels"][ch_key]
                    number = ''.join(filter(lambda x: x.isdigit() or x == '.', value_ch))
                    if 19.5 <= float(number) <= 20.8 or "*" in value_ch:
                        gpio_digits[i] = "0"
                    else:
                        gpio_digits[i] = "1"

                # Update critical alarm channel values (digits 5-8)
                for i, ch_key in enumerate(custom_data["data"]["Channels"], start=4):
                    # print(f'i---> {i + 1}, ch_key ---> {ch_key}')
                    value_ch = custom_data["data"]["Channels"][ch_key]
                    number = ''.join(filter(lambda x: x.isdigit() or x == '.', value_ch))
                    # print(f'cusotm_data[data][channels] ---> {number}')
                    # if float(number) < 18.5 or float(number) >= 23.5:
                    #     gpio_digits[i] = "1"
                    if 18.5 <= float(number)<= 23.5 or "*" in value_ch:
                        gpio_digits[i] = "0"
                    else:
                        gpio_digits[i] = "1"
                    # else:
                    #     print(f'error ---> {number}')

                # Update battery logic channel values (digits 9-12)
                for i in range(8, 12):
                    gpio_digits[i] = str(random.randint(0, 1))  # Random value (0 or 1)
                    # print(f'gpio_digits ---> {gpio_digits[i]}')

                custom_data["data"]["GPIO"] = "0x" + "".join(gpio_digits)  # Include "0x" prefix
                
                # Update Alarm value based on numbers_array
                value_alarm = 19.7
                value_critical_low = 18.5
                value_critical_high = 23.5
                alarm = ''

                for n in numbers_array:
                    if not numbers_array: 
                        alarm = 'No Alarm'
                        custom_data["data"]["Alarm"] = alarm
                    elif n < value_critical_low or n > value_critical_high:
                        if alarm != 'Critical':
                            alarm = 'Critical'
                            custom_data["data"]["Alarm"] = alarm
                            break
                    elif value_critical_low < n <= value_alarm:
                        if alarm != 'Critical' or alarm == 'Normal':
                            alarm = 'Alarm'
                            custom_data["data"]["Alarm"] = alarm
                    else:
                        if alarm == 'Critical':
                            break
                        elif alarm == 'Alarm':
                            break
                        else:
                            alarm = 'Normal'
                            custom_data["data"]["Alarm"] = alarm
                       


                # Update "Chan Num" based on the presence of "*" in channel values                
                num_stars = sum("*" in value for value in custom_data["data"]["Channels"].values())

                if num_stars == 0:
                    custom_data["data"]["Chan Num"] = 4
                elif num_stars == 1:
                    custom_data["data"]["Chan Num"] = 3
                elif num_stars == 2:
                    custom_data["data"]["Chan Num"] = 2
                else:
                    custom_data["data"]["Chan Num"] = 1

                now = datetime.datetime.now(tz)
                date_time = now.strftime("%m/%d/%Y %H:%M:%S")

                result_dict = {}

                result_dict['date_time'] = date_time
                result_dict['data'] = json.dumps(custom_data)
                print(f'Consumer.py: from send_custom_data() result dict --> {result_dict}')
                
                # save raw msg into database
                raw_msg = RawMessageLog(created=now, data=json.dumps(custom_data))
                await sync_to_async(raw_msg.save)()

                json_result_dict = json.dumps({'message': result_dict})
                await self.send(json_result_dict)

                await asyncio.sleep(15)


    
