import numpy as np
import json
import util

DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
DAY_VAL = [1, 2 ,3 ,4 ,5 ,6 ,7]

def channel_analysis(im_data_df):
    # Channelek napi leosztasa ido szerint
    groupby_data = im_data_df.groupby(["channel"])
    #print str(im_data_df.describe())
    #print im_data_df.loc[[2]]
    #print groupby_data["ts"].max()
    #print "Channel analysis \n"
    channel_msgs_day = groupby_data["ts"].aggregate(util.aggregate_days)
    #print channel_msgs_day
    #print "\n"
    
    output_data = {}
    channels = channel_msgs_day.index.tolist()
    for i in xrange(len(channels)):
        output_data[channels[i]] = {"x": DAYS, "y": channel_msgs_day[i][1:]}
        #util.plot_bar(DAY_VAL, DAYS, channel_msgs_day[i][1:], None, channels[i]+" channel messages per day", 
        #          "", "Message count", "plot_"+channels[i]+"_days.png", True, False)
    print(json.dumps(output_data))
    
    # Channelekbeli uzenetek
    channel_sum_msgs = im_data_df.groupby(['channel'])['channel'].aggregate(np.count_nonzero)
    #print channel_sum_msgs
    #print "\n"
    return channel_sum_msgs
