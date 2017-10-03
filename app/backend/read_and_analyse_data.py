import os
import sys
import json
import pandas

import reaction_time_analysis
import user_analysis
#import time_series_analysis
import channel_analysis

"""
    Data format: channel(id) ,originating(u_id), terminating(u_id), ts(real), type(message/file_share) edited(binomial), edited_by(u_id), edit_ts(real), attachment(binomial)
"""
im_data = []
headers = ["channel","originating", "terminating", "ts", "type", "edited", "edited_by", "edit_ts", "attachment"]
done_channels = []


def read_user_data(orig_user, cur_dir):
    global im_data, done_channels
    
    path = cur_dir+"\\"+ orig_user
    filenames = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f)) and 'channels' not in f]

    for filename in filenames:
        channel = filename.split(".")[0].split("_")[1]
        f = open(path+"\\"+filename, "r")

        channel_data = f.readline()
        if filename in done_channels:
            f.close()
            continue
        else:
            done_channels.append(filename)
        
        if channel_data == '[]':
            f.close()
            continue

        channel_data = json.loads(channel_data)
        other_user = ""
        for message_json in channel_data:
            if message_json["user"] == orig_user:
                continue
            else:
                other_user = message_json["user"]
                break
        
        for message_json in channel_data:

            message_list = [channel]
            
            message_list.append(message_json["user"])
            if message_json["user"] == orig_user:
                message_list.append(other_user)
            else:
                message_list.append(orig_user)
                
            message_list.append(message_json["ts"])
            if "subtype" in message_json.keys():
                message_list.append(message_json["subtype"])
            else:
                message_list.append(message_json["type"])
                
            if "edited" in message_json.keys():
                message_list.append(1)
                message_list.append(message_json["edited"]["user"])
                message_list.append(message_json["edited"]["ts"])
            else:
                message_list.append(0)
                message_list.append("-")
                message_list.append("-")
                
            if "attachments" in message_json.keys():
                message_list.append(1)
            else:
                message_list.append(0)
                  
            im_data.append(message_list)
        f.close()

def read_all_data():
    cur_dir = os.getcwd()+'\ims'
    subdirs = os.listdir(cur_dir)
    if IM_DATA_FILENAME in subdirs:
        subdirs.remove(IM_DATA_FILENAME)
    f = open(cur_dir+"\\"+IM_DATA_FILENAME,"w+")
    
    print "Users: "
    for dir_name in subdirs:
        print "   "+dir_name
        read_user_data(dir_name, cur_dir)
        
    f.write(json.dumps(im_data))
    im_data_df = pandas.DataFrame(im_data,columns=headers)
    
    print "\n"
    return subdirs, im_data_df

def read_stored_df(path):
    return pandas.DataFrame(json.load(open(path)),columns=headers)

def get_channels(df):
    return list(df.channel.unique())

def get_users(df):
    orig_list = list(df.originating)
    term_list = list(df.terminating)
    return [x for x in set(orig_list + term_list) if x != '']    

def main(args):
    #users, im_data_df = read_all_data()
    
    im_data_df = read_stored_df(args[1])

    if (int(args[2]) == 0):
        channel_sum_msgs = channel_analysis.channel_analysis(im_data_df)

    elif (int(args[2]) == 1):
        users = get_users(im_data_df)
        user_analysis.user_analysis(im_data_df, users)
    elif (int(args[2]) == 2):
        reaction_time_analysis.reaction_time_analysis(im_data_df)
    
    #time_series_analysis.time_series_analysis(im_data_df, channel_sum_msgs)

if __name__ == '__main__':
    main(sys.argv)