import numpy as np
import util
import json

TIME_WINDOW = 3600
users_medians = {}

def set_median_dict_values(orig_user, term_user, median):
    global users_medians
    
    if orig_user in users_medians.keys():
        users_medians[orig_user][term_user] = median
    else:
        users_medians[orig_user] = {term_user:median}

def calc_medians(user1, list_react1, user2, list_react2):
    global users_medians
    
    set_median_dict_values(user1, user2, np.median(list_react1))
    set_median_dict_values(user2, user1, np.median(list_react2))    

def calc_and_print_react_time_statisctics(list_react_time, user, is_end_of_channel):    
    user_output_data = {}
    #print "User: "+user
    if len(list_react_time) == 0:
        #print "No reaction time computed"
        return
    user_output_data["list"] = list_react_time
    user_output_data["max"] = np.max(list_react_time)
    user_output_data["min"] =  np.min(list_react_time)
    user_output_data["median"] = np.median(list_react_time)
    #print "React times: "+ str(list_react_time)
    #print "Min: "+str(np.min(list_react_time))
    #print "Max: "+str(np.max(list_react_time))
    #print "Average: "+str(np.average(list_react_time))
    if not is_end_of_channel:
        pass
        #print "Median: "+str(np.median(list_react_time))+"\n"
    else:
        pass
        #print "Median: "+str(np.median(list_react_time))
    
    if is_end_of_channel:
        pass
        #print "------------------------------------\n"
    return user_output_data
    
def user_reaction_time_analysis(df, reaction_user, other_user):
    list_react_time = []  
    current_timestamp = 0
    
    for index, row in df.iterrows():
        if current_timestamp == 0:
            if str(row['originating']) == reaction_user:
                continue
            else:
                current_timestamp = float(row['ts'])
        
        else:
            if str(row['originating']) == other_user:
                current_timestamp = float(row['ts'])
            
            else:
                reaction_time = float(row['ts']) - current_timestamp
                current_timestamp = 0
                list_react_time.append(reaction_time)
    
    return list_react_time

def channel_reaction_time_analysis(df):
    output_data = {}

    user1 = str(df.iloc[0]['originating'])
    user2 = None
    
    for index, row in df.iterrows():
        if str(row['originating']) != user1:
            user2 = str(row['originating'])
            break

    if user1 is None or user2 is None:
        return output_data
    
    time_windows = []
    ts_before = float(df.iloc[0]['ts'])
    start_index = 0
    
    for index, row in df.iterrows():
        current_ts = float(row['ts'])
        if float(row['ts']) - ts_before > TIME_WINDOW:
            int_idx = int(df.index.get_loc(index))
            time_windows.append((start_index,int_idx))
            start_index = int_idx
        ts_before = current_ts
        
    if start_index != len(df.index)-1:
        time_windows.append((start_index,len(df.index)))
    
    #print user1 + " ---- " + user2 
    list_react_time = [[],[]]
    
    for time_window in time_windows:
        list_react_time[0] += user_reaction_time_analysis(df[time_window[0]:time_window[1]], user1, user2)
        list_react_time[1] += user_reaction_time_analysis(df[time_window[0]:time_window[1]], user2, user1)
        
    output_data[user1] = calc_and_print_react_time_statisctics(list_react_time[0], user1, False)
    output_data[user2] = calc_and_print_react_time_statisctics(list_react_time[1], user2, True)
    calc_medians(user1, list_react_time[0], user2, list_react_time[1])
    
    x_axis_values = [i for i in xrange(len(list_react_time[0]))]
    if len(x_axis_values) >= 1:
        pass
        #util.plot_bar(x_axis_values, x_axis_values, list_react_time[0], None,
                      #user1+"---"+user2+" channel react time stats for user: "+user1, 
                      #"Messages originating from user, sum: ["+str(len(list_react_time[0]))+"]", 
                      #"Reaction times in seconds", "plot_react_time_"+user1+"_"+user2+"_"+user1+".png", False, False)
        
    x_axis_values = [i for i in xrange(len(list_react_time[1]))]
    if len(x_axis_values) >= 1:
        pass
        #util.plot_bar(x_axis_values, x_axis_values, list_react_time[1], None,
                      #user1+"---"+user2+" channel react time stats for user: "+user2, 
                      #"Messages originating from user, sum: ["+str(len(list_react_time[1]))+"]", 
                      #"Reaction times in seconds", "plot_react_time_"+user1+"_"+user2+"_"+user2+".png", False, False)
    return output_data
        
def reaction_time_analysis(im_data_df):
    #print "Reaction time analysis: \n"
    channels = set(im_data_df['channel'])
    reaction_time_df = im_data_df.reindex(index=im_data_df.index[::-1])
    output_data = {"channels":{}, "medians": {}}
    
    for channel in channels:
        output_data["channels"][channel] = channel_reaction_time_analysis(reaction_time_df[reaction_time_df.channel == channel])
        
    #print "Overall user medians statistics: "+str(users_medians)
    for orig_user in users_medians.keys():
        x_axis_names = list(users_medians[orig_user].keys())
        x_axis_values = [i for i in xrange(len(x_axis_names))]
        y_axis_values = list(users_medians[orig_user].values())
        output_data["medians"][orig_user] = users_medians[orig_user]
        
        #util.plot_bar(x_axis_values, x_axis_names, y_axis_values, None,
        #              orig_user+" channel react time medians for users", 
        #              "", "Medians in seconds", "plot_medians_"+orig_user+".png", True, True)
    
    print(json.dumps(output_data))