import util
import simplejson as json

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
    for item in output_data:
        id = 0
        for edge in output_data[item]['graph']['links']:
            edge['id'] = id
            id = id + 1

            edge['from'] = edge['source']
            del edge['source']

            edge['to'] = edge['target']
            del edge['target']
            
            edge['value'] = edge['weight']
            del edge['weight']

        for i in range(len(output_data[item]['graph']['nodes'])):
            output_data[item]['graph']['nodes'][i]['label'] = output_data[item]['graph']['nodes'][i]['id']
            output_data[item]['graph']['nodes'][i]['id'] = i

    print(json.dumps(output_data,ignore_nan=True))