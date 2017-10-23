import datetime
import json
import numpy as np
import matplotlib.pyplot as plt
import networkx as nx
from networkx.algorithms.clique import find_cliques
from networkx.readwrite import json_graph
import calendar


def graph_analysis(directed_G, undirected_G, graph_name):
    graph_stats = {}
    try:
        #print("Graph constructed on day: "+ graph_name)
        #print("Max Clique:")
        _, max_clique = max(enumerate(find_cliques(undirected_G)), key = lambda tup: len(tup[1]))
        graph_stats["max_clique"] = list(max_clique)
        #print("Current flow betweenness measurement")
        graph_stats["cfbc"] = nx.approximate_current_flow_betweenness_centrality(undirected_G)
        #print("Communicability betweenness centrality")
        graph_stats["cbc"] = nx.betweenness_centrality(undirected_G)
        return graph_stats
        #print "\n"
    except:
        #print "Graph day: "+str(graph_name)+ " is not connected" 
        graph_stats["error"] = "Graph is not connected"

def construct_draw_graphs(days_data):
    user_analysis_data = {}
    for i in range(7):
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

def aggregate_days(ts_list):
    day_count = [0,0,0,0,0,0,0]
    count = 0
    for ts in ts_list:
        day = datetime.datetime.fromtimestamp(float(ts)).weekday()
        day_count[day] += 1
        count += 1
        
    return [count]+ day_count