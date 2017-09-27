import datetime
import json
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
from networkx.algorithms.approximation import clique
from networkx.readwrite import json_graph
import calendar


def graph_analysis(directed_G, undirected_G, graph_name):
    graph_stats = {}
    try:
        #print("Graph constructed on day: "+ graph_name)
        #print("Max Clique:")
        graph_stats["max_clique"] = json.dumps(list(clique.max_clique(undirected_G)))
        #print("Current flow betweenness measurement")
        graph_stats["cfbc"] = json.dumps(nx.approximate_current_flow_betweenness_centrality(undirected_G))
        #print("Communicability betweenness centrality")
        graph_stats["cbc"] = json.dumps(nx.communicability_betweenness_centrality(undirected_G))
        return graph_stats
        #print "\n"
    except:
        #print "Graph day: "+str(graph_name)+ " is not connected" 
        graph_stats["error"] = "Graph is not connected"

def construct_draw_graphs(days_data):
    user_analysis_data = {}
    for i in xrange(7):
        temp_data = {}
        directed_G = nx.DiGraph()
        undirected_G = nx.Graph()
        for user_data in days_data:
            if user_data[i+3] != 0:
                directed_G.add_edge(user_data[0],user_data[1],weight=user_data[i+3])
                if undirected_G.has_edge(user_data[0], user_data[1]):
                    undirected_G[user_data[0]][user_data[1]]['weight'] = user_data[i+3] + undirected_G[user_data[0]][user_data[1]]['weight']
                else:
                    undirected_G.add_edge(user_data[0],user_data[1],weight=user_data[i+3])
                    
        #nx.write_graphml(directed_G,"plots/"+str(i)+"_graph.graphml")
        temp_data["stats"] = graph_analysis(directed_G, undirected_G, i)
        temp_data["graph"] = json_graph.node_link_data(directed_G)
        user_analysis_data[calendar.day_name[i]] = temp_data
    return user_analysis_data
        
def plot_series_stats(data, title,y_axis_label, filename):
    plt.style.use('ggplot')
    
    rolmean = data.rolling(window=7,center=False).mean()
    rolstd = data.rolling(window=7,center=False).std()
        
    data.plot(color='blue',label='Original')
    rolmean.plot(color='red', label='Rolling Mean')
    rolstd.plot(color='black', label = 'Rolling Std')
    
    plt.legend()
    plt.ylabel(y_axis_label)
    plt.grid(True)
    plt.xticks(rotation=30)
    plt.title(title)
    plt.savefig("plots/"+filename)
    plt.close()

def plot_series(data, title, y_axis_label, filename):
    plt.style.use('ggplot')
    
    data.plot()

    plt.title(title)
    plt.ylabel(y_axis_label)
    plt.grid(True)
    plt.xticks(rotation=30)
    
    plt.savefig("plots/"+filename)
    plt.close()
    

def plot_bar(x_axis_values, x_axis_names, y_axis_values, y_axis_names, title, labelx, labely, filename, show_x_values, adjust_size):
    plt.style.use('ggplot')
    N = len(x_axis_values)
    ind = np.arange(N)    # the x locations for the groups
    width = 0.35       # the width of the bars: can also be len(x) sequence
    
    if adjust_size:
        plt.figure(figsize=(10,12))
    p1 = plt.bar(ind, y_axis_values, width, color='r')
    
    plt.ylabel(labely)
    plt.xlabel(labelx)
    plt.title(title)
    
    if adjust_size:
        plt.xticks(ind + width/2., x_axis_names, rotation='vertical')
    else:
        plt.xticks(ind + width/2., x_axis_names)

    y_max = np.max(y_axis_values)
    offset = 10
    if y_max <= 200:
        offset = 20
    elif y_max <= 500:
        offset = 30
    elif y_max <= 1000:
        offset = 50
    elif y_max <= 1500:
        offset = 100
    else:
        offset = 150
    plt.yticks(np.arange(0, y_max+20, offset))
    
    if show_x_values is False:
        frame = plt.gca()
        frame.axes.xaxis.set_ticklabels([])
    
    plt.savefig("plots/"+filename)
    plt.close()

def aggregate_days(ts_list):
    day_count = [0,0,0,0,0,0,0]
    count = 0
    for ts in ts_list:
        day = datetime.datetime.fromtimestamp(float(ts)).weekday()
        day_count[day] += 1
        count += 1
        
    return [count]+ day_count