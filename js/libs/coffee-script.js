
  var overlayShown = false;
  
  var Bubbles, root, texts;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  Bubbles = function() {
    var chart, clear, click, collide, collisionPadding, connectEvents, data, force, gravity, hashchange, height, idValue, jitter, label, margin, maxRadius, minCollisionRadius, mouseout, mouseover, node, rScale, rValue, textValue, tick, transformData, update, updateActive, updateLabels, updateNodes, width;
    
    //width = document.getElementById('vis').clientWidth;
    
    width = $('#vis').innerWidth(); //for ie explorer
    
    height=450;
    data = [];
    node = null;
    label = null;
    margin = {
      top: 20,
      right: 5,
      bottom: 5,
      left: 10
    };
    maxRadius = 30;
    rScale = d3.scale.sqrt().range([0, maxRadius]);
    rValue = function(d) {
      return parseInt(d.count);
    };
    idValue = function(d) {
      return d.name;
    };
    textValue = function(d) {
      return d.name;
    };
    collisionPadding = 4;
    minCollisionRadius = 12;
    jitter = 0.5;
    transformData = function(rawData) {
      rawData.forEach(function(d) {
        d.count = parseInt(d.count);
        return rawData.sort(function() {
          return 0.5 - Math.random();
        });
      });
      return rawData;
    };
    tick = function(e) {
      var dampenedAlpha;
      dampenedAlpha = e.alpha * 0.3;
      node.each(gravity(dampenedAlpha)).each(collide(jitter)).attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      return label.style("left", function(d) {
        return ((margin.left + d.x) - d.dx / 2) + "px";
      }).style("top", function(d) {
        return ((margin.top  + d.y) - d.dy / 2) + "px";
      });
    };
    force = d3.layout.force().gravity(0).charge(0).size([width, height]).on("tick", tick);
    chart = function(selection) {
      return selection.each(function(rawData) {
        var maxDomainValue, svg, svgEnter;
        data = transformData(rawData);
        maxDomainValue = d3.max(data, function(d) {
          return rValue(d);
        });
        rScale.domain([0, maxDomainValue]);
        svg = d3.select(this).selectAll("svg").data([data]);
        svgEnter = svg.enter().append("svg");
        svg.attr("width", width + margin.left + margin.right);
        svg.attr("height", height + margin.top + margin.bottom);
        node = svgEnter.append("g").attr("id", "bubble-nodes").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        node.append("rect").attr("id", "bubble-background").attr("width", width).attr("height", height).on("click", clear);
        label = d3.select(this).selectAll("#bubble-labels").data([data]).enter().append("div").attr("id", "bubble-labels");
        update();
        hashchange();
        return d3.select(window).on("hashchange", hashchange);
      });
    };
    update = function() {
      data.forEach(function(d, i) {
        return d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)));
      });
      force.nodes(data).start();
      updateNodes();
      return updateLabels();
    };
    updateNodes = function() {
      node = node.selectAll(".bubble-node").data(data, function(d) {
        return idValue(d);
      });
      node.exit().remove();
      return node.enter().append("a").attr("class", "bubble-node").attr("xlink:href", function(d) {
        return "#" + (encodeURIComponent(idValue(d)));
      }).call(force.drag).call(connectEvents).append("circle").attr("r", function(d) {
        return rScale(rValue(d));
      });
    };
    updateLabels = function() {
      var labelEnter;
      label = label.selectAll(".bubble-label").data(data, function(d) {
        return idValue(d);
      });
      label.exit().remove();
      labelEnter = label.enter().append("a").attr("class", "bubble-label").attr("href", function(d) {
        return "#" + (encodeURIComponent(idValue(d)));
      }).call(force.drag).call(connectEvents);
      labelEnter.append("div").attr("class", "bubble-label-name").text(function(d) {
        return textValue(d);
      });
      /*
      labelEnter.append("div").attr("class", "bubble-label-value").text(function(d) {
        return rValue(d);
      });*/
      label.style("font-size", function(d) {
        return Math.max(4, rScale(rValue(d) / 4)) + "px";
      }).style("width", function(d) {
        return 2.5 * rScale(rValue(d)) + "px";
      });
      label.append("span").text(function(d) {
        return textValue(d);
      }).each(function(d) {
        return d.dx = Math.max(1.5 * rScale(rValue(d)), this.getBoundingClientRect().width);
      }).remove();
      label.style("width", function(d) {
        return d.dx + "px";
      });
      return label.each(function(d) {
        return d.dy = this.getBoundingClientRect().height;
      });
    };
    gravity = function(alpha) {
      var ax, ay, cx, cy;
      cx = width / 2;
      cy = height / 2;
      ax = alpha;
      ay = alpha/10;
      return function(d) {
        d.x += (cx - d.x) * ax;
        return d.y += (cy - d.y) * ay;
      };
    };
    collide = function(jitter) {
      return function(d) {
        return data.forEach(function(d2) {
          var distance, minDistance, moveX, moveY, x, y;
          if (d !== d2) {
            x = d.x - d2.x;
            y = d.y - d2.y;
            distance = Math.sqrt(x * x + y * y);
            minDistance = d.forceR + d2.forceR + collisionPadding;
            if (distance < minDistance) {
              distance = (distance - minDistance) / distance * jitter;
              moveX = x * distance;
              moveY = y * distance;
              d.x -= moveX;
              d.y -= moveY;
              d2.x += moveX;
              return d2.y += moveY;
            }
          }
        });
      };
    };
    connectEvents = function(d) {
      d.on("click", click);
      d.on("mouseover", mouseover);
      return d.on("mouseout", mouseout);
    };
    clear = function() {
      
      
      //return location.replace("#");
    };
    click = function(d) {
      //clean first
      $('#toHighlight').unhighlight();
      //highlight selected bubble's d.name
      $('#toHighlight').highlight(relatedHighlight(d.name));
      //location.replace("#" + encodeURIComponent(idValue(d)));
      return d3.event.preventDefault();
    };
    hashchange = function() {
      var id;
      id = decodeURIComponent(location.hash.substring(1)).trim();
      return updateActive(id);
    };
    updateActive = function(id) {
      node.classed("bubble-selected", function(d) {
        return id === idValue(d);
      });
      if (id.length > 0) {
        return d3.select("#status").html("<h3>The word <span class=\"active\">" + id + "</span> is now active</h3>");
      } else {
        return d3.select("#status").html("<h3>No word is active</h3>");
      }
    };
    mouseover = function(d) {
      return node.classed("bubble-hover", function(p) {
        return p === d;
      });
    };
    mouseout = function(d) {
      return node.classed("bubble-hover", false);
    };
    chart.jitter = function(_) {
      if (!arguments.length) {
        return jitter;
      }
      jitter = _;
      force.start();
      return chart;
    };
    chart.height = function(_) {
      if (!arguments.length) {
        return height;
      }
      height = _;
      return chart;
    };
    chart.width = function(_) {
      if (!arguments.length) {
        return width;
      }
      width = _;
      return chart;
    };
    chart.r = function(_) {
      if (!arguments.length) {
        return rValue;
      }
      rValue = _;
      return chart;
    };
    return chart;
  };

  root.plotData = function(selector, data, plot) {
    return d3.select(selector).datum(data).call(plot);
  };

  texts = [
    
    {
      key: "/index.html",
      file: "interests.csv",
      name: "ProfInterests"
    },
    
    {
      key: "/TechnicalSkills_2.html",
      file: "skills.csv",
      name: "TechnicalSkills"
    },
    
    {
      key: "/Education_2.html",
      file: "education.csv",
      name: "Education"
    }, 
    
    {
      key: "/Experience_2.html",
      file: "experience.csv",
      name: "Experience"
    },
    
    {
      key: "/HonorsAwards_2.html",
      file: "honors.csv",
      name: "HonorsAwards"
    },
    
    {
      key: "/Hobbies_2.html",
      file: "hobbies.csv",
      name: "HobbiesInterests"
    },
    
  ];

  $(function() {

    var display, key, plot, text;
    
    plot = Bubbles();
   
    display = function(data) {
      return plotData("#vis", data, plot);
    };
    
    key = decodeURIComponent(location.search).replace("?", "");
    
    
    if(key=="")
    {
      key = window.location.pathname;
    }
    
    text = texts.filter( 
                  function(t) {
                    return t.key === key;
                    })[0];
    
    if (!text) {
      text = texts[0];
    }
    
    
    //$("#text-select").val(key);
    
    /*
    d3.select("#jitter").on("input", function() {
      return plot.jitter(parseFloat(this.output.value));
    });
    */
    
    /*
    d3.select("#text-select").on("change", function(e) {
      key = $(this).val();
      location.replace("#");
      return location.search = encodeURIComponent(key);
    });*/
    
    
    //d3.select("#book-title").html(text.name);
    
    return d3.csv("data/" + text.file, display);
  });


function redraw(myString){
  /*
    if( location.search = myString )
    return location.search = myString + "_resized";
    else if ( location.search = myString + "_resized")
    return location.search = myString;
    else 
    */
    return location.search = myString;
    
    }


function relatedHighlight(myString)
{
  
  // JSON
var relations = {
    
    "Telecomm.": ["network","3G","4G","2G", "LTE", "VoLTE"],
    "Data Analysis": ["Python","pandas","matplotlib", "data", "mining", "database", "analysis", "data", "analytics"],
    "Optimisation": ["network", "LTE", "UMTS", "HSDPA", "HICH", "E-RGCH", "HSPA", "HSUPA", "parameter", "performance", "EUL", "RRC", "2G", "3G", "4G", "5G", "VoLTE"],
    "Benchmarking": ["benchmark", "LTE", "UMTS", "performance", "2G", "3G", "4G", "5G", "VoLTE", "ookla", "crowd", "sourcing", "report"],
    "Programming": ["SQL", "Database", "Python", "programming", "script", "class", "C++", "Java","HTML","Framework7","App","develop","git", "C#", "implemented", "designed", "developed"],   
    "LTE": ["LTE", "VoLTE", "4.5G", "4G", "MME", "eNodeB"],
    "VoLTE": ["LTE", "VoLTE", "4.5G", "4G", "MME", "eNodeB", "IMS"],
    "Web Development": ["script", "Javascript","HTML","Framework7","App","develop","git", "web"],
    "Embedded Programming": ["C++", "firmware", "embedded", "ARM", "chipset", "protocol"],
    "SON": [ "SON", "optimisation", "3G", "4G", "algorithm", "self", "automatic", "artificial", "intelligent", "smart"],
    
    "MSc. in Telecomm.": [ "Master", "Thesis", "Msc", "RWTH" ],
    "High Honor Student": [ "CGPA: 3.81", "METU" ],
    "BSc. Electrical & Elecronics": ["METU","BSc","Electrical","Elecronics","High", "Honor"],
    
    "4G":["4g", "LTE", "VoLTE", "4.5G", "MME", "eNodeB"],
    "3G":["3g", "UMTS", "HSDPA", "HICH", "E-RGCH", "HSPA", "HSUPA", "EUL", "RRC"],
    
    "SQL":["sql","oracle","query","database","data","toad","olap","analysis services","mdx"],
    "Radio Network Protocols": [ "Radio", "LTE", "UMTS", "HSDPA", "HICH", "E-RGCH", "HSPA", "HSUPA", "parameter", "performance", "EUL", "RRC", "2G", "3G", "4G", "5G", "VoLTE"],
    "Radio Network Parameters": [ "Radio", "LTE", "UMTS", "HSDPA", "HICH", "E-RGCH", "HSPA", "HSUPA", "parameter", "performance", "EUL", "RRC", "2G", "3G", "4G", "5G", "VoLTE"],
    "Radio Network Measurement":  ["Radio", "LTE", "UMTS", "performance", "2G", "3G", "4G", "5G", "VoLTE", "ookla", "measure", "metric", "network", "report"],
    "Obj. O. Programming":["C#","Java"], 
    "Python":["python", "pandas", "matplotlib", "jupyter","notebook","data analysis","django","numpy"],
    "C/C++": ["C++", "embedded"],
    "German Speaking": ["german", "deutsch", "sprache"],
    "TEV Scholar": ["TEV", "Scholar", "DAAD", "German Academic Exchange Service"],
    "High Honor Student": ["Honor", "Grade Point Average"],
    "Turkcell CXO Award": ["Turkcell", "CXO"], 
    "Texas Instruments Award": ["Texas Instruments", "DSP"],
    "Conference Speeches":["speaker", "presentation", "summit", "conference"]

};
  
  if( relations[myString] )
  return relations[myString];
  else
  return myString;
}


overlayNotShown = true

function displayOverlay(text) {
  
    $("<table id='overlay'><tbody><tr><td>" + text + "</td></tr></tbody></table>").css({
        "position": "fixed",
        "top": 0,
        "left": 0,
        "width": "100%",
        "height": "100%",
        "background-color": "rgba(0,0,0,.8)",
        "z-index": 10000,
        "vertical-align": "middle",
        "text-align": "center",
        "color": "#fff",
        "font-size": "20px",
        //"font-weight": "bold",
        "cursor": "wait"
    }).appendTo("body");
    
    overlayNotShown = false
}

function removeOverlay() {
    $("#overlay").remove();
}


var something = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            displayOverlay("Hi, <br> Thanks for visiting. <br> Looks like you are on mobile! <br><br> For much easier browsing and some nice feautures, I highly recommend you to visit the desktop version. If you don't.. that's cool. No hard feelings :)<br><br> This message will destroy itself very soon, and will not bother you again. ");
            setTimeout(function(){ removeOverlay(); }, 10000);
        }
    };
})();