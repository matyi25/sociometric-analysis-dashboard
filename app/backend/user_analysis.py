import util
import json

# Egy user mennyit kuldott osszesen es ezek hogy oszlanak el kik kozott, napok szerint is
def user_analysis(im_data_df, users):
    days_data = []
    n_overall = 0
    #print "User analysis: \n"
    
    for user in users:
        user_df = im_data_df.loc[im_data_df['originating'] == user]
        n_msg = int(user_df['channel'].count())
        #print user+": " + str(n_msg)
        
        for terminating_user in users:
            if user == terminating_user:
                continue
            #print "    "+terminating_user+": "+str(int(user_df.loc[user_df['terminating'] == terminating_user]['channel'].count()))
            user_msg_days = util.aggregate_days(user_df.loc[user_df['terminating'] == terminating_user]["ts"])
            days_data.append([user,terminating_user]+user_msg_days)
            #print "    "+str(user_msg_days)
        #print "    else: "+str(int(user_df.loc[~user_df['terminating'].isin(users)]['channel'].count()))+ "\n"
        n_overall += n_msg
    #print "Overall msgs: "+str(n_overall)
    #print "Messages between no users: "+str(im_data_df.loc[~im_data_df['originating'].isin(users)]['channel'].count())
    #print "\n"
    
    #util.test()
    output_data = util.construct_draw_graphs(days_data)
    print(json.dumps(output_data))