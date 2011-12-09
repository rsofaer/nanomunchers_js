/ generate node(nodeid) and
/ edge(nodeid, nodeid)


x: _gtime _t
y: ((x[1]) ! 1003) _draw 300


/ DUMP TABLE dumptable


/ formstring takes a list and makes a string
formstring:{[list]
 list,: ()
 : (-1) _ ,/ ($list) ,\: (" ")
}

formstringvertbar:{[list]
 list,: ()
 : (-1) _ ,/ ($list) ,\: ("|")
}

formstringcomma:{[list]
 list,: ()
 : (-1) _ ,/ ($list) ,\: (",")
}

/ Output a table (a variable) to a text file outfile (string)
/ e.g.   output[`guide; guide; "foobar"]
dumptable:{[tablename; table; outfile]
 out: ,("# "), ($tablename), ("|"), formstringvertbar[!table]
 first: *!table
 numofelements: . ("#"), ($tablename), ("."), ($first)
 i: 0
 while[i < numofelements
       list: table[;i]
       x: formstring'list
       out,: , (-1) _ ,/x ,\: ("|")
       i+: 1
 ]
 outfile 0: out
}

dumptablecsv:{[tablename; table; outfile]
 out: ,"          "
 out,: , formstringcomma[!table]
 first: *!table
 numofelements: . ("#"), ($tablename), ("."), ($first)
 i: 0
 while[i < numofelements
       list: table[;i]
       x: formstring'list
       out,: , (-1) _ ,/x ,\: (",")
       i+: 1
 ]
 outfile 0: out
}

/ DATA and EXECUTION

xsize: 30
ysize: 20
numnodes: 700
edgeprob: 0.7 / if there could be an edge between i and j, there
       / is an edgeprob chance that it will be there

xloc: numnodes _draw xsize
yloc: numnodes _draw ysize
uniqs: ?xloc ,' yloc
node.nodeid: !#uniqs
node.xloc: uniqs[;0]
node.yloc: uniqs[;1]
edge.nodeid1: ()
edge.nodeid2: ()

/ given a prob does the event happen
happen:{[prob]
 x: * 1 _draw 0
 : x < prob
}

neighbor:{[i;j]
 x1: node.xloc[i]
 y1: node.yloc[i]
 x2: node.xloc[j]
 y2: node.yloc[j]
 if[(x1 = x2) & (1 = (_ _abs (y1-y2))); :1]
 if[(y1 = y2) & (1 = (_ _abs (x1-x2))); :1]
 :0
}

filledges:{[]
 i: 0
 while[i < #node.nodeid
       j: i+1
       while[j < #node.nodeid
               if[(neighbor[i;j]) & (happen[edgeprob])
                       edge.nodeid1,: i
                       edge.nodeid2,: j
               ]
               j+: 1
       ]
       i+: 1
 ]
}
filledges[]



dumptablecsv[`node; node; "nodes"]
dumptablecsv[`edge; edge; "edges"]
\\

