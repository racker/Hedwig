(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global['hedwig-docs'] = {}));
}(this, function (exports) { 'use strict';

    /**
     * @name Defaults
     * @description
     * Default values for componets throughout Hedwig
     */
    class Defaults {
      constructor() {
        this.margin = {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        };
        this.graphHeight = 200;
        this.graphWidth = 400;
        this.lineColor = '#0c7c84';
      }

    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(compare) {
      if (compare.length === 1) compare = ascendingComparator(compare);
      return {
        left: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        },
        right: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) > 0) hi = mid;
            else lo = mid + 1;
          }
          return lo;
        }
      };
    }

    function ascendingComparator(f) {
      return function(d, x) {
        return ascending(f(d), x);
      };
    }

    var ascendingBisect = bisector(ascending);
    var bisectRight = ascendingBisect.right;

    function extent(values, valueof) {
      var n = values.length,
          i = -1,
          value,
          min,
          max;

      if (valueof == null) {
        while (++i < n) { // Find the first comparable value.
          if ((value = values[i]) != null && value >= value) {
            min = max = value;
            while (++i < n) { // Compare the remaining values.
              if ((value = values[i]) != null) {
                if (min > value) min = value;
                if (max < value) max = value;
              }
            }
          }
        }
      }

      else {
        while (++i < n) { // Find the first comparable value.
          if ((value = valueof(values[i], i, values)) != null && value >= value) {
            min = max = value;
            while (++i < n) { // Compare the remaining values.
              if ((value = valueof(values[i], i, values)) != null) {
                if (min > value) min = value;
                if (max < value) max = value;
              }
            }
          }
        }
      }

      return [min, max];
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array(n = Math.ceil(stop - start + 1));
        while (++i < n) ticks[i] = (start + i) * step;
      } else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array(n = Math.ceil(start - stop + 1));
        while (++i < n) ticks[i] = (start - i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function max(values, valueof) {
      var n = values.length,
          i = -1,
          value,
          max;

      if (valueof == null) {
        while (++i < n) { // Find the first comparable value.
          if ((value = values[i]) != null && value >= value) {
            max = value;
            while (++i < n) { // Compare the remaining values.
              if ((value = values[i]) != null && value > max) {
                max = value;
              }
            }
          }
        }
      }

      else {
        while (++i < n) { // Find the first comparable value.
          if ((value = valueof(values[i], i, values)) != null && value >= value) {
            max = value;
            while (++i < n) { // Compare the remaining values.
              if ((value = valueof(values[i], i, values)) != null && value > max) {
                max = value;
              }
            }
          }
        }
      }

      return max;
    }

    var slice = Array.prototype.slice;

    function identity(x) {
      return x;
    }

    var top = 1,
        right = 2,
        bottom = 3,
        left = 4,
        epsilon = 1e-6;

    function translateX(x) {
      return "translate(" + (x + 0.5) + ",0)";
    }

    function translateY(y) {
      return "translate(0," + (y + 0.5) + ")";
    }

    function number(scale) {
      return function(d) {
        return +scale(d);
      };
    }

    function center(scale) {
      var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
      if (scale.round()) offset = Math.round(offset);
      return function(d) {
        return +scale(d) + offset;
      };
    }

    function entering() {
      return !this.__axis;
    }

    function axis(orient, scale) {
      var tickArguments = [],
          tickValues = null,
          tickFormat = null,
          tickSizeInner = 6,
          tickSizeOuter = 6,
          tickPadding = 3,
          k = orient === top || orient === left ? -1 : 1,
          x = orient === left || orient === right ? "x" : "y",
          transform = orient === top || orient === bottom ? translateX : translateY;

      function axis(context) {
        var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
            format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,
            spacing = Math.max(tickSizeInner, 0) + tickPadding,
            range = scale.range(),
            range0 = +range[0] + 0.5,
            range1 = +range[range.length - 1] + 0.5,
            position = (scale.bandwidth ? center : number)(scale.copy()),
            selection = context.selection ? context.selection() : context,
            path = selection.selectAll(".domain").data([null]),
            tick = selection.selectAll(".tick").data(values, scale).order(),
            tickExit = tick.exit(),
            tickEnter = tick.enter().append("g").attr("class", "tick"),
            line = tick.select("line"),
            text = tick.select("text");

        path = path.merge(path.enter().insert("path", ".tick")
            .attr("class", "domain")
            .attr("stroke", "currentColor"));

        tick = tick.merge(tickEnter);

        line = line.merge(tickEnter.append("line")
            .attr("stroke", "currentColor")
            .attr(x + "2", k * tickSizeInner));

        text = text.merge(tickEnter.append("text")
            .attr("fill", "currentColor")
            .attr(x, k * spacing)
            .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

        if (context !== selection) {
          path = path.transition(context);
          tick = tick.transition(context);
          line = line.transition(context);
          text = text.transition(context);

          tickExit = tickExit.transition(context)
              .attr("opacity", epsilon)
              .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

          tickEnter
              .attr("opacity", epsilon)
              .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
        }

        tickExit.remove();

        path
            .attr("d", orient === left || orient == right
                ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1)
                : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1));

        tick
            .attr("opacity", 1)
            .attr("transform", function(d) { return transform(position(d)); });

        line
            .attr(x + "2", k * tickSizeInner);

        text
            .attr(x, k * spacing)
            .text(format);

        selection.filter(entering)
            .attr("fill", "none")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

        selection
            .each(function() { this.__axis = position; });
      }

      axis.scale = function(_) {
        return arguments.length ? (scale = _, axis) : scale;
      };

      axis.ticks = function() {
        return tickArguments = slice.call(arguments), axis;
      };

      axis.tickArguments = function(_) {
        return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), axis) : tickArguments.slice();
      };

      axis.tickValues = function(_) {
        return arguments.length ? (tickValues = _ == null ? null : slice.call(_), axis) : tickValues && tickValues.slice();
      };

      axis.tickFormat = function(_) {
        return arguments.length ? (tickFormat = _, axis) : tickFormat;
      };

      axis.tickSize = function(_) {
        return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
      };

      axis.tickSizeInner = function(_) {
        return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
      };

      axis.tickSizeOuter = function(_) {
        return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
      };

      axis.tickPadding = function(_) {
        return arguments.length ? (tickPadding = +_, axis) : tickPadding;
      };

      return axis;
    }

    function axisBottom(scale) {
      return axis(bottom, scale);
    }

    function axisLeft(scale) {
      return axis(left, scale);
    }

    var noop = {value: function() {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function empty() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
      };
    }

    function selection_selectAll(select) {
      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    var matcher = function(selector) {
      return function() {
        return this.matches(selector);
      };
    };

    if (typeof document !== "undefined") {
      var element = document.documentElement;
      if (!element.matches) {
        var vendorMatches = element.webkitMatchesSelector
            || element.msMatchesSelector
            || element.mozMatchesSelector
            || element.oMatchesSelector;
        matcher = function(selector) {
          return function() {
            return vendorMatches.call(this, selector);
          };
        };
      }
    }

    var matcher$1 = matcher;

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant(x) {
      return function() {
        return x;
      };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = {},
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
          if (keyValue in nodeByKeyValue) {
            exit[i] = node;
          } else {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue[keyValue] = null;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
          exit[i] = node;
        }
      }
    }

    function selection_data(value, key) {
      if (!value) {
        data = new Array(this.size()), j = -1;
        this.each(function(d) { data[++j] = d; });
        return data;
      }

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = value.call(parent, parent && parent.__data__, j, parents),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function selection_exit() {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_merge(selection) {

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending$1;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      var nodes = new Array(this.size()), i = -1;
      this.each(function() { nodes[++i] = this; });
      return nodes;
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      var size = 0;
      this.each(function() { ++size; });
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)
          : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove : typeof value === "function"
                ? styleFunction
                : styleConstant)(name, value, priority == null ? "" : priority))
          : styleValue(this.node(), name);
    }

    function styleValue(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction
              : textConstant)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_cloneShallow() {
      return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
    }

    function selection_cloneDeep() {
      return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
    }

    function selection_clone(deep) {
      return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    var filterEvents = {};

    if (typeof document !== "undefined") {
      var element$1 = document.documentElement;
      if (!("onmouseenter" in element$1)) {
        filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
      }
    }

    function filterContextListener(listener, index, group) {
      listener = contextListener(listener, index, group);
      return function(event) {
        var related = event.relatedTarget;
        if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
          listener.call(this, event);
        }
      };
    }

    function contextListener(listener, index, group) {
      return function(event1) {
        try {
          listener.call(this, this.__data__, index, group);
        } finally {
        }
      };
    }

    function parseTypenames$1(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, capture) {
      var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
      return function(d, i, group) {
        var on = this.__on, o, listener = wrap(value, i, group);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
            this.addEventListener(o.type, o.listener = listener, o.capture = capture);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, capture);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, capture) {
      var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      if (capture == null) capture = false;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
      return this;
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    var root = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection([[document.documentElement]], root);
    }

    Selection.prototype = selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      merge: selection_merge,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      clone: selection_clone,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection([[document.querySelector(selector)]], [document.documentElement])
          : new Selection([[selector]], root);
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex3 = /^#([0-9a-f]{3})$/,
        reHex6 = /^#([0-9a-f]{6})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: function() {
        return this.rgb().hex();
      },
      toString: function() {
        return this.rgb() + "";
      }
    });

    function color(format) {
      var m;
      format = (format + "").trim().toLowerCase();
      return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
          : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format])
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (0 <= this.r && this.r <= 255)
            && (0 <= this.g && this.g <= 255)
            && (0 <= this.b && this.b <= 255)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: function() {
        return "#" + hex(this.r) + hex(this.g) + hex(this.b);
      },
      toString: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "rgb(" : "rgba(")
            + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
            + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
            + Math.max(0, Math.min(255, Math.round(this.b) || 0))
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var deg2rad = Math.PI / 180;
    var rad2deg = 180 / Math.PI;

    // https://beta.observablehq.com/@mbostock/lab-and-rgb
    var K = 18,
        Xn = 0.96422,
        Yn = 1,
        Zn = 0.82521,
        t0 = 4 / 29,
        t1 = 6 / 29,
        t2 = 3 * t1 * t1,
        t3 = t1 * t1 * t1;

    function labConvert(o) {
      if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
      if (o instanceof Hcl) {
        if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
        var h = o.h * deg2rad;
        return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
      }
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = rgb2lrgb(o.r),
          g = rgb2lrgb(o.g),
          b = rgb2lrgb(o.b),
          y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
      if (r === g && g === b) x = z = y; else {
        x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
        z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
      }
      return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
    }

    function lab(l, a, b, opacity) {
      return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
    }

    function Lab(l, a, b, opacity) {
      this.l = +l;
      this.a = +a;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Lab, lab, extend(Color, {
      brighter: function(k) {
        return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      darker: function(k) {
        return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
      },
      rgb: function() {
        var y = (this.l + 16) / 116,
            x = isNaN(this.a) ? y : y + this.a / 500,
            z = isNaN(this.b) ? y : y - this.b / 200;
        x = Xn * lab2xyz(x);
        y = Yn * lab2xyz(y);
        z = Zn * lab2xyz(z);
        return new Rgb(
          lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
          lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
          lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
          this.opacity
        );
      }
    }));

    function xyz2lab(t) {
      return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
    }

    function lab2xyz(t) {
      return t > t1 ? t * t * t : t2 * (t - t0);
    }

    function lrgb2rgb(x) {
      return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
    }

    function rgb2lrgb(x) {
      return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }

    function hclConvert(o) {
      if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
      if (!(o instanceof Lab)) o = labConvert(o);
      if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
      var h = Math.atan2(o.b, o.a) * rad2deg;
      return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
    }

    function hcl(h, c, l, opacity) {
      return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
    }

    function Hcl(h, c, l, opacity) {
      this.h = +h;
      this.c = +c;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hcl, hcl, extend(Color, {
      brighter: function(k) {
        return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
      },
      darker: function(k) {
        return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
      },
      rgb: function() {
        return labConvert(this).rgb();
      }
    }));

    var A = -0.14861,
        B = +1.78277,
        C = -0.29227,
        D = -0.90649,
        E = +1.97294,
        ED = E * D,
        EB = E * B,
        BC_DA = B * C - D * A;

    function cubehelixConvert(o) {
      if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
          bl = b - l,
          k = (E * (g - l) - C * bl) / D,
          s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
          h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
      return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix(h, s, l, opacity) {
      return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Cubehelix, cubehelix, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
            l = +this.l,
            a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
            cosh = Math.cos(h),
            sinh = Math.sin(h);
        return new Rgb(
          255 * (l + a * (A * cosh + B * sinh)),
          255 * (l + a * (C * cosh + D * sinh)),
          255 * (l + a * (E * cosh)),
          this.opacity
        );
      }
    }));

    function basis(t1, v0, v1, v2, v3) {
      var t2 = t1 * t1, t3 = t2 * t1;
      return ((1 - 3 * t1 + 3 * t2 - t3) * v0
          + (4 - 6 * t2 + 3 * t3) * v1
          + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
          + t3 * v3) / 6;
    }

    function basis$1(values) {
      var n = values.length - 1;
      return function(t) {
        var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
            v1 = values[i],
            v2 = values[i + 1],
            v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
            v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
        return basis((t - i / n) * n, v0, v1, v2, v3);
      };
    }

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function linear(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function hue(a, b) {
      var d = b - a;
      return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$1(isNaN(a) ? b : a);
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb$1(start, end) {
        var r = color((start = rgb(start)).r, (end = rgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb$1.gamma = rgbGamma;

      return rgb$1;
    })(1);

    function rgbSpline(spline) {
      return function(colors) {
        var n = colors.length,
            r = new Array(n),
            g = new Array(n),
            b = new Array(n),
            i, color;
        for (i = 0; i < n; ++i) {
          color = rgb(colors[i]);
          r[i] = color.r || 0;
          g[i] = color.g || 0;
          b[i] = color.b || 0;
        }
        r = spline(r);
        g = spline(g);
        b = spline(b);
        color.opacity = 1;
        return function(t) {
          color.r = r(t);
          color.g = g(t);
          color.b = b(t);
          return color + "";
        };
      };
    }

    var rgbBasis = rgbSpline(basis$1);

    function array(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b -= a, function(t) {
        return d.setTime(a + b * t), d;
      };
    }

    function reinterpolate(a, b) {
      return a = +a, b -= a, function(t) {
        return a + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolateValue(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function interpolateString(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: reinterpolate(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolateValue(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant$1(b)
          : (t === "number" ? reinterpolate
          : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
          : b instanceof color ? interpolateRgb
          : b instanceof Date ? date
          : Array.isArray(b) ? array
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : reinterpolate)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b -= a, function(t) {
        return Math.round(a + b * t);
      };
    }

    var degrees = 180 / Math.PI;

    var identity$1 = {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      skewX: 0,
      scaleX: 1,
      scaleY: 1
    };

    function decompose(a, b, c, d, e, f) {
      var scaleX, scaleY, skewX;
      if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
      if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
      if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
      if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
      return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX: scaleX,
        scaleY: scaleY
      };
    }

    var cssNode,
        cssRoot,
        cssView,
        svgNode;

    function parseCss(value) {
      if (value === "none") return identity$1;
      if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
      cssNode.style.transform = value;
      value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
      cssRoot.removeChild(cssNode);
      value = value.slice(7, -1).split(",");
      return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
    }

    function parseSvg(value) {
      if (value == null) return identity$1;
      if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svgNode.setAttribute("transform", value);
      if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
      value = value.matrix;
      return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
    }

    function interpolateTransform(parse, pxComma, pxParen, degParen) {

      function pop(s) {
        return s.length ? s.pop() + " " : "";
      }

      function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push("translate(", null, pxComma, null, pxParen);
          q.push({i: i - 4, x: reinterpolate(xa, xb)}, {i: i - 2, x: reinterpolate(ya, yb)});
        } else if (xb || yb) {
          s.push("translate(" + xb + pxComma + yb + pxParen);
        }
      }

      function rotate(a, b, s, q) {
        if (a !== b) {
          if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
          q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: reinterpolate(a, b)});
        } else if (b) {
          s.push(pop(s) + "rotate(" + b + degParen);
        }
      }

      function skewX(a, b, s, q) {
        if (a !== b) {
          q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: reinterpolate(a, b)});
        } else if (b) {
          s.push(pop(s) + "skewX(" + b + degParen);
        }
      }

      function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push(pop(s) + "scale(", null, ",", null, ")");
          q.push({i: i - 4, x: reinterpolate(xa, xb)}, {i: i - 2, x: reinterpolate(ya, yb)});
        } else if (xb !== 1 || yb !== 1) {
          s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
      }

      return function(a, b) {
        var s = [], // string constants and placeholders
            q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function(t) {
          var i = -1, n = q.length, o;
          while (++i < n) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        };
      };
    }

    var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
    var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

    var rho = Math.SQRT2;

    function cubehelix$1(hue) {
      return (function cubehelixGamma(y) {
        y = +y;

        function cubehelix$1(start, end) {
          var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
              s = nogamma(start.s, end.s),
              l = nogamma(start.l, end.l),
              opacity = nogamma(start.opacity, end.opacity);
          return function(t) {
            start.h = h(t);
            start.s = s(t);
            start.l = l(Math.pow(t, y));
            start.opacity = opacity(t);
            return start + "";
          };
        }

        cubehelix$1.gamma = cubehelixGamma;

        return cubehelix$1;
      })(1);
    }

    cubehelix$1(hue);
    var cubehelixLong = cubehelix$1(nogamma);

    var frame = 0, // is an animation frame pending?
        timeout = 0, // is a timeout pending?
        interval = 0, // are any timers active?
        pokeDelay = 1000, // how frequently we check for clock skew
        taskHead,
        taskTail,
        clockLast = 0,
        clockNow = 0,
        clockSkew = 0,
        clock = typeof performance === "object" && performance.now ? performance : Date,
        setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

    function now() {
      return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
      clockNow = 0;
    }

    function Timer() {
      this._call =
      this._time =
      this._next = null;
    }

    Timer.prototype = timer.prototype = {
      constructor: Timer,
      restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
          if (taskTail) taskTail._next = this;
          else taskHead = this;
          taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
      },
      stop: function() {
        if (this._call) {
          this._call = null;
          this._time = Infinity;
          sleep();
        }
      }
    };

    function timer(callback, delay, time) {
      var t = new Timer;
      t.restart(callback, delay, time);
      return t;
    }

    function timerFlush() {
      now(); // Get the current time, if not already set.
      ++frame; // Pretend we’ve set an alarm, if we haven’t already.
      var t = taskHead, e;
      while (t) {
        if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
        t = t._next;
      }
      --frame;
    }

    function wake() {
      clockNow = (clockLast = clock.now()) + clockSkew;
      frame = timeout = 0;
      try {
        timerFlush();
      } finally {
        frame = 0;
        nap();
        clockNow = 0;
      }
    }

    function poke() {
      var now = clock.now(), delay = now - clockLast;
      if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
      var t0, t1 = taskHead, t2, time = Infinity;
      while (t1) {
        if (t1._call) {
          if (time > t1._time) time = t1._time;
          t0 = t1, t1 = t1._next;
        } else {
          t2 = t1._next, t1._next = null;
          t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
      }
      taskTail = t0;
      sleep(time);
    }

    function sleep(time) {
      if (frame) return; // Soonest alarm already set, or will be.
      if (timeout) timeout = clearTimeout(timeout);
      var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
      if (delay > 24) {
        if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
      } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
      }
    }

    function timeout$1(callback, delay, time) {
      var t = new Timer;
      delay = delay == null ? 0 : +delay;
      t.restart(function(elapsed) {
        t.stop();
        callback(elapsed + delay);
      }, delay, time);
      return t;
    }

    var emptyOn = dispatch("start", "end", "interrupt");
    var emptyTween = [];

    var CREATED = 0;
    var SCHEDULED = 1;
    var STARTING = 2;
    var STARTED = 3;
    var RUNNING = 4;
    var ENDING = 5;
    var ENDED = 6;

    function schedule(node, name, id, index, group, timing) {
      var schedules = node.__transition;
      if (!schedules) node.__transition = {};
      else if (id in schedules) return;
      create(node, id, {
        name: name,
        index: index, // For context during callback.
        group: group, // For context during callback.
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
      });
    }

    function init(node, id) {
      var schedule = get$1(node, id);
      if (schedule.state > CREATED) throw new Error("too late; already scheduled");
      return schedule;
    }

    function set$1(node, id) {
      var schedule = get$1(node, id);
      if (schedule.state > STARTING) throw new Error("too late; already started");
      return schedule;
    }

    function get$1(node, id) {
      var schedule = node.__transition;
      if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
      return schedule;
    }

    function create(node, id, self) {
      var schedules = node.__transition,
          tween;

      // Initialize the self timer when the transition is created.
      // Note the actual delay is not known until the first callback!
      schedules[id] = self;
      self.timer = timer(schedule, 0, self.time);

      function schedule(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start, self.delay, self.time);

        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
      }

      function start(elapsed) {
        var i, j, n, o;

        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== SCHEDULED) return stop();

        for (i in schedules) {
          o = schedules[i];
          if (o.name !== self.name) continue;

          // While this element already has a starting transition during this frame,
          // defer starting an interrupting transition until that transition has a
          // chance to tick (and possibly end); see d3/d3-transition#54!
          if (o.state === STARTED) return timeout$1(start);

          // Interrupt the active transition, if any.
          // Dispatch the interrupt event.
          if (o.state === RUNNING) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("interrupt", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }

          // Cancel any pre-empted transitions. No interrupt event is dispatched
          // because the cancelled transitions never started. Note that this also
          // removes this transition from the pending list!
          else if (+i < id) {
            o.state = ENDED;
            o.timer.stop();
            delete schedules[i];
          }
        }

        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        timeout$1(function() {
          if (self.state === STARTED) {
            self.state = RUNNING;
            self.timer.restart(tick, self.delay, self.time);
            tick(elapsed);
          }
        });

        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return; // interrupted
        self.state = STARTED;

        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for (i = 0, j = -1; i < n; ++i) {
          if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
            tween[++j] = o;
          }
        }
        tween.length = j + 1;
      }

      function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
            i = -1,
            n = tween.length;

        while (++i < n) {
          tween[i].call(null, t);
        }

        // Dispatch the end event.
        if (self.state === ENDING) {
          self.on.call("end", node, node.__data__, self.index, self.group);
          stop();
        }
      }

      function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id];
        for (var i in schedules) return; // eslint-disable-line no-unused-vars
        delete node.__transition;
      }
    }

    function interrupt(node, name) {
      var schedules = node.__transition,
          schedule,
          active,
          empty = true,
          i;

      if (!schedules) return;

      name = name == null ? null : name + "";

      for (i in schedules) {
        if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
        active = schedule.state > STARTING && schedule.state < ENDING;
        schedule.state = ENDED;
        schedule.timer.stop();
        if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
      }

      if (empty) delete node.__transition;
    }

    function selection_interrupt(name) {
      return this.each(function() {
        interrupt(this, name);
      });
    }

    function tweenRemove(id, name) {
      var tween0, tween1;
      return function() {
        var schedule = set$1(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = tween0 = tween;
          for (var i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1 = tween1.slice();
              tween1.splice(i, 1);
              break;
            }
          }
        }

        schedule.tween = tween1;
      };
    }

    function tweenFunction(id, name, value) {
      var tween0, tween1;
      if (typeof value !== "function") throw new Error;
      return function() {
        var schedule = set$1(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = (tween0 = tween).slice();
          for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1[i] = t;
              break;
            }
          }
          if (i === n) tween1.push(t);
        }

        schedule.tween = tween1;
      };
    }

    function transition_tween(name, value) {
      var id = this._id;

      name += "";

      if (arguments.length < 2) {
        var tween = get$1(this.node(), id).tween;
        for (var i = 0, n = tween.length, t; i < n; ++i) {
          if ((t = tween[i]).name === name) {
            return t.value;
          }
        }
        return null;
      }

      return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
    }

    function tweenValue(transition, name, value) {
      var id = transition._id;

      transition.each(function() {
        var schedule = set$1(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
      });

      return function(node) {
        return get$1(node, id).value[name];
      };
    }

    function interpolate(a, b) {
      var c;
      return (typeof b === "number" ? reinterpolate
          : b instanceof color ? interpolateRgb
          : (c = color(b)) ? (b = c, interpolateRgb)
          : interpolateString)(a, b);
    }

    function attrRemove$1(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS$1(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant$1(name, interpolate, value1) {
      var value00,
          interpolate0;
      return function() {
        var value0 = this.getAttribute(name);
        return value0 === value1 ? null
            : value0 === value00 ? interpolate0
            : interpolate0 = interpolate(value00 = value0, value1);
      };
    }

    function attrConstantNS$1(fullname, interpolate, value1) {
      var value00,
          interpolate0;
      return function() {
        var value0 = this.getAttributeNS(fullname.space, fullname.local);
        return value0 === value1 ? null
            : value0 === value00 ? interpolate0
            : interpolate0 = interpolate(value00 = value0, value1);
      };
    }

    function attrFunction$1(name, interpolate, value) {
      var value00,
          value10,
          interpolate0;
      return function() {
        var value0, value1 = value(this);
        if (value1 == null) return void this.removeAttribute(name);
        value0 = this.getAttribute(name);
        return value0 === value1 ? null
            : value0 === value00 && value1 === value10 ? interpolate0
            : interpolate0 = interpolate(value00 = value0, value10 = value1);
      };
    }

    function attrFunctionNS$1(fullname, interpolate, value) {
      var value00,
          value10,
          interpolate0;
      return function() {
        var value0, value1 = value(this);
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        value0 = this.getAttributeNS(fullname.space, fullname.local);
        return value0 === value1 ? null
            : value0 === value00 && value1 === value10 ? interpolate0
            : interpolate0 = interpolate(value00 = value0, value10 = value1);
      };
    }

    function transition_attr(name, value) {
      var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
      return this.attrTween(name, typeof value === "function"
          ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
          : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
          : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value + ""));
    }

    function attrTweenNS(fullname, value) {
      function tween() {
        var node = this, i = value.apply(node, arguments);
        return i && function(t) {
          node.setAttributeNS(fullname.space, fullname.local, i(t));
        };
      }
      tween._value = value;
      return tween;
    }

    function attrTween(name, value) {
      function tween() {
        var node = this, i = value.apply(node, arguments);
        return i && function(t) {
          node.setAttribute(name, i(t));
        };
      }
      tween._value = value;
      return tween;
    }

    function transition_attrTween(name, value) {
      var key = "attr." + name;
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      var fullname = namespace(name);
      return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
    }

    function delayFunction(id, value) {
      return function() {
        init(this, id).delay = +value.apply(this, arguments);
      };
    }

    function delayConstant(id, value) {
      return value = +value, function() {
        init(this, id).delay = value;
      };
    }

    function transition_delay(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? delayFunction
              : delayConstant)(id, value))
          : get$1(this.node(), id).delay;
    }

    function durationFunction(id, value) {
      return function() {
        set$1(this, id).duration = +value.apply(this, arguments);
      };
    }

    function durationConstant(id, value) {
      return value = +value, function() {
        set$1(this, id).duration = value;
      };
    }

    function transition_duration(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? durationFunction
              : durationConstant)(id, value))
          : get$1(this.node(), id).duration;
    }

    function easeConstant(id, value) {
      if (typeof value !== "function") throw new Error;
      return function() {
        set$1(this, id).ease = value;
      };
    }

    function transition_ease(value) {
      var id = this._id;

      return arguments.length
          ? this.each(easeConstant(id, value))
          : get$1(this.node(), id).ease;
    }

    function transition_filter(match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Transition(subgroups, this._parents, this._name, this._id);
    }

    function transition_merge(transition) {
      if (transition._id !== this._id) throw new Error;

      for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Transition(merges, this._parents, this._name, this._id);
    }

    function start(name) {
      return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
      });
    }

    function onFunction(id, name, listener) {
      var on0, on1, sit = start(name) ? init : set$1;
      return function() {
        var schedule = sit(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

        schedule.on = on1;
      };
    }

    function transition_on(name, listener) {
      var id = this._id;

      return arguments.length < 2
          ? get$1(this.node(), id).on.on(name)
          : this.each(onFunction(id, name, listener));
    }

    function removeFunction(id) {
      return function() {
        var parent = this.parentNode;
        for (var i in this.__transition) if (+i !== id) return;
        if (parent) parent.removeChild(this);
      };
    }

    function transition_remove() {
      return this.on("end.remove", removeFunction(this._id));
    }

    function transition_select(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
            schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
          }
        }
      }

      return new Transition(subgroups, this._parents, name, id);
    }

    function transition_selectAll(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            for (var children = select.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
              if (child = children[k]) {
                schedule(child, name, id, k, children, inherit);
              }
            }
            subgroups.push(children);
            parents.push(node);
          }
        }
      }

      return new Transition(subgroups, parents, name, id);
    }

    var Selection$1 = selection.prototype.constructor;

    function transition_selection() {
      return new Selection$1(this._groups, this._parents);
    }

    function styleRemove$1(name, interpolate) {
      var value00,
          value10,
          interpolate0;
      return function() {
        var value0 = styleValue(this, name),
            value1 = (this.style.removeProperty(name), styleValue(this, name));
        return value0 === value1 ? null
            : value0 === value00 && value1 === value10 ? interpolate0
            : interpolate0 = interpolate(value00 = value0, value10 = value1);
      };
    }

    function styleRemoveEnd(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant$1(name, interpolate, value1) {
      var value00,
          interpolate0;
      return function() {
        var value0 = styleValue(this, name);
        return value0 === value1 ? null
            : value0 === value00 ? interpolate0
            : interpolate0 = interpolate(value00 = value0, value1);
      };
    }

    function styleFunction$1(name, interpolate, value) {
      var value00,
          value10,
          interpolate0;
      return function() {
        var value0 = styleValue(this, name),
            value1 = value(this);
        if (value1 == null) value1 = (this.style.removeProperty(name), styleValue(this, name));
        return value0 === value1 ? null
            : value0 === value00 && value1 === value10 ? interpolate0
            : interpolate0 = interpolate(value00 = value0, value10 = value1);
      };
    }

    function transition_style(name, value, priority) {
      var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
      return value == null ? this
              .styleTween(name, styleRemove$1(name, i))
              .on("end.style." + name, styleRemoveEnd(name))
          : this.styleTween(name, typeof value === "function"
              ? styleFunction$1(name, i, tweenValue(this, "style." + name, value))
              : styleConstant$1(name, i, value + ""), priority);
    }

    function styleTween(name, value, priority) {
      function tween() {
        var node = this, i = value.apply(node, arguments);
        return i && function(t) {
          node.style.setProperty(name, i(t), priority);
        };
      }
      tween._value = value;
      return tween;
    }

    function transition_styleTween(name, value, priority) {
      var key = "style." + (name += "");
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
    }

    function textConstant$1(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction$1(value) {
      return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
      };
    }

    function transition_text(value) {
      return this.tween("text", typeof value === "function"
          ? textFunction$1(tweenValue(this, "text", value))
          : textConstant$1(value == null ? "" : value + ""));
    }

    function transition_transition() {
      var name = this._name,
          id0 = this._id,
          id1 = newId();

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            var inherit = get$1(node, id0);
            schedule(node, name, id1, i, group, {
              time: inherit.time + inherit.delay + inherit.duration,
              delay: 0,
              duration: inherit.duration,
              ease: inherit.ease
            });
          }
        }
      }

      return new Transition(groups, this._parents, name, id1);
    }

    var id = 0;

    function Transition(groups, parents, name, id) {
      this._groups = groups;
      this._parents = parents;
      this._name = name;
      this._id = id;
    }

    function transition(name) {
      return selection().transition(name);
    }

    function newId() {
      return ++id;
    }

    var selection_prototype = selection.prototype;

    Transition.prototype = transition.prototype = {
      constructor: Transition,
      select: transition_select,
      selectAll: transition_selectAll,
      filter: transition_filter,
      merge: transition_merge,
      selection: transition_selection,
      transition: transition_transition,
      call: selection_prototype.call,
      nodes: selection_prototype.nodes,
      node: selection_prototype.node,
      size: selection_prototype.size,
      empty: selection_prototype.empty,
      each: selection_prototype.each,
      on: transition_on,
      attr: transition_attr,
      attrTween: transition_attrTween,
      style: transition_style,
      styleTween: transition_styleTween,
      text: transition_text,
      remove: transition_remove,
      tween: transition_tween,
      delay: transition_delay,
      duration: transition_duration,
      ease: transition_ease
    };

    function cubicInOut(t) {
      return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    }

    var pi = Math.PI;

    var tau = 2 * Math.PI;

    var defaultTiming = {
      time: null, // Set on use.
      delay: 0,
      duration: 250,
      ease: cubicInOut
    };

    function inherit(node, id) {
      var timing;
      while (!(timing = node.__transition) || !(timing = timing[id])) {
        if (!(node = node.parentNode)) {
          return defaultTiming.time = now(), defaultTiming;
        }
      }
      return timing;
    }

    function selection_transition(name) {
      var id,
          timing;

      if (name instanceof Transition) {
        id = name._id, name = name._name;
      } else {
        id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
      }

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            schedule(node, name, id, i, group, timing || inherit(node, id));
          }
        }
      }

      return new Transition(groups, this._parents, name, id);
    }

    selection.prototype.interrupt = selection_interrupt;
    selection.prototype.transition = selection_transition;

    var pi$1 = Math.PI;

    var pi$2 = Math.PI,
        tau$1 = 2 * pi$2,
        epsilon$1 = 1e-6,
        tauEpsilon = tau$1 - epsilon$1;

    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path() {
      return new Path;
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon$1));

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
          var x20 = x2 - x0,
              y20 = y2 - y0,
              l21_2 = x21 * x21 + y21 * y21,
              l20_2 = x20 * x20 + y20 * y20,
              l21 = Math.sqrt(l21_2),
              l01 = Math.sqrt(l01_2),
              l = r * Math.tan((pi$2 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
              t01 = l / l01,
              t21 = l / l21;

          // If the start tangent is not coincident with (x0,y0), line to.
          if (Math.abs(t01 - 1) > epsilon$1) {
            this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
          }

          this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
      },
      arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
          this._ += "L" + x0 + "," + y0;
        }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau$1 + tau$1;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon$1) {
          this._ += "A" + r + "," + r + ",0," + (+(da >= pi$2)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
      },
      rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
      },
      toString: function() {
        return this._;
      }
    };

    var prefix = "$";

    function Map() {}

    Map.prototype = map.prototype = {
      constructor: Map,
      has: function(key) {
        return (prefix + key) in this;
      },
      get: function(key) {
        return this[prefix + key];
      },
      set: function(key, value) {
        this[prefix + key] = value;
        return this;
      },
      remove: function(key) {
        var property = prefix + key;
        return property in this && delete this[property];
      },
      clear: function() {
        for (var property in this) if (property[0] === prefix) delete this[property];
      },
      keys: function() {
        var keys = [];
        for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
        return keys;
      },
      values: function() {
        var values = [];
        for (var property in this) if (property[0] === prefix) values.push(this[property]);
        return values;
      },
      entries: function() {
        var entries = [];
        for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
        return entries;
      },
      size: function() {
        var size = 0;
        for (var property in this) if (property[0] === prefix) ++size;
        return size;
      },
      empty: function() {
        for (var property in this) if (property[0] === prefix) return false;
        return true;
      },
      each: function(f) {
        for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
      }
    };

    function map(object, f) {
      var map = new Map;

      // Copy constructor.
      if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

      // Index array by numeric index or specified key function.
      else if (Array.isArray(object)) {
        var i = -1,
            n = object.length,
            o;

        if (f == null) while (++i < n) map.set(i, object[i]);
        else while (++i < n) map.set(f(o = object[i], i, object), o);
      }

      // Convert object to map.
      else if (object) for (var key in object) map.set(key, object[key]);

      return map;
    }

    function Set() {}

    var proto = map.prototype;

    Set.prototype = set$2.prototype = {
      constructor: Set,
      has: proto.has,
      add: function(value) {
        value += "";
        this[prefix + value] = value;
        return this;
      },
      remove: proto.remove,
      clear: proto.clear,
      values: proto.keys,
      size: proto.size,
      empty: proto.empty,
      each: proto.each
    };

    function set$2(object, f) {
      var set = new Set;

      // Copy constructor.
      if (object instanceof Set) object.each(function(value) { set.add(value); });

      // Otherwise, assume it’s an array.
      else if (object) {
        var i = -1, n = object.length;
        if (f == null) while (++i < n) set.add(object[i]);
        else while (++i < n) set.add(f(object[i], i, object));
      }

      return set;
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "]";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function dsvFormat(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        })).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(text) {
        return text == null ? ""
            : reFormat.test(text += "") ? "\"" + text.replace(/"/g, "\"\"") + "\""
            : text;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatRows: formatRows
      };
    }

    var csv = dsvFormat(",");

    var tsv = dsvFormat("\t");

    function tree_add(d) {
      var x = +this._x.call(null, d),
          y = +this._y.call(null, d);
      return add(this.cover(x, y), x, y, d);
    }

    function add(tree, x, y, d) {
      if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

      var parent,
          node = tree._root,
          leaf = {data: d},
          x0 = tree._x0,
          y0 = tree._y0,
          x1 = tree._x1,
          y1 = tree._y1,
          xm,
          ym,
          xp,
          yp,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return tree._root = leaf, tree;

      // Find the existing leaf for the new point, or add it.
      while (node.length) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
      }

      // Is the new point is exactly coincident with the existing point?
      xp = +tree._x.call(null, node.data);
      yp = +tree._y.call(null, node.data);
      if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

      // Otherwise, split the leaf node until the old and new point are separated.
      do {
        parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
      } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | (xp >= xm)));
      return parent[j] = node, parent[i] = leaf, tree;
    }

    function addAll(data) {
      var d, i, n = data.length,
          x,
          y,
          xz = new Array(n),
          yz = new Array(n),
          x0 = Infinity,
          y0 = Infinity,
          x1 = -Infinity,
          y1 = -Infinity;

      // Compute the points and their extent.
      for (i = 0; i < n; ++i) {
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }

      // If there were no (valid) points, inherit the existing extent.
      if (x1 < x0) x0 = this._x0, x1 = this._x1;
      if (y1 < y0) y0 = this._y0, y1 = this._y1;

      // Expand the tree to cover the new points.
      this.cover(x0, y0).cover(x1, y1);

      // Add the new points.
      for (i = 0; i < n; ++i) {
        add(this, xz[i], yz[i], data[i]);
      }

      return this;
    }

    function tree_cover(x, y) {
      if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

      var x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1;

      // If the quadtree has no extent, initialize them.
      // Integer extent are necessary so that if we later double the extent,
      // the existing quadrant boundaries don’t change due to floating point error!
      if (isNaN(x0)) {
        x1 = (x0 = Math.floor(x)) + 1;
        y1 = (y0 = Math.floor(y)) + 1;
      }

      // Otherwise, double repeatedly to cover.
      else if (x0 > x || x > x1 || y0 > y || y > y1) {
        var z = x1 - x0,
            node = this._root,
            parent,
            i;

        switch (i = (y < (y0 + y1) / 2) << 1 | (x < (x0 + x1) / 2)) {
          case 0: {
            do parent = new Array(4), parent[i] = node, node = parent;
            while (z *= 2, x1 = x0 + z, y1 = y0 + z, x > x1 || y > y1);
            break;
          }
          case 1: {
            do parent = new Array(4), parent[i] = node, node = parent;
            while (z *= 2, x0 = x1 - z, y1 = y0 + z, x0 > x || y > y1);
            break;
          }
          case 2: {
            do parent = new Array(4), parent[i] = node, node = parent;
            while (z *= 2, x1 = x0 + z, y0 = y1 - z, x > x1 || y0 > y);
            break;
          }
          case 3: {
            do parent = new Array(4), parent[i] = node, node = parent;
            while (z *= 2, x0 = x1 - z, y0 = y1 - z, x0 > x || y0 > y);
            break;
          }
        }

        if (this._root && this._root.length) this._root = node;
      }

      // If the quadtree covers the point already, just return.
      else return this;

      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      return this;
    }

    function tree_data() {
      var data = [];
      this.visit(function(node) {
        if (!node.length) do data.push(node.data); while (node = node.next)
      });
      return data;
    }

    function tree_extent(_) {
      return arguments.length
          ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1])
          : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
    }

    function Quad(node, x0, y0, x1, y1) {
      this.node = node;
      this.x0 = x0;
      this.y0 = y0;
      this.x1 = x1;
      this.y1 = y1;
    }

    function tree_find(x, y, radius) {
      var data,
          x0 = this._x0,
          y0 = this._y0,
          x1,
          y1,
          x2,
          y2,
          x3 = this._x1,
          y3 = this._y1,
          quads = [],
          node = this._root,
          q,
          i;

      if (node) quads.push(new Quad(node, x0, y0, x3, y3));
      if (radius == null) radius = Infinity;
      else {
        x0 = x - radius, y0 = y - radius;
        x3 = x + radius, y3 = y + radius;
        radius *= radius;
      }

      while (q = quads.pop()) {

        // Stop searching if this quadrant can’t contain a closer node.
        if (!(node = q.node)
            || (x1 = q.x0) > x3
            || (y1 = q.y0) > y3
            || (x2 = q.x1) < x0
            || (y2 = q.y1) < y0) continue;

        // Bisect the current quadrant.
        if (node.length) {
          var xm = (x1 + x2) / 2,
              ym = (y1 + y2) / 2;

          quads.push(
            new Quad(node[3], xm, ym, x2, y2),
            new Quad(node[2], x1, ym, xm, y2),
            new Quad(node[1], xm, y1, x2, ym),
            new Quad(node[0], x1, y1, xm, ym)
          );

          // Visit the closest quadrant first.
          if (i = (y >= ym) << 1 | (x >= xm)) {
            q = quads[quads.length - 1];
            quads[quads.length - 1] = quads[quads.length - 1 - i];
            quads[quads.length - 1 - i] = q;
          }
        }

        // Visit this point. (Visiting coincident points isn’t necessary!)
        else {
          var dx = x - +this._x.call(null, node.data),
              dy = y - +this._y.call(null, node.data),
              d2 = dx * dx + dy * dy;
          if (d2 < radius) {
            var d = Math.sqrt(radius = d2);
            x0 = x - d, y0 = y - d;
            x3 = x + d, y3 = y + d;
            data = node.data;
          }
        }
      }

      return data;
    }

    function tree_remove(d) {
      if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

      var parent,
          node = this._root,
          retainer,
          previous,
          next,
          x0 = this._x0,
          y0 = this._y0,
          x1 = this._x1,
          y1 = this._y1,
          x,
          y,
          xm,
          ym,
          right,
          bottom,
          i,
          j;

      // If the tree is empty, initialize the root as a leaf.
      if (!node) return this;

      // Find the leaf node for the point.
      // While descending, also retain the deepest parent with a non-removed sibling.
      if (node.length) while (true) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
        if (!node.length) break;
        if (parent[(i + 1) & 3] || parent[(i + 2) & 3] || parent[(i + 3) & 3]) retainer = parent, j = i;
      }

      // Find the point to remove.
      while (node.data !== d) if (!(previous = node, node = node.next)) return this;
      if (next = node.next) delete node.next;

      // If there are multiple coincident points, remove just the point.
      if (previous) return (next ? previous.next = next : delete previous.next), this;

      // If this is the root point, remove it.
      if (!parent) return this._root = next, this;

      // Remove this leaf.
      next ? parent[i] = next : delete parent[i];

      // If the parent now contains exactly one leaf, collapse superfluous parents.
      if ((node = parent[0] || parent[1] || parent[2] || parent[3])
          && node === (parent[3] || parent[2] || parent[1] || parent[0])
          && !node.length) {
        if (retainer) retainer[j] = node;
        else this._root = node;
      }

      return this;
    }

    function removeAll(data) {
      for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);
      return this;
    }

    function tree_root() {
      return this._root;
    }

    function tree_size() {
      var size = 0;
      this.visit(function(node) {
        if (!node.length) do ++size; while (node = node.next)
      });
      return size;
    }

    function tree_visit(callback) {
      var quads = [], q, node = this._root, child, x0, y0, x1, y1;
      if (node) quads.push(new Quad(node, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
          var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
        }
      }
      return this;
    }

    function tree_visitAfter(callback) {
      var quads = [], next = [], q;
      if (this._root) quads.push(new Quad(this._root, this._x0, this._y0, this._x1, this._y1));
      while (q = quads.pop()) {
        var node = q.node;
        if (node.length) {
          var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
          if (child = node[0]) quads.push(new Quad(child, x0, y0, xm, ym));
          if (child = node[1]) quads.push(new Quad(child, xm, y0, x1, ym));
          if (child = node[2]) quads.push(new Quad(child, x0, ym, xm, y1));
          if (child = node[3]) quads.push(new Quad(child, xm, ym, x1, y1));
        }
        next.push(q);
      }
      while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
      }
      return this;
    }

    function defaultX(d) {
      return d[0];
    }

    function tree_x(_) {
      return arguments.length ? (this._x = _, this) : this._x;
    }

    function defaultY(d) {
      return d[1];
    }

    function tree_y(_) {
      return arguments.length ? (this._y = _, this) : this._y;
    }

    function quadtree(nodes, x, y) {
      var tree = new Quadtree(x == null ? defaultX : x, y == null ? defaultY : y, NaN, NaN, NaN, NaN);
      return nodes == null ? tree : tree.addAll(nodes);
    }

    function Quadtree(x, y, x0, y0, x1, y1) {
      this._x = x;
      this._y = y;
      this._x0 = x0;
      this._y0 = y0;
      this._x1 = x1;
      this._y1 = y1;
      this._root = undefined;
    }

    function leaf_copy(leaf) {
      var copy = {data: leaf.data}, next = copy;
      while (leaf = leaf.next) next = next.next = {data: leaf.data};
      return copy;
    }

    var treeProto = quadtree.prototype = Quadtree.prototype;

    treeProto.copy = function() {
      var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
          node = this._root,
          nodes,
          child;

      if (!node) return copy;

      if (!node.length) return copy._root = leaf_copy(node), copy;

      nodes = [{source: node, target: copy._root = new Array(4)}];
      while (node = nodes.pop()) {
        for (var i = 0; i < 4; ++i) {
          if (child = node.source[i]) {
            if (child.length) nodes.push({source: child, target: node.target[i] = new Array(4)});
            else node.target[i] = leaf_copy(child);
          }
        }
      }

      return copy;
    };

    treeProto.add = tree_add;
    treeProto.addAll = addAll;
    treeProto.cover = tree_cover;
    treeProto.data = tree_data;
    treeProto.extent = tree_extent;
    treeProto.find = tree_find;
    treeProto.remove = tree_remove;
    treeProto.removeAll = removeAll;
    treeProto.root = tree_root;
    treeProto.size = tree_size;
    treeProto.visit = tree_visit;
    treeProto.visitAfter = tree_visitAfter;
    treeProto.x = tree_x;
    treeProto.y = tree_y;

    var initialAngle = Math.PI * (3 - Math.sqrt(5));

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimal(1.23) returns ["123", 0].
    function formatDecimal(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      return new FormatSpecifier(specifier);
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      this.fill = match[1] || " ";
      this.align = match[2] || ">";
      this.sign = match[3] || "-";
      this.symbol = match[4] || "";
      this.zero = !!match[5];
      this.width = match[6] && +match[6];
      this.comma = !!match[7];
      this.precision = match[8] && +match[8].slice(1);
      this.trim = !!match[9];
      this.type = match[10] || "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width == null ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": function(x, p) { return (x * 100).toFixed(p); },
      "b": function(x) { return Math.round(x).toString(2); },
      "c": function(x) { return x + ""; },
      "d": function(x) { return Math.round(x).toString(10); },
      "e": function(x, p) { return x.toExponential(p); },
      "f": function(x, p) { return x.toFixed(p); },
      "g": function(x, p) { return x.toPrecision(p); },
      "o": function(x) { return Math.round(x).toString(8); },
      "p": function(x, p) { return formatRounded(x * 100, p); },
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
      "x": function(x) { return Math.round(x).toString(16); }
    };

    function identity$2(x) {
      return x;
    }

    var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$2,
          currency = locale.currency,
          decimal = locale.decimal,
          numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$2,
          percent = locale.percent || "%";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision == null ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Perform the initial formatting.
            var valueNegative = value < 0;
            value = formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero during formatting, treat as positive.
            if (valueNegative && +value === 0) valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    // Adds floating point numbers with twice the normal precision.
    // Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
    // Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
    // 305–363 (1997).
    // Code adapted from GeographicLib by Charles F. F. Karney,
    // http://geographiclib.sourceforge.net/

    function adder() {
      return new Adder;
    }

    function Adder() {
      this.reset();
    }

    Adder.prototype = {
      constructor: Adder,
      reset: function() {
        this.s = // rounded value
        this.t = 0; // exact error
      },
      add: function(y) {
        add$1(temp, y, this.t);
        add$1(this, temp.s, this.s);
        if (this.s) this.t += temp.t;
        else this.s = temp.t;
      },
      valueOf: function() {
        return this.s;
      }
    };

    var temp = new Adder;

    function add$1(adder, a, b) {
      var x = adder.s = a + b,
          bv = x - a,
          av = x - bv;
      adder.t = (a - av) + (b - bv);
    }

    var pi$3 = Math.PI;

    var areaRingSum = adder();

    var areaSum = adder();

    var deltaSum = adder();

    var sum = adder();

    var lengthSum = adder();

    var areaSum$1 = adder(),
        areaRingSum$1 = adder();

    var lengthSum$1 = adder();

    var array$1 = Array.prototype;

    var map$1 = array$1.map;
    var slice$1 = array$1.slice;

    function constant$2(x) {
      return function() {
        return x;
      };
    }

    function number$1(x) {
      return +x;
    }

    var unit = [0, 1];

    function deinterpolateLinear(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constant$2(b);
    }

    function deinterpolateClamp(deinterpolate) {
      return function(a, b) {
        var d = deinterpolate(a = +a, b = +b);
        return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
      };
    }

    function reinterpolateClamp(reinterpolate) {
      return function(a, b) {
        var r = reinterpolate(a = +a, b = +b);
        return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
      };
    }

    function bimap(domain, range, deinterpolate, reinterpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
      else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, deinterpolate, reinterpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = deinterpolate(domain[i], domain[i + 1]);
        r[i] = reinterpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp());
    }

    // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
    function continuous(deinterpolate, reinterpolate) {
      var domain = unit,
          range = unit,
          interpolate = interpolateValue,
          clamp = false,
          piecewise,
          output,
          input;

      function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate)))(+x);
      }

      scale.invert = function(y) {
        return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = map$1.call(_, number$1), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice$1.call(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = slice$1.call(_), interpolate = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = !!_, rescale()) : clamp;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      return rescale();
    }

    function tickFormat(domain, count, specifier) {
      var start = domain[0],
          stop = domain[domain.length - 1],
          step = tickStep(start, stop, count == null ? 10 : count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        return tickFormat(domain(), count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain(),
            i0 = 0,
            i1 = d.length - 1,
            start = d[i0],
            stop = d[i1],
            step;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }

        step = tickIncrement(start, stop, count);

        if (step > 0) {
          start = Math.floor(start / step) * step;
          stop = Math.ceil(stop / step) * step;
          step = tickIncrement(start, stop, count);
        } else if (step < 0) {
          start = Math.ceil(start * step) / step;
          stop = Math.floor(stop * step) / step;
          step = tickIncrement(start, stop, count);
        }

        if (step > 0) {
          d[i0] = Math.floor(start / step) * step;
          d[i1] = Math.ceil(stop / step) * step;
          domain(d);
        } else if (step < 0) {
          d[i0] = Math.ceil(start * step) / step;
          d[i1] = Math.floor(stop * step) / step;
          domain(d);
        }

        return scale;
      };

      return scale;
    }

    function linear$1() {
      var scale = continuous(deinterpolateLinear, reinterpolate);

      scale.copy = function() {
        return copy(scale, linear$1());
      };

      return linearish(scale);
    }

    function nice(domain, interval) {
      domain = domain.slice();

      var i0 = 0,
          i1 = domain.length - 1,
          x0 = domain[i0],
          x1 = domain[i1],
          t;

      if (x1 < x0) {
        t = i0, i0 = i1, i1 = t;
        t = x0, x0 = x1, x1 = t;
      }

      domain[i0] = interval.floor(x0);
      domain[i1] = interval.ceil(x1);
      return domain;
    }

    var t0$1 = new Date,
        t1$1 = new Date;

    function newInterval(floori, offseti, count, field) {

      function interval(date) {
        return floori(date = new Date(+date)), date;
      }

      interval.floor = interval;

      interval.ceil = function(date) {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };

      interval.round = function(date) {
        var d0 = interval(date),
            d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
      };

      interval.offset = function(date, step) {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };

      interval.range = function(start, stop, step) {
        var range = [], previous;
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop);
        return range;
      };

      interval.filter = function(test) {
        return newInterval(function(date) {
          if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
        }, function(date, step) {
          if (date >= date) {
            if (step < 0) while (++step <= 0) {
              while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
            } else while (--step >= 0) {
              while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
            }
          }
        });
      };

      if (count) {
        interval.count = function(start, end) {
          t0$1.setTime(+start), t1$1.setTime(+end);
          floori(t0$1), floori(t1$1);
          return Math.floor(count(t0$1, t1$1));
        };

        interval.every = function(step) {
          step = Math.floor(step);
          return !isFinite(step) || !(step > 0) ? null
              : !(step > 1) ? interval
              : interval.filter(field
                  ? function(d) { return field(d) % step === 0; }
                  : function(d) { return interval.count(0, d) % step === 0; });
        };
      }

      return interval;
    }

    var millisecond = newInterval(function() {
      // noop
    }, function(date, step) {
      date.setTime(+date + step);
    }, function(start, end) {
      return end - start;
    });

    // An optimized implementation for this simple case.
    millisecond.every = function(k) {
      k = Math.floor(k);
      if (!isFinite(k) || !(k > 0)) return null;
      if (!(k > 1)) return millisecond;
      return newInterval(function(date) {
        date.setTime(Math.floor(date / k) * k);
      }, function(date, step) {
        date.setTime(+date + step * k);
      }, function(start, end) {
        return (end - start) / k;
      });
    };

    var durationSecond = 1e3;
    var durationMinute = 6e4;
    var durationHour = 36e5;
    var durationDay = 864e5;
    var durationWeek = 6048e5;

    var second = newInterval(function(date) {
      date.setTime(Math.floor(date / durationSecond) * durationSecond);
    }, function(date, step) {
      date.setTime(+date + step * durationSecond);
    }, function(start, end) {
      return (end - start) / durationSecond;
    }, function(date) {
      return date.getUTCSeconds();
    });

    var minute = newInterval(function(date) {
      date.setTime(Math.floor(date / durationMinute) * durationMinute);
    }, function(date, step) {
      date.setTime(+date + step * durationMinute);
    }, function(start, end) {
      return (end - start) / durationMinute;
    }, function(date) {
      return date.getMinutes();
    });

    var hour = newInterval(function(date) {
      var offset = date.getTimezoneOffset() * durationMinute % durationHour;
      if (offset < 0) offset += durationHour;
      date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
    }, function(date, step) {
      date.setTime(+date + step * durationHour);
    }, function(start, end) {
      return (end - start) / durationHour;
    }, function(date) {
      return date.getHours();
    });

    var day = newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
    }, function(date) {
      return date.getDate() - 1;
    });

    function weekday(i) {
      return newInterval(function(date) {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setDate(date.getDate() + step * 7);
      }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
    }

    var sunday = weekday(0);
    var monday = weekday(1);
    var tuesday = weekday(2);
    var wednesday = weekday(3);
    var thursday = weekday(4);
    var friday = weekday(5);
    var saturday = weekday(6);

    var month = newInterval(function(date) {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setMonth(date.getMonth() + step);
    }, function(start, end) {
      return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
    }, function(date) {
      return date.getMonth();
    });

    var year = newInterval(function(date) {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
      return end.getFullYear() - start.getFullYear();
    }, function(date) {
      return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    year.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setFullYear(date.getFullYear() + step * k);
      });
    };

    var utcMinute = newInterval(function(date) {
      date.setUTCSeconds(0, 0);
    }, function(date, step) {
      date.setTime(+date + step * durationMinute);
    }, function(start, end) {
      return (end - start) / durationMinute;
    }, function(date) {
      return date.getUTCMinutes();
    });

    var utcHour = newInterval(function(date) {
      date.setUTCMinutes(0, 0, 0);
    }, function(date, step) {
      date.setTime(+date + step * durationHour);
    }, function(start, end) {
      return (end - start) / durationHour;
    }, function(date) {
      return date.getUTCHours();
    });

    var utcDay = newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
      return (end - start) / durationDay;
    }, function(date) {
      return date.getUTCDate() - 1;
    });

    function utcWeekday(i) {
      return newInterval(function(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step * 7);
      }, function(start, end) {
        return (end - start) / durationWeek;
      });
    }

    var utcSunday = utcWeekday(0);
    var utcMonday = utcWeekday(1);
    var utcTuesday = utcWeekday(2);
    var utcWednesday = utcWeekday(3);
    var utcThursday = utcWeekday(4);
    var utcFriday = utcWeekday(5);
    var utcSaturday = utcWeekday(6);

    var utcMonth = newInterval(function(date) {
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCMonth(date.getUTCMonth() + step);
    }, function(start, end) {
      return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
    }, function(date) {
      return date.getUTCMonth();
    });

    var utcYear = newInterval(function(date) {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
      return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
      return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
    };

    function localDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newYear(y) {
      return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale$1(locale) {
      var locale_dateTime = locale.dateTime,
          locale_date = locale.date,
          locale_time = locale.time,
          locale_periods = locale.periods,
          locale_weekdays = locale.days,
          locale_shortWeekdays = locale.shortDays,
          locale_months = locale.months,
          locale_shortMonths = locale.shortMonths;

      var periodRe = formatRe(locale_periods),
          periodLookup = formatLookup(locale_periods),
          weekdayRe = formatRe(locale_weekdays),
          weekdayLookup = formatLookup(locale_weekdays),
          shortWeekdayRe = formatRe(locale_shortWeekdays),
          shortWeekdayLookup = formatLookup(locale_shortWeekdays),
          monthRe = formatRe(locale_months),
          monthLookup = formatLookup(locale_months),
          shortMonthRe = formatRe(locale_shortMonths),
          shortMonthLookup = formatLookup(locale_shortMonths);

      var formats = {
        "a": formatShortWeekday,
        "A": formatWeekday,
        "b": formatShortMonth,
        "B": formatMonth,
        "c": null,
        "d": formatDayOfMonth,
        "e": formatDayOfMonth,
        "f": formatMicroseconds,
        "H": formatHour24,
        "I": formatHour12,
        "j": formatDayOfYear,
        "L": formatMilliseconds,
        "m": formatMonthNumber,
        "M": formatMinutes,
        "p": formatPeriod,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatSeconds,
        "u": formatWeekdayNumberMonday,
        "U": formatWeekNumberSunday,
        "V": formatWeekNumberISO,
        "w": formatWeekdayNumberSunday,
        "W": formatWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatYear,
        "Y": formatFullYear,
        "Z": formatZone,
        "%": formatLiteralPercent
      };

      var utcFormats = {
        "a": formatUTCShortWeekday,
        "A": formatUTCWeekday,
        "b": formatUTCShortMonth,
        "B": formatUTCMonth,
        "c": null,
        "d": formatUTCDayOfMonth,
        "e": formatUTCDayOfMonth,
        "f": formatUTCMicroseconds,
        "H": formatUTCHour24,
        "I": formatUTCHour12,
        "j": formatUTCDayOfYear,
        "L": formatUTCMilliseconds,
        "m": formatUTCMonthNumber,
        "M": formatUTCMinutes,
        "p": formatUTCPeriod,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatUTCSeconds,
        "u": formatUTCWeekdayNumberMonday,
        "U": formatUTCWeekNumberSunday,
        "V": formatUTCWeekNumberISO,
        "w": formatUTCWeekdayNumberSunday,
        "W": formatUTCWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatUTCYear,
        "Y": formatUTCFullYear,
        "Z": formatUTCZone,
        "%": formatLiteralPercent
      };

      var parses = {
        "a": parseShortWeekday,
        "A": parseWeekday,
        "b": parseShortMonth,
        "B": parseMonth,
        "c": parseLocaleDateTime,
        "d": parseDayOfMonth,
        "e": parseDayOfMonth,
        "f": parseMicroseconds,
        "H": parseHour24,
        "I": parseHour24,
        "j": parseDayOfYear,
        "L": parseMilliseconds,
        "m": parseMonthNumber,
        "M": parseMinutes,
        "p": parsePeriod,
        "Q": parseUnixTimestamp,
        "s": parseUnixTimestampSeconds,
        "S": parseSeconds,
        "u": parseWeekdayNumberMonday,
        "U": parseWeekNumberSunday,
        "V": parseWeekNumberISO,
        "w": parseWeekdayNumberSunday,
        "W": parseWeekNumberMonday,
        "x": parseLocaleDate,
        "X": parseLocaleTime,
        "y": parseYear,
        "Y": parseFullYear,
        "Z": parseZone,
        "%": parseLiteralPercent
      };

      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);

      function newFormat(specifier, formats) {
        return function(date) {
          var string = [],
              i = -1,
              j = 0,
              n = specifier.length,
              c,
              pad,
              format;

          if (!(date instanceof Date)) date = new Date(+date);

          while (++i < n) {
            if (specifier.charCodeAt(i) === 37) {
              string.push(specifier.slice(j, i));
              if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
              else pad = c === "e" ? " " : "0";
              if (format = formats[c]) c = format(date, pad);
              string.push(c);
              j = i + 1;
            }
          }

          string.push(specifier.slice(j, i));
          return string.join("");
        };
      }

      function newParse(specifier, newDate) {
        return function(string) {
          var d = newYear(1900),
              i = parseSpecifier(d, specifier, string += "", 0),
              week, day$1;
          if (i != string.length) return null;

          // If a UNIX timestamp is specified, return it.
          if ("Q" in d) return new Date(d.Q);

          // The am-pm flag is 0 for AM, and 1 for PM.
          if ("p" in d) d.H = d.H % 12 + d.p * 12;

          // Convert day-of-week and week-of-year to day-of-year.
          if ("V" in d) {
            if (d.V < 1 || d.V > 53) return null;
            if (!("w" in d)) d.w = 1;
            if ("Z" in d) {
              week = utcDate(newYear(d.y)), day$1 = week.getUTCDay();
              week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
              week = utcDay.offset(week, (d.V - 1) * 7);
              d.y = week.getUTCFullYear();
              d.m = week.getUTCMonth();
              d.d = week.getUTCDate() + (d.w + 6) % 7;
            } else {
              week = newDate(newYear(d.y)), day$1 = week.getDay();
              week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
              week = day.offset(week, (d.V - 1) * 7);
              d.y = week.getFullYear();
              d.m = week.getMonth();
              d.d = week.getDate() + (d.w + 6) % 7;
            }
          } else if ("W" in d || "U" in d) {
            if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
            day$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
            d.m = 0;
            d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
          }

          // If a time zone is specified, all fields are interpreted as UTC and then
          // offset according to the specified time zone.
          if ("Z" in d) {
            d.H += d.Z / 100 | 0;
            d.M += d.Z % 100;
            return utcDate(d);
          }

          // Otherwise, all fields are in local time.
          return newDate(d);
        };
      }

      function parseSpecifier(d, specifier, string, j) {
        var i = 0,
            n = specifier.length,
            m = string.length,
            c,
            parse;

        while (i < n) {
          if (j >= m) return -1;
          c = specifier.charCodeAt(i++);
          if (c === 37) {
            c = specifier.charAt(i++);
            parse = parses[c in pads ? specifier.charAt(i++) : c];
            if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
          } else if (c != string.charCodeAt(j++)) {
            return -1;
          }
        }

        return j;
      }

      function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
      }

      function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
      }

      function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
      }

      function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
      }

      function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
      }

      function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
      }

      function formatMonth(d) {
        return locale_months[d.getMonth()];
      }

      function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
      }

      function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
      }

      function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
      }

      function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
      }

      function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
      }

      function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
      }

      return {
        format: function(specifier) {
          var f = newFormat(specifier += "", formats);
          f.toString = function() { return specifier; };
          return f;
        },
        parse: function(specifier) {
          var p = newParse(specifier += "", localDate);
          p.toString = function() { return specifier; };
          return p;
        },
        utcFormat: function(specifier) {
          var f = newFormat(specifier += "", utcFormats);
          f.toString = function() { return specifier; };
          return f;
        },
        utcParse: function(specifier) {
          var p = newParse(specifier, utcDate);
          p.toString = function() { return specifier; };
          return p;
        }
      };
    }

    var pads = {"-": "", "_": " ", "0": "0"},
        numberRe = /^\s*\d+/, // note: ignores next directive
        percentRe = /^%/,
        requoteRe = /[\\^$*+?|[\]().{}]/g;

    function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "",
          string = (sign ? -value : value) + "",
          length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
      return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
      var map = {}, i = -1, n = names.length;
      while (++i < n) map[names[i].toLowerCase()] = i;
      return map;
    }

    function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
      return pad(1 + day.count(year(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
      return pad(sunday.count(year(d), d), p, 2);
    }

    function formatWeekNumberISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
      return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
      return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
      return pad(monday.count(year(d), d), p, 2);
    }

    function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay.count(utcYear(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear(d), d), p, 2);
    }

    function formatUTCWeekNumberISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear(d), d), p, 2);
    }

    function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
      return "+0000";
    }

    function formatLiteralPercent() {
      return "%";
    }

    function formatUnixTimestamp(d) {
      return +d;
    }

    function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
    }

    var locale$1;
    var timeFormat;
    var timeParse;
    var utcFormat;
    var utcParse;

    defaultLocale$1({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      timeFormat = locale$1.format;
      timeParse = locale$1.parse;
      utcFormat = locale$1.utcFormat;
      utcParse = locale$1.utcParse;
      return locale$1;
    }

    var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

    function formatIsoNative(date) {
      return date.toISOString();
    }

    var formatIso = Date.prototype.toISOString
        ? formatIsoNative
        : utcFormat(isoSpecifier);

    function parseIsoNative(string) {
      var date = new Date(string);
      return isNaN(date) ? null : date;
    }

    var parseIso = +new Date("2000-01-01T00:00:00.000Z")
        ? parseIsoNative
        : utcParse(isoSpecifier);

    var durationSecond$1 = 1000,
        durationMinute$1 = durationSecond$1 * 60,
        durationHour$1 = durationMinute$1 * 60,
        durationDay$1 = durationHour$1 * 24,
        durationWeek$1 = durationDay$1 * 7,
        durationMonth = durationDay$1 * 30,
        durationYear = durationDay$1 * 365;

    function date$1(t) {
      return new Date(t);
    }

    function number$2(t) {
      return t instanceof Date ? +t : +new Date(+t);
    }

    function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
      var scale = continuous(deinterpolateLinear, reinterpolate),
          invert = scale.invert,
          domain = scale.domain;

      var formatMillisecond = format(".%L"),
          formatSecond = format(":%S"),
          formatMinute = format("%I:%M"),
          formatHour = format("%I %p"),
          formatDay = format("%a %d"),
          formatWeek = format("%b %d"),
          formatMonth = format("%B"),
          formatYear = format("%Y");

      var tickIntervals = [
        [second,  1,      durationSecond$1],
        [second,  5,  5 * durationSecond$1],
        [second, 15, 15 * durationSecond$1],
        [second, 30, 30 * durationSecond$1],
        [minute,  1,      durationMinute$1],
        [minute,  5,  5 * durationMinute$1],
        [minute, 15, 15 * durationMinute$1],
        [minute, 30, 30 * durationMinute$1],
        [  hour,  1,      durationHour$1  ],
        [  hour,  3,  3 * durationHour$1  ],
        [  hour,  6,  6 * durationHour$1  ],
        [  hour, 12, 12 * durationHour$1  ],
        [   day,  1,      durationDay$1   ],
        [   day,  2,  2 * durationDay$1   ],
        [  week,  1,      durationWeek$1  ],
        [ month,  1,      durationMonth ],
        [ month,  3,  3 * durationMonth ],
        [  year,  1,      durationYear  ]
      ];

      function tickFormat(date) {
        return (second(date) < date ? formatMillisecond
            : minute(date) < date ? formatSecond
            : hour(date) < date ? formatMinute
            : day(date) < date ? formatHour
            : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
            : year(date) < date ? formatMonth
            : formatYear)(date);
      }

      function tickInterval(interval, start, stop, step) {
        if (interval == null) interval = 10;

        // If a desired tick count is specified, pick a reasonable tick interval
        // based on the extent of the domain and a rough estimate of tick size.
        // Otherwise, assume interval is already a time interval and use it.
        if (typeof interval === "number") {
          var target = Math.abs(stop - start) / interval,
              i = bisector(function(i) { return i[2]; }).right(tickIntervals, target);
          if (i === tickIntervals.length) {
            step = tickStep(start / durationYear, stop / durationYear, interval);
            interval = year;
          } else if (i) {
            i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
            step = i[1];
            interval = i[0];
          } else {
            step = Math.max(tickStep(start, stop, interval), 1);
            interval = millisecond;
          }
        }

        return step == null ? interval : interval.every(step);
      }

      scale.invert = function(y) {
        return new Date(invert(y));
      };

      scale.domain = function(_) {
        return arguments.length ? domain(map$1.call(_, number$2)) : domain().map(date$1);
      };

      scale.ticks = function(interval, step) {
        var d = domain(),
            t0 = d[0],
            t1 = d[d.length - 1],
            r = t1 < t0,
            t;
        if (r) t = t0, t0 = t1, t1 = t;
        t = tickInterval(interval, t0, t1, step);
        t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
        return r ? t.reverse() : t;
      };

      scale.tickFormat = function(count, specifier) {
        return specifier == null ? tickFormat : format(specifier);
      };

      scale.nice = function(interval, step) {
        var d = domain();
        return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
            ? domain(nice(d, interval))
            : scale;
      };

      scale.copy = function() {
        return copy(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
      };

      return scale;
    }

    function time() {
      return calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
    }

    function colors(specifier) {
      var n = specifier.length / 6 | 0, colors = new Array(n), i = 0;
      while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);
      return colors;
    }

    colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

    colors("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

    colors("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

    colors("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

    colors("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

    colors("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

    colors("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

    colors("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

    colors("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

    function ramp(scheme) {
      return rgbBasis(scheme[scheme.length - 1]);
    }

    var scheme = new Array(3).concat(
      "d8b365f5f5f55ab4ac",
      "a6611adfc27d80cdc1018571",
      "a6611adfc27df5f5f580cdc1018571",
      "8c510ad8b365f6e8c3c7eae55ab4ac01665e",
      "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e",
      "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e",
      "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e",
      "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30",
      "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30"
    ).map(colors);

    ramp(scheme);

    var scheme$1 = new Array(3).concat(
      "af8dc3f7f7f77fbf7b",
      "7b3294c2a5cfa6dba0008837",
      "7b3294c2a5cff7f7f7a6dba0008837",
      "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837",
      "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837",
      "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837",
      "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837",
      "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b",
      "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b"
    ).map(colors);

    ramp(scheme$1);

    var scheme$2 = new Array(3).concat(
      "e9a3c9f7f7f7a1d76a",
      "d01c8bf1b6dab8e1864dac26",
      "d01c8bf1b6daf7f7f7b8e1864dac26",
      "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221",
      "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221",
      "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221",
      "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221",
      "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419",
      "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419"
    ).map(colors);

    ramp(scheme$2);

    var scheme$3 = new Array(3).concat(
      "998ec3f7f7f7f1a340",
      "5e3c99b2abd2fdb863e66101",
      "5e3c99b2abd2f7f7f7fdb863e66101",
      "542788998ec3d8daebfee0b6f1a340b35806",
      "542788998ec3d8daebf7f7f7fee0b6f1a340b35806",
      "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806",
      "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806",
      "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08",
      "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08"
    ).map(colors);

    ramp(scheme$3);

    var scheme$4 = new Array(3).concat(
      "ef8a62f7f7f767a9cf",
      "ca0020f4a58292c5de0571b0",
      "ca0020f4a582f7f7f792c5de0571b0",
      "b2182bef8a62fddbc7d1e5f067a9cf2166ac",
      "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac",
      "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac",
      "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac",
      "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061",
      "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061"
    ).map(colors);

    ramp(scheme$4);

    var scheme$5 = new Array(3).concat(
      "ef8a62ffffff999999",
      "ca0020f4a582bababa404040",
      "ca0020f4a582ffffffbababa404040",
      "b2182bef8a62fddbc7e0e0e09999994d4d4d",
      "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d",
      "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d",
      "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d",
      "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a",
      "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a"
    ).map(colors);

    ramp(scheme$5);

    var scheme$6 = new Array(3).concat(
      "fc8d59ffffbf91bfdb",
      "d7191cfdae61abd9e92c7bb6",
      "d7191cfdae61ffffbfabd9e92c7bb6",
      "d73027fc8d59fee090e0f3f891bfdb4575b4",
      "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4",
      "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4",
      "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4",
      "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695",
      "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695"
    ).map(colors);

    ramp(scheme$6);

    var scheme$7 = new Array(3).concat(
      "fc8d59ffffbf91cf60",
      "d7191cfdae61a6d96a1a9641",
      "d7191cfdae61ffffbfa6d96a1a9641",
      "d73027fc8d59fee08bd9ef8b91cf601a9850",
      "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850",
      "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850",
      "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850",
      "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837",
      "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837"
    ).map(colors);

    ramp(scheme$7);

    var scheme$8 = new Array(3).concat(
      "fc8d59ffffbf99d594",
      "d7191cfdae61abdda42b83ba",
      "d7191cfdae61ffffbfabdda42b83ba",
      "d53e4ffc8d59fee08be6f59899d5943288bd",
      "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd",
      "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd",
      "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd",
      "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2",
      "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2"
    ).map(colors);

    ramp(scheme$8);

    var scheme$9 = new Array(3).concat(
      "e5f5f999d8c92ca25f",
      "edf8fbb2e2e266c2a4238b45",
      "edf8fbb2e2e266c2a42ca25f006d2c",
      "edf8fbccece699d8c966c2a42ca25f006d2c",
      "edf8fbccece699d8c966c2a441ae76238b45005824",
      "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824",
      "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b"
    ).map(colors);

    ramp(scheme$9);

    var scheme$a = new Array(3).concat(
      "e0ecf49ebcda8856a7",
      "edf8fbb3cde38c96c688419d",
      "edf8fbb3cde38c96c68856a7810f7c",
      "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
      "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
      "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
      "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
    ).map(colors);

    ramp(scheme$a);

    var scheme$b = new Array(3).concat(
      "e0f3dba8ddb543a2ca",
      "f0f9e8bae4bc7bccc42b8cbe",
      "f0f9e8bae4bc7bccc443a2ca0868ac",
      "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac",
      "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e",
      "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e",
      "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081"
    ).map(colors);

    ramp(scheme$b);

    var scheme$c = new Array(3).concat(
      "fee8c8fdbb84e34a33",
      "fef0d9fdcc8afc8d59d7301f",
      "fef0d9fdcc8afc8d59e34a33b30000",
      "fef0d9fdd49efdbb84fc8d59e34a33b30000",
      "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000",
      "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000",
      "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000"
    ).map(colors);

    ramp(scheme$c);

    var scheme$d = new Array(3).concat(
      "ece2f0a6bddb1c9099",
      "f6eff7bdc9e167a9cf02818a",
      "f6eff7bdc9e167a9cf1c9099016c59",
      "f6eff7d0d1e6a6bddb67a9cf1c9099016c59",
      "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450",
      "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450",
      "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636"
    ).map(colors);

    ramp(scheme$d);

    var scheme$e = new Array(3).concat(
      "ece7f2a6bddb2b8cbe",
      "f1eef6bdc9e174a9cf0570b0",
      "f1eef6bdc9e174a9cf2b8cbe045a8d",
      "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d",
      "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b",
      "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b",
      "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858"
    ).map(colors);

    ramp(scheme$e);

    var scheme$f = new Array(3).concat(
      "e7e1efc994c7dd1c77",
      "f1eef6d7b5d8df65b0ce1256",
      "f1eef6d7b5d8df65b0dd1c77980043",
      "f1eef6d4b9dac994c7df65b0dd1c77980043",
      "f1eef6d4b9dac994c7df65b0e7298ace125691003f",
      "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f",
      "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f"
    ).map(colors);

    ramp(scheme$f);

    var scheme$g = new Array(3).concat(
      "fde0ddfa9fb5c51b8a",
      "feebe2fbb4b9f768a1ae017e",
      "feebe2fbb4b9f768a1c51b8a7a0177",
      "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177",
      "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177",
      "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177",
      "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a"
    ).map(colors);

    ramp(scheme$g);

    var scheme$h = new Array(3).concat(
      "edf8b17fcdbb2c7fb8",
      "ffffcca1dab441b6c4225ea8",
      "ffffcca1dab441b6c42c7fb8253494",
      "ffffccc7e9b47fcdbb41b6c42c7fb8253494",
      "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84",
      "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84",
      "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58"
    ).map(colors);

    ramp(scheme$h);

    var scheme$i = new Array(3).concat(
      "f7fcb9addd8e31a354",
      "ffffccc2e69978c679238443",
      "ffffccc2e69978c67931a354006837",
      "ffffccd9f0a3addd8e78c67931a354006837",
      "ffffccd9f0a3addd8e78c67941ab5d238443005a32",
      "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32",
      "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529"
    ).map(colors);

    ramp(scheme$i);

    var scheme$j = new Array(3).concat(
      "fff7bcfec44fd95f0e",
      "ffffd4fed98efe9929cc4c02",
      "ffffd4fed98efe9929d95f0e993404",
      "ffffd4fee391fec44ffe9929d95f0e993404",
      "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04",
      "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04",
      "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506"
    ).map(colors);

    ramp(scheme$j);

    var scheme$k = new Array(3).concat(
      "ffeda0feb24cf03b20",
      "ffffb2fecc5cfd8d3ce31a1c",
      "ffffb2fecc5cfd8d3cf03b20bd0026",
      "ffffb2fed976feb24cfd8d3cf03b20bd0026",
      "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026",
      "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026",
      "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026"
    ).map(colors);

    ramp(scheme$k);

    var scheme$l = new Array(3).concat(
      "deebf79ecae13182bd",
      "eff3ffbdd7e76baed62171b5",
      "eff3ffbdd7e76baed63182bd08519c",
      "eff3ffc6dbef9ecae16baed63182bd08519c",
      "eff3ffc6dbef9ecae16baed64292c62171b5084594",
      "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594",
      "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b"
    ).map(colors);

    ramp(scheme$l);

    var scheme$m = new Array(3).concat(
      "e5f5e0a1d99b31a354",
      "edf8e9bae4b374c476238b45",
      "edf8e9bae4b374c47631a354006d2c",
      "edf8e9c7e9c0a1d99b74c47631a354006d2c",
      "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32",
      "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32",
      "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b"
    ).map(colors);

    ramp(scheme$m);

    var scheme$n = new Array(3).concat(
      "f0f0f0bdbdbd636363",
      "f7f7f7cccccc969696525252",
      "f7f7f7cccccc969696636363252525",
      "f7f7f7d9d9d9bdbdbd969696636363252525",
      "f7f7f7d9d9d9bdbdbd969696737373525252252525",
      "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525",
      "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000"
    ).map(colors);

    ramp(scheme$n);

    var scheme$o = new Array(3).concat(
      "efedf5bcbddc756bb1",
      "f2f0f7cbc9e29e9ac86a51a3",
      "f2f0f7cbc9e29e9ac8756bb154278f",
      "f2f0f7dadaebbcbddc9e9ac8756bb154278f",
      "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486",
      "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486",
      "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d"
    ).map(colors);

    ramp(scheme$o);

    var scheme$p = new Array(3).concat(
      "fee0d2fc9272de2d26",
      "fee5d9fcae91fb6a4acb181d",
      "fee5d9fcae91fb6a4ade2d26a50f15",
      "fee5d9fcbba1fc9272fb6a4ade2d26a50f15",
      "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d",
      "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d",
      "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d"
    ).map(colors);

    ramp(scheme$p);

    var scheme$q = new Array(3).concat(
      "fee6cefdae6be6550d",
      "feeddefdbe85fd8d3cd94701",
      "feeddefdbe85fd8d3ce6550da63603",
      "feeddefdd0a2fdae6bfd8d3ce6550da63603",
      "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04",
      "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04",
      "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704"
    ).map(colors);

    ramp(scheme$q);

    cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

    var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

    var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

    var c = cubehelix();

    var c$1 = rgb(),
        pi_1_3 = Math.PI / 3,
        pi_2_3 = Math.PI * 2 / 3;

    function ramp$1(range) {
      var n = range.length;
      return function(t) {
        return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
      };
    }

    ramp$1(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

    var magma = ramp$1(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

    var inferno = ramp$1(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

    var plasma = ramp$1(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

    function constant$3(x) {
      return function constant() {
        return x;
      };
    }

    var pi$4 = Math.PI;

    function Linear(context) {
      this._context = context;
    }

    Linear.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; // proceed
          default: this._context.lineTo(x, y); break;
        }
      }
    };

    function curveLinear(context) {
      return new Linear(context);
    }

    function x(p) {
      return p[0];
    }

    function y(p) {
      return p[1];
    }

    function line() {
      var x$1 = x,
          y$1 = y,
          defined = constant$3(true),
          context = null,
          curve = curveLinear,
          output = null;

      function line(data) {
        var i,
            n = data.length,
            d,
            defined0 = false,
            buffer;

        if (context == null) output = curve(buffer = path());

        for (i = 0; i <= n; ++i) {
          if (!(i < n && defined(d = data[i], i, data)) === defined0) {
            if (defined0 = !defined0) output.lineStart();
            else output.lineEnd();
          }
          if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
        }

        if (buffer) return output = null, buffer + "" || null;
      }

      line.x = function(_) {
        return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$3(+_), line) : x$1;
      };

      line.y = function(_) {
        return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$3(+_), line) : y$1;
      };

      line.defined = function(_) {
        return arguments.length ? (defined = typeof _ === "function" ? _ : constant$3(!!_), line) : defined;
      };

      line.curve = function(_) {
        return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
      };

      line.context = function(_) {
        return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
      };

      return line;
    }

    function sign(x) {
      return x < 0 ? -1 : 1;
    }

    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
      var h0 = that._x1 - that._x0,
          h1 = x2 - that._x1,
          s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
          s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
          p = (s0 * h1 + s1 * h0) / (h0 + h1);
      return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
    }

    // Calculate a one-sided slope.
    function slope2(that, t) {
      var h = that._x1 - that._x0;
      return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }

    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function point(that, t0, t1) {
      var x0 = that._x0,
          y0 = that._y0,
          x1 = that._x1,
          y1 = that._y1,
          dx = (x1 - x0) / 3;
      that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }

    function MonotoneX(context) {
      this._context = context;
    }

    MonotoneX.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 =
        this._y0 = this._y1 =
        this._t0 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 2: this._context.lineTo(this._x1, this._y1); break;
          case 3: point(this, this._t0, slope2(this, this._t0)); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        var t1 = NaN;

        x = +x, y = +y;
        if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; point(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
          default: point(this, this._t0, t1 = slope3(this, x, y)); break;
        }

        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
        this._t0 = t1;
      }
    };

    function MonotoneY(context) {
      this._context = new ReflectContext(context);
    }

    (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
      MonotoneX.prototype.point.call(this, y, x);
    };

    function ReflectContext(context) {
      this._context = context;
    }

    ReflectContext.prototype = {
      moveTo: function(x, y) { this._context.moveTo(y, x); },
      closePath: function() { this._context.closePath(); },
      lineTo: function(x, y) { this._context.lineTo(y, x); },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
    };

    /**
     * @name AxisLeft
     * @description
     * Class to handle conversion of Left Axis labels
     */
    class AxisLeft {
      constructor() {}
      /**
       * @name convert
       * @description
       * Function to return correct y axis tick label
       * @param {string} unit
       */


      convert(unit, d) {
        switch (true) {
          case unit === 'count':
            return d;

          case unit === 'b':
            return d + ' b';

          case unit === 'kb':
            return d + ' kb';

          case unit === 'mb':
            return d + ' mb';

          case unit === 'frames':
            return d + ' frames/s';

          case unit === 'overruns':
            return d + ' overruns/s';

          case unit === 'errors':
            return d + ' errors/s';

          case unit === 'packets':
            return d + ' packets/s';

          case unit === 'collisions':
            return d + ' collisions/s';

          case unit === 'other':
            return d + ' days';

          case unit === 'milliseconds':
            return d + ' ms';

          case unit === 'seconds':
            return d + ' s';

          default:
            return d + '%';
        }
      }

    }

    /**
     * @name LineGraph
     * @description
     * @extends HTMLElement
     * Generic line graph component for reusability
     */

    class LineGraph extends HTMLElement {
      constructor() {
        super();
      }
      /**
       * @name connectedCallback
       * @description
       * Call back for when the component is attached to the DOM
       */


      connectedCallback() {
        let id = 'hedwig-' + btoa(Math.random()).substr(5, 5);
        this.innerHTML = `<svg id='${id}'></svg>`;
        var svg = document.querySelector(`#${id}`);
        var data = JSON.parse(this.dataset.graph);
        this.attachShadow({
          mode: 'open'
        });
        this.shadowRoot.appendChild(svg);
        this.renderGraph(this.parseData(data), svg);
      }
      /**
       * @name parseData
       * @param {Array} data
       * @description
       * Parses data into an array and converts dates into
       * javascript date objects which is required for d3js
       */


      parseData(data) {
        let uniqueGroups = [];
        let grouping = this.dataset.group;
        data.map(item => {
          // if grouping is specified find unique groups
          let group = item[grouping];
          const index = uniqueGroups.findIndex(i => i === group);

          if (index === -1) {
            uniqueGroups.push(group);
          }
        }); // now that we have grouping we will filter and map our datapoints

        return uniqueGroups.map(group => {
          return {
            group,
            datapoints: data.filter(d => d[grouping] === group).map(d => {
              return {
                time: new Date(d.time),
                value: +d.mean
              };
            })
          };
        });
      }
      /**
       * @name disconnectedCallback
       * @description
       * Call back for when the component is detached from the DOM
       */


      disconnectedCallback() {}
      /**
       * @name renderGraph
       * @param {Array} data
       * @param {innerHTML} el
       * @description
       * Renders the graph using d3js
       */


      renderGraph(data, el) {
        // Setup the margins and height, width
        var margin = JSON.parse(this.dataset.margin);
        var height = parseInt(this.dataset.height);
        var width = parseInt(this.dataset.width);
        var unit = this.dataset.unit; // Create X time scale

        var xScale = time().domain(extent(data[0].datapoints, d => d.time)).range([0, width - margin.bottom]); // Create Y linear scale

        var yScale = linear$1().domain([0, max(data[0].datapoints, d => d.value)]).range([height - margin.left, 0]); // Setup the svg element in the DOM

        var svg = select(el).style("width", width + margin.left + +margin.right).style("height", height + +margin.top + +margin.bottom).append('g').attr("transform", `translate(${margin.top}, ${margin.left})`); // Create the lines

        var line$1 = line().x(d => xScale(d.time)).y(d => yScale(d.value)); // add element for line and add class name

        let lines = svg.append('g').attr('class', 'lines'); // add the lines for each collection of objects to the SVG

        lines.selectAll('.line-group').data(data).enter().append('g').attr('class', 'line-group').append('path').attr('class', 'line').attr('d', d => line$1(d.datapoints)).style('stroke', this.dataset.lineColor).style('fill', 'none');
        /*
        TODO: Color schema strategy needed to ensure lines
        are the right colors
        https://github.com/d3/d3-scale/blob/master/README.md#sequential-scales
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        .style('stroke', (d, i) => color(i));
        */
        // Configure X Axis ticks and add xScale

        var xAxis = axisBottom(xScale).ticks(5); // Configure Y Axis ticks and

        var yAxis = axisLeft(yScale).ticks(5).tickFormat(d => {
          return new AxisLeft().convert(unit, d);
        }); // Add both Axis' to the SVG

        svg.append("g").attr("class", "x axis").attr("transform", `translate(0, ${height - margin.top})`).call(xAxis);
        svg.append("g").attr("class", "y axis").call(yAxis).append('text').attr("y", 15).attr("transform", "rotate(-90)").attr("fill", "#000");
      }

    }
    customElements.define('line-graph', LineGraph);

    var graphs = {
    	MAAS_cpu: {
    		metric: [
    			{
    				field: "usage_average",
    				unit: "%"
    			},
    			{
    				field: "cpu_count",
    				unit: "count"
    			},
    			{
    				field: "max_cpu_usage",
    				unit: "%"
    			},
    			{
    				field: "idle_percent_average",
    				unit: "%"
    			},
    			{
    				field: "irq_percent_average",
    				unit: "%"
    			},
    			{
    				field: "min_cpu_usage",
    				unit: "%"
    			},
    			{
    				field: "stolen_percent_average",
    				unit: "%"
    			},
    			{
    				field: "sys_percent_average",
    				unit: "%"
    			},
    			{
    				field: "user_percent_average",
    				unit: "%"
    			},
    			{
    				field: "wait_percent_average",
    				unit: "%"
    			}
    		]
    	},
    	MAAS_filesystem: {
    		metric: [
    			{
    				field: "avail",
    				unit: "kb"
    			},
    			{
    				field: "files",
    				unit: "kb"
    			},
    			{
    				field: "free",
    				unit: "kb"
    			},
    			{
    				field: "free_files",
    				unit: "count"
    			},
    			{
    				field: "used",
    				unit: "kb"
    			},
    			{
    				field: "total",
    				unit: "kb"
    			}
    		]
    	},
    	MAAS_memory: {
    		metric: [
    			{
    				field: "actual_free",
    				unit: "b"
    			},
    			{
    				field: "actual_used",
    				unit: "b"
    			},
    			{
    				field: "free",
    				unit: "b"
    			},
    			{
    				field: "ram",
    				unit: "mb"
    			},
    			{
    				field: "swap_page_in",
    				unit: "b"
    			},
    			{
    				field: "swap_page_out",
    				unit: "b"
    			},
    			{
    				field: "swap-total",
    				unit: "b"
    			},
    			{
    				field: "swap_used",
    				unit: "b"
    			},
    			{
    				field: "total",
    				unit: "b"
    			},
    			{
    				field: "used",
    				unit: "b"
    			}
    		]
    	},
    	MAAS_network: {
    		metric: [
    			{
    				field: "rx_bytes",
    				unit: "b"
    			},
    			{
    				field: "rx_dropped",
    				unit: "packets"
    			},
    			{
    				field: "rx_bytes",
    				unit: "b"
    			},
    			{
    				field: "rx_bytes",
    				unit: "b"
    			},
    			{
    				field: "rx_errors",
    				unit: "errors"
    			},
    			{
    				field: "rx_frame",
    				unit: "frames"
    			},
    			{
    				field: "rx_overruns",
    				unit: "overruns"
    			},
    			{
    				field: "rx_packets",
    				unit: "packets"
    			},
    			{
    				field: "tx_bytes",
    				unit: "b"
    			},
    			{
    				field: "tx_carrier",
    				unit: "errors"
    			},
    			{
    				field: "tx_collisions",
    				unit: "collisions"
    			},
    			{
    				field: "tx_dropped",
    				unit: "packets"
    			},
    			{
    				field: "tx_overruns",
    				unit: "overruns"
    			},
    			{
    				field: "tx_packets",
    				unit: "packets"
    			}
    		]
    	},
    	MAAS_http: {
    		metric: [
    			{
    				field: "bytes",
    				unit: "b"
    			},
    			{
    				field: "cert_bits",
    				unit: "b"
    			},
    			{
    				field: "cert_end",
    				unit: "other"
    			},
    			{
    				field: "cert_end_in",
    				unit: "other"
    			},
    			{
    				field: "cert_start",
    				unit: "other"
    			},
    			{
    				field: "code_100",
    				unit: "count"
    			},
    			{
    				field: "code_200",
    				unit: "count"
    			},
    			{
    				field: "code_300",
    				unit: "count"
    			},
    			{
    				field: "code_400",
    				unit: "count"
    			},
    			{
    				field: "code_500",
    				unit: "count"
    			},
    			{
    				field: "duration",
    				unit: "milliseconds"
    			},
    			{
    				field: "truncated",
    				unit: "b"
    			},
    			{
    				field: "tt_connect",
    				unit: "milliseconds"
    			},
    			{
    				field: "tt_firstbyte",
    				unit: "milliseconds"
    			}
    		]
    	}
    };

    /**
     * @name FindInfo
     * @description
     * Retrieve info on supported graph types
     */

    class FindInfo {
      constructor() {
        this.supported = graphs;
      }
      /**
       * @name info
       * @description
       * Function to get the info on graph type from JSON
       * @param {string} type
       * @returns {object}
       */


      info(type, field) {
        let supportedInfo;

        if (type === "" || type === undefined) {
          return;
        }

        if (field === "" || field === undefined) {
          throw new Error('Missing field attribute');
        }

        let supported = Object.keys(this.supported).find(key => key === type);
        let metrics = this.supported[supported].metric;
        supportedInfo = metrics.find(key => key.field === field);

        if (supportedInfo === undefined) {
          throw new Error("Unknown graph data-type!");
        }

        return supportedInfo;
      }

    }

    /**
     * @name GraphEngine
     * @extends HTMLElement
     * @description
     * Base graph
     */

    class GraphEngine extends HTMLElement {
      constructor() {
        super();
      }
      /**
       * @name connectedCallback
       * @description
       * Call back for when the component is attached to the DOM
       */


      connectedCallback() {
        this.defaults = {};
        var defaults = new Defaults();
        this.defaults.margin = this.dataset.margin || defaults.margin;
        this.defaults.height = (this.dataset.height || defaults.graphHeight) - this.defaults.margin.top - this.defaults.margin.bottom;
        this.defaults.width = (this.dataset.width || defaults.graphWidth) - this.defaults.margin.left - this.defaults.margin.right;
        this.defaults.lineColor = this.dataset.lineColor || defaults.lineColor;
        this.defaults.unit = this.dataset.unit;
        this.render();
      }
      /**
       * @name render
       * @description
       * Kicks off the render process after attribute value has been set & connectedcallback has run.
       * @param {string} data this param is collected from the data-graph attribute
       */


      render() {
        if (this.defaults) {
          this.innerHTML = "<line-graph data-margin=" + JSON.stringify(this.defaults.margin) + " data-height=" + this.defaults.height + " data-width=" + this.defaults.width + " data-graph=" + this.graphData + " data-unit=" + (this.graphInfo.unit || this.defaults.unit) + " data-line-color=" + this.defaults.lineColor + " data-group=" + this.dataset.group + "></lineGraph>";
        }
      }
      /**
       * @name dataPoints
       * @description Sets datapoints this.graphdata
       * @param {string} data This param is stringified JSON data setting
       */


      dataPoints(data) {
        this.graphInfo = new FindInfo().info(this.dataset.type, this.dataset.field);
        this.graphData = data;
      }
      /**
       * @name disconnectedCallback
       * @description
       * Call back for when the component is detached from the DOM
       */


      disconnectedCallback() {}
      /**
       * @name observedAttributes
       * @description Sets what attributes this component will listen for.
       * @returns {Array} an array of attribute to watch for value changes
       */


      static get observedAttributes() {
        return ['data-graph'];
      }
      /**
       * @name attributeChangedCallback
       * @description This callback is fired when attribute values change for
       * @param {string} name attribute name
       * @param {any} oldValue original value upon page load, will most of the time be blank
       * @param {any} newValue new value bound to the attribute
       */


      attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && name === "data-graph") {
          this.dataPoints(newValue);
          this.render();
        }
      }

    }
    customElements.define('hedwig-graph', GraphEngine);

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var highcharts = createCommonjsModule(function (module) {
    /*
     Highcharts JS v8.1.2 (2020-06-16)

     (c) 2009-2018 Torstein Honsi

     License: www.highcharts.com/license
    */
    (function(T,O){module.exports?(O["default"]=O,module.exports=T.document?O(T):O):(T.Highcharts&&T.Highcharts.error(16,!0),T.Highcharts=O(T));})("undefined"!==typeof window?window:commonjsGlobal,function(T){function O(g,c,R,y){g.hasOwnProperty(c)||(g[c]=y.apply(null,R));}var q={};O(q,"parts/Globals.js",[],function(){var g="undefined"!==typeof T?T:"undefined"!==typeof window?window:{},c=g.document,
    R=g.navigator&&g.navigator.userAgent||"",y=c&&c.createElementNS&&!!c.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,q=/(edge|msie|trident)/i.test(R)&&!g.opera,H=-1!==R.indexOf("Firefox"),D=-1!==R.indexOf("Chrome"),J=H&&4>parseInt(R.split("Firefox/")[1],10);return {product:"Highcharts",version:"8.1.2",deg2rad:2*Math.PI/360,doc:c,hasBidiBug:J,hasTouch:!!g.TouchEvent,isMS:q,isWebKit:-1!==R.indexOf("AppleWebKit"),isFirefox:H,isChrome:D,isSafari:!D&&-1!==R.indexOf("Safari"),isTouchDevice:/(Mobile|Android|Windows Phone)/.test(R),
    SVG_NS:"http://www.w3.org/2000/svg",chartCount:0,seriesTypes:{},symbolSizes:{},svg:y,win:g,marginNames:["plotTop","marginRight","marginBottom","plotLeft"],noop:function(){},charts:[],dateFormats:{}}});O(q,"parts/Utilities.js",[q["parts/Globals.js"]],function(g){function c(b,h,e,z){var a=h?"Highcharts error":"Highcharts warning";32===b&&(b=a+": Deprecated member");var x=I(b),f=x?a+" #"+b+": www.highcharts.com/errors/"+b+"/":b.toString();a=function(){if(h)throw Error(f);G.console&&-1===c.messages.indexOf(f)&&
    console.log(f);};if("undefined"!==typeof z){var d="";x&&(f+="?");W(z,function(b,h){d+="\n - "+h+": "+b;x&&(f+=encodeURI(h)+"="+encodeURI(b));});f+=d;}e?da(e,"displayError",{code:b,message:f,params:z},a):a();c.messages.push(f);}function R(){var b,h=arguments,e={},z=function(b,h){"object"!==typeof b&&(b={});W(h,function(e,a){!y(e,!0)||C(e)||r(e)?b[a]=h[a]:b[a]=z(b[a]||{},e);});return b};!0===h[0]&&(e=h[1],h=Array.prototype.slice.call(h,2));var a=h.length;for(b=0;b<a;b++)e=z(e,h[b]);return e}function y(b,
    h){return !!b&&"object"===typeof b&&(!h||!n(b))}function q(b,h,e){var a;K(h)?m(e)?b.setAttribute(h,e):b&&b.getAttribute&&((a=b.getAttribute(h))||"class"!==h||(a=b.getAttribute(h+"Name"))):W(h,function(h,e){b.setAttribute(e,h);});return a}function H(){for(var b=arguments,h=b.length,e=0;e<h;e++){var a=b[e];if("undefined"!==typeof a&&null!==a)return a}}function D(b,h){if(!b)return h;var e=b.split(".").reverse();if(1===e.length)return h[b];for(b=e.pop();"undefined"!==typeof b&&"undefined"!==typeof h&&null!==
    h;)h=h[b],b=e.pop();return h}g.timers=[];var J=g.charts,t=g.doc,G=g.win;(c||(c={})).messages=[];g.error=c;var L=function(){function b(b,h,e){this.options=h;this.elem=b;this.prop=e;}b.prototype.dSetter=function(){var b=this.paths,h=b&&b[0];b=b&&b[1];var e=[],a=this.now||0;if(1!==a&&h&&b)if(h.length===b.length&&1>a)for(var z=0;z<b.length;z++){for(var x=h[z],f=b[z],d=[],k=0;k<f.length;k++){var N=x[k],l=f[k];d[k]="number"===typeof N&&"number"===typeof l&&("A"!==f[0]||4!==k&&5!==k)?N+a*(l-N):l;}e.push(d);}else e=
    b;else e=this.toD||[];this.elem.attr("d",e,void 0,!0);};b.prototype.update=function(){var b=this.elem,h=this.prop,e=this.now,a=this.options.step;if(this[h+"Setter"])this[h+"Setter"]();else b.attr?b.element&&b.attr(h,e,null,!0):b.style[h]=e+this.unit;a&&a.call(b,e,this);};b.prototype.run=function(b,h,e){var a=this,z=a.options,x=function(b){return x.stopped?!1:a.step(b)},f=G.requestAnimationFrame||function(b){setTimeout(b,13);},d=function(){for(var b=0;b<g.timers.length;b++)g.timers[b]()||g.timers.splice(b--,
    1);g.timers.length&&f(d);};b!==h||this.elem["forceAnimate:"+this.prop]?(this.startTime=+new Date,this.start=b,this.end=h,this.unit=e,this.now=this.start,this.pos=0,x.elem=this.elem,x.prop=this.prop,x()&&1===g.timers.push(x)&&f(d)):(delete z.curAnim[this.prop],z.complete&&0===Object.keys(z.curAnim).length&&z.complete.call(this.elem));};b.prototype.step=function(b){var h=+new Date,e=this.options,a=this.elem,z=e.complete,x=e.duration,f=e.curAnim;if(a.attr&&!a.element)b=!1;else if(b||h>=x+this.startTime){this.now=
    this.end;this.pos=1;this.update();var d=f[this.prop]=!0;W(f,function(b){!0!==b&&(d=!1);});d&&z&&z.call(a);b=!1;}else this.pos=e.easing((h-this.startTime)/x),this.now=this.start+(this.end-this.start)*this.pos,this.update(),b=!0;return b};b.prototype.initPath=function(b,h,e){function a(b,h){for(;b.length<u;){var e=b[0],a=h[u-b.length];a&&"M"===e[0]&&(b[0]="C"===a[0]?["C",e[1],e[2],e[1],e[2],e[1],e[2]]:["L",e[1],e[2]]);b.unshift(e);d&&b.push(b[b.length-1]);}}function z(b,h){for(;b.length<u;)if(h=b[b.length/
    k-1].slice(),"C"===h[0]&&(h[1]=h[5],h[2]=h[6]),d){var e=b[b.length/k].slice();b.splice(b.length/2,0,h,e);}else b.push(h);}var x=b.startX,f=b.endX;h=h&&h.slice();e=e.slice();var d=b.isArea,k=d?2:1;if(!h)return [e,e];if(x&&f){for(b=0;b<x.length;b++)if(x[b]===f[0]){var N=b;break}else if(x[0]===f[f.length-x.length+b]){N=b;var l=!0;break}else if(x[x.length-1]===f[f.length-x.length+b]){N=x.length-b;break}"undefined"===typeof N&&(h=[]);}if(h.length&&I(N)){var u=e.length+N*k;l?(a(h,e),z(e,h)):(a(e,h),z(h,e));}return [h,
    e]};b.prototype.fillSetter=function(){b.prototype.strokeSetter.apply(this,arguments);};b.prototype.strokeSetter=function(){this.elem.attr(this.prop,g.color(this.start).tweenTo(g.color(this.end),this.pos),null,!0);};return b}();g.Fx=L;g.merge=R;var v=g.pInt=function(b,h){return parseInt(b,h||10)},K=g.isString=function(b){return "string"===typeof b},n=g.isArray=function(b){b=Object.prototype.toString.call(b);return "[object Array]"===b||"[object Array Iterator]"===b};g.isObject=y;var r=g.isDOMElement=function(b){return y(b)&&
    "number"===typeof b.nodeType},C=g.isClass=function(b){var h=b&&b.constructor;return !(!y(b,!0)||r(b)||!h||!h.name||"Object"===h.name)},I=g.isNumber=function(b){return "number"===typeof b&&!isNaN(b)&&Infinity>b&&-Infinity<b},p=g.erase=function(b,h){for(var e=b.length;e--;)if(b[e]===h){b.splice(e,1);break}},m=g.defined=function(b){return "undefined"!==typeof b&&null!==b};g.attr=q;var d=g.splat=function(b){return n(b)?b:[b]},l=g.syncTimeout=function(b,h,e){if(0<h)return setTimeout(b,h,e);b.call(0,e);return -1},
    k=g.clearTimeout=function(b){m(b)&&clearTimeout(b);},f=g.extend=function(b,h){var e;b||(b={});for(e in h)b[e]=h[e];return b};g.pick=H;var a=g.css=function(b,h){g.isMS&&!g.svg&&h&&"undefined"!==typeof h.opacity&&(h.filter="alpha(opacity="+100*h.opacity+")");f(b.style,h);},A=g.createElement=function(b,h,e,z,x){b=t.createElement(b);h&&f(b,h);x&&a(b,{padding:"0",border:"none",margin:"0"});e&&a(b,e);z&&z.appendChild(b);return b},u=g.extendClass=function(b,h){var e=function(){};e.prototype=new b;f(e.prototype,
    h);return e},E=g.pad=function(b,h,e){return Array((h||2)+1-String(b).replace("-","").length).join(e||"0")+b},P=g.relativeLength=function(b,h,e){return /%$/.test(b)?h*parseFloat(b)/100+(e||0):parseFloat(b)},w=g.wrap=function(b,h,e){var a=b[h];b[h]=function(){var b=Array.prototype.slice.call(arguments),h=arguments,z=this;z.proceed=function(){a.apply(z,arguments.length?arguments:h);};b.unshift(a);b=e.apply(this,b);z.proceed=null;return b};},M=g.format=function(b,h,e){var a="{",z=!1,x=[],f=/f$/,d=/\.([0-9])/,
    k=g.defaultOptions.lang,N=e&&e.time||g.time;for(e=e&&e.numberFormatter||Y;b;){var l=b.indexOf(a);if(-1===l)break;var u=b.slice(0,l);if(z){u=u.split(":");a=D(u.shift()||"",h);if(u.length&&"number"===typeof a)if(u=u.join(":"),f.test(u)){var m=parseInt((u.match(d)||["","-1"])[1],10);null!==a&&(a=e(a,m,k.decimalPoint,-1<u.indexOf(",")?k.thousandsSep:""));}else a=N.dateFormat(u,a);x.push(a);}else x.push(u);b=b.slice(l+1);a=(z=!z)?"}":"{";}x.push(b);return x.join("")},F=g.getMagnitude=function(b){return Math.pow(10,
    Math.floor(Math.log(b)/Math.LN10))},Q=g.normalizeTickInterval=function(b,h,e,a,z){var x=b;e=H(e,1);var f=b/e;h||(h=z?[1,1.2,1.5,2,2.5,3,4,5,6,8,10]:[1,2,2.5,5,10],!1===a&&(1===e?h=h.filter(function(b){return 0===b%1}):.1>=e&&(h=[1/e])));for(a=0;a<h.length&&!(x=h[a],z&&x*e>=b||!z&&f<=(h[a]+(h[a+1]||h[a]))/2);a++);return x=N(x*e,-Math.round(Math.log(.001)/Math.LN10))},e=g.stableSort=function(b,h){var e=b.length,a,z;for(z=0;z<e;z++)b[z].safeI=z;b.sort(function(b,e){a=h(b,e);return 0===a?b.safeI-e.safeI:
    a});for(z=0;z<e;z++)delete b[z].safeI;},b=g.arrayMin=function(b){for(var h=b.length,e=b[0];h--;)b[h]<e&&(e=b[h]);return e},h=g.arrayMax=function(b){for(var h=b.length,e=b[0];h--;)b[h]>e&&(e=b[h]);return e},z=g.destroyObjectProperties=function(b,h){W(b,function(e,a){e&&e!==h&&e.destroy&&e.destroy();delete b[a];});},x=g.discardElement=function(b){var h=g.garbageBin;h||(h=A("div"));b&&h.appendChild(b);h.innerHTML="";},N=g.correctFloat=function(b,h){return parseFloat(b.toPrecision(h||14))},aa=g.setAnimation=
    function(b,h){h.renderer.globalAnimation=H(b,h.options.chart.animation,!0);},Z=g.animObject=function(b){return y(b)?R(b):{duration:b?500:0}},V=g.timeUnits={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5,month:24192E5,year:314496E5},Y=g.numberFormat=function(b,h,e,a){b=+b||0;h=+h;var z=g.defaultOptions.lang,x=(b.toString().split(".")[1]||"").split("e")[0].length,f=b.toString().split("e");if(-1===h)h=Math.min(x,20);else if(!I(h))h=2;else if(h&&f[1]&&0>f[1]){var d=h+ +f[1];0<=d?(f[0]=
    (+f[0]).toExponential(d).split("e")[0],h=d):(f[0]=f[0].split(".")[0]||0,b=20>h?(f[0]*Math.pow(10,f[1])).toFixed(h):0,f[1]=0);}var k=(Math.abs(f[1]?f[0]:b)+Math.pow(10,-Math.max(h,x)-1)).toFixed(h);x=String(v(k));d=3<x.length?x.length%3:0;e=H(e,z.decimalPoint);a=H(a,z.thousandsSep);b=(0>b?"-":"")+(d?x.substr(0,d)+a:"");b+=x.substr(d).replace(/(\d{3})(?=\d)/g,"$1"+a);h&&(b+=e+k.slice(-h));f[1]&&0!==+b&&(b+="e"+f[1]);return b};Math.easeInOutSine=function(b){return -.5*(Math.cos(Math.PI*b)-1)};var ba=g.getStyle=
    function(b,h,e){if("width"===h)return h=Math.min(b.offsetWidth,b.scrollWidth),e=b.getBoundingClientRect&&b.getBoundingClientRect().width,e<h&&e>=h-1&&(h=Math.floor(e)),Math.max(0,h-g.getStyle(b,"padding-left")-g.getStyle(b,"padding-right"));if("height"===h)return Math.max(0,Math.min(b.offsetHeight,b.scrollHeight)-g.getStyle(b,"padding-top")-g.getStyle(b,"padding-bottom"));G.getComputedStyle||c(27,!0);if(b=G.getComputedStyle(b,void 0))b=b.getPropertyValue(h),H(e,"opacity"!==h)&&(b=v(b));return b},
    U=g.inArray=function(b,h,e){c(32,!1,void 0,{"Highcharts.inArray":"use Array.indexOf"});return h.indexOf(b,e)},X=g.find=Array.prototype.find?function(b,h){return b.find(h)}:function(b,h){var e,a=b.length;for(e=0;e<a;e++)if(h(b[e],e))return b[e]};g.keys=function(b){c(32,!1,void 0,{"Highcharts.keys":"use Object.keys"});return Object.keys(b)};var ia=g.offset=function(b){var h=t.documentElement;b=b.parentElement||b.parentNode?b.getBoundingClientRect():{top:0,left:0};return {top:b.top+(G.pageYOffset||h.scrollTop)-
    (h.clientTop||0),left:b.left+(G.pageXOffset||h.scrollLeft)-(h.clientLeft||0)}},S=g.stop=function(b,h){for(var e=g.timers.length;e--;)g.timers[e].elem!==b||h&&h!==g.timers[e].prop||(g.timers[e].stopped=!0);},W=g.objectEach=function(b,h,e){for(var a in b)Object.hasOwnProperty.call(b,a)&&h.call(e||b[a],b[a],a,b);};W({map:"map",each:"forEach",grep:"filter",reduce:"reduce",some:"some"},function(b,h){g[h]=function(e){var a;c(32,!1,void 0,(a={},a["Highcharts."+h]="use Array."+b,a));return Array.prototype[b].apply(e,
    [].slice.call(arguments,1))};});var ja=g.addEvent=function(b,h,e,a){void 0===a&&(a={});var z=b.addEventListener||g.addEventListenerPolyfill;var x="function"===typeof b&&b.prototype?b.prototype.protoEvents=b.prototype.protoEvents||{}:b.hcEvents=b.hcEvents||{};g.Point&&b instanceof g.Point&&b.series&&b.series.chart&&(b.series.chart.runTrackerClick=!0);z&&z.call(b,h,e,!1);x[h]||(x[h]=[]);x[h].push({fn:e,order:"number"===typeof a.order?a.order:Infinity});x[h].sort(function(b,h){return b.order-h.order});
    return function(){ea(b,h,e);}},ea=g.removeEvent=function(b,h,e){function a(h,e){var a=b.removeEventListener||g.removeEventListenerPolyfill;a&&a.call(b,h,e,!1);}function z(e){var z;if(b.nodeName){if(h){var x={};x[h]=!0;}else x=e;W(x,function(b,h){if(e[h])for(z=e[h].length;z--;)a(h,e[h][z].fn);});}}var x;["protoEvents","hcEvents"].forEach(function(f,d){var k=(d=d?b:b.prototype)&&d[f];k&&(h?(x=k[h]||[],e?(k[h]=x.filter(function(b){return e!==b.fn}),a(h,e)):(z(k),k[h]=[])):(z(k),d[f]={}));});},da=g.fireEvent=
    function(b,h,e,a){var z;e=e||{};if(t.createEvent&&(b.dispatchEvent||b.fireEvent)){var x=t.createEvent("Events");x.initEvent(h,!0,!0);f(x,e);b.dispatchEvent?b.dispatchEvent(x):b.fireEvent(h,x);}else e.target||f(e,{preventDefault:function(){e.defaultPrevented=!0;},target:b,type:h}),function(h,a){void 0===h&&(h=[]);void 0===a&&(a=[]);var x=0,f=0,d=h.length+a.length;for(z=0;z<d;z++)!1===(h[x]?a[f]?h[x].order<=a[f].order?h[x++]:a[f++]:h[x++]:a[f++]).fn.call(b,e)&&e.preventDefault();}(b.protoEvents&&b.protoEvents[h],
    b.hcEvents&&b.hcEvents[h]);a&&!e.defaultPrevented&&a.call(b,e);},ka=g.animate=function(b,h,e){var a,z="",x,f;if(!y(e)){var d=arguments;e={duration:d[2],easing:d[3],complete:d[4]};}I(e.duration)||(e.duration=400);e.easing="function"===typeof e.easing?e.easing:Math[e.easing]||Math.easeInOutSine;e.curAnim=R(h);W(h,function(d,k){S(b,k);f=new L(b,e,k);x=null;"d"===k&&n(h.d)?(f.paths=f.initPath(b,b.pathArray,h.d),f.toD=h.d,a=0,x=1):b.attr?a=b.attr(k):(a=parseFloat(ba(b,k))||0,"opacity"!==k&&(z="px"));x||
    (x=d);x&&x.match&&x.match("px")&&(x=x.replace(/px/g,""));f.run(a,x,z);});},la=g.seriesType=function(b,h,e,a,x){var z=fa(),f=g.seriesTypes;z.plotOptions[b]=R(z.plotOptions[h],e);f[b]=u(f[h]||function(){},a);f[b].prototype.type=b;x&&(f[b].prototype.pointClass=u(g.Point,x));return f[b]},ca,ha=g.uniqueKey=function(){var b=Math.random().toString(36).substring(2,9)+"-",h=0;return function(){return "highcharts-"+(ca?"":b)+h++}}(),ma=g.useSerialIds=function(b){return ca=H(b,ca)},O=g.isFunction=function(b){return "function"===
    typeof b},fa=g.getOptions=function(){return g.defaultOptions},na=g.setOptions=function(b){g.defaultOptions=R(!0,g.defaultOptions,b);(b.time||b.global)&&g.time.update(R(g.defaultOptions.global,g.defaultOptions.time,b.global,b.time));return g.defaultOptions};G.jQuery&&(G.jQuery.fn.highcharts=function(){var b=[].slice.call(arguments);if(this[0])return b[0]?(new (g[K(b[0])?b.shift():"Chart"])(this[0],b[0],b[1]),this):J[q(this[0],"data-highcharts-chart")]});return {Fx:g.Fx,addEvent:ja,animate:ka,animObject:Z,
    arrayMax:h,arrayMin:b,attr:q,clamp:function(b,h,e){return b>h?b<e?b:e:h},clearTimeout:k,correctFloat:N,createElement:A,css:a,defined:m,destroyObjectProperties:z,discardElement:x,erase:p,error:c,extend:f,extendClass:u,find:X,fireEvent:da,format:M,getMagnitude:F,getNestedProperty:D,getOptions:fa,getStyle:ba,inArray:U,isArray:n,isClass:C,isDOMElement:r,isFunction:O,isNumber:I,isObject:y,isString:K,merge:R,normalizeTickInterval:Q,numberFormat:Y,objectEach:W,offset:ia,pad:E,pick:H,pInt:v,relativeLength:P,
    removeEvent:ea,seriesType:la,setAnimation:aa,setOptions:na,splat:d,stableSort:e,stop:S,syncTimeout:l,timeUnits:V,uniqueKey:ha,useSerialIds:ma,wrap:w}});O(q,"parts/Color.js",[q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var R=c.isNumber,y=c.merge,q=c.pInt;c=function(){function c(g){this.parsers=[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(c){return [q(c[1]),q(c[2]),q(c[3]),parseFloat(c[4],10)]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
    parse:function(c){return [q(c[1]),q(c[2]),q(c[3]),1]}}];this.rgba=[];if(!(this instanceof c))return new c(g);this.init(g);}c.parse=function(g){return new c(g)};c.prototype.init=function(g){var J,t;if((this.input=g=c.names[g&&g.toLowerCase?g.toLowerCase():""]||g)&&g.stops)this.stops=g.stops.map(function(v){return new c(v[1])});else{if(g&&g.charAt&&"#"===g.charAt()){var G=g.length;g=parseInt(g.substr(1),16);7===G?J=[(g&16711680)>>16,(g&65280)>>8,g&255,1]:4===G&&(J=[(g&3840)>>4|(g&3840)>>8,(g&240)>>4|
    g&240,(g&15)<<4|g&15,1]);}if(!J)for(t=this.parsers.length;t--&&!J;){var L=this.parsers[t];(G=L.regex.exec(g))&&(J=L.parse(G));}}this.rgba=J||[];};c.prototype.get=function(c){var g=this.input,t=this.rgba;if("undefined"!==typeof this.stops){var G=y(g);G.stops=[].concat(G.stops);this.stops.forEach(function(g,v){G.stops[v]=[G.stops[v][0],g.get(c)];});}else G=t&&R(t[0])?"rgb"===c||!c&&1===t[3]?"rgb("+t[0]+","+t[1]+","+t[2]+")":"a"===c?t[3]:"rgba("+t.join(",")+")":g;return G};c.prototype.brighten=function(c){var g,
    t=this.rgba;if(this.stops)this.stops.forEach(function(g){g.brighten(c);});else if(R(c)&&0!==c)for(g=0;3>g;g++)t[g]+=q(255*c),0>t[g]&&(t[g]=0),255<t[g]&&(t[g]=255);return this};c.prototype.setOpacity=function(c){this.rgba[3]=c;return this};c.prototype.tweenTo=function(c,g){var t=this.rgba,G=c.rgba;G.length&&t&&t.length?(c=1!==G[3]||1!==t[3],g=(c?"rgba(":"rgb(")+Math.round(G[0]+(t[0]-G[0])*(1-g))+","+Math.round(G[1]+(t[1]-G[1])*(1-g))+","+Math.round(G[2]+(t[2]-G[2])*(1-g))+(c?","+(G[3]+(t[3]-G[3])*(1-
    g)):"")+")"):g=c.input||"none";return g};c.names={white:"#ffffff",black:"#000000"};return c}();g.Color=c;g.color=c.parse;return g.Color});O(q,"parts/SVGElement.js",[q["parts/Color.js"],q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c,q){var y=c.deg2rad,B=c.doc,H=c.hasTouch,D=c.isFirefox,J=c.noop,t=c.svg,G=c.SVG_NS,L=c.win,v=q.animate,K=q.animObject,n=q.attr,r=q.createElement,C=q.css,I=q.defined,p=q.erase,m=q.extend,d=q.fireEvent,l=q.isArray,k=q.isFunction,f=q.isNumber,a=q.isString,A=q.merge,
    u=q.objectEach,E=q.pick,P=q.pInt,w=q.stop,M=q.uniqueKey;q=function(){function F(){this.height=this.element=void 0;this.opacity=1;this.renderer=void 0;this.SVG_NS=G;this.symbolCustomAttribs="x y width height r start end innerR anchorX anchorY rounded".split(" ");this.width=void 0;}F.prototype._defaultGetter=function(a){a=E(this[a+"Value"],this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a};F.prototype._defaultSetter=function(a,e,b){b.setAttribute(e,
    a);};F.prototype.add=function(a){var e=this.renderer,b=this.element;a&&(this.parentGroup=a);this.parentInverted=a&&a.inverted;"undefined"!==typeof this.textStr&&"text"===this.element.nodeName&&e.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)var h=this.zIndexSetter();h||(a?a.element:e.box).appendChild(b);if(this.onAdd)this.onAdd();return this};F.prototype.addClass=function(a,e){var b=e?"":this.attr("class")||"";a=(a||"").split(/ /g).reduce(function(h,e){-1===b.indexOf(e)&&h.push(e);return h},
    b?[b]:[]).join(" ");a!==b&&this.attr("class",a);return this};F.prototype.afterSetters=function(){this.doTransform&&(this.updateTransform(),this.doTransform=!1);};F.prototype.align=function(f,e,b){var h,z={};var x=this.renderer;var d=x.alignedObjects;var k,l;if(f){if(this.alignOptions=f,this.alignByTranslate=e,!b||a(b))this.alignTo=h=b||"renderer",p(d,this),d.push(this),b=void 0;}else f=this.alignOptions,e=this.alignByTranslate,h=this.alignTo;b=E(b,x[h],x);h=f.align;x=f.verticalAlign;d=(b.x||0)+(f.x||
    0);var u=(b.y||0)+(f.y||0);"right"===h?k=1:"center"===h&&(k=2);k&&(d+=(b.width-(f.width||0))/k);z[e?"translateX":"x"]=Math.round(d);"bottom"===x?l=1:"middle"===x&&(l=2);l&&(u+=(b.height-(f.height||0))/l);z[e?"translateY":"y"]=Math.round(u);this[this.placed?"animate":"attr"](z);this.placed=!0;this.alignAttr=z;return this};F.prototype.alignSetter=function(a){var e={left:"start",center:"middle",right:"end"};e[a]&&(this.alignValue=a,this.element.setAttribute("text-anchor",e[a]));};F.prototype.animate=
    function(a,e,b){var h=K(E(e,this.renderer.globalAnimation,!0));E(B.hidden,B.msHidden,B.webkitHidden,!1)&&(h.duration=0);0!==h.duration?(b&&(h.complete=b),v(this,a,h)):(this.attr(a,void 0,b),u(a,function(b,e){h.step&&h.step.call(this,b,{prop:e,pos:1});},this));return this};F.prototype.applyTextOutline=function(a){var e=this.element,b;-1!==a.indexOf("contrast")&&(a=a.replace(/contrast/g,this.renderer.getContrast(e.style.fill)));a=a.split(" ");var h=a[a.length-1];if((b=a[0])&&"none"!==b&&c.svg){this.fakeTS=
    !0;a=[].slice.call(e.getElementsByTagName("tspan"));this.ySetter=this.xSetter;b=b.replace(/(^[\d\.]+)(.*?)$/g,function(b,h,e){return 2*h+e});this.removeTextOutline(a);var z=e.textContent?/^[\u0591-\u065F\u066A-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(e.textContent):!1;var x=e.firstChild;a.forEach(function(a,f){0===f&&(a.setAttribute("x",e.getAttribute("x")),f=e.getAttribute("y"),a.setAttribute("y",f||0),null===f&&e.setAttribute("y",0));f=a.cloneNode(!0);n(z&&!D?a:f,{"class":"highcharts-text-outline",
    fill:h,stroke:h,"stroke-width":b,"stroke-linejoin":"round"});e.insertBefore(f,x);});z&&D&&a[0]&&(a=a[0].cloneNode(!0),a.textContent=" ",e.insertBefore(a,x));}};F.prototype.attr=function(a,e,b,h){var z=this.element,x,f=this,d,k,l=this.symbolCustomAttribs;if("string"===typeof a&&"undefined"!==typeof e){var m=a;a={};a[m]=e;}"string"===typeof a?f=(this[a+"Getter"]||this._defaultGetter).call(this,a,z):(u(a,function(b,e){d=!1;h||w(this,e);this.symbolName&&-1!==l.indexOf(e)&&(x||(this.symbolAttr(a),x=!0),d=
    !0);!this.rotation||"x"!==e&&"y"!==e||(this.doTransform=!0);d||(k=this[e+"Setter"]||this._defaultSetter,k.call(this,b,e,z),!this.styledMode&&this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(e)&&this.updateShadows(e,b,k));},this),this.afterSetters());b&&b.call(this);return f};F.prototype.clip=function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":"none")};F.prototype.crisp=function(a,e){e=e||a.strokeWidth||0;var b=Math.round(e)%2/2;a.x=Math.floor(a.x||
    this.x||0)+b;a.y=Math.floor(a.y||this.y||0)+b;a.width=Math.floor((a.width||this.width||0)-2*b);a.height=Math.floor((a.height||this.height||0)-2*b);I(a.strokeWidth)&&(a.strokeWidth=e);return a};F.prototype.complexColor=function(a,e,b){var h=this.renderer,z,x,f,k,m,p,w,C,Q,r,E=[],S;d(this.renderer,"complexColor",{args:arguments},function(){a.radialGradient?x="radialGradient":a.linearGradient&&(x="linearGradient");if(x){f=a[x];m=h.gradients;p=a.stops;Q=b.radialReference;l(f)&&(a[x]=f={x1:f[0],y1:f[1],
    x2:f[2],y2:f[3],gradientUnits:"userSpaceOnUse"});"radialGradient"===x&&Q&&!I(f.gradientUnits)&&(k=f,f=A(f,h.getRadialAttr(Q,k),{gradientUnits:"userSpaceOnUse"}));u(f,function(b,h){"id"!==h&&E.push(h,b);});u(p,function(b){E.push(b);});E=E.join(",");if(m[E])r=m[E].attr("id");else{f.id=r=M();var d=m[E]=h.createElement(x).attr(f).add(h.defs);d.radAttr=k;d.stops=[];p.forEach(function(b){0===b[1].indexOf("rgba")?(z=g.parse(b[1]),w=z.get("rgb"),C=z.get("a")):(w=b[1],C=1);b=h.createElement("stop").attr({offset:b[0],
    "stop-color":w,"stop-opacity":C}).add(d);d.stops.push(b);});}S="url("+h.url+"#"+r+")";b.setAttribute(e,S);b.gradient=E;a.toString=function(){return S};}});};F.prototype.css=function(a){var e=this.styles,b={},h=this.element,z="",x=!e,f=["textOutline","textOverflow","width"];a&&a.color&&(a.fill=a.color);e&&u(a,function(h,a){e&&e[a]!==h&&(b[a]=h,x=!0);});if(x){e&&(a=m(e,b));if(a)if(null===a.width||"auto"===a.width)delete this.textWidth;else if("text"===h.nodeName.toLowerCase()&&a.width)var d=this.textWidth=
    P(a.width);this.styles=a;d&&!t&&this.renderer.forExport&&delete a.width;if(h.namespaceURI===this.SVG_NS){var k=function(b,h){return "-"+h.toLowerCase()};u(a,function(b,h){-1===f.indexOf(h)&&(z+=h.replace(/([A-Z])/g,k)+":"+b+";");});z&&n(h,"style",z);}else C(h,a);this.added&&("text"===this.element.nodeName&&this.renderer.buildText(this),a&&a.textOutline&&this.applyTextOutline(a.textOutline));}return this};F.prototype.dashstyleSetter=function(a){var e=this["stroke-width"];"inherit"===e&&(e=1);if(a=a&&a.toLowerCase()){var b=
    a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(a=b.length;a--;)b[a]=""+P(b[a])*E(e,NaN);a=b.join(",").replace(/NaN/g,"none");this.element.setAttribute("stroke-dasharray",a);}};F.prototype.destroy=function(){var a=this,e=a.element||{},b=a.renderer,h=b.isSVG&&"SPAN"===e.nodeName&&a.parentGroup||void 0,z=e.ownerSVGElement;
    e.onclick=e.onmouseout=e.onmouseover=e.onmousemove=e.point=null;w(a);if(a.clipPath&&z){var x=a.clipPath;[].forEach.call(z.querySelectorAll("[clip-path],[CLIP-PATH]"),function(b){-1<b.getAttribute("clip-path").indexOf(x.element.id)&&b.removeAttribute("clip-path");});a.clipPath=x.destroy();}if(a.stops){for(z=0;z<a.stops.length;z++)a.stops[z].destroy();a.stops.length=0;a.stops=void 0;}a.safeRemoveChild(e);for(b.styledMode||a.destroyShadows();h&&h.div&&0===h.div.childNodes.length;)e=h.parentGroup,a.safeRemoveChild(h.div),
    delete h.div,h=e;a.alignTo&&p(b.alignedObjects,a);u(a,function(b,h){a[h]&&a[h].parentGroup===a&&a[h].destroy&&a[h].destroy();delete a[h];});};F.prototype.destroyShadows=function(){(this.shadows||[]).forEach(function(a){this.safeRemoveChild(a);},this);this.shadows=void 0;};F.prototype.destroyTextPath=function(a,e){var b=a.getElementsByTagName("text")[0];if(b){if(b.removeAttribute("dx"),b.removeAttribute("dy"),e.element.setAttribute("id",""),this.textPathWrapper&&b.getElementsByTagName("textPath").length){for(a=
    this.textPathWrapper.element.childNodes;a.length;)b.appendChild(a[0]);b.removeChild(this.textPathWrapper.element);}}else if(a.getAttribute("dx")||a.getAttribute("dy"))a.removeAttribute("dx"),a.removeAttribute("dy");this.textPathWrapper&&(this.textPathWrapper=this.textPathWrapper.destroy());};F.prototype.dSetter=function(a,e,b){l(a)&&("string"===typeof a[0]&&(a=this.renderer.pathToSegments(a)),this.pathArray=a,a=a.reduce(function(b,a,e){return a&&a.join?(e?b+" ":"")+a.join(" "):(a||"").toString()},""));
    /(NaN| {2}|^$)/.test(a)&&(a="M 0 0");this[e]!==a&&(b.setAttribute(e,a),this[e]=a);};F.prototype.fadeOut=function(a){var e=this;e.animate({opacity:0},{duration:E(a,150),complete:function(){e.attr({y:-9999}).hide();}});};F.prototype.fillSetter=function(a,e,b){"string"===typeof a?b.setAttribute(e,a):a&&this.complexColor(a,e,b);};F.prototype.getBBox=function(a,e){var b,h=this.renderer,z=this.element,x=this.styles,f=this.textStr,d=h.cache,l=h.cacheKeys,u=z.namespaceURI===this.SVG_NS;e=E(e,this.rotation,0);
    var A=h.styledMode?z&&F.prototype.getStyle.call(z,"font-size"):x&&x.fontSize;if(I(f)){var p=f.toString();-1===p.indexOf("<")&&(p=p.replace(/[0-9]/g,"0"));p+=["",e,A,this.textWidth,x&&x.textOverflow,x&&x.fontWeight].join();}p&&!a&&(b=d[p]);if(!b){if(u||h.forExport){try{var w=this.fakeTS&&function(b){[].forEach.call(z.querySelectorAll(".highcharts-text-outline"),function(h){h.style.display=b;});};k(w)&&w("none");b=z.getBBox?m({},z.getBBox()):{width:z.offsetWidth,height:z.offsetHeight};k(w)&&w("");}catch(X){}if(!b||
    0>b.width)b={width:0,height:0};}else b=this.htmlGetBBox();h.isSVG&&(a=b.width,h=b.height,u&&(b.height=h={"11px,17":14,"13px,20":16}[x&&x.fontSize+","+Math.round(h)]||h),e&&(x=e*y,b.width=Math.abs(h*Math.sin(x))+Math.abs(a*Math.cos(x)),b.height=Math.abs(h*Math.cos(x))+Math.abs(a*Math.sin(x))));if(p&&0<b.height){for(;250<l.length;)delete d[l.shift()];d[p]||l.push(p);d[p]=b;}}return b};F.prototype.getStyle=function(a){return L.getComputedStyle(this.element||this,"").getPropertyValue(a)};F.prototype.hasClass=
    function(a){return -1!==(""+this.attr("class")).split(" ").indexOf(a)};F.prototype.hide=function(a){a?this.attr({y:-9999}):this.attr({visibility:"hidden"});return this};F.prototype.htmlGetBBox=function(){return {height:0,width:0,x:0,y:0}};F.prototype.init=function(a,e){this.element="span"===e?r(e):B.createElementNS(this.SVG_NS,e);this.renderer=a;d(this,"afterInit");};F.prototype.invert=function(a){this.inverted=a;this.updateTransform();return this};F.prototype.on=function(a,e){var b,h,z=this.element,
    x;H&&"click"===a?(z.ontouchstart=function(a){b=a.touches[0].clientX;h=a.touches[0].clientY;},z.ontouchend=function(a){b&&4<=Math.sqrt(Math.pow(b-a.changedTouches[0].clientX,2)+Math.pow(h-a.changedTouches[0].clientY,2))||e.call(z,a);x=!0;a.preventDefault();},z.onclick=function(b){x||e.call(z,b);}):z["on"+a]=e;return this};F.prototype.opacitySetter=function(a,e,b){this[e]=a;b.setAttribute(e,a);};F.prototype.removeClass=function(f){return this.attr("class",(""+this.attr("class")).replace(a(f)?new RegExp("(^| )"+
    f+"( |$)"):f," ").replace(/ +/g," ").trim())};F.prototype.removeTextOutline=function(a){for(var e=a.length,b;e--;)b=a[e],"highcharts-text-outline"===b.getAttribute("class")&&p(a,this.element.removeChild(b));};F.prototype.safeRemoveChild=function(a){var e=a.parentNode;e&&e.removeChild(a);};F.prototype.setRadialReference=function(a){var e=this.element.gradient&&this.renderer.gradients[this.element.gradient];this.element.radialReference=a;e&&e.radAttr&&e.animate(this.renderer.getRadialAttr(a,e.radAttr));
    return this};F.prototype.setTextPath=function(a,e){var b=this.element,h={textAnchor:"text-anchor"},z=!1,x=this.textPathWrapper,d=!x;e=A(!0,{enabled:!0,attributes:{dy:-5,startOffset:"50%",textAnchor:"middle"}},e);var k=e.attributes;if(a&&e&&e.enabled){x&&null===x.element.parentNode?(d=!0,x=x.destroy()):x&&this.removeTextOutline.call(x.parentGroup,[].slice.call(b.getElementsByTagName("tspan")));this.options&&this.options.padding&&(k.dx=-this.options.padding);x||(this.textPathWrapper=x=this.renderer.createElement("textPath"),
    z=!0);var l=x.element;(e=a.element.getAttribute("id"))||a.element.setAttribute("id",e=M());if(d)for(a=b.getElementsByTagName("tspan");a.length;)a[0].setAttribute("y",0),f(k.dx)&&a[0].setAttribute("x",-k.dx),l.appendChild(a[0]);z&&x&&x.add({element:this.text?this.text.element:b});l.setAttributeNS("http://www.w3.org/1999/xlink","href",this.renderer.url+"#"+e);I(k.dy)&&(l.parentNode.setAttribute("dy",k.dy),delete k.dy);I(k.dx)&&(l.parentNode.setAttribute("dx",k.dx),delete k.dx);u(k,function(b,a){l.setAttribute(h[a]||
    a,b);});b.removeAttribute("transform");this.removeTextOutline.call(x,[].slice.call(b.getElementsByTagName("tspan")));this.text&&!this.renderer.styledMode&&this.attr({fill:"none","stroke-width":0});this.applyTextOutline=this.updateTransform=J;}else x&&(delete this.updateTransform,delete this.applyTextOutline,this.destroyTextPath(b,a),this.updateTransform(),this.options&&this.options.rotation&&this.applyTextOutline(this.options.style.textOutline));return this};F.prototype.shadow=function(a,e,b){var h=
    [],z=this.element,x=!1,f=this.oldShadowOptions;var d={color:"#000000",offsetX:1,offsetY:1,opacity:.15,width:3};var k;!0===a?k=d:"object"===typeof a&&(k=m(d,a));k&&(k&&f&&u(k,function(b,h){b!==f[h]&&(x=!0);}),x&&this.destroyShadows(),this.oldShadowOptions=k);if(!k)this.destroyShadows();else if(!this.shadows){var l=k.opacity/k.width;var A=this.parentInverted?"translate(-1,-1)":"translate("+k.offsetX+", "+k.offsetY+")";for(d=1;d<=k.width;d++){var p=z.cloneNode(!1);var w=2*k.width+1-2*d;n(p,{stroke:a.color||
    "#000000","stroke-opacity":l*d,"stroke-width":w,transform:A,fill:"none"});p.setAttribute("class",(p.getAttribute("class")||"")+" highcharts-shadow");b&&(n(p,"height",Math.max(n(p,"height")-w,0)),p.cutHeight=w);e?e.element.appendChild(p):z.parentNode&&z.parentNode.insertBefore(p,z);h.push(p);}this.shadows=h;}return this};F.prototype.show=function(a){return this.attr({visibility:a?"inherit":"visible"})};F.prototype.strokeSetter=function(a,e,b){this[e]=a;this.stroke&&this["stroke-width"]?(F.prototype.fillSetter.call(this,
    this.stroke,"stroke",b),b.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0):"stroke-width"===e&&0===a&&this.hasStroke?(b.removeAttribute("stroke"),this.hasStroke=!1):this.renderer.styledMode&&this["stroke-width"]&&(b.setAttribute("stroke-width",this["stroke-width"]),this.hasStroke=!0);};F.prototype.strokeWidth=function(){if(!this.renderer.styledMode)return this["stroke-width"]||0;var a=this.getStyle("stroke-width"),e=0;if(a.indexOf("px")===a.length-2)e=P(a);else if(""!==a){var b=
    B.createElementNS(G,"rect");n(b,{width:a,"stroke-width":0});this.element.parentNode.appendChild(b);e=b.getBBox().width;b.parentNode.removeChild(b);}return e};F.prototype.symbolAttr=function(a){var e=this;"x y r start end width height innerR anchorX anchorY clockwise".split(" ").forEach(function(b){e[b]=E(a[b],e[b]);});e.attr({d:e.renderer.symbols[e.symbolName](e.x,e.y,e.width,e.height,e)});};F.prototype.textSetter=function(a){a!==this.textStr&&(delete this.textPxLength,this.textStr=a,this.added&&this.renderer.buildText(this));};
    F.prototype.titleSetter=function(a){var e=this.element.getElementsByTagName("title")[0];e||(e=B.createElementNS(this.SVG_NS,"title"),this.element.appendChild(e));e.firstChild&&e.removeChild(e.firstChild);e.appendChild(B.createTextNode(String(E(a,"")).replace(/<[^>]*>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">")));};F.prototype.toFront=function(){var a=this.element;a.parentNode.appendChild(a);return this};F.prototype.translate=function(a,e){return this.attr({translateX:a,translateY:e})};F.prototype.updateShadows=
    function(a,e,b){var h=this.shadows;if(h)for(var z=h.length;z--;)b.call(h[z],"height"===a?Math.max(e-(h[z].cutHeight||0),0):"d"===a?this.d:e,a,h[z]);};F.prototype.updateTransform=function(){var a=this.translateX||0,e=this.translateY||0,b=this.scaleX,h=this.scaleY,z=this.inverted,x=this.rotation,f=this.matrix,d=this.element;z&&(a+=this.width,e+=this.height);a=["translate("+a+","+e+")"];I(f)&&a.push("matrix("+f.join(",")+")");z?a.push("rotate(90) scale(-1,1)"):x&&a.push("rotate("+x+" "+E(this.rotationOriginX,
    d.getAttribute("x"),0)+" "+E(this.rotationOriginY,d.getAttribute("y")||0)+")");(I(b)||I(h))&&a.push("scale("+E(b,1)+" "+E(h,1)+")");a.length&&d.setAttribute("transform",a.join(" "));};F.prototype.visibilitySetter=function(a,e,b){"inherit"===a?b.removeAttribute(e):this[e]!==a&&b.setAttribute(e,a);this[e]=a;};F.prototype.xGetter=function(a){"circle"===this.element.nodeName&&("x"===a?a="cx":"y"===a&&(a="cy"));return this._defaultGetter(a)};F.prototype.zIndexSetter=function(a,e){var b=this.renderer,h=this.parentGroup,
    z=(h||b).element||b.box,x=this.element,f=!1;b=z===b.box;var d=this.added;var k;I(a)?(x.setAttribute("data-z-index",a),a=+a,this[e]===a&&(d=!1)):I(this[e])&&x.removeAttribute("data-z-index");this[e]=a;if(d){(a=this.zIndex)&&h&&(h.handleZ=!0);e=z.childNodes;for(k=e.length-1;0<=k&&!f;k--){h=e[k];d=h.getAttribute("data-z-index");var l=!I(d);if(h!==x)if(0>a&&l&&!b&&!k)z.insertBefore(x,e[k]),f=!0;else if(P(d)<=a||l&&(!I(a)||0<=a))z.insertBefore(x,e[k+1]||null),f=!0;}f||(z.insertBefore(x,e[b?3:0]||null),
    f=!0);}return f};return F}();q.prototype["stroke-widthSetter"]=q.prototype.strokeSetter;q.prototype.yGetter=q.prototype.xGetter;q.prototype.matrixSetter=q.prototype.rotationOriginXSetter=q.prototype.rotationOriginYSetter=q.prototype.rotationSetter=q.prototype.scaleXSetter=q.prototype.scaleYSetter=q.prototype.translateXSetter=q.prototype.translateYSetter=q.prototype.verticalAlignSetter=function(a,f){this[f]=a;this.doTransform=!0;};c.SVGElement=q;return c.SVGElement});O(q,"parts/SVGLabel.js",[q["parts/SVGElement.js"],
    q["parts/Utilities.js"]],function(g,c){var q=this&&this.__extends||function(){var c=function(g,L){c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(c,g){c.__proto__=g;}||function(c,g){for(var n in g)g.hasOwnProperty(n)&&(c[n]=g[n]);};return c(g,L)};return function(g,L){function v(){this.constructor=g;}c(g,L);g.prototype=null===L?Object.create(L):(v.prototype=L.prototype,new v);}}(),y=c.defined,B=c.extend,H=c.isNumber,D=c.merge,J=c.removeEvent;return function(c){function t(g,v,K,n,r,C,
    I,p,m,d){var l=c.call(this)||this;l.init(g,"g");l.textStr=v;l.x=K;l.y=n;l.anchorX=C;l.anchorY=I;l.baseline=m;l.className=d;"button"!==d&&l.addClass("highcharts-label");d&&l.addClass("highcharts-"+d);l.text=g.text("",0,0,p).attr({zIndex:1});if("string"===typeof r){var k=/^url\((.*?)\)$/.test(r);if(l.renderer.symbols[r]||k)l.symbolKey=r;}l.bBox=t.emptyBBox;l.padding=3;l.paddingLeft=0;l.baselineOffset=0;l.needsBox=g.styledMode||k;l.deferredAttr={};l.alignFactor=0;return l}q(t,c);t.prototype.alignSetter=
    function(c){c={left:0,center:.5,right:1}[c];c!==this.alignFactor&&(this.alignFactor=c,this.bBox&&H(this.xSetting)&&this.attr({x:this.xSetting}));};t.prototype.anchorXSetter=function(c,g){this.anchorX=c;this.boxAttr(g,Math.round(c)-this.getCrispAdjust()-this.xSetting);};t.prototype.anchorYSetter=function(c,g){this.anchorY=c;this.boxAttr(g,c-this.ySetting);};t.prototype.boxAttr=function(c,g){this.box?this.box.attr(c,g):this.deferredAttr[c]=g;};t.prototype.css=function(c){if(c){var v={};c=D(c);t.textProps.forEach(function(n){"undefined"!==
    typeof c[n]&&(v[n]=c[n],delete c[n]);});this.text.css(v);var L="fontSize"in v||"fontWeight"in v;if("width"in v||L)this.updateBoxSize(),L&&this.updateTextPadding();}return g.prototype.css.call(this,c)};t.prototype.destroy=function(){J(this.element,"mouseenter");J(this.element,"mouseleave");this.text&&this.text.destroy();this.box&&(this.box=this.box.destroy());g.prototype.destroy.call(this);};t.prototype.fillSetter=function(c,g){c&&(this.needsBox=!0);this.fill=c;this.boxAttr(g,c);};t.prototype.getBBox=
    function(){var c=this.bBox,g=this.padding;return {width:c.width+2*g,height:c.height+2*g,x:c.x-g,y:c.y-g}};t.prototype.getCrispAdjust=function(){return this.renderer.styledMode&&this.box?this.box.strokeWidth()%2/2:(this["stroke-width"]?parseInt(this["stroke-width"],10):0)%2/2};t.prototype.heightSetter=function(c){this.heightSetting=c;};t.prototype.on=function(c,v){var t=this,n=t.text,r=n&&"SPAN"===n.element.tagName?n:void 0;if(r){var C=function(C){("mouseenter"===c||"mouseleave"===c)&&C.relatedTarget instanceof
    Element&&(t.element.contains(C.relatedTarget)||r.element.contains(C.relatedTarget))||v.call(t.element,C);};r.on(c,C);}g.prototype.on.call(t,c,C||v);return t};t.prototype.onAdd=function(){var c=this.textStr;this.text.add(this);this.attr({text:y(c)?c:"",x:this.x,y:this.y});this.box&&y(this.anchorX)&&this.attr({anchorX:this.anchorX,anchorY:this.anchorY});};t.prototype.paddingSetter=function(c){y(c)&&c!==this.padding&&(this.padding=c,this.updateTextPadding());};t.prototype.paddingLeftSetter=function(c){y(c)&&
    c!==this.paddingLeft&&(this.paddingLeft=c,this.updateTextPadding());};t.prototype.rSetter=function(c,g){this.boxAttr(g,c);};t.prototype.shadow=function(c){c&&!this.renderer.styledMode&&(this.updateBoxSize(),this.box&&this.box.shadow(c));return this};t.prototype.strokeSetter=function(c,g){this.stroke=c;this.boxAttr(g,c);};t.prototype["stroke-widthSetter"]=function(c,g){c&&(this.needsBox=!0);this["stroke-width"]=c;this.boxAttr(g,c);};t.prototype["text-alignSetter"]=function(c){this.textAlign=c;};t.prototype.textSetter=
    function(c){"undefined"!==typeof c&&this.text.attr({text:c});this.updateBoxSize();this.updateTextPadding();};t.prototype.updateBoxSize=function(){var c=this.text.element.style,g={},G=this.padding,n=this.paddingLeft,r=H(this.widthSetting)&&H(this.heightSetting)&&!this.textAlign||!y(this.text.textStr)?t.emptyBBox:this.text.getBBox();this.width=(this.widthSetting||r.width||0)+2*G+n;this.height=(this.heightSetting||r.height||0)+2*G;this.baselineOffset=G+Math.min(this.renderer.fontMetrics(c&&c.fontSize,
    this.text).b,r.height||Infinity);this.needsBox&&(this.box||(c=this.box=this.symbolKey?this.renderer.symbol(this.symbolKey):this.renderer.rect(),c.addClass(("button"===this.className?"":"highcharts-label-box")+(this.className?" highcharts-"+this.className+"-box":"")),c.add(this),c=this.getCrispAdjust(),g.x=c,g.y=(this.baseline?-this.baselineOffset:0)+c),g.width=Math.round(this.width),g.height=Math.round(this.height),this.box.attr(B(g,this.deferredAttr)),this.deferredAttr={});this.bBox=r;};t.prototype.updateTextPadding=
    function(){var c=this.text,g=this.baseline?0:this.baselineOffset,t=this.paddingLeft+this.padding;y(this.widthSetting)&&this.bBox&&("center"===this.textAlign||"right"===this.textAlign)&&(t+={center:.5,right:1}[this.textAlign]*(this.widthSetting-this.bBox.width));if(t!==c.x||g!==c.y)c.attr("x",t),c.hasBoxWidthChanged&&(this.bBox=c.getBBox(!0),this.updateBoxSize()),"undefined"!==typeof g&&c.attr("y",g);c.x=t;c.y=g;};t.prototype.widthSetter=function(c){this.widthSetting=H(c)?c:void 0;};t.prototype.xSetter=
    function(c){this.x=c;this.alignFactor&&(c-=this.alignFactor*((this.widthSetting||this.bBox.width)+2*this.padding),this["forceAnimate:x"]=!0);this.xSetting=Math.round(c);this.attr("translateX",this.xSetting);};t.prototype.ySetter=function(c){this.ySetting=this.y=Math.round(c);this.attr("translateY",this.ySetting);};t.emptyBBox={width:0,height:0,x:0,y:0};t.textProps="color cursor direction fontFamily fontSize fontStyle fontWeight lineHeight textAlign textDecoration textOutline textOverflow width".split(" ");
    return t}(g)});O(q,"parts/SVGRenderer.js",[q["parts/Color.js"],q["parts/Globals.js"],q["parts/SVGElement.js"],q["parts/SVGLabel.js"],q["parts/Utilities.js"]],function(g,c,q,y,B){var H=B.addEvent,D=B.attr,J=B.createElement,t=B.css,G=B.defined,L=B.destroyObjectProperties,v=B.extend,K=B.isArray,n=B.isNumber,r=B.isObject,C=B.isString,I=B.merge,p=B.objectEach,m=B.pick,d=B.pInt,l=B.splat,k=B.uniqueKey,f=c.charts,a=c.deg2rad,A=c.doc,u=c.isFirefox,E=c.isMS,P=c.isWebKit;B=c.noop;var w=c.svg,M=c.SVG_NS,F=c.symbolSizes,
    Q=c.win,e=function(){function b(b,a,e,f,d,k,l){this.width=this.url=this.style=this.isSVG=this.imgCount=this.height=this.gradients=this.globalAnimation=this.defs=this.chartIndex=this.cacheKeys=this.cache=this.boxWrapper=this.box=this.alignedObjects=void 0;this.init(b,a,e,f,d,k,l);}b.prototype.init=function(b,a,e,f,d,k,l){var h=this.createElement("svg").attr({version:"1.1","class":"highcharts-root"});l||h.css(this.getStyle(f));f=h.element;b.appendChild(f);D(b,"dir","ltr");-1===b.innerHTML.indexOf("xmlns")&&
    D(f,"xmlns",this.SVG_NS);this.isSVG=!0;this.box=f;this.boxWrapper=h;this.alignedObjects=[];this.url=(u||P)&&A.getElementsByTagName("base").length?Q.location.href.split("#")[0].replace(/<[^>]*>/g,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(A.createTextNode("Created with Highcharts 8.1.2"));this.defs=this.createElement("defs").add();this.allowHTML=k;this.forExport=d;this.styledMode=l;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=
    0;this.setSize(a,e,!1);var x;u&&b.getBoundingClientRect&&(a=function(){t(b,{left:0,top:0});x=b.getBoundingClientRect();t(b,{left:Math.ceil(x.left)-x.left+"px",top:Math.ceil(x.top)-x.top+"px"});},a(),this.unSubPixelFix=H(Q,"resize",a));};b.prototype.definition=function(b){function h(b,e){var f;l(b).forEach(function(b){var x=a.createElement(b.tagName),z={};p(b,function(b,h){"tagName"!==h&&"children"!==h&&"textContent"!==h&&(z[h]=b);});x.attr(z);x.add(e||a.defs);b.textContent&&x.element.appendChild(A.createTextNode(b.textContent));
    h(b.children||[],x);f=x;});return f}var a=this;return h(b)};b.prototype.getStyle=function(b){return this.style=v({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},b)};b.prototype.setStyle=function(b){this.boxWrapper.css(this.getStyle(b));};b.prototype.isHidden=function(){return !this.boxWrapper.getBBox().width};b.prototype.destroy=function(){var b=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();L(this.gradients||{});this.gradients=null;
    b&&(this.defs=b.destroy());this.unSubPixelFix&&this.unSubPixelFix();return this.alignedObjects=null};b.prototype.createElement=function(b){var h=new this.Element;h.init(this,b);return h};b.prototype.getRadialAttr=function(b,a){return {cx:b[0]-b[2]/2+a.cx*b[2],cy:b[1]-b[2]/2+a.cy*b[2],r:a.r*b[2]}};b.prototype.truncate=function(b,a,e,f,d,k,l){var h=this,x=b.rotation,z,u=f?1:0,N=(e||f).length,m=N,p=[],w=function(b){a.firstChild&&a.removeChild(a.firstChild);b&&a.appendChild(A.createTextNode(b));},c=function(x,
    z){z=z||x;if("undefined"===typeof p[z])if(a.getSubStringLength)try{p[z]=d+a.getSubStringLength(0,f?z+1:z);}catch(ha){}else h.getSpanWidth&&(w(l(e||f,x)),p[z]=d+h.getSpanWidth(b,a));return p[z]},C;b.rotation=0;var r=c(a.textContent.length);if(C=d+r>k){for(;u<=N;)m=Math.ceil((u+N)/2),f&&(z=l(f,m)),r=c(m,z&&z.length-1),u===N?u=N+1:r>k?N=m-1:u=m;0===N?w(""):e&&N===e.length-1||w(z||l(e||f,m));}f&&f.splice(0,m);b.actualWidth=r;b.rotation=x;return C};b.prototype.buildText=function(b){var h=b.element,a=this,
    e=a.forExport,f=m(b.textStr,"").toString(),k=-1!==f.indexOf("<"),l=h.childNodes,u,c=D(h,"x"),r=b.styles,E=b.textWidth,n=r&&r.lineHeight,S=r&&r.textOutline,g=r&&"ellipsis"===r.textOverflow,I=r&&"nowrap"===r.whiteSpace,F=r&&r.fontSize,P,v=l.length;r=E&&!b.added&&this.box;var G=function(b){var e;a.styledMode||(e=/(px|em)$/.test(b&&b.style.fontSize)?b.style.fontSize:F||a.style.fontSize||12);return n?d(n):a.fontMetrics(e,b.getAttribute("style")?b:h).h},Q=function(b,h){p(a.escapes,function(a,e){h&&-1!==
    h.indexOf(a)||(b=b.toString().replace(new RegExp(a,"g"),e));});return b},q=function(b,h){var a=b.indexOf("<");b=b.substring(a,b.indexOf(">")-a);a=b.indexOf(h+"=");if(-1!==a&&(a=a+h.length+1,h=b.charAt(a),'"'===h||"'"===h))return b=b.substring(a+1),b.substring(0,b.indexOf(h))},K=/<br.*?>/g;var J=[f,g,I,n,S,F,E].join();if(J!==b.textCache){for(b.textCache=J;v--;)h.removeChild(l[v]);k||S||g||E||-1!==f.indexOf(" ")&&(!I||K.test(f))?(r&&r.appendChild(h),k?(f=a.styledMode?f.replace(/<(b|strong)>/g,'<span class="highcharts-strong">').replace(/<(i|em)>/g,
    '<span class="highcharts-emphasized">'):f.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">'),f=f.replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(K)):f=[f],f=f.filter(function(b){return ""!==b}),f.forEach(function(f,x){var z=0,d=0;f=f.replace(/^\s+|\s+$/g,"").replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");var k=f.split("|||");k.forEach(function(f){if(""!==f||1===k.length){var l={},N=A.createElementNS(a.SVG_NS,
    "tspan"),m,p;(m=q(f,"class"))&&D(N,"class",m);if(m=q(f,"style"))m=m.replace(/(;| |^)color([ :])/,"$1fill$2"),D(N,"style",m);if((p=q(f,"href"))&&!e&&-1===p.split(":")[0].toLowerCase().indexOf("javascript")){var C=A.createElementNS(a.SVG_NS,"a");D(C,"href",p);D(N,"class","highcharts-anchor");C.appendChild(N);a.styledMode||t(N,{cursor:"pointer"});}f=Q(f.replace(/<[a-zA-Z\/](.|\n)*?>/g,"")||" ");if(" "!==f){N.appendChild(A.createTextNode(f));z?l.dx=0:x&&null!==c&&(l.x=c);D(N,l);h.appendChild(C||N);!z&&
    P&&(!w&&e&&t(N,{display:"block"}),D(N,"dy",G(N)));if(E){var r=f.replace(/([^\^])-/g,"$1- ").split(" ");l=!I&&(1<k.length||x||1<r.length);C=0;p=G(N);if(g)u=a.truncate(b,N,f,void 0,0,Math.max(0,E-parseInt(F||12,10)),function(b,h){return b.substring(0,h)+"\u2026"});else if(l)for(;r.length;)r.length&&!I&&0<C&&(N=A.createElementNS(M,"tspan"),D(N,{dy:p,x:c}),m&&D(N,"style",m),N.appendChild(A.createTextNode(r.join(" ").replace(/- /g,"-"))),h.appendChild(N)),a.truncate(b,N,null,r,0===C?d:0,E,function(b,h){return r.slice(0,
    h).join(" ").replace(/- /g,"-")}),d=b.actualWidth,C++;}z++;}}});P=P||h.childNodes.length;}),g&&u&&b.attr("title",Q(b.textStr||"",["&lt;","&gt;"])),r&&r.removeChild(h),C(S)&&b.applyTextOutline&&b.applyTextOutline(S)):h.appendChild(A.createTextNode(Q(f)));}};b.prototype.getContrast=function(b){b=g.parse(b).rgba;b[0]*=1;b[1]*=1.2;b[2]*=.5;return 459<b[0]+b[1]+b[2]?"#000000":"#FFFFFF"};b.prototype.button=function(b,a,e,f,d,k,l,u,m,p){var h=this.label(b,a,e,m,void 0,void 0,p,void 0,"button"),x=0,z=this.styledMode;
    b=d&&d.style||{};d&&d.style&&delete d.style;h.attr(I({padding:8,r:2},d));if(!z){d=I({fill:"#f7f7f7",stroke:"#cccccc","stroke-width":1,style:{color:"#333333",cursor:"pointer",fontWeight:"normal"}},{style:b},d);var N=d.style;delete d.style;k=I(d,{fill:"#e6e6e6"},k);var A=k.style;delete k.style;l=I(d,{fill:"#e6ebf5",style:{color:"#000000",fontWeight:"bold"}},l);var w=l.style;delete l.style;u=I(d,{style:{color:"#cccccc"}},u);var c=u.style;delete u.style;}H(h.element,E?"mouseover":"mouseenter",function(){3!==
    x&&h.setState(1);});H(h.element,E?"mouseout":"mouseleave",function(){3!==x&&h.setState(x);});h.setState=function(b){1!==b&&(h.state=x=b);h.removeClass(/highcharts-button-(normal|hover|pressed|disabled)/).addClass("highcharts-button-"+["normal","hover","pressed","disabled"][b||0]);z||h.attr([d,k,l,u][b||0]).css([N,A,w,c][b||0]);};z||h.attr(d).css(v({cursor:"default"},N));return h.on("click",function(b){3!==x&&f.call(h,b);})};b.prototype.crispLine=function(b,a,e){void 0===e&&(e="round");var h=b[0],f=b[1];
    h[1]===f[1]&&(h[1]=f[1]=Math[e](h[1])-a%2/2);h[2]===f[2]&&(h[2]=f[2]=Math[e](h[2])+a%2/2);return b};b.prototype.path=function(b){var h=this.styledMode?{}:{fill:"none"};K(b)?h.d=b:r(b)&&v(h,b);return this.createElement("path").attr(h)};b.prototype.circle=function(b,a,e){b=r(b)?b:"undefined"===typeof b?{}:{x:b,y:a,r:e};a=this.createElement("circle");a.xSetter=a.ySetter=function(b,h,a){a.setAttribute("c"+h,b);};return a.attr(b)};b.prototype.arc=function(b,a,e,f,d,k){r(b)?(f=b,a=f.y,e=f.r,b=f.x):f={innerR:f,
    start:d,end:k};b=this.symbol("arc",b,a,e,e,f);b.r=e;return b};b.prototype.rect=function(b,a,e,f,d,k){d=r(b)?b.r:d;var h=this.createElement("rect");b=r(b)?b:"undefined"===typeof b?{}:{x:b,y:a,width:Math.max(e,0),height:Math.max(f,0)};this.styledMode||("undefined"!==typeof k&&(b.strokeWidth=k,b=h.crisp(b)),b.fill="none");d&&(b.r=d);h.rSetter=function(b,a,e){h.r=b;D(e,{rx:b,ry:b});};h.rGetter=function(){return h.r};return h.attr(b)};b.prototype.setSize=function(b,a,e){var h=this.alignedObjects,f=h.length;
    this.width=b;this.height=a;for(this.boxWrapper.animate({width:b,height:a},{step:function(){this.attr({viewBox:"0 0 "+this.attr("width")+" "+this.attr("height")});},duration:m(e,!0)?void 0:0});f--;)h[f].align();};b.prototype.g=function(b){var h=this.createElement("g");return b?h.attr({"class":"highcharts-"+b}):h};b.prototype.image=function(b,a,e,f,d,k){var h={preserveAspectRatio:"none"},x=function(b,h){b.setAttributeNS?b.setAttributeNS("http://www.w3.org/1999/xlink","href",h):b.setAttribute("hc-svg-href",
    h);},z=function(h){x(l.element,b);k.call(l,h);};1<arguments.length&&v(h,{x:a,y:e,width:f,height:d});var l=this.createElement("image").attr(h);k?(x(l.element,"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="),h=new Q.Image,H(h,"load",z),h.src=b,h.complete&&z({})):x(l.element,b);return l};b.prototype.symbol=function(b,a,e,d,k,l){var h=this,x=/^url\((.*?)\)$/,z=x.test(b),u=!z&&(this.symbols[b]?b:"circle"),N=u&&this.symbols[u],p;if(N){"number"===typeof a&&(p=N.call(this.symbols,
    Math.round(a||0),Math.round(e||0),d||0,k||0,l));var w=this.path(p);h.styledMode||w.attr("fill","none");v(w,{symbolName:u,x:a,y:e,width:d,height:k});l&&v(w,l);}else if(z){var c=b.match(x)[1];w=this.image(c);w.imgwidth=m(F[c]&&F[c].width,l&&l.width);w.imgheight=m(F[c]&&F[c].height,l&&l.height);var C=function(){w.attr({width:w.width,height:w.height});};["width","height"].forEach(function(b){w[b+"Setter"]=function(b,h){var a={},e=this["img"+h],f="width"===h?"translateX":"translateY";this[h]=b;G(e)&&(l&&
    "within"===l.backgroundSize&&this.width&&this.height&&(e=Math.round(e*Math.min(this.width/this.imgwidth,this.height/this.imgheight))),this.element&&this.element.setAttribute(h,e),this.alignByTranslate||(a[f]=((this[h]||0)-e)/2,this.attr(a)));};});G(a)&&w.attr({x:a,y:e});w.isImg=!0;G(w.imgwidth)&&G(w.imgheight)?C():(w.attr({width:0,height:0}),J("img",{onload:function(){var b=f[h.chartIndex];0===this.width&&(t(this,{position:"absolute",top:"-999em"}),A.body.appendChild(this));F[c]={width:this.width,height:this.height};
    w.imgwidth=this.width;w.imgheight=this.height;w.element&&C();this.parentNode&&this.parentNode.removeChild(this);h.imgCount--;if(!h.imgCount&&b&&!b.hasLoaded)b.onload();},src:c}),this.imgCount++);}return w};b.prototype.clipRect=function(b,a,e,f){var h=k()+"-",x=this.createElement("clipPath").attr({id:h}).add(this.defs);b=this.rect(b,a,e,f,0).add(x);b.id=h;b.clipPath=x;b.count=0;return b};b.prototype.text=function(b,a,e,f){var h={};if(f&&(this.allowHTML||!this.forExport))return this.html(b,a,e);h.x=Math.round(a||
    0);e&&(h.y=Math.round(e));G(b)&&(h.text=b);b=this.createElement("text").attr(h);f||(b.xSetter=function(b,h,a){var e=a.getElementsByTagName("tspan"),f=a.getAttribute(h),x;for(x=0;x<e.length;x++){var d=e[x];d.getAttribute(h)===f&&d.setAttribute(h,b);}a.setAttribute(h,b);});return b};b.prototype.fontMetrics=function(b,a){b=!this.styledMode&&/px/.test(b)||!Q.getComputedStyle?b||a&&a.style&&a.style.fontSize||this.style&&this.style.fontSize:a&&q.prototype.getStyle.call(a,"font-size");b=/px/.test(b)?d(b):
    12;a=24>b?b+3:Math.round(1.2*b);return {h:a,b:Math.round(.8*a),f:b}};b.prototype.rotCorr=function(b,e,f){var h=b;e&&f&&(h=Math.max(h*Math.cos(e*a),4));return {x:-b/3*Math.sin(e*a),y:h}};b.prototype.pathToSegments=function(b){for(var h=[],a=[],e={A:8,C:7,H:2,L:3,M:3,Q:5,S:5,T:3,V:2},f=0;f<b.length;f++)C(a[0])&&n(b[f])&&a.length===e[a[0].toUpperCase()]&&b.splice(f,0,a[0].replace("M","L").replace("m","l")),"string"===typeof b[f]&&(a.length&&h.push(a.slice(0)),a.length=0),a.push(b[f]);h.push(a.slice(0));
    return h};b.prototype.label=function(b,a,e,f,d,k,l,u,m){return new y(this,b,a,e,f,d,k,l,u,m)};return b}();e.prototype.Element=q;e.prototype.SVG_NS=M;e.prototype.draw=B;e.prototype.escapes={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"};e.prototype.symbols={circle:function(b,h,a,e){return this.arc(b+a/2,h+e/2,a/2,e/2,{start:.5*Math.PI,end:2.5*Math.PI,open:!1})},square:function(b,h,a,e){return [["M",b,h],["L",b+a,h],["L",b+a,h+e],["L",b,h+e],["Z"]]},triangle:function(b,h,a,e){return [["M",
    b+a/2,h],["L",b+a,h+e],["L",b,h+e],["Z"]]},"triangle-down":function(b,h,a,e){return [["M",b,h],["L",b+a,h],["L",b+a/2,h+e],["Z"]]},diamond:function(b,h,a,e){return [["M",b+a/2,h],["L",b+a,h+e/2],["L",b+a/2,h+e],["L",b,h+e/2],["Z"]]},arc:function(b,h,a,e,f){var d=[];if(f){var x=f.start||0,k=f.end||0,z=f.r||a;a=f.r||e||a;var l=.001>Math.abs(k-x-2*Math.PI);k-=.001;e=f.innerR;l=m(f.open,l);var u=Math.cos(x),p=Math.sin(x),N=Math.cos(k),A=Math.sin(k);x=m(f.longArc,.001>k-x-Math.PI?0:1);d.push(["M",b+z*u,
    h+a*p],["A",z,a,0,x,m(f.clockwise,1),b+z*N,h+a*A]);G(e)&&d.push(l?["M",b+e*N,h+e*A]:["L",b+e*N,h+e*A],["A",e,e,0,x,G(f.clockwise)?1-f.clockwise:0,b+e*u,h+e*p]);l||d.push(["Z"]);}return d},callout:function(b,h,a,e,f){var d=Math.min(f&&f.r||0,a,e),k=d+6,x=f&&f.anchorX||0;f=f&&f.anchorY||0;var z=[["M",b+d,h],["L",b+a-d,h],["C",b+a,h,b+a,h,b+a,h+d],["L",b+a,h+e-d],["C",b+a,h+e,b+a,h+e,b+a-d,h+e],["L",b+d,h+e],["C",b,h+e,b,h+e,b,h+e-d],["L",b,h+d],["C",b,h,b,h,b+d,h]];x&&x>a?f>h+k&&f<h+e-k?z.splice(3,1,
    ["L",b+a,f-6],["L",b+a+6,f],["L",b+a,f+6],["L",b+a,h+e-d]):z.splice(3,1,["L",b+a,e/2],["L",x,f],["L",b+a,e/2],["L",b+a,h+e-d]):x&&0>x?f>h+k&&f<h+e-k?z.splice(7,1,["L",b,f+6],["L",b-6,f],["L",b,f-6],["L",b,h+d]):z.splice(7,1,["L",b,e/2],["L",x,f],["L",b,e/2],["L",b,h+d]):f&&f>e&&x>b+k&&x<b+a-k?z.splice(5,1,["L",x+6,h+e],["L",x,h+e+6],["L",x-6,h+e],["L",b+d,h+e]):f&&0>f&&x>b+k&&x<b+a-k&&z.splice(1,1,["L",x-6,h],["L",x,h-6],["L",x+6,h],["L",a-d,h]);return z}};c.SVGRenderer=e;c.Renderer=c.SVGRenderer;
    return c.Renderer});O(q,"parts/Html.js",[q["parts/Globals.js"],q["parts/SVGElement.js"],q["parts/SVGRenderer.js"],q["parts/Utilities.js"]],function(g,c,q,y){var B=y.attr,H=y.createElement,D=y.css,J=y.defined,t=y.extend,G=y.pick,L=y.pInt,v=g.isFirefox,K=g.isMS,n=g.isWebKit,r=g.win;t(c.prototype,{htmlCss:function(c){var r="SPAN"===this.element.tagName&&c&&"width"in c,p=G(r&&c.width,void 0);if(r){delete c.width;this.textWidth=p;var m=!0;}c&&"ellipsis"===c.textOverflow&&(c.whiteSpace="nowrap",c.overflow=
    "hidden");this.styles=t(this.styles,c);D(this.element,c);m&&this.htmlUpdateTransform();return this},htmlGetBBox:function(){var c=this.element;return {x:c.offsetLeft,y:c.offsetTop,width:c.offsetWidth,height:c.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var c=this.renderer,r=this.element,p=this.translateX||0,m=this.translateY||0,d=this.x||0,l=this.y||0,k=this.textAlign||"left",f={left:0,center:.5,right:1}[k],a=this.styles,A=a&&a.whiteSpace;D(r,{marginLeft:p,marginTop:m});!c.styledMode&&
    this.shadows&&this.shadows.forEach(function(a){D(a,{marginLeft:p+1,marginTop:m+1});});this.inverted&&[].forEach.call(r.childNodes,function(a){c.invertChild(a,r);});if("SPAN"===r.tagName){a=this.rotation;var u=this.textWidth&&L(this.textWidth),E=[a,k,r.innerHTML,this.textWidth,this.textAlign].join(),n;(n=u!==this.oldTextWidth)&&!(n=u>this.oldTextWidth)&&((n=this.textPxLength)||(D(r,{width:"",whiteSpace:A||"nowrap"}),n=r.offsetWidth),n=n>u);n&&(/[ \-]/.test(r.textContent||r.innerText)||"ellipsis"===r.style.textOverflow)?
    (D(r,{width:u+"px",display:"block",whiteSpace:A||"normal"}),this.oldTextWidth=u,this.hasBoxWidthChanged=!0):this.hasBoxWidthChanged=!1;E!==this.cTT&&(A=c.fontMetrics(r.style.fontSize,r).b,!J(a)||a===(this.oldRotation||0)&&k===this.oldAlign||this.setSpanRotation(a,f,A),this.getSpanCorrection(!J(a)&&this.textPxLength||r.offsetWidth,A,f,a,k));D(r,{left:d+(this.xCorr||0)+"px",top:l+(this.yCorr||0)+"px"});this.cTT=E;this.oldRotation=a;this.oldAlign=k;}}else this.alignOnAdd=!0;},setSpanRotation:function(c,
    r,p){var m={},d=this.renderer.getTransformKey();m[d]=m.transform="rotate("+c+"deg)";m[d+(v?"Origin":"-origin")]=m.transformOrigin=100*r+"% "+p+"px";D(this.element,m);},getSpanCorrection:function(c,r,p){this.xCorr=-c*p;this.yCorr=-r;}});t(q.prototype,{getTransformKey:function(){return K&&!/Edge/.test(r.navigator.userAgent)?"-ms-transform":n?"-webkit-transform":v?"MozTransform":r.opera?"-o-transform":""},html:function(r,n,p){var m=this.createElement("span"),d=m.element,l=m.renderer,k=l.isSVG,f=function(a,
    f){["opacity","visibility"].forEach(function(d){a[d+"Setter"]=function(k,l,u){var m=a.div?a.div.style:f;c.prototype[d+"Setter"].call(this,k,l,u);m&&(m[l]=k);};});a.addedSetters=!0;};m.textSetter=function(a){a!==d.innerHTML&&(delete this.bBox,delete this.oldTextWidth);this.textStr=a;d.innerHTML=G(a,"");m.doTransform=!0;};k&&f(m,m.element.style);m.xSetter=m.ySetter=m.alignSetter=m.rotationSetter=function(a,f){"align"===f&&(f="textAlign");m[f]=a;m.doTransform=!0;};m.afterSetters=function(){this.doTransform&&
    (this.htmlUpdateTransform(),this.doTransform=!1);};m.attr({text:r,x:Math.round(n),y:Math.round(p)}).css({position:"absolute"});l.styledMode||m.css({fontFamily:this.style.fontFamily,fontSize:this.style.fontSize});d.style.whiteSpace="nowrap";m.css=m.htmlCss;k&&(m.add=function(a){var k=l.box.parentNode,u=[];if(this.parentGroup=a){var p=a.div;if(!p){for(;a;)u.push(a),a=a.parentGroup;u.reverse().forEach(function(a){function d(f,e){a[e]=f;"translateX"===e?A.left=f+"px":A.top=f+"px";a.doTransform=!0;}var l=
    B(a.element,"class");p=a.div=a.div||H("div",l?{className:l}:void 0,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px",display:a.display,opacity:a.opacity,pointerEvents:a.styles&&a.styles.pointerEvents},p||k);var A=p.style;t(a,{classSetter:function(a){return function(e){this.element.setAttribute("class",e);a.className=e;}}(p),on:function(){u[0].div&&m.on.apply({element:u[0].div},arguments);return a},translateXSetter:d,translateYSetter:d});a.addedSetters||f(a);});}}else p=k;p.appendChild(d);
    m.added=!0;m.alignOnAdd&&m.htmlUpdateTransform();return m});return m}});});O(q,"parts/Tick.js",[q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=c.clamp,y=c.correctFloat,B=c.defined,H=c.destroyObjectProperties,D=c.extend,J=c.fireEvent,t=c.isNumber,G=c.merge,L=c.objectEach,v=c.pick,K=g.deg2rad;c=function(){function c(c,C,n,p,m){this.isNewLabel=this.isNew=!0;this.axis=c;this.pos=C;this.type=n||"";this.parameters=m||{};this.tickmarkOffset=this.parameters.tickmarkOffset;this.options=
    this.parameters.options;J(this,"init");n||p||this.addLabel();}c.prototype.addLabel=function(){var c=this,C=c.axis,n=C.options,p=C.chart,m=C.categories,d=C.logarithmic,l=C.names,k=c.pos,f=v(c.options&&c.options.labels,n.labels),a=C.tickPositions,A=k===a[0],u=k===a[a.length-1];l=this.parameters.category||(m?v(m[k],l[k],k):k);var E=c.label;m=(!f.step||1===f.step)&&1===C.tickInterval;a=a.info;var g,w;if(C.dateTime&&a){var M=p.time.resolveDTLFormat(n.dateTimeLabelFormats[!n.grid&&a.higherRanks[k]||a.unitName]);
    var F=M.main;}c.isFirst=A;c.isLast=u;c.formatCtx={axis:C,chart:p,isFirst:A,isLast:u,dateTimeLabelFormat:F,tickPositionInfo:a,value:d?y(d.lin2log(l)):l,pos:k};n=C.labelFormatter.call(c.formatCtx,this.formatCtx);if(w=M&&M.list)c.shortenLabel=function(){for(g=0;g<w.length;g++)if(E.attr({text:C.labelFormatter.call(D(c.formatCtx,{dateTimeLabelFormat:w[g]}))}),E.getBBox().width<C.getSlotWidth(c)-2*v(f.padding,5))return;E.attr({text:""});};m&&C._addedPlotLB&&C.isXAxis&&c.moveLabel(n,f);B(E)||c.movedLabel?
    E&&E.textStr!==n&&!m&&(!E.textWidth||f.style&&f.style.width||E.styles.width||E.css({width:null}),E.attr({text:n}),E.textPxLength=E.getBBox().width):(c.label=E=c.createLabel({x:0,y:0},n,f),c.rotation=0);};c.prototype.createLabel=function(c,C,n){var p=this.axis,m=p.chart;if(c=B(C)&&n.enabled?m.renderer.text(C,c.x,c.y,n.useHTML).add(p.labelGroup):null)m.styledMode||c.css(G(n.style)),c.textPxLength=c.getBBox().width;return c};c.prototype.destroy=function(){H(this,this.axis);};c.prototype.getPosition=function(c,
    C,n,p){var m=this.axis,d=m.chart,l=p&&d.oldChartHeight||d.chartHeight;c={x:c?y(m.translate(C+n,null,null,p)+m.transB):m.left+m.offset+(m.opposite?(p&&d.oldChartWidth||d.chartWidth)-m.right-m.left:0),y:c?l-m.bottom+m.offset-(m.opposite?m.height:0):y(l-m.translate(C+n,null,null,p)-m.transB)};c.y=q(c.y,-1E5,1E5);J(this,"afterGetPosition",{pos:c});return c};c.prototype.getLabelPosition=function(c,C,n,p,m,d,l,k){var f=this.axis,a=f.transA,A=f.isLinked&&f.linkedParent?f.linkedParent.reversed:f.reversed,
    u=f.staggerLines,r=f.tickRotCorr||{x:0,y:0},g=m.y,w=p||f.reserveSpaceDefault?0:-f.labelOffset*("center"===f.labelAlign?.5:1),M={};B(g)||(g=0===f.side?n.rotation?-8:-n.getBBox().height:2===f.side?r.y+8:Math.cos(n.rotation*K)*(r.y-n.getBBox(!1,0).height/2));c=c+m.x+w+r.x-(d&&p?d*a*(A?-1:1):0);C=C+g-(d&&!p?d*a*(A?1:-1):0);u&&(n=l/(k||1)%u,f.opposite&&(n=u-n-1),C+=f.labelOffset/u*n);M.x=c;M.y=Math.round(C);J(this,"afterGetLabelPosition",{pos:M,tickmarkOffset:d,index:l});return M};c.prototype.getLabelSize=
    function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0};c.prototype.getMarkPath=function(c,C,n,p,m,d){return d.crispLine([["M",c,C],["L",c+(m?0:-n),C+(m?n:0)]],p)};c.prototype.handleOverflow=function(c){var r=this.axis,n=r.options.labels,p=c.x,m=r.chart.chartWidth,d=r.chart.spacing,l=v(r.labelLeft,Math.min(r.pos,d[3]));d=v(r.labelRight,Math.max(r.isRadial?0:r.pos+r.len,m-d[1]));var k=this.label,f=this.rotation,a={left:0,center:.5,right:1}[r.labelAlign||k.attr("align")],
    A=k.getBBox().width,u=r.getSlotWidth(this),E=u,g=1,w,M={};if(f||"justify"!==v(n.overflow,"justify"))0>f&&p-a*A<l?w=Math.round(p/Math.cos(f*K)-l):0<f&&p+a*A>d&&(w=Math.round((m-p)/Math.cos(f*K)));else if(m=p+(1-a)*A,p-a*A<l?E=c.x+E*(1-a)-l:m>d&&(E=d-c.x+E*a,g=-1),E=Math.min(u,E),E<u&&"center"===r.labelAlign&&(c.x+=g*(u-E-a*(u-Math.min(A,E)))),A>E||r.autoRotation&&(k.styles||{}).width)w=E;w&&(this.shortenLabel?this.shortenLabel():(M.width=Math.floor(w)+"px",(n.style||{}).textOverflow||(M.textOverflow=
    "ellipsis"),k.css(M)));};c.prototype.moveLabel=function(c,C){var r=this,p=r.label,m=!1,d=r.axis,l=d.reversed,k=d.chart.inverted;p&&p.textStr===c?(r.movedLabel=p,m=!0,delete r.label):L(d.ticks,function(a){m||a.isNew||a===r||!a.label||a.label.textStr!==c||(r.movedLabel=a.label,m=!0,a.labelPos=r.movedLabel.xy,delete a.label);});if(!m&&(r.labelPos||p)){var f=r.labelPos||p.xy;p=k?f.x:l?0:d.width+d.left;d=k?l?d.width+d.left:0:f.y;r.movedLabel=r.createLabel({x:p,y:d},c,C);r.movedLabel&&r.movedLabel.attr({opacity:0});}};
    c.prototype.render=function(c,C,n){var p=this.axis,m=p.horiz,d=this.pos,l=v(this.tickmarkOffset,p.tickmarkOffset);d=this.getPosition(m,d,l,C);l=d.x;var k=d.y;p=m&&l===p.pos+p.len||!m&&k===p.pos?-1:1;n=v(n,1);this.isActive=!0;this.renderGridLine(C,n,p);this.renderMark(d,n,p);this.renderLabel(d,C,n,c);this.isNew=!1;J(this,"afterRender");};c.prototype.renderGridLine=function(c,C,n){var p=this.axis,m=p.options,d=this.gridLine,l={},k=this.pos,f=this.type,a=v(this.tickmarkOffset,p.tickmarkOffset),A=p.chart.renderer,
    u=f?f+"Grid":"grid",r=m[u+"LineWidth"],g=m[u+"LineColor"];m=m[u+"LineDashStyle"];d||(p.chart.styledMode||(l.stroke=g,l["stroke-width"]=r,m&&(l.dashstyle=m)),f||(l.zIndex=1),c&&(C=0),this.gridLine=d=A.path().attr(l).addClass("highcharts-"+(f?f+"-":"")+"grid-line").add(p.gridGroup));if(d&&(n=p.getPlotLinePath({value:k+a,lineWidth:d.strokeWidth()*n,force:"pass",old:c})))d[c||this.isNew?"attr":"animate"]({d:n,opacity:C});};c.prototype.renderMark=function(c,n,g){var p=this.axis,m=p.options,d=p.chart.renderer,
    l=this.type,k=l?l+"Tick":"tick",f=p.tickSize(k),a=this.mark,A=!a,u=c.x;c=c.y;var r=v(m[k+"Width"],!l&&p.isXAxis?1:0);m=m[k+"Color"];f&&(p.opposite&&(f[0]=-f[0]),A&&(this.mark=a=d.path().addClass("highcharts-"+(l?l+"-":"")+"tick").add(p.axisGroup),p.chart.styledMode||a.attr({stroke:m,"stroke-width":r})),a[A?"attr":"animate"]({d:this.getMarkPath(u,c,f[0],a.strokeWidth()*g,p.horiz,d),opacity:n}));};c.prototype.renderLabel=function(c,n,g,p){var m=this.axis,d=m.horiz,l=m.options,k=this.label,f=l.labels,
    a=f.step;m=v(this.tickmarkOffset,m.tickmarkOffset);var A=!0,u=c.x;c=c.y;k&&t(u)&&(k.xy=c=this.getLabelPosition(u,c,k,d,f,m,p,a),this.isFirst&&!this.isLast&&!v(l.showFirstLabel,1)||this.isLast&&!this.isFirst&&!v(l.showLastLabel,1)?A=!1:!d||f.step||f.rotation||n||0===g||this.handleOverflow(c),a&&p%a&&(A=!1),A&&t(c.y)?(c.opacity=g,k[this.isNewLabel?"attr":"animate"](c),this.isNewLabel=!1):(k.attr("y",-9999),this.isNewLabel=!0));};c.prototype.replaceMovedLabel=function(){var c=this.label,n=this.axis,g=
    n.reversed,p=this.axis.chart.inverted;if(c&&!this.isNew){var m=p?c.xy.x:g?n.left:n.width+n.left;g=p?g?n.width+n.top:n.top:c.xy.y;c.animate({x:m,y:g,opacity:0},void 0,c.destroy);delete this.label;}n.isDirty=!0;this.label=this.movedLabel;delete this.movedLabel;};return c}();g.Tick=c;return g.Tick});O(q,"parts/Time.js",[q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=c.defined,y=c.error,B=c.extend,H=c.isObject,D=c.merge,J=c.objectEach,t=c.pad,G=c.pick,L=c.splat,v=c.timeUnits,K=g.win;
    c=function(){function c(c){this.options={};this.variableTimezone=this.useUTC=!1;this.Date=K.Date;this.getTimezoneOffset=this.timezoneOffsetFunction();this.update(c);}c.prototype.get=function(c,n){if(this.variableTimezone||this.timezoneOffset){var r=n.getTime(),p=r-this.getTimezoneOffset(n);n.setTime(p);c=n["getUTC"+c]();n.setTime(r);return c}return this.useUTC?n["getUTC"+c]():n["get"+c]()};c.prototype.set=function(c,n,g){if(this.variableTimezone||this.timezoneOffset){if("Milliseconds"===c||"Seconds"===
    c||"Minutes"===c)return n["setUTC"+c](g);var p=this.getTimezoneOffset(n);p=n.getTime()-p;n.setTime(p);n["setUTC"+c](g);c=this.getTimezoneOffset(n);p=n.getTime()+c;return n.setTime(p)}return this.useUTC?n["setUTC"+c](g):n["set"+c](g)};c.prototype.update=function(c){var n=G(c&&c.useUTC,!0);this.options=c=D(!0,this.options||{},c);this.Date=c.Date||K.Date||Date;this.timezoneOffset=(this.useUTC=n)&&c.timezoneOffset;this.getTimezoneOffset=this.timezoneOffsetFunction();this.variableTimezone=!(n&&!c.getTimezoneOffset&&
    !c.timezone);};c.prototype.makeTime=function(c,n,t,p,m,d){if(this.useUTC){var l=this.Date.UTC.apply(0,arguments);var k=this.getTimezoneOffset(l);l+=k;var f=this.getTimezoneOffset(l);k!==f?l+=f-k:k-36E5!==this.getTimezoneOffset(l-36E5)||g.isSafari||(l-=36E5);}else l=(new this.Date(c,n,G(t,1),G(p,0),G(m,0),G(d,0))).getTime();return l};c.prototype.timezoneOffsetFunction=function(){var c=this,n=this.options,g=K.moment;if(!this.useUTC)return function(c){return 6E4*(new Date(c.toString())).getTimezoneOffset()};
    if(n.timezone){if(g)return function(c){return 6E4*-g.tz(c,n.timezone).utcOffset()};y(25);}return this.useUTC&&n.getTimezoneOffset?function(c){return 6E4*n.getTimezoneOffset(c.valueOf())}:function(){return 6E4*(c.timezoneOffset||0)}};c.prototype.dateFormat=function(c,n,v){var p;if(!q(n)||isNaN(n))return (null===(p=g.defaultOptions.lang)||void 0===p?void 0:p.invalidDate)||"";c=G(c,"%Y-%m-%d %H:%M:%S");var m=this;p=new this.Date(n);var d=this.get("Hours",p),l=this.get("Day",p),k=this.get("Date",p),f=this.get("Month",
    p),a=this.get("FullYear",p),A=g.defaultOptions.lang,u=null===A||void 0===A?void 0:A.weekdays,E=null===A||void 0===A?void 0:A.shortWeekdays;p=B({a:E?E[l]:u[l].substr(0,3),A:u[l],d:t(k),e:t(k,2," "),w:l,b:A.shortMonths[f],B:A.months[f],m:t(f+1),o:f+1,y:a.toString().substr(2,2),Y:a,H:t(d),k:d,I:t(d%12||12),l:d%12||12,M:t(this.get("Minutes",p)),p:12>d?"AM":"PM",P:12>d?"am":"pm",S:t(p.getSeconds()),L:t(Math.floor(n%1E3),3)},g.dateFormats);J(p,function(a,f){for(;-1!==c.indexOf("%"+f);)c=c.replace("%"+f,
    "function"===typeof a?a.call(m,n):a);});return v?c.substr(0,1).toUpperCase()+c.substr(1):c};c.prototype.resolveDTLFormat=function(c){return H(c,!0)?c:(c=L(c),{main:c[0],from:c[1],to:c[2]})};c.prototype.getTimeTicks=function(c,n,g,p){var m=this,d=[],l={};var k=new m.Date(n);var f=c.unitRange,a=c.count||1,A;p=G(p,1);if(q(n)){m.set("Milliseconds",k,f>=v.second?0:a*Math.floor(m.get("Milliseconds",k)/a));f>=v.second&&m.set("Seconds",k,f>=v.minute?0:a*Math.floor(m.get("Seconds",k)/a));f>=v.minute&&m.set("Minutes",
    k,f>=v.hour?0:a*Math.floor(m.get("Minutes",k)/a));f>=v.hour&&m.set("Hours",k,f>=v.day?0:a*Math.floor(m.get("Hours",k)/a));f>=v.day&&m.set("Date",k,f>=v.month?1:Math.max(1,a*Math.floor(m.get("Date",k)/a)));if(f>=v.month){m.set("Month",k,f>=v.year?0:a*Math.floor(m.get("Month",k)/a));var u=m.get("FullYear",k);}f>=v.year&&m.set("FullYear",k,u-u%a);f===v.week&&(u=m.get("Day",k),m.set("Date",k,m.get("Date",k)-u+p+(u<p?-7:0)));u=m.get("FullYear",k);p=m.get("Month",k);var E=m.get("Date",k),r=m.get("Hours",
    k);n=k.getTime();m.variableTimezone&&(A=g-n>4*v.month||m.getTimezoneOffset(n)!==m.getTimezoneOffset(g));n=k.getTime();for(k=1;n<g;)d.push(n),n=f===v.year?m.makeTime(u+k*a,0):f===v.month?m.makeTime(u,p+k*a):!A||f!==v.day&&f!==v.week?A&&f===v.hour&&1<a?m.makeTime(u,p,E,r+k*a):n+f*a:m.makeTime(u,p,E+k*a*(f===v.day?1:7)),k++;d.push(n);f<=v.hour&&1E4>d.length&&d.forEach(function(a){0===a%18E5&&"000000000"===m.dateFormat("%H%M%S%L",a)&&(l[a]="day");});}d.info=B(c,{higherRanks:l,totalRange:f*a});return d};
    return c}();g.Time=c;return g.Time});O(q,"parts/Options.js",[q["parts/Globals.js"],q["parts/Time.js"],q["parts/Color.js"],q["parts/Utilities.js"]],function(g,c,q,y){q=q.parse;y=y.merge;g.defaultOptions={colors:"#7cb5ec #434348 #90ed7d #f7a35c #8085e9 #f15c80 #e4d354 #2b908f #f45b5b #91e8e1".split(" "),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January February March April May June July August September October November December".split(" "),
    shortMonths:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),weekdays:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),decimalPoint:".",numericSymbols:"kMGTPE".split(""),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{},time:{Date:void 0,getTimezoneOffset:void 0,timezone:void 0,timezoneOffset:0,useUTC:!0},chart:{styledMode:!1,borderRadius:0,colorCount:10,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],resetZoomButton:{theme:{zIndex:6},
    position:{align:"right",x:-10,y:10}},width:null,height:null,borderColor:"#335cad",backgroundColor:"#ffffff",plotBorderColor:"#cccccc"},title:{text:"Chart title",align:"center",margin:15,widthAdjust:-44},subtitle:{text:"",align:"center",widthAdjust:-44},caption:{margin:15,text:"",align:"left",verticalAlign:"bottom"},plotOptions:{},labels:{style:{position:"absolute",color:"#333333"}},legend:{enabled:!0,align:"center",alignColumns:!0,layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#999999",
    borderRadius:0,navigation:{activeColor:"#003399",inactiveColor:"#cccccc"},itemStyle:{color:"#333333",cursor:"pointer",fontSize:"12px",fontWeight:"bold",textOverflow:"ellipsis"},itemHoverStyle:{color:"#000000"},itemHiddenStyle:{color:"#cccccc"},shadow:!1,itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},squareSymbol:!0,symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",
    backgroundColor:"#ffffff",opacity:.5,textAlign:"center"}},tooltip:{enabled:!0,animation:g.svg,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",padding:8,snap:g.isTouchDevice?25:10,headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',
    backgroundColor:q("#f7f7f7").setOpacity(.85).get(),borderWidth:1,shadow:!0,style:{color:"#333333",cursor:"default",fontSize:"12px",whiteSpace:"nowrap"}},credits:{enabled:!0,href:"https://www.highcharts.com?credits",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#999999",fontSize:"9px"},text:"Highcharts.com"}};g.time=new c(y(g.defaultOptions.global,g.defaultOptions.time));g.dateFormat=function(c,q,y){return g.time.dateFormat(c,q,y)};return {dateFormat:g.dateFormat,
    defaultOptions:g.defaultOptions,time:g.time}});O(q,"parts/Axis.js",[q["parts/Color.js"],q["parts/Globals.js"],q["parts/Tick.js"],q["parts/Utilities.js"],q["parts/Options.js"]],function(g,c,q,y,B){var H=y.addEvent,D=y.animObject,J=y.arrayMax,t=y.arrayMin,G=y.clamp,L=y.correctFloat,v=y.defined,K=y.destroyObjectProperties,n=y.error,r=y.extend,C=y.fireEvent,I=y.format,p=y.getMagnitude,m=y.isArray,d=y.isFunction,l=y.isNumber,k=y.isString,f=y.merge,a=y.normalizeTickInterval,A=y.objectEach,u=y.pick,E=y.relativeLength,
    P=y.removeEvent,w=y.splat,M=y.syncTimeout,F=B.defaultOptions,Q=c.deg2rad;y=function(){function e(b,a){this.zoomEnabled=this.width=this.visible=this.userOptions=this.translationSlope=this.transB=this.transA=this.top=this.ticks=this.tickRotCorr=this.tickPositions=this.tickmarkOffset=this.tickInterval=this.tickAmount=this.side=this.series=this.right=this.positiveValuesOnly=this.pos=this.pointRangePadding=this.pointRange=this.plotLinesAndBandsGroups=this.plotLinesAndBands=this.paddedTicks=this.overlap=
    this.options=this.oldMin=this.oldMax=this.offset=this.names=this.minPixelPadding=this.minorTicks=this.minorTickInterval=this.min=this.maxLabelLength=this.max=this.len=this.left=this.labelFormatter=this.labelEdge=this.isLinked=this.height=this.hasVisibleSeries=this.hasNames=this.coll=this.closestPointRange=this.chart=this.categories=this.bottom=this.alternateBands=void 0;this.init(b,a);}e.prototype.init=function(b,a){var h=a.isX,e=this;e.chart=b;e.horiz=b.inverted&&!e.isZAxis?!h:h;e.isXAxis=h;e.coll=
    e.coll||(h?"xAxis":"yAxis");C(this,"init",{userOptions:a});e.opposite=a.opposite;e.side=a.side||(e.horiz?e.opposite?0:2:e.opposite?1:3);e.setOptions(a);var f=this.options,k=f.type;e.labelFormatter=f.labels.formatter||e.defaultLabelFormatter;e.userOptions=a;e.minPixelPadding=0;e.reversed=f.reversed;e.visible=!1!==f.visible;e.zoomEnabled=!1!==f.zoomEnabled;e.hasNames="category"===k||!0===f.categories;e.categories=f.categories||e.hasNames;e.names||(e.names=[],e.names.keys={});e.plotLinesAndBandsGroups=
    {};e.positiveValuesOnly=!(!e.logarithmic||f.allowNegativeLog);e.isLinked=v(f.linkedTo);e.ticks={};e.labelEdge=[];e.minorTicks={};e.plotLinesAndBands=[];e.alternateBands={};e.len=0;e.minRange=e.userMinRange=f.minRange||f.maxZoom;e.range=f.range;e.offset=f.offset||0;e.max=null;e.min=null;e.crosshair=u(f.crosshair,w(b.options.tooltip.crosshairs)[h?0:1],!1);a=e.options.events;-1===b.axes.indexOf(e)&&(h?b.axes.splice(b.xAxis.length,0,e):b.axes.push(e),b[e.coll].push(e));e.series=e.series||[];b.inverted&&
    !e.isZAxis&&h&&"undefined"===typeof e.reversed&&(e.reversed=!0);e.labelRotation=e.options.labels.rotation;A(a,function(b,a){d(b)&&H(e,a,b);});C(this,"afterInit");};e.prototype.setOptions=function(b){this.options=f(e.defaultOptions,"yAxis"===this.coll&&e.defaultYAxisOptions,[e.defaultTopAxisOptions,e.defaultRightAxisOptions,e.defaultBottomAxisOptions,e.defaultLeftAxisOptions][this.side],f(F[this.coll],b));C(this,"afterSetOptions",{userOptions:b});};e.prototype.defaultLabelFormatter=function(){var b=this.axis,
    a=l(this.value)?this.value:NaN,e=b.chart.time,f=b.categories,d=this.dateTimeLabelFormat,k=F.lang,c=k.numericSymbols;k=k.numericSymbolMagnitude||1E3;var u=c&&c.length,m=b.options.labels.format;b=b.logarithmic?Math.abs(a):b.tickInterval;var p=this.chart,A=p.numberFormatter;if(m)var w=I(m,this,p);else if(f)w=""+this.value;else if(d)w=e.dateFormat(d,a);else if(u&&1E3<=b)for(;u--&&"undefined"===typeof w;)e=Math.pow(k,u+1),b>=e&&0===10*a%e&&null!==c[u]&&0!==a&&(w=A(a/e,-1)+c[u]);"undefined"===typeof w&&
    (w=1E4<=Math.abs(a)?A(a,-1):A(a,-1,void 0,""));return w};e.prototype.getSeriesExtremes=function(){var b=this,a=b.chart,e;C(this,"getSeriesExtremes",null,function(){b.hasVisibleSeries=!1;b.dataMin=b.dataMax=b.threshold=null;b.softThreshold=!b.isXAxis;b.stacking&&b.stacking.buildStacks();b.series.forEach(function(h){if(h.visible||!a.options.chart.ignoreHiddenSeries){var f=h.options,d=f.threshold;b.hasVisibleSeries=!0;b.positiveValuesOnly&&0>=d&&(d=null);if(b.isXAxis){if(f=h.xData,f.length){e=h.getXExtremes(f);
    var k=e.min;var x=e.max;l(k)||k instanceof Date||(f=f.filter(l),e=h.getXExtremes(f),k=e.min,x=e.max);f.length&&(b.dataMin=Math.min(u(b.dataMin,k),k),b.dataMax=Math.max(u(b.dataMax,x),x));}}else if(h=h.applyExtremes(),l(h.dataMin)&&(k=h.dataMin,b.dataMin=Math.min(u(b.dataMin,k),k)),l(h.dataMax)&&(x=h.dataMax,b.dataMax=Math.max(u(b.dataMax,x),x)),v(d)&&(b.threshold=d),!f.softThreshold||b.positiveValuesOnly)b.softThreshold=!1;}});});C(this,"afterGetSeriesExtremes");};e.prototype.translate=function(b,a,e,
    f,d,k){var h=this.linkedParent||this,x=1,z=0,c=f?h.oldTransA:h.transA;f=f?h.oldMin:h.min;var u=h.minPixelPadding;d=(h.isOrdinal||h.brokenAxis&&h.brokenAxis.hasBreaks||h.logarithmic&&d)&&h.lin2val;c||(c=h.transA);e&&(x*=-1,z=h.len);h.reversed&&(x*=-1,z-=x*(h.sector||h.len));a?(b=(b*x+z-u)/c+f,d&&(b=h.lin2val(b))):(d&&(b=h.val2lin(b)),b=l(f)?x*(b-f)*c+z+x*u+(l(k)?c*k:0):void 0);return b};e.prototype.toPixels=function(b,a){return this.translate(b,!1,!this.horiz,null,!0)+(a?0:this.pos)};e.prototype.toValue=
    function(b,a){return this.translate(b-(a?0:this.pos),!0,!this.horiz,null,!0)};e.prototype.getPlotLinePath=function(b){function a(b,a,h){if("pass"!==w&&b<a||b>h)w?b=G(b,a,h):t=!0;return b}var e=this,f=e.chart,d=e.left,k=e.top,c=b.old,m=b.value,p=b.translatedValue,A=b.lineWidth,w=b.force,n,g,E,r,M=c&&f.oldChartHeight||f.chartHeight,F=c&&f.oldChartWidth||f.chartWidth,t,v=e.transB;b={value:m,lineWidth:A,old:c,force:w,acrossPanes:b.acrossPanes,translatedValue:p};C(this,"getPlotLinePath",b,function(b){p=
    u(p,e.translate(m,null,null,c));p=G(p,-1E5,1E5);n=E=Math.round(p+v);g=r=Math.round(M-p-v);l(p)?e.horiz?(g=k,r=M-e.bottom,n=E=a(n,d,d+e.width)):(n=d,E=F-e.right,g=r=a(g,k,k+e.height)):(t=!0,w=!1);b.path=t&&!w?null:f.renderer.crispLine([["M",n,g],["L",E,r]],A||1);});return b.path};e.prototype.getLinearTickPositions=function(b,a,e){var h=L(Math.floor(a/b)*b);e=L(Math.ceil(e/b)*b);var f=[],d;L(h+b)===h&&(d=20);if(this.single)return [a];for(a=h;a<=e;){f.push(a);a=L(a+b,d);if(a===k)break;var k=a;}return f};
    e.prototype.getMinorTickInterval=function(){var b=this.options;return !0===b.minorTicks?u(b.minorTickInterval,"auto"):!1===b.minorTicks?null:b.minorTickInterval};e.prototype.getMinorTickPositions=function(){var b=this.options,a=this.tickPositions,e=this.minorTickInterval,f=[],d=this.pointRangePadding||0,k=this.min-d;d=this.max+d;var c=d-k;if(c&&c/e<this.len/3){var l=this.logarithmic;if(l)this.paddedTicks.forEach(function(b,a,h){a&&f.push.apply(f,l.getLogTickPositions(e,h[a-1],h[a],!0));});else if(this.dateTime&&
    "auto"===this.getMinorTickInterval())f=f.concat(this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(e),k,d,b.startOfWeek));else for(b=k+(a[0]-k)%e;b<=d&&b!==f[0];b+=e)f.push(b);}0!==f.length&&this.trimTicks(f);return f};e.prototype.adjustForMinRange=function(){var b=this.options,a=this.min,e=this.max,f=this.logarithmic,d,k,c,l,m;this.isXAxis&&"undefined"===typeof this.minRange&&!f&&(v(b.min)||v(b.max)?this.minRange=null:(this.series.forEach(function(b){l=b.xData;for(k=m=b.xIncrement?1:l.length-
    1;0<k;k--)if(c=l[k]-l[k-1],"undefined"===typeof d||c<d)d=c;}),this.minRange=Math.min(5*d,this.dataMax-this.dataMin)));if(e-a<this.minRange){var p=this.dataMax-this.dataMin>=this.minRange;var A=this.minRange;var w=(A-e+a)/2;w=[a-w,u(b.min,a-w)];p&&(w[2]=this.logarithmic?this.logarithmic.log2lin(this.dataMin):this.dataMin);a=J(w);e=[a+A,u(b.max,a+A)];p&&(e[2]=f?f.log2lin(this.dataMax):this.dataMax);e=t(e);e-a<A&&(w[0]=e-A,w[1]=u(b.min,e-A),a=J(w));}this.min=a;this.max=e;};e.prototype.getClosest=function(){var b;
    this.categories?b=1:this.series.forEach(function(a){var h=a.closestPointRange,e=a.visible||!a.chart.options.chart.ignoreHiddenSeries;!a.noSharedTooltip&&v(h)&&e&&(b=v(b)?Math.min(b,h):h);});return b};e.prototype.nameToX=function(b){var a=m(this.categories),e=a?this.categories:this.names,f=b.options.x;b.series.requireSorting=!1;v(f)||(f=!1===this.options.uniqueNames?b.series.autoIncrement():a?e.indexOf(b.name):u(e.keys[b.name],-1));if(-1===f){if(!a)var d=e.length;}else d=f;"undefined"!==typeof d&&(this.names[d]=
    b.name,this.names.keys[b.name]=d);return d};e.prototype.updateNames=function(){var b=this,a=this.names;0<a.length&&(Object.keys(a.keys).forEach(function(b){delete a.keys[b];}),a.length=0,this.minRange=this.userMinRange,(this.series||[]).forEach(function(a){a.xIncrement=null;if(!a.points||a.isDirtyData)b.max=Math.max(b.max,a.xData.length-1),a.processData(),a.generatePoints();a.data.forEach(function(h,e){if(h&&h.options&&"undefined"!==typeof h.name){var f=b.nameToX(h);"undefined"!==typeof f&&f!==h.x&&
    (h.x=f,a.xData[e]=f);}});}));};e.prototype.setAxisTranslation=function(b){var a=this,e=a.max-a.min,f=a.axisPointRange||0,d=0,c=0,l=a.linkedParent,m=!!a.categories,p=a.transA,A=a.isXAxis;if(A||m||f){var w=a.getClosest();l?(d=l.minPointOffset,c=l.pointRangePadding):a.series.forEach(function(b){var h=m?1:A?u(b.options.pointRange,w,0):a.axisPointRange||0,e=b.options.pointPlacement;f=Math.max(f,h);if(!a.single||m)b=b.is("xrange")?!A:A,d=Math.max(d,b&&k(e)?0:h/2),c=Math.max(c,b&&"on"===e?0:h);});l=a.ordinal&&
    a.ordinal.slope&&w?a.ordinal.slope/w:1;a.minPointOffset=d*=l;a.pointRangePadding=c*=l;a.pointRange=Math.min(f,a.single&&m?1:e);A&&(a.closestPointRange=w);}b&&(a.oldTransA=p);a.translationSlope=a.transA=p=a.staticScale||a.len/(e+c||1);a.transB=a.horiz?a.left:a.bottom;a.minPixelPadding=p*d;C(this,"afterSetAxisTranslation");};e.prototype.minFromRange=function(){return this.max-this.range};e.prototype.setTickInterval=function(b){var h=this,e=h.chart,f=h.logarithmic,d=h.options,k=h.isXAxis,c=h.isLinked,
    m=d.maxPadding,A=d.minPadding,w=d.tickInterval,g=d.tickPixelInterval,E=h.categories,r=l(h.threshold)?h.threshold:null,S=h.softThreshold;h.dateTime||E||c||this.getTickAmount();var M=u(h.userMin,d.min);var F=u(h.userMax,d.max);if(c){h.linkedParent=e[h.coll][d.linkedTo];var t=h.linkedParent.getExtremes();h.min=u(t.min,t.dataMin);h.max=u(t.max,t.dataMax);d.type!==h.linkedParent.options.type&&n(11,1,e);}else{if(!S&&v(r))if(h.dataMin>=r)t=r,A=0;else if(h.dataMax<=r){var P=r;m=0;}h.min=u(M,t,h.dataMin);h.max=
    u(F,P,h.dataMax);}f&&(h.positiveValuesOnly&&!b&&0>=Math.min(h.min,u(h.dataMin,h.min))&&n(10,1,e),h.min=L(f.log2lin(h.min),16),h.max=L(f.log2lin(h.max),16));h.range&&v(h.max)&&(h.userMin=h.min=M=Math.max(h.dataMin,h.minFromRange()),h.userMax=F=h.max,h.range=null);C(h,"foundExtremes");h.beforePadding&&h.beforePadding();h.adjustForMinRange();!(E||h.axisPointRange||h.stacking&&h.stacking.usePercentage||c)&&v(h.min)&&v(h.max)&&(e=h.max-h.min)&&(!v(M)&&A&&(h.min-=e*A),!v(F)&&m&&(h.max+=e*m));l(h.userMin)||
    (l(d.softMin)&&d.softMin<h.min&&(h.min=M=d.softMin),l(d.floor)&&(h.min=Math.max(h.min,d.floor)));l(h.userMax)||(l(d.softMax)&&d.softMax>h.max&&(h.max=F=d.softMax),l(d.ceiling)&&(h.max=Math.min(h.max,d.ceiling)));S&&v(h.dataMin)&&(r=r||0,!v(M)&&h.min<r&&h.dataMin>=r?h.min=h.options.minRange?Math.min(r,h.max-h.minRange):r:!v(F)&&h.max>r&&h.dataMax<=r&&(h.max=h.options.minRange?Math.max(r,h.min+h.minRange):r));h.tickInterval=h.min===h.max||"undefined"===typeof h.min||"undefined"===typeof h.max?1:c&&
    !w&&g===h.linkedParent.options.tickPixelInterval?w=h.linkedParent.tickInterval:u(w,this.tickAmount?(h.max-h.min)/Math.max(this.tickAmount-1,1):void 0,E?1:(h.max-h.min)*g/Math.max(h.len,g));k&&!b&&h.series.forEach(function(b){b.processData(h.min!==h.oldMin||h.max!==h.oldMax);});h.setAxisTranslation(!0);C(this,"initialAxisTranslation");h.pointRange&&!w&&(h.tickInterval=Math.max(h.pointRange,h.tickInterval));b=u(d.minTickInterval,h.dateTime&&!h.series.some(function(b){return b.noSharedTooltip})?h.closestPointRange:
    0);!w&&h.tickInterval<b&&(h.tickInterval=b);h.dateTime||h.logarithmic||w||(h.tickInterval=a(h.tickInterval,void 0,p(h.tickInterval),u(d.allowDecimals,.5>h.tickInterval||void 0!==this.tickAmount),!!this.tickAmount));this.tickAmount||(h.tickInterval=h.unsquish());this.setTickPositions();};e.prototype.setTickPositions=function(){var b=this.options,a=b.tickPositions;var e=this.getMinorTickInterval();var f=b.tickPositioner,d=this.hasVerticalPanning(),k="colorAxis"===this.coll,c=(k||!d)&&b.startOnTick;d=
    (k||!d)&&b.endOnTick;this.tickmarkOffset=this.categories&&"between"===b.tickmarkPlacement&&1===this.tickInterval?.5:0;this.minorTickInterval="auto"===e&&this.tickInterval?this.tickInterval/5:e;this.single=this.min===this.max&&v(this.min)&&!this.tickAmount&&(parseInt(this.min,10)===this.min||!1!==b.allowDecimals);this.tickPositions=e=a&&a.slice();!e&&(this.ordinal&&this.ordinal.positions||!((this.max-this.min)/this.tickInterval>Math.max(2*this.len,200))?e=this.dateTime?this.getTimeTicks(this.dateTime.normalizeTimeTickInterval(this.tickInterval,
    b.units),this.min,this.max,b.startOfWeek,this.ordinal&&this.ordinal.positions,this.closestPointRange,!0):this.logarithmic?this.logarithmic.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max):(e=[this.min,this.max],n(19,!1,this.chart)),e.length>this.len&&(e=[e[0],e.pop()],e[0]===e[1]&&(e.length=1)),this.tickPositions=e,f&&(f=f.apply(this,[this.min,this.max])))&&(this.tickPositions=e=f);this.paddedTicks=e.slice(0);this.trimTicks(e,
    c,d);this.isLinked||(this.single&&2>e.length&&!this.categories&&!this.series.some(function(b){return b.is("heatmap")&&"between"===b.options.pointPlacement})&&(this.min-=.5,this.max+=.5),a||f||this.adjustTickAmount());C(this,"afterSetTickPositions");};e.prototype.trimTicks=function(b,a,e){var h=b[0],f=b[b.length-1],d=!this.isOrdinal&&this.minPointOffset||0;C(this,"trimTicks");if(!this.isLinked){if(a&&-Infinity!==h)this.min=h;else for(;this.min-d>b[0];)b.shift();if(e)this.max=f;else for(;this.max+d<
    b[b.length-1];)b.pop();0===b.length&&v(h)&&!this.options.tickPositions&&b.push((f+h)/2);}};e.prototype.alignToOthers=function(){var b={},a,e=this.options;!1===this.chart.options.chart.alignTicks||!1===e.alignTicks||!1===e.startOnTick||!1===e.endOnTick||this.logarithmic||this.chart[this.coll].forEach(function(h){var e=h.options;e=[h.horiz?e.left:e.top,e.width,e.height,e.pane].join();h.series.length&&(b[e]?a=!0:b[e]=1);});return a};e.prototype.getTickAmount=function(){var b=this.options,a=b.tickAmount,
    e=b.tickPixelInterval;!v(b.tickInterval)&&!a&&this.len<e&&!this.isRadial&&!this.logarithmic&&b.startOnTick&&b.endOnTick&&(a=2);!a&&this.alignToOthers()&&(a=Math.ceil(this.len/e)+1);4>a&&(this.finalTickAmt=a,a=5);this.tickAmount=a;};e.prototype.adjustTickAmount=function(){var b=this.options,a=this.tickInterval,e=this.tickPositions,f=this.tickAmount,d=this.finalTickAmt,k=e&&e.length,c=u(this.threshold,this.softThreshold?0:null),l;if(this.hasData()){if(k<f){for(l=this.min;e.length<f;)e.length%2||l===
    c?e.push(L(e[e.length-1]+a)):e.unshift(L(e[0]-a));this.transA*=(k-1)/(f-1);this.min=b.startOnTick?e[0]:Math.min(this.min,e[0]);this.max=b.endOnTick?e[e.length-1]:Math.max(this.max,e[e.length-1]);}else k>f&&(this.tickInterval*=2,this.setTickPositions());if(v(d)){for(a=b=e.length;a--;)(3===d&&1===a%2||2>=d&&0<a&&a<b-1)&&e.splice(a,1);this.finalTickAmt=void 0;}}};e.prototype.setScale=function(){var b,a=!1,e=!1;this.series.forEach(function(b){var h;a=a||b.isDirtyData||b.isDirty;e=e||(null===(h=b.xAxis)||
    void 0===h?void 0:h.isDirty)||!1;});this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();(b=this.len!==this.oldAxisLength)||a||e||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax||this.alignToOthers()?(this.stacking&&this.stacking.resetStacks(),this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,this.isDirty||(this.isDirty=b||this.min!==this.oldMin||
    this.max!==this.oldMax)):this.stacking&&this.stacking.cleanStacks();a&&this.panningState&&(this.panningState.isDirty=!0);C(this,"afterSetScale");};e.prototype.setExtremes=function(b,a,e,f,d){var h=this,k=h.chart;e=u(e,!0);h.series.forEach(function(b){delete b.kdTree;});d=r(d,{min:b,max:a});C(h,"setExtremes",d,function(){h.userMin=b;h.userMax=a;h.eventArgs=d;e&&k.redraw(f);});};e.prototype.zoom=function(b,a){var e=this,h=this.dataMin,f=this.dataMax,d=this.options,k=Math.min(h,u(d.min,h)),c=Math.max(f,
    u(d.max,f));b={newMin:b,newMax:a};C(this,"zoom",b,function(b){var a=b.newMin,d=b.newMax;if(a!==e.min||d!==e.max)e.allowZoomOutside||(v(h)&&(a<k&&(a=k),a>c&&(a=c)),v(f)&&(d<k&&(d=k),d>c&&(d=c))),e.displayBtn="undefined"!==typeof a||"undefined"!==typeof d,e.setExtremes(a,d,!1,void 0,{trigger:"zoom"});b.zoomed=!0;});return b.zoomed};e.prototype.setAxisSize=function(){var b=this.chart,a=this.options,e=a.offsets||[0,0,0,0],f=this.horiz,d=this.width=Math.round(E(u(a.width,b.plotWidth-e[3]+e[1]),b.plotWidth)),
    k=this.height=Math.round(E(u(a.height,b.plotHeight-e[0]+e[2]),b.plotHeight)),c=this.top=Math.round(E(u(a.top,b.plotTop+e[0]),b.plotHeight,b.plotTop));a=this.left=Math.round(E(u(a.left,b.plotLeft+e[3]),b.plotWidth,b.plotLeft));this.bottom=b.chartHeight-k-c;this.right=b.chartWidth-d-a;this.len=Math.max(f?d:k,0);this.pos=f?a:c;};e.prototype.getExtremes=function(){var b=this.logarithmic;return {min:b?L(b.lin2log(this.min)):this.min,max:b?L(b.lin2log(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,
    userMin:this.userMin,userMax:this.userMax}};e.prototype.getThreshold=function(b){var a=this.logarithmic,e=a?a.lin2log(this.min):this.min;a=a?a.lin2log(this.max):this.max;null===b||-Infinity===b?b=e:Infinity===b?b=a:e>b?b=e:a<b&&(b=a);return this.translate(b,0,1,0,1)};e.prototype.autoLabelAlign=function(b){var a=(u(b,0)-90*this.side+720)%360;b={align:"center"};C(this,"autoLabelAlign",b,function(b){15<a&&165>a?b.align="right":195<a&&345>a&&(b.align="left");});return b.align};e.prototype.tickSize=function(b){var a=
    this.options,e=a["tick"===b?"tickLength":"minorTickLength"],f=u(a["tick"===b?"tickWidth":"minorTickWidth"],"tick"===b&&this.isXAxis&&!this.categories?1:0);if(f&&e){"inside"===a[b+"Position"]&&(e=-e);var d=[e,f];}b={tickSize:d};C(this,"afterTickSize",b);return b.tickSize};e.prototype.labelMetrics=function(){var b=this.tickPositions&&this.tickPositions[0]||0;return this.chart.renderer.fontMetrics(this.options.labels.style&&this.options.labels.style.fontSize,this.ticks[b]&&this.ticks[b].label)};e.prototype.unsquish=
    function(){var b=this.options.labels,a=this.horiz,e=this.tickInterval,f=e,d=this.len/(((this.categories?1:0)+this.max-this.min)/e),k,c=b.rotation,l=this.labelMetrics(),m,p=Number.MAX_VALUE,A,w=this.max-this.min,n=function(b){var a=b/(d||1);a=1<a?Math.ceil(a):1;a*e>w&&Infinity!==b&&Infinity!==d&&w&&(a=Math.ceil(w/e));return L(a*e)};a?(A=!b.staggerLines&&!b.step&&(v(c)?[c]:d<u(b.autoRotationLimit,80)&&b.autoRotation))&&A.forEach(function(b){if(b===c||b&&-90<=b&&90>=b){m=n(Math.abs(l.h/Math.sin(Q*b)));
    var a=m+Math.abs(b/360);a<p&&(p=a,k=b,f=m);}}):b.step||(f=n(l.h));this.autoRotation=A;this.labelRotation=u(k,c);return f};e.prototype.getSlotWidth=function(b){var a,e=this.chart,f=this.horiz,d=this.options.labels,k=Math.max(this.tickPositions.length-(this.categories?0:1),1),c=e.margin[3];if(b&&l(b.slotWidth))return b.slotWidth;if(f&&d&&2>(d.step||0))return d.rotation?0:(this.staggerLines||1)*this.len/k;if(!f){b=null===(a=null===d||void 0===d?void 0:d.style)||void 0===a?void 0:a.width;if(void 0!==b)return parseInt(b,
    10);if(c)return c-e.spacing[3]}return .33*e.chartWidth};e.prototype.renderUnsquish=function(){var b=this.chart,a=b.renderer,e=this.tickPositions,f=this.ticks,d=this.options.labels,c=d&&d.style||{},l=this.horiz,u=this.getSlotWidth(),m=Math.max(1,Math.round(u-2*(d.padding||5))),p={},A=this.labelMetrics(),w=d.style&&d.style.textOverflow,n=0;k(d.rotation)||(p.rotation=d.rotation||0);e.forEach(function(b){b=f[b];b.movedLabel&&b.replaceMovedLabel();b&&b.label&&b.label.textPxLength>n&&(n=b.label.textPxLength);});
    this.maxLabelLength=n;if(this.autoRotation)n>m&&n>A.h?p.rotation=this.labelRotation:this.labelRotation=0;else if(u){var g=m;if(!w){var E="clip";for(m=e.length;!l&&m--;){var r=e[m];if(r=f[r].label)r.styles&&"ellipsis"===r.styles.textOverflow?r.css({textOverflow:"clip"}):r.textPxLength>u&&r.css({width:u+"px"}),r.getBBox().height>this.len/e.length-(A.h-A.f)&&(r.specificTextOverflow="ellipsis");}}}p.rotation&&(g=n>.5*b.chartHeight?.33*b.chartHeight:n,w||(E="ellipsis"));if(this.labelAlign=d.align||this.autoLabelAlign(this.labelRotation))p.align=
    this.labelAlign;e.forEach(function(b){var a=(b=f[b])&&b.label,e=c.width,h={};a&&(a.attr(p),b.shortenLabel?b.shortenLabel():g&&!e&&"nowrap"!==c.whiteSpace&&(g<a.textPxLength||"SPAN"===a.element.tagName)?(h.width=g+"px",w||(h.textOverflow=a.specificTextOverflow||E),a.css(h)):a.styles&&a.styles.width&&!h.width&&!e&&a.css({width:null}),delete a.specificTextOverflow,b.rotation=p.rotation);},this);this.tickRotCorr=a.rotCorr(A.b,this.labelRotation||0,0!==this.side);};e.prototype.hasData=function(){return this.series.some(function(b){return b.hasData()})||
    this.options.showEmpty&&v(this.min)&&v(this.max)};e.prototype.addTitle=function(b){var a=this.chart.renderer,e=this.horiz,d=this.opposite,k=this.options.title,c,l=this.chart.styledMode;this.axisTitle||((c=k.textAlign)||(c=(e?{low:"left",middle:"center",high:"right"}:{low:d?"right":"left",middle:"center",high:d?"left":"right"})[k.align]),this.axisTitle=a.text(k.text,0,0,k.useHTML).attr({zIndex:7,rotation:k.rotation||0,align:c}).addClass("highcharts-axis-title"),l||this.axisTitle.css(f(k.style)),this.axisTitle.add(this.axisGroup),
    this.axisTitle.isNew=!0);l||k.style.width||this.isRadial||this.axisTitle.css({width:this.len+"px"});this.axisTitle[b?"show":"hide"](b);};e.prototype.generateTick=function(b){var a=this.ticks;a[b]?a[b].addLabel():a[b]=new q(this,b);};e.prototype.getOffset=function(){var b=this,a=b.chart,e=a.renderer,f=b.options,d=b.tickPositions,k=b.ticks,c=b.horiz,l=b.side,m=a.inverted&&!b.isZAxis?[1,0,3,2][l]:l,p,w=0,n=0,g=f.title,E=f.labels,r=0,M=a.axisOffset;a=a.clipOffset;var F=[-1,1,1,-1][l],t=f.className,P=b.axisParent;
    var I=b.hasData();b.showAxis=p=I||u(f.showEmpty,!0);b.staggerLines=b.horiz&&E.staggerLines;b.axisGroup||(b.gridGroup=e.g("grid").attr({zIndex:f.gridZIndex||1}).addClass("highcharts-"+this.coll.toLowerCase()+"-grid "+(t||"")).add(P),b.axisGroup=e.g("axis").attr({zIndex:f.zIndex||2}).addClass("highcharts-"+this.coll.toLowerCase()+" "+(t||"")).add(P),b.labelGroup=e.g("axis-labels").attr({zIndex:E.zIndex||7}).addClass("highcharts-"+b.coll.toLowerCase()+"-labels "+(t||"")).add(P));I||b.isLinked?(d.forEach(function(a,
    e){b.generateTick(a,e);}),b.renderUnsquish(),b.reserveSpaceDefault=0===l||2===l||{1:"left",3:"right"}[l]===b.labelAlign,u(E.reserveSpace,"center"===b.labelAlign?!0:null,b.reserveSpaceDefault)&&d.forEach(function(b){r=Math.max(k[b].getLabelSize(),r);}),b.staggerLines&&(r*=b.staggerLines),b.labelOffset=r*(b.opposite?-1:1)):A(k,function(b,a){b.destroy();delete k[a];});if(g&&g.text&&!1!==g.enabled&&(b.addTitle(p),p&&!1!==g.reserveSpace)){b.titleOffset=w=b.axisTitle.getBBox()[c?"height":"width"];var q=g.offset;
    n=v(q)?0:u(g.margin,c?5:10);}b.renderLine();b.offset=F*u(f.offset,M[l]?M[l]+(f.margin||0):0);b.tickRotCorr=b.tickRotCorr||{x:0,y:0};e=0===l?-b.labelMetrics().h:2===l?b.tickRotCorr.y:0;n=Math.abs(r)+n;r&&(n=n-e+F*(c?u(E.y,b.tickRotCorr.y+8*F):E.x));b.axisTitleMargin=u(q,n);b.getMaxLabelDimensions&&(b.maxLabelDimensions=b.getMaxLabelDimensions(k,d));c=this.tickSize("tick");M[l]=Math.max(M[l],b.axisTitleMargin+w+F*b.offset,n,d&&d.length&&c?c[0]+F*b.offset:0);f=f.offset?0:2*Math.floor(b.axisLine.strokeWidth()/
    2);a[m]=Math.max(a[m],f);C(this,"afterGetOffset");};e.prototype.getLinePath=function(b){var a=this.chart,e=this.opposite,f=this.offset,d=this.horiz,k=this.left+(e?this.width:0)+f;f=a.chartHeight-this.bottom-(e?this.height:0)+f;e&&(b*=-1);return a.renderer.crispLine([["M",d?this.left:k,d?f:this.top],["L",d?a.chartWidth-this.right:k,d?f:a.chartHeight-this.bottom]],b)};e.prototype.renderLine=function(){this.axisLine||(this.axisLine=this.chart.renderer.path().addClass("highcharts-axis-line").add(this.axisGroup),
    this.chart.styledMode||this.axisLine.attr({stroke:this.options.lineColor,"stroke-width":this.options.lineWidth,zIndex:7}));};e.prototype.getTitlePosition=function(){var b=this.horiz,a=this.left,e=this.top,f=this.len,d=this.options.title,k=b?a:e,c=this.opposite,l=this.offset,u=d.x||0,m=d.y||0,p=this.axisTitle,A=this.chart.renderer.fontMetrics(d.style&&d.style.fontSize,p);p=Math.max(p.getBBox(null,0).height-A.h-1,0);f={low:k+(b?0:f),middle:k+f/2,high:k+(b?f:0)}[d.align];a=(b?e+this.height:a)+(b?1:-1)*
    (c?-1:1)*this.axisTitleMargin+[-p,p,A.f,-p][this.side];b={x:b?f+u:a+(c?this.width:0)+l+u,y:b?a+m-(c?this.height:0)+l:f+m};C(this,"afterGetTitlePosition",{titlePosition:b});return b};e.prototype.renderMinorTick=function(b){var a=this.chart.hasRendered&&l(this.oldMin),e=this.minorTicks;e[b]||(e[b]=new q(this,b,"minor"));a&&e[b].isNew&&e[b].render(null,!0);e[b].render(null,!1,1);};e.prototype.renderTick=function(b,a){var e=this.isLinked,h=this.ticks,f=this.chart.hasRendered&&l(this.oldMin);if(!e||b>=
    this.min&&b<=this.max)h[b]||(h[b]=new q(this,b)),f&&h[b].isNew&&h[b].render(a,!0,-1),h[b].render(a);};e.prototype.render=function(){var b=this,a=b.chart,e=b.logarithmic,f=b.options,d=b.isLinked,k=b.tickPositions,u=b.axisTitle,m=b.ticks,p=b.minorTicks,w=b.alternateBands,n=f.stackLabels,g=f.alternateGridColor,E=b.tickmarkOffset,r=b.axisLine,F=b.showAxis,t=D(a.renderer.globalAnimation),v,P;b.labelEdge.length=0;b.overlap=!1;[m,p,w].forEach(function(b){A(b,function(b){b.isActive=!1;});});if(b.hasData()||
    d)b.minorTickInterval&&!b.categories&&b.getMinorTickPositions().forEach(function(a){b.renderMinorTick(a);}),k.length&&(k.forEach(function(a,e){b.renderTick(a,e);}),E&&(0===b.min||b.single)&&(m[-1]||(m[-1]=new q(b,-1,null,!0)),m[-1].render(-1))),g&&k.forEach(function(h,f){P="undefined"!==typeof k[f+1]?k[f+1]+E:b.max-E;0===f%2&&h<b.max&&P<=b.max+(a.polar?-E:E)&&(w[h]||(w[h]=new c.PlotLineOrBand(b)),v=h+E,w[h].options={from:e?e.lin2log(v):v,to:e?e.lin2log(P):P,color:g,className:"highcharts-alternate-grid"},
    w[h].render(),w[h].isActive=!0);}),b._addedPlotLB||((f.plotLines||[]).concat(f.plotBands||[]).forEach(function(a){b.addPlotBandOrLine(a);}),b._addedPlotLB=!0);[m,p,w].forEach(function(b){var e,h=[],f=t.duration;A(b,function(b,a){b.isActive||(b.render(a,!1,0),b.isActive=!1,h.push(a));});M(function(){for(e=h.length;e--;)b[h[e]]&&!b[h[e]].isActive&&(b[h[e]].destroy(),delete b[h[e]]);},b!==w&&a.hasRendered&&f?f:0);});r&&(r[r.isPlaced?"animate":"attr"]({d:this.getLinePath(r.strokeWidth())}),r.isPlaced=!0,r[F?
    "show":"hide"](F));u&&F&&(f=b.getTitlePosition(),l(f.y)?(u[u.isNew?"attr":"animate"](f),u.isNew=!1):(u.attr("y",-9999),u.isNew=!0));n&&n.enabled&&b.stacking&&b.stacking.renderStackTotals();b.isDirty=!1;C(this,"afterRender");};e.prototype.redraw=function(){this.visible&&(this.render(),this.plotLinesAndBands.forEach(function(b){b.render();}));this.series.forEach(function(b){b.isDirty=!0;});};e.prototype.getKeepProps=function(){return this.keepProps||e.keepProps};e.prototype.destroy=function(b){var a=this,
    e=a.plotLinesAndBands,f;C(this,"destroy",{keepEvents:b});b||P(a);[a.ticks,a.minorTicks,a.alternateBands].forEach(function(b){K(b);});if(e)for(b=e.length;b--;)e[b].destroy();"axisLine axisTitle axisGroup gridGroup labelGroup cross scrollbar".split(" ").forEach(function(b){a[b]&&(a[b]=a[b].destroy());});for(f in a.plotLinesAndBandsGroups)a.plotLinesAndBandsGroups[f]=a.plotLinesAndBandsGroups[f].destroy();A(a,function(b,e){-1===a.getKeepProps().indexOf(e)&&delete a[e];});};e.prototype.drawCrosshair=function(b,
    a){var e=this.crosshair,h=u(e.snap,!0),f,d=this.cross,k=this.chart;C(this,"drawCrosshair",{e:b,point:a});b||(b=this.cross&&this.cross.e);if(this.crosshair&&!1!==(v(a)||!h)){h?v(a)&&(f=u("colorAxis"!==this.coll?a.crosshairPos:null,this.isXAxis?a.plotX:this.len-a.plotY)):f=b&&(this.horiz?b.chartX-this.pos:this.len-b.chartY+this.pos);if(v(f)){var c={value:a&&(this.isXAxis?a.x:u(a.stackY,a.y)),translatedValue:f};k.polar&&r(c,{isCrosshair:!0,chartX:b&&b.chartX,chartY:b&&b.chartY,point:a});c=this.getPlotLinePath(c)||
    null;}if(!v(c)){this.hideCrosshair();return}h=this.categories&&!this.isRadial;d||(this.cross=d=k.renderer.path().addClass("highcharts-crosshair highcharts-crosshair-"+(h?"category ":"thin ")+e.className).attr({zIndex:u(e.zIndex,2)}).add(),k.styledMode||(d.attr({stroke:e.color||(h?g.parse("#ccd6eb").setOpacity(.25).get():"#cccccc"),"stroke-width":u(e.width,1)}).css({"pointer-events":"none"}),e.dashStyle&&d.attr({dashstyle:e.dashStyle})));d.show().attr({d:c});h&&!e.width&&d.attr({"stroke-width":this.transA});
    this.cross.e=b;}else this.hideCrosshair();C(this,"afterDrawCrosshair",{e:b,point:a});};e.prototype.hideCrosshair=function(){this.cross&&this.cross.hide();C(this,"afterHideCrosshair");};e.prototype.hasVerticalPanning=function(){var b,a;return /y/.test((null===(a=null===(b=this.chart.options.chart)||void 0===b?void 0:b.panning)||void 0===a?void 0:a.type)||"")};e.defaultOptions={dateTimeLabelFormats:{millisecond:{main:"%H:%M:%S.%L",range:!1},second:{main:"%H:%M:%S",range:!1},minute:{main:"%H:%M",range:!1},
    hour:{main:"%H:%M",range:!1},day:{main:"%e. %b"},week:{main:"%e. %b"},month:{main:"%b '%y"},year:{main:"%Y"}},endOnTick:!1,labels:{enabled:!0,indentation:10,x:0,style:{color:"#666666",cursor:"default",fontSize:"11px"}},maxPadding:.01,minorTickLength:2,minorTickPosition:"outside",minPadding:.01,showEmpty:!0,startOfWeek:1,startOnTick:!1,tickLength:10,tickPixelInterval:100,tickmarkPlacement:"between",tickPosition:"outside",title:{align:"middle",style:{color:"#666666"}},type:"linear",minorGridLineColor:"#f2f2f2",
    minorGridLineWidth:1,minorTickColor:"#999999",lineColor:"#ccd6eb",lineWidth:1,gridLineColor:"#e6e6e6",tickColor:"#ccd6eb"};e.defaultYAxisOptions={endOnTick:!0,maxPadding:.05,minPadding:.05,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8},startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{allowOverlap:!1,enabled:!1,crop:!0,overflow:"justify",formatter:function(){var b=this.axis.chart.numberFormatter;return b(this.total,-1)},style:{color:"#000000",fontSize:"11px",fontWeight:"bold",textOutline:"1px contrast"}},
    gridLineWidth:1,lineWidth:0};e.defaultLeftAxisOptions={labels:{x:-15},title:{rotation:270}};e.defaultRightAxisOptions={labels:{x:15},title:{rotation:90}};e.defaultBottomAxisOptions={labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}};e.defaultTopAxisOptions={labels:{autoRotation:[-45],x:0},margin:15,title:{rotation:0}};e.keepProps="extKey hcEvents names series userMax userMin".split(" ");return e}();c.Axis=y;return c.Axis});O(q,"parts/DateTimeAxis.js",[q["parts/Axis.js"],q["parts/Utilities.js"]],
    function(g,c){var q=c.addEvent,y=c.getMagnitude,B=c.normalizeTickInterval,H=c.timeUnits,D=function(){function c(c){this.axis=c;}c.prototype.normalizeTimeTickInterval=function(c,g){var t=g||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]];g=t[t.length-1];var v=H[g[0]],q=g[1],n;for(n=0;n<t.length&&!(g=t[n],v=H[g[0]],q=g[1],t[n+1]&&c<=(v*q[q.length-1]+H[t[n+
    1][0]])/2);n++);v===H.year&&c<5*v&&(q=[1,2,5]);c=B(c/v,q,"year"===g[0]?Math.max(y(c/v),1):1);return {unitRange:v,count:c,unitName:g[0]}};return c}();c=function(){function c(){}c.compose=function(c){c.keepProps.push("dateTime");c.prototype.getTimeTicks=function(){return this.chart.time.getTimeTicks.apply(this.chart.time,arguments)};q(c,"init",function(c){"datetime"!==c.userOptions.type?this.dateTime=void 0:this.dateTime||(this.dateTime=new D(this));});};c.AdditionsClass=D;return c}();c.compose(g);return c});
    O(q,"parts/LogarithmicAxis.js",[q["parts/Axis.js"],q["parts/Utilities.js"]],function(g,c){var q=c.addEvent,y=c.getMagnitude,B=c.normalizeTickInterval,H=c.pick,D=function(){function c(c){this.axis=c;}c.prototype.getLogTickPositions=function(c,g,q,v){var t=this.axis,n=t.len,r=t.options,C=[];v||(this.minorAutoInterval=void 0);if(.5<=c)c=Math.round(c),C=t.getLinearTickPositions(c,g,q);else if(.08<=c){r=Math.floor(g);var I,p;for(n=.3<c?[1,2,4]:.15<c?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];r<q+1&&!p;r++){var m=
    n.length;for(I=0;I<m&&!p;I++){var d=this.log2lin(this.lin2log(r)*n[I]);d>g&&(!v||l<=q)&&"undefined"!==typeof l&&C.push(l);l>q&&(p=!0);var l=d;}}}else g=this.lin2log(g),q=this.lin2log(q),c=v?t.getMinorTickInterval():r.tickInterval,c=H("auto"===c?null:c,this.minorAutoInterval,r.tickPixelInterval/(v?5:1)*(q-g)/((v?n/t.tickPositions.length:n)||1)),c=B(c,void 0,y(c)),C=t.getLinearTickPositions(c,g,q).map(this.log2lin),v||(this.minorAutoInterval=c/5);v||(t.tickInterval=c);return C};c.prototype.lin2log=function(c){return Math.pow(10,
    c)};c.prototype.log2lin=function(c){return Math.log(c)/Math.LN10};return c}();c=function(){function c(){}c.compose=function(c){c.keepProps.push("logarithmic");var g=c.prototype,t=D.prototype;g.log2lin=t.log2lin;g.lin2log=t.lin2log;q(c,"init",function(c){var g=this.logarithmic;"logarithmic"!==c.userOptions.type?this.logarithmic=void 0:(g||(g=this.logarithmic=new D(this)),this.log2lin!==g.log2lin&&(g.log2lin=this.log2lin.bind(this)),this.lin2log!==g.lin2log&&(g.lin2log=this.lin2log.bind(this)));});q(c,
    "afterInit",function(){var c=this.logarithmic;c&&(this.lin2val=function(g){return c.lin2log(g)},this.val2lin=function(g){return c.log2lin(g)});});};return c}();c.compose(g);return c});O(q,"parts/PlotLineOrBand.js",[q["parts/Axis.js"],q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c,q){var y=q.arrayMax,B=q.arrayMin,H=q.defined,D=q.destroyObjectProperties,J=q.erase,t=q.extend,G=q.merge,L=q.objectEach,v=q.pick,K=function(){function n(c,n){this.axis=c;n&&(this.options=n,this.id=n.id);}n.prototype.render=
    function(){c.fireEvent(this,"render");var n=this,g=n.axis,t=g.horiz,p=g.logarithmic,m=n.options,d=m.label,l=n.label,k=m.to,f=m.from,a=m.value,A=H(f)&&H(k),u=H(a),E=n.svgElem,P=!E,w=[],M=m.color,F=v(m.zIndex,0),q=m.events;w={"class":"highcharts-plot-"+(A?"band ":"line ")+(m.className||"")};var e={},b=g.chart.renderer,h=A?"bands":"lines";p&&(f=p.log2lin(f),k=p.log2lin(k),a=p.log2lin(a));g.chart.styledMode||(u?(w.stroke=M||"#999999",w["stroke-width"]=v(m.width,1),m.dashStyle&&(w.dashstyle=m.dashStyle)):
    A&&(w.fill=M||"#e6ebf5",m.borderWidth&&(w.stroke=m.borderColor,w["stroke-width"]=m.borderWidth)));e.zIndex=F;h+="-"+F;(p=g.plotLinesAndBandsGroups[h])||(g.plotLinesAndBandsGroups[h]=p=b.g("plot-"+h).attr(e).add());P&&(n.svgElem=E=b.path().attr(w).add(p));if(u)w=g.getPlotLinePath({value:a,lineWidth:E.strokeWidth(),acrossPanes:m.acrossPanes});else if(A)w=g.getPlotBandPath(f,k,m);else return;!n.eventsAdded&&q&&(L(q,function(b,a){E.on(a,function(b){q[a].apply(n,[b]);});}),n.eventsAdded=!0);(P||!E.d)&&w&&
    w.length?E.attr({d:w}):E&&(w?(E.show(!0),E.animate({d:w})):E.d&&(E.hide(),l&&(n.label=l=l.destroy())));d&&(H(d.text)||H(d.formatter))&&w&&w.length&&0<g.width&&0<g.height&&!w.isFlat?(d=G({align:t&&A&&"center",x:t?!A&&4:10,verticalAlign:!t&&A&&"middle",y:t?A?16:10:A?6:-4,rotation:t&&!A&&90},d),this.renderLabel(d,w,A,F)):l&&l.hide();return n};n.prototype.renderLabel=function(c,n,g,p){var m=this.label,d=this.axis.chart.renderer;m||(m={align:c.textAlign||c.align,rotation:c.rotation,"class":"highcharts-plot-"+
    (g?"band":"line")+"-label "+(c.className||"")},m.zIndex=p,p=this.getLabelText(c),this.label=m=d.text(p,0,0,c.useHTML).attr(m).add(),this.axis.chart.styledMode||m.css(c.style));d=n.xBounds||[n[0][1],n[1][1],g?n[2][1]:n[0][1]];n=n.yBounds||[n[0][2],n[1][2],g?n[2][2]:n[0][2]];g=B(d);p=B(n);m.align(c,!1,{x:g,y:p,width:y(d)-g,height:y(n)-p});m.show(!0);};n.prototype.getLabelText=function(c){return H(c.formatter)?c.formatter.call(this):c.text};n.prototype.destroy=function(){J(this.axis.plotLinesAndBands,
    this);delete this.axis;D(this);};return n}();t(g.prototype,{getPlotBandPath:function(c,g){var n=this.getPlotLinePath({value:g,force:!0,acrossPanes:this.options.acrossPanes}),r=this.getPlotLinePath({value:c,force:!0,acrossPanes:this.options.acrossPanes}),p=[],m=this.horiz,d=1;c=c<this.min&&g<this.min||c>this.max&&g>this.max;if(r&&n){if(c){var l=r.toString()===n.toString();d=0;}for(c=0;c<r.length;c+=2){g=r[c];var k=r[c+1],f=n[c],a=n[c+1];"M"!==g[0]&&"L"!==g[0]||"M"!==k[0]&&"L"!==k[0]||"M"!==f[0]&&"L"!==
    f[0]||"M"!==a[0]&&"L"!==a[0]||(m&&f[1]===g[1]?(f[1]+=d,a[1]+=d):m||f[2]!==g[2]||(f[2]+=d,a[2]+=d),p.push(["M",g[1],g[2]],["L",k[1],k[2]],["L",a[1],a[2]],["L",f[1],f[2]],["Z"]));p.isFlat=l;}}return p},addPlotBand:function(c){return this.addPlotBandOrLine(c,"plotBands")},addPlotLine:function(c){return this.addPlotBandOrLine(c,"plotLines")},addPlotBandOrLine:function(c,g){var n=(new K(this,c)).render(),r=this.userOptions;if(n){if(g){var p=r[g]||[];p.push(c);r[g]=p;}this.plotLinesAndBands.push(n);this._addedPlotLB=
    !0;}return n},removePlotBandOrLine:function(c){for(var n=this.plotLinesAndBands,g=this.options,t=this.userOptions,p=n.length;p--;)n[p].id===c&&n[p].destroy();[g.plotLines||[],t.plotLines||[],g.plotBands||[],t.plotBands||[]].forEach(function(m){for(p=m.length;p--;)(m[p]||{}).id===c&&J(m,m[p]);});},removePlotBand:function(c){this.removePlotBandOrLine(c);},removePlotLine:function(c){this.removePlotBandOrLine(c);}});c.PlotLineOrBand=K;return c.PlotLineOrBand});O(q,"parts/Tooltip.js",[q["parts/Globals.js"],
    q["parts/Utilities.js"]],function(g,c){var q=g.doc,y=c.clamp,B=c.css,H=c.defined,D=c.discardElement,J=c.extend,t=c.fireEvent,G=c.format,L=c.isNumber,v=c.isString,K=c.merge,n=c.pick,r=c.splat,C=c.syncTimeout,I=c.timeUnits;var p=function(){function m(d,c){this.container=void 0;this.crosshairs=[];this.distance=0;this.isHidden=!0;this.isSticky=!1;this.now={};this.options={};this.outside=!1;this.chart=d;this.init(d,c);}m.prototype.applyFilter=function(){var d=this.chart;d.renderer.definition({tagName:"filter",
    id:"drop-shadow-"+d.index,opacity:.5,children:[{tagName:"feGaussianBlur","in":"SourceAlpha",stdDeviation:1},{tagName:"feOffset",dx:1,dy:1},{tagName:"feComponentTransfer",children:[{tagName:"feFuncA",type:"linear",slope:.3}]},{tagName:"feMerge",children:[{tagName:"feMergeNode"},{tagName:"feMergeNode","in":"SourceGraphic"}]}]});d.renderer.definition({tagName:"style",textContent:".highcharts-tooltip-"+d.index+"{filter:url(#drop-shadow-"+d.index+")}"});};m.prototype.bodyFormatter=function(d){return d.map(function(d){var k=
    d.series.tooltipOptions;return (k[(d.point.formatPrefix||"point")+"Formatter"]||d.point.tooltipFormatter).call(d.point,k[(d.point.formatPrefix||"point")+"Format"]||"")})};m.prototype.cleanSplit=function(d){this.chart.series.forEach(function(c){var k=c&&c.tt;k&&(!k.isActive||d?c.tt=k.destroy():k.isActive=!1);});};m.prototype.defaultFormatter=function(d){var c=this.points||r(this);var k=[d.tooltipFooterHeaderFormatter(c[0])];k=k.concat(d.bodyFormatter(c));k.push(d.tooltipFooterHeaderFormatter(c[0],!0));
    return k};m.prototype.destroy=function(){this.label&&(this.label=this.label.destroy());this.split&&this.tt&&(this.cleanSplit(this.chart,!0),this.tt=this.tt.destroy());this.renderer&&(this.renderer=this.renderer.destroy(),D(this.container));c.clearTimeout(this.hideTimer);c.clearTimeout(this.tooltipTimeout);};m.prototype.getAnchor=function(d,c){var k=this.chart,f=k.pointer,a=k.inverted,l=k.plotTop,u=k.plotLeft,m=0,p=0,w,n;d=r(d);this.followPointer&&c?("undefined"===typeof c.chartX&&(c=f.normalize(c)),
    d=[c.chartX-u,c.chartY-l]):d[0].tooltipPos?d=d[0].tooltipPos:(d.forEach(function(f){w=f.series.yAxis;n=f.series.xAxis;m+=f.plotX+(!a&&n?n.left-u:0);p+=(f.plotLow?(f.plotLow+f.plotHigh)/2:f.plotY)+(!a&&w?w.top-l:0);}),m/=d.length,p/=d.length,d=[a?k.plotWidth-p:m,this.shared&&!a&&1<d.length&&c?c.chartY-l:a?k.plotHeight-m:p]);return d.map(Math.round)};m.prototype.getDateFormat=function(d,c,k,f){var a=this.chart.time,l=a.dateFormat("%m-%d %H:%M:%S.%L",c),u={millisecond:15,second:12,minute:9,hour:6,day:3},
    m="millisecond";for(p in I){if(d===I.week&&+a.dateFormat("%w",c)===k&&"00:00:00.000"===l.substr(6)){var p="week";break}if(I[p]>d){p=m;break}if(u[p]&&l.substr(u[p])!=="01-01 00:00:00.000".substr(u[p]))break;"week"!==p&&(m=p);}if(p)var w=a.resolveDTLFormat(f[p]).main;return w};m.prototype.getLabel=function(){var d,c,k=this,f=this.chart.renderer,a=this.chart.styledMode,m=this.options,u="tooltip"+(H(m.className)?" "+m.className:""),p=(null===(d=m.style)||void 0===d?void 0:d.pointerEvents)||(!this.followPointer&&
    m.stickOnContact?"auto":"none"),n;d=function(){k.inContact=!0;};var w=function(){var a=k.chart.hoverSeries;k.inContact=!1;if(a&&a.onMouseOut)a.onMouseOut();};if(!this.label){this.outside&&(this.container=n=g.doc.createElement("div"),n.className="highcharts-tooltip-container",B(n,{position:"absolute",top:"1px",pointerEvents:p,zIndex:3}),g.doc.body.appendChild(n),this.renderer=f=new g.Renderer(n,0,0,null===(c=this.chart.options.chart)||void 0===c?void 0:c.style,void 0,void 0,f.styledMode));this.split?
    this.label=f.g(u):(this.label=f.label("",0,0,m.shape||"callout",null,null,m.useHTML,null,u).attr({padding:m.padding,r:m.borderRadius}),a||this.label.attr({fill:m.backgroundColor,"stroke-width":m.borderWidth}).css(m.style).css({pointerEvents:p}).shadow(m.shadow));a&&(this.applyFilter(),this.label.addClass("highcharts-tooltip-"+this.chart.index));if(k.outside&&!k.split){var r=this.label,F=r.xSetter,t=r.ySetter;r.xSetter=function(a){F.call(r,k.distance);n.style.left=a+"px";};r.ySetter=function(a){t.call(r,
    k.distance);n.style.top=a+"px";};}this.label.on("mouseenter",d).on("mouseleave",w).attr({zIndex:8}).add();}return this.label};m.prototype.getPosition=function(d,c,k){var f=this.chart,a=this.distance,l={},m=f.inverted&&k.h||0,p,g=this.outside,w=g?q.documentElement.clientWidth-2*a:f.chartWidth,r=g?Math.max(q.body.scrollHeight,q.documentElement.scrollHeight,q.body.offsetHeight,q.documentElement.offsetHeight,q.documentElement.clientHeight):f.chartHeight,F=f.pointer.getChartPosition(),t=f.containerScaling,
    e=function(b){return t?b*t.scaleX:b},b=function(b){return t?b*t.scaleY:b},h=function(h){var l="x"===h;return [h,l?w:r,l?d:c].concat(g?[l?e(d):b(c),l?F.left-a+e(k.plotX+f.plotLeft):F.top-a+b(k.plotY+f.plotTop),0,l?w:r]:[l?d:c,l?k.plotX+f.plotLeft:k.plotY+f.plotTop,l?f.plotLeft:f.plotTop,l?f.plotLeft+f.plotWidth:f.plotTop+f.plotHeight])},z=h("y"),x=h("x"),C=!this.followPointer&&n(k.ttBelow,!f.inverted===!!k.negative),v=function(h,f,d,c,k,u,p){var x="y"===h?b(a):e(a),w=(d-c)/2,n=c<k-a,A=k+a+c<f,g=k-x-
    d+w;k=k+x-w;if(C&&A)l[h]=k;else if(!C&&n)l[h]=g;else if(n)l[h]=Math.min(p-c,0>g-m?g:g-m);else if(A)l[h]=Math.max(u,k+m+d>f?k:k+m);else return !1},I=function(b,e,h,f,d){var c;d<a||d>e-a?c=!1:l[b]=d<h/2?1:d>e-f/2?e-f-2:d-h/2;return c},V=function(b){var a=z;z=x;x=a;p=b;},G=function(){!1!==v.apply(0,z)?!1!==I.apply(0,x)||p||(V(!0),G()):p?l.x=l.y=0:(V(!0),G());};(f.inverted||1<this.len)&&V();G();return l};m.prototype.getXDateFormat=function(d,c,k){c=c.dateTimeLabelFormats;var f=k&&k.closestPointRange;return (f?
    this.getDateFormat(f,d.x,k.options.startOfWeek,c):c.day)||c.year};m.prototype.hide=function(d){var l=this;c.clearTimeout(this.hideTimer);d=n(d,this.options.hideDelay,500);this.isHidden||(this.hideTimer=C(function(){l.getLabel().fadeOut(d?void 0:d);l.isHidden=!0;},d));};m.prototype.init=function(d,c){this.chart=d;this.options=c;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.split=c.split&&!d.inverted&&!d.polar;this.shared=c.shared||this.split;this.outside=n(c.outside,!(!d.scrollablePixelsX&&
    !d.scrollablePixelsY));};m.prototype.isStickyOnContact=function(){return !(this.followPointer||!this.options.stickOnContact||!this.inContact)};m.prototype.move=function(d,l,k,f){var a=this,m=a.now,u=!1!==a.options.animation&&!a.isHidden&&(1<Math.abs(d-m.x)||1<Math.abs(l-m.y)),p=a.followPointer||1<a.len;J(m,{x:u?(2*m.x+d)/3:d,y:u?(m.y+l)/2:l,anchorX:p?void 0:u?(2*m.anchorX+k)/3:k,anchorY:p?void 0:u?(m.anchorY+f)/2:f});a.getLabel().attr(m);a.drawTracker();u&&(c.clearTimeout(this.tooltipTimeout),this.tooltipTimeout=
    setTimeout(function(){a&&a.move(d,l,k,f);},32));};m.prototype.refresh=function(d,l){var k=this.chart,f=this.options,a=d,m={},u=[],p=f.formatter||this.defaultFormatter;m=this.shared;var g=k.styledMode;if(f.enabled){c.clearTimeout(this.hideTimer);this.followPointer=r(a)[0].series.tooltipOptions.followPointer;var w=this.getAnchor(a,l);l=w[0];var M=w[1];!m||a.series&&a.series.noSharedTooltip?m=a.getLabelConfig():(k.pointer.applyInactiveState(a),a.forEach(function(a){a.setState("hover");u.push(a.getLabelConfig());}),
    m={x:a[0].category,y:a[0].y},m.points=u,a=a[0]);this.len=u.length;k=p.call(m,this);p=a.series;this.distance=n(p.tooltipOptions.distance,16);!1===k?this.hide():(this.split?this.renderSplit(k,r(d)):(d=this.getLabel(),f.style.width&&!g||d.css({width:this.chart.spacingBox.width+"px"}),d.attr({text:k&&k.join?k.join(""):k}),d.removeClass(/highcharts-color-[\d]+/g).addClass("highcharts-color-"+n(a.colorIndex,p.colorIndex)),g||d.attr({stroke:f.borderColor||a.color||p.color||"#666666"}),this.updatePosition({plotX:l,
    plotY:M,negative:a.negative,ttBelow:a.ttBelow,h:w[2]||0})),this.isHidden&&this.label&&this.label.attr({opacity:1}).show(),this.isHidden=!1);t(this,"refresh");}};m.prototype.renderSplit=function(d,c){function k(b,a,e,h,f){void 0===f&&(f=!0);e?(a=V?0:D,b=y(b-h/2,q.left,q.right-h)):(a-=G,b=f?b-h-z:b+z,b=y(b,f?b:q.left,q.right));return {x:b,y:a}}var f=this,a=f.chart,l=f.chart,m=l.plotHeight,p=l.plotLeft,r=l.plotTop,w=l.pointer,M=l.renderer,F=l.scrollablePixelsY,t=void 0===F?0:F;F=l.scrollingContainer;F=
    void 0===F?{scrollLeft:0,scrollTop:0}:F;var e=F.scrollLeft,b=F.scrollTop,h=l.styledMode,z=f.distance,x=f.options,C=f.options.positioner,q={left:e,right:e+l.chartWidth,top:b,bottom:b+l.chartHeight},I=f.getLabel(),V=!(!a.xAxis[0]||!a.xAxis[0].opposite),G=r+b,K=0,D=m-t;v(d)&&(d=[!1,d]);d=d.slice(0,c.length+1).reduce(function(a,e,d){if(!1!==e&&""!==e){d=c[d-1]||{isHeader:!0,plotX:c[0].plotX,plotY:m,series:{}};var l=d.isHeader,u=l?f:d.series,w=u.tt,g=d.isHeader;var A=d.series;var E="highcharts-color-"+
    n(d.colorIndex,A.colorIndex,"none");w||(w={padding:x.padding,r:x.borderRadius},h||(w.fill=x.backgroundColor,w["stroke-width"]=x.borderWidth),w=M.label("",0,0,x[g?"headerShape":"shape"]||"callout",void 0,void 0,x.useHTML).addClass((g?"highcharts-tooltip-header ":"")+"highcharts-tooltip-box "+E).attr(w).add(I));w.isActive=!0;w.attr({text:e});h||w.css(x.style).shadow(x.shadow).attr({stroke:x.borderColor||d.color||A.color||"#333333"});e=u.tt=w;g=e.getBBox();u=g.width+e.strokeWidth();l&&(K=g.height,D+=
    K,V&&(G-=K));A=d.plotX;A=void 0===A?0:A;E=d.plotY;E=void 0===E?0:E;var F=d.series;if(d.isHeader){A=p+A;var S=r+m/2;}else w=F.xAxis,F=F.yAxis,A=w.pos+y(A,-z,w.len+z),F.pos+E>=b+r&&F.pos+E<=b+r+m-t&&(S=F.pos+E);A=y(A,q.left-z,q.right+z);"number"===typeof S?(g=g.height+1,E=C?C.call(f,u,g,d):k(A,S,l,u),a.push({align:C?0:void 0,anchorX:A,anchorY:S,boxWidth:u,point:d,rank:n(E.rank,l?1:0),size:g,target:E.y,tt:e,x:E.x})):e.isActive=!1;}return a},[]);!C&&d.some(function(b){return b.x<q.left})&&(d=d.map(function(b){var a=
    k(b.anchorX,b.anchorY,b.point.isHeader,b.boxWidth,!1);return J(b,{target:a.y,x:a.x})}));f.cleanSplit();g.distribute(d,D);d.forEach(function(b){var a=b.pos;b.tt.attr({visibility:"undefined"===typeof a?"hidden":"inherit",x:b.x,y:a+G,anchorX:b.anchorX,anchorY:b.anchorY});});d=f.container;a=f.renderer;f.outside&&d&&a&&(l=I.getBBox(),a.setSize(l.width+l.x,l.height+l.y,!1),w=w.getChartPosition(),d.style.left=w.left+"px",d.style.top=w.top+"px");};m.prototype.drawTracker=function(){if(this.followPointer||!this.options.stickOnContact)this.tracker&&
    this.tracker.destroy();else{var d=this.chart,c=this.label,k=d.hoverPoint;if(c&&k){var f={x:0,y:0,width:0,height:0};k=this.getAnchor(k);var a=c.getBBox();k[0]+=d.plotLeft-c.translateX;k[1]+=d.plotTop-c.translateY;f.x=Math.min(0,k[0]);f.y=Math.min(0,k[1]);f.width=0>k[0]?Math.max(Math.abs(k[0]),a.width-k[0]):Math.max(Math.abs(k[0]),a.width);f.height=0>k[1]?Math.max(Math.abs(k[1]),a.height-Math.abs(k[1])):Math.max(Math.abs(k[1]),a.height);this.tracker?this.tracker.attr(f):(this.tracker=c.renderer.rect(f).addClass("highcharts-tracker").add(c),
    d.styledMode||this.tracker.attr({fill:"rgba(0,0,0,0)"}));}}};m.prototype.styledModeFormat=function(d){return d.replace('style="font-size: 10px"','class="highcharts-header"').replace(/style="color:{(point|series)\.color}"/g,'class="highcharts-color-{$1.colorIndex}"')};m.prototype.tooltipFooterHeaderFormatter=function(d,c){var k=c?"footer":"header",f=d.series,a=f.tooltipOptions,l=a.xDateFormat,m=f.xAxis,p=m&&"datetime"===m.options.type&&L(d.key),n=a[k+"Format"];c={isFooter:c,labelConfig:d};t(this,"headerFormatter",
    c,function(c){p&&!l&&(l=this.getXDateFormat(d,a,m));p&&l&&(d.point&&d.point.tooltipDateKeys||["key"]).forEach(function(a){n=n.replace("{point."+a+"}","{point."+a+":"+l+"}");});f.chart.styledMode&&(n=this.styledModeFormat(n));c.text=G(n,{point:d,series:f},this.chart);});return c.text};m.prototype.update=function(d){this.destroy();K(!0,this.chart.options.tooltip.userOptions,d);this.init(this.chart,K(!0,this.options,d));};m.prototype.updatePosition=function(d){var c=this.chart,k=c.pointer,f=this.getLabel(),
    a=d.plotX+c.plotLeft,m=d.plotY+c.plotTop;k=k.getChartPosition();d=(this.options.positioner||this.getPosition).call(this,f.width,f.height,d);if(this.outside){var p=(this.options.borderWidth||0)+2*this.distance;this.renderer.setSize(f.width+p,f.height+p,!1);if(c=c.containerScaling)B(this.container,{transform:"scale("+c.scaleX+", "+c.scaleY+")"}),a*=c.scaleX,m*=c.scaleY;a+=k.left-d.x;m+=k.top-d.y;}this.move(Math.round(d.x),Math.round(d.y||0),a,m);};return m}();g.Tooltip=p;return g.Tooltip});O(q,"parts/Pointer.js",
    [q["parts/Color.js"],q["parts/Globals.js"],q["parts/Tooltip.js"],q["parts/Utilities.js"]],function(g,c,q,y){var B=g.parse,H=c.charts,D=c.noop,J=y.addEvent,t=y.attr,G=y.css,L=y.defined,v=y.extend,K=y.find,n=y.fireEvent,r=y.isNumber,C=y.isObject,I=y.objectEach,p=y.offset,m=y.pick,d=y.splat;g=function(){function l(d,f){this.lastValidTouch={};this.pinchDown=[];this.runChartClick=!1;this.chart=d;this.hasDragged=!1;this.options=f;this.unbindContainerMouseLeave=function(){};this.init(d,f);}l.prototype.applyInactiveState=
    function(d){var f=[],a;(d||[]).forEach(function(d){a=d.series;f.push(a);a.linkedParent&&f.push(a.linkedParent);a.linkedSeries&&(f=f.concat(a.linkedSeries));a.navigatorSeries&&f.push(a.navigatorSeries);});this.chart.series.forEach(function(a){-1===f.indexOf(a)?a.setState("inactive",!0):a.options.inactiveOtherPoints&&a.setAllPointsToState("inactive");});};l.prototype.destroy=function(){var d=this;"undefined"!==typeof d.unDocMouseMove&&d.unDocMouseMove();this.unbindContainerMouseLeave();c.chartCount||(c.unbindDocumentMouseUp&&
    (c.unbindDocumentMouseUp=c.unbindDocumentMouseUp()),c.unbindDocumentTouchEnd&&(c.unbindDocumentTouchEnd=c.unbindDocumentTouchEnd()));clearInterval(d.tooltipTimeout);I(d,function(f,a){d[a]=void 0;});};l.prototype.drag=function(d){var f=this.chart,a=f.options.chart,c=d.chartX,k=d.chartY,l=this.zoomHor,m=this.zoomVert,p=f.plotLeft,n=f.plotTop,g=f.plotWidth,r=f.plotHeight,e=this.selectionMarker,b=this.mouseDownX||0,h=this.mouseDownY||0,z=C(a.panning)?a.panning&&a.panning.enabled:a.panning,x=a.panKey&&d[a.panKey+
    "Key"];if(!e||!e.touch)if(c<p?c=p:c>p+g&&(c=p+g),k<n?k=n:k>n+r&&(k=n+r),this.hasDragged=Math.sqrt(Math.pow(b-c,2)+Math.pow(h-k,2)),10<this.hasDragged){var t=f.isInsidePlot(b-p,h-n);f.hasCartesianSeries&&(this.zoomX||this.zoomY)&&t&&!x&&!e&&(this.selectionMarker=e=f.renderer.rect(p,n,l?1:g,m?1:r,0).attr({"class":"highcharts-selection-marker",zIndex:7}).add(),f.styledMode||e.attr({fill:a.selectionMarkerFill||B("#335cad").setOpacity(.25).get()}));e&&l&&(c-=b,e.attr({width:Math.abs(c),x:(0<c?0:c)+b}));
    e&&m&&(c=k-h,e.attr({height:Math.abs(c),y:(0<c?0:c)+h}));t&&!e&&z&&f.pan(d,a.panning);}};l.prototype.dragStart=function(d){var f=this.chart;f.mouseIsDown=d.type;f.cancelClick=!1;f.mouseDownX=this.mouseDownX=d.chartX;f.mouseDownY=this.mouseDownY=d.chartY;};l.prototype.drop=function(d){var f=this,a=this.chart,c=this.hasPinched;if(this.selectionMarker){var k={originalEvent:d,xAxis:[],yAxis:[]},l=this.selectionMarker,m=l.attr?l.attr("x"):l.x,p=l.attr?l.attr("y"):l.y,g=l.attr?l.attr("width"):l.width,F=l.attr?
    l.attr("height"):l.height,t;if(this.hasDragged||c)a.axes.forEach(function(a){if(a.zoomEnabled&&L(a.min)&&(c||f[{xAxis:"zoomX",yAxis:"zoomY"}[a.coll]])&&r(m)&&r(p)){var b=a.horiz,e="touchend"===d.type?a.minPixelPadding:0,l=a.toValue((b?m:p)+e);b=a.toValue((b?m+g:p+F)-e);k[a.coll].push({axis:a,min:Math.min(l,b),max:Math.max(l,b)});t=!0;}}),t&&n(a,"selection",k,function(e){a.zoom(v(e,c?{animation:!1}:null));});r(a.index)&&(this.selectionMarker=this.selectionMarker.destroy());c&&this.scaleGroups();}a&&r(a.index)&&
    (G(a.container,{cursor:a._cursor}),a.cancelClick=10<this.hasDragged,a.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[]);};l.prototype.findNearestKDPoint=function(d,f,a){var c=this.chart,k=c.hoverPoint;c=c.tooltip;if(k&&c&&c.isStickyOnContact())return k;var l;d.forEach(function(d){var c=!(d.noSharedTooltip&&f)&&0>d.options.findNearestPointBy.indexOf("y");d=d.searchPoint(a,c);if((c=C(d,!0))&&!(c=!C(l,!0))){c=l.distX-d.distX;var k=l.dist-d.dist,m=(d.series.group&&d.series.group.zIndex)-
    (l.series.group&&l.series.group.zIndex);c=0<(0!==c&&f?c:0!==k?k:0!==m?m:l.series.index>d.series.index?-1:1);}c&&(l=d);});return l};l.prototype.getChartCoordinatesFromPoint=function(d,f){var a=d.series,c=a.xAxis;a=a.yAxis;var k=m(d.clientX,d.plotX),l=d.shapeArgs;if(c&&a)return f?{chartX:c.len+c.pos-k,chartY:a.len+a.pos-d.plotY}:{chartX:k+c.pos,chartY:d.plotY+a.pos};if(l&&l.x&&l.y)return {chartX:l.x,chartY:l.y}};l.prototype.getChartPosition=function(){return this.chartPosition||(this.chartPosition=p(this.chart.container))};
    l.prototype.getCoordinates=function(d){var f={xAxis:[],yAxis:[]};this.chart.axes.forEach(function(a){f[a.isXAxis?"xAxis":"yAxis"].push({axis:a,value:a.toValue(d[a.horiz?"chartX":"chartY"])});});return f};l.prototype.getHoverData=function(d,f,a,c,l,p){var k,u=[];c=!(!c||!d);var g=f&&!f.stickyTracking,A={chartX:p?p.chartX:void 0,chartY:p?p.chartY:void 0,shared:l};n(this,"beforeGetHoverData",A);g=g?[f]:a.filter(function(a){return A.filter?A.filter(a):a.visible&&!(!l&&a.directTouch)&&m(a.options.enableMouseTracking,
    !0)&&a.stickyTracking});f=(k=c||!p?d:this.findNearestKDPoint(g,l,p))&&k.series;k&&(l&&!f.noSharedTooltip?(g=a.filter(function(a){return A.filter?A.filter(a):a.visible&&!(!l&&a.directTouch)&&m(a.options.enableMouseTracking,!0)&&!a.noSharedTooltip}),g.forEach(function(a){var e=K(a.points,function(b){return b.x===k.x&&!b.isNull});C(e)&&(a.chart.isBoosting&&(e=a.getPoint(e)),u.push(e));})):u.push(k));A={hoverPoint:k};n(this,"afterGetHoverData",A);return {hoverPoint:A.hoverPoint,hoverSeries:f,hoverPoints:u}};
    l.prototype.getPointFromEvent=function(d){d=d.target;for(var f;d&&!f;)f=d.point,d=d.parentNode;return f};l.prototype.onTrackerMouseOut=function(d){d=d.relatedTarget||d.toElement;var f=this.chart.hoverSeries;this.isDirectTouch=!1;if(!(!f||!d||f.stickyTracking||this.inClass(d,"highcharts-tooltip")||this.inClass(d,"highcharts-series-"+f.index)&&this.inClass(d,"highcharts-tracker")))f.onMouseOut();};l.prototype.inClass=function(d,f){for(var a;d;){if(a=t(d,"class")){if(-1!==a.indexOf(f))return !0;if(-1!==
    a.indexOf("highcharts-container"))return !1}d=d.parentNode;}};l.prototype.init=function(d,f){this.options=f;this.chart=d;this.runChartClick=f.chart.events&&!!f.chart.events.click;this.pinchDown=[];this.lastValidTouch={};q&&(d.tooltip=new q(d,f.tooltip),this.followTouchMove=m(f.tooltip.followTouchMove,!0));this.setDOMEvents();};l.prototype.normalize=function(d,f){var a=d.touches,c=a?a.length?a.item(0):m(a.changedTouches,d.changedTouches)[0]:d;f||(f=this.getChartPosition());a=c.pageX-f.left;f=c.pageY-
    f.top;if(c=this.chart.containerScaling)a/=c.scaleX,f/=c.scaleY;return v(d,{chartX:Math.round(a),chartY:Math.round(f)})};l.prototype.onContainerClick=function(d){var f=this.chart,a=f.hoverPoint;d=this.normalize(d);var c=f.plotLeft,k=f.plotTop;f.cancelClick||(a&&this.inClass(d.target,"highcharts-tracker")?(n(a.series,"click",v(d,{point:a})),f.hoverPoint&&a.firePointEvent("click",d)):(v(d,this.getCoordinates(d)),f.isInsidePlot(d.chartX-c,d.chartY-k)&&n(f,"click",d)));};l.prototype.onContainerMouseDown=
    function(d){d=this.normalize(d);if(c.isFirefox&&0!==d.button)this.onContainerMouseMove(d);if("undefined"===typeof d.button||1===((d.buttons||d.button)&1))this.zoomOption(d),this.dragStart(d);};l.prototype.onContainerMouseLeave=function(d){var f=H[m(c.hoverChartIndex,-1)],a=this.chart.tooltip;d=this.normalize(d);f&&(d.relatedTarget||d.toElement)&&(f.pointer.reset(),f.pointer.chartPosition=void 0);a&&!a.isHidden&&this.reset();};l.prototype.onContainerMouseMove=function(d){var f=this.chart;d=this.normalize(d);
    this.setHoverChartIndex();d.preventDefault||(d.returnValue=!1);"mousedown"===f.mouseIsDown&&this.drag(d);f.openMenu||!this.inClass(d.target,"highcharts-tracker")&&!f.isInsidePlot(d.chartX-f.plotLeft,d.chartY-f.plotTop)||this.runPointActions(d);};l.prototype.onDocumentTouchEnd=function(d){H[c.hoverChartIndex]&&H[c.hoverChartIndex].pointer.drop(d);};l.prototype.onContainerTouchMove=function(d){this.touch(d);};l.prototype.onContainerTouchStart=function(d){this.zoomOption(d);this.touch(d,!0);};l.prototype.onDocumentMouseMove=
    function(d){var f=this.chart,a=this.chartPosition;d=this.normalize(d,a);var c=f.tooltip;!a||c&&c.isStickyOnContact()||f.isInsidePlot(d.chartX-f.plotLeft,d.chartY-f.plotTop)||this.inClass(d.target,"highcharts-tracker")||this.reset();};l.prototype.onDocumentMouseUp=function(d){var f=H[m(c.hoverChartIndex,-1)];f&&f.pointer.drop(d);};l.prototype.pinch=function(d){var f=this,a=f.chart,c=f.pinchDown,k=d.touches||[],l=k.length,p=f.lastValidTouch,n=f.hasZoom,g=f.selectionMarker,r={},t=1===l&&(f.inClass(d.target,
    "highcharts-tracker")&&a.runTrackerClick||f.runChartClick),e={};1<l&&(f.initiated=!0);n&&f.initiated&&!t&&d.preventDefault();[].map.call(k,function(b){return f.normalize(b)});"touchstart"===d.type?([].forEach.call(k,function(b,a){c[a]={chartX:b.chartX,chartY:b.chartY};}),p.x=[c[0].chartX,c[1]&&c[1].chartX],p.y=[c[0].chartY,c[1]&&c[1].chartY],a.axes.forEach(function(b){if(b.zoomEnabled){var e=a.bounds[b.horiz?"h":"v"],f=b.minPixelPadding,d=b.toPixels(Math.min(m(b.options.min,b.dataMin),b.dataMin)),
    c=b.toPixels(Math.max(m(b.options.max,b.dataMax),b.dataMax)),k=Math.max(d,c);e.min=Math.min(b.pos,Math.min(d,c)-f);e.max=Math.max(b.pos+b.len,k+f);}}),f.res=!0):f.followTouchMove&&1===l?this.runPointActions(f.normalize(d)):c.length&&(g||(f.selectionMarker=g=v({destroy:D,touch:!0},a.plotBox)),f.pinchTranslate(c,k,r,g,e,p),f.hasPinched=n,f.scaleGroups(r,e),f.res&&(f.res=!1,this.reset(!1,0)));};l.prototype.pinchTranslate=function(d,f,a,c,l,m){this.zoomHor&&this.pinchTranslateDirection(!0,d,f,a,c,l,m);
    this.zoomVert&&this.pinchTranslateDirection(!1,d,f,a,c,l,m);};l.prototype.pinchTranslateDirection=function(d,f,a,c,l,m,p,n){var k=this.chart,u=d?"x":"y",g=d?"X":"Y",e="chart"+g,b=d?"width":"height",h=k["plot"+(d?"Left":"Top")],w,x,A=n||1,r=k.inverted,E=k.bounds[d?"h":"v"],t=1===f.length,C=f[0][e],v=a[0][e],q=!t&&f[1][e],I=!t&&a[1][e];a=function(){"number"===typeof I&&20<Math.abs(C-q)&&(A=n||Math.abs(v-I)/Math.abs(C-q));x=(h-v)/A+C;w=k["plot"+(d?"Width":"Height")]/A;};a();f=x;if(f<E.min){f=E.min;var P=
    !0;}else f+w>E.max&&(f=E.max-w,P=!0);P?(v-=.8*(v-p[u][0]),"number"===typeof I&&(I-=.8*(I-p[u][1])),a()):p[u]=[v,I];r||(m[u]=x-h,m[b]=w);m=r?1/A:A;l[b]=w;l[u]=f;c[r?d?"scaleY":"scaleX":"scale"+g]=A;c["translate"+g]=m*h+(v-m*C);};l.prototype.reset=function(c,f){var a=this.chart,k=a.hoverSeries,l=a.hoverPoint,m=a.hoverPoints,p=a.tooltip,n=p&&p.shared?m:l;c&&n&&d(n).forEach(function(a){a.series.isCartesian&&"undefined"===typeof a.plotX&&(c=!1);});if(c)p&&n&&d(n).length&&(p.refresh(n),p.shared&&m?m.forEach(function(a){a.setState(a.state,
    !0);a.series.isCartesian&&(a.series.xAxis.crosshair&&a.series.xAxis.drawCrosshair(null,a),a.series.yAxis.crosshair&&a.series.yAxis.drawCrosshair(null,a));}):l&&(l.setState(l.state,!0),a.axes.forEach(function(a){a.crosshair&&l.series[a.coll]===a&&a.drawCrosshair(null,l);})));else{if(l)l.onMouseOut();m&&m.forEach(function(a){a.setState();});if(k)k.onMouseOut();p&&p.hide(f);this.unDocMouseMove&&(this.unDocMouseMove=this.unDocMouseMove());a.axes.forEach(function(a){a.hideCrosshair();});this.hoverX=a.hoverPoints=
    a.hoverPoint=null;}};l.prototype.runPointActions=function(d,f){var a=this.chart,k=a.tooltip&&a.tooltip.options.enabled?a.tooltip:void 0,l=k?k.shared:!1,p=f||a.hoverPoint,n=p&&p.series||a.hoverSeries;n=this.getHoverData(p,n,a.series,(!d||"touchmove"!==d.type)&&(!!f||n&&n.directTouch&&this.isDirectTouch),l,d);p=n.hoverPoint;var g=n.hoverPoints;f=(n=n.hoverSeries)&&n.tooltipOptions.followPointer;l=l&&n&&!n.noSharedTooltip;if(p&&(p!==a.hoverPoint||k&&k.isHidden)){(a.hoverPoints||[]).forEach(function(a){-1===
    g.indexOf(a)&&a.setState();});if(a.hoverSeries!==n)n.onMouseOver();this.applyInactiveState(g);(g||[]).forEach(function(a){a.setState("hover");});a.hoverPoint&&a.hoverPoint.firePointEvent("mouseOut");if(!p.series)return;a.hoverPoints=g;a.hoverPoint=p;p.firePointEvent("mouseOver");k&&k.refresh(l?g:p,d);}else f&&k&&!k.isHidden&&(p=k.getAnchor([{}],d),k.updatePosition({plotX:p[0],plotY:p[1]}));this.unDocMouseMove||(this.unDocMouseMove=J(a.container.ownerDocument,"mousemove",function(a){var f=H[c.hoverChartIndex];
    if(f)f.pointer.onDocumentMouseMove(a);}));a.axes.forEach(function(f){var c=m((f.crosshair||{}).snap,!0),k;c&&((k=a.hoverPoint)&&k.series[f.coll]===f||(k=K(g,function(a){return a.series[f.coll]===f})));k||!c?f.drawCrosshair(d,k):f.hideCrosshair();});};l.prototype.scaleGroups=function(d,f){var a=this.chart,c;a.series.forEach(function(k){c=d||k.getPlotBox();k.xAxis&&k.xAxis.zoomEnabled&&k.group&&(k.group.attr(c),k.markerGroup&&(k.markerGroup.attr(c),k.markerGroup.clip(f?a.clipRect:null)),k.dataLabelsGroup&&
    k.dataLabelsGroup.attr(c));});a.clipRect.attr(f||a.clipBox);};l.prototype.setDOMEvents=function(){var d=this.chart.container,f=d.ownerDocument;d.onmousedown=this.onContainerMouseDown.bind(this);d.onmousemove=this.onContainerMouseMove.bind(this);d.onclick=this.onContainerClick.bind(this);this.unbindContainerMouseLeave=J(d,"mouseleave",this.onContainerMouseLeave.bind(this));c.unbindDocumentMouseUp||(c.unbindDocumentMouseUp=J(f,"mouseup",this.onDocumentMouseUp.bind(this)));c.hasTouch&&(J(d,"touchstart",
    this.onContainerTouchStart.bind(this)),J(d,"touchmove",this.onContainerTouchMove.bind(this)),c.unbindDocumentTouchEnd||(c.unbindDocumentTouchEnd=J(f,"touchend",this.onDocumentTouchEnd.bind(this))));};l.prototype.setHoverChartIndex=function(){var d=this.chart,f=c.charts[m(c.hoverChartIndex,-1)];if(f&&f!==d)f.pointer.onContainerMouseLeave({relatedTarget:!0});f&&f.mouseIsDown||(c.hoverChartIndex=d.index);};l.prototype.touch=function(d,f){var a=this.chart,c;this.setHoverChartIndex();if(1===d.touches.length)if(d=
    this.normalize(d),(c=a.isInsidePlot(d.chartX-a.plotLeft,d.chartY-a.plotTop))&&!a.openMenu){f&&this.runPointActions(d);if("touchmove"===d.type){f=this.pinchDown;var k=f[0]?4<=Math.sqrt(Math.pow(f[0].chartX-d.chartX,2)+Math.pow(f[0].chartY-d.chartY,2)):!1;}m(k,!0)&&this.pinch(d);}else f&&this.reset();else 2===d.touches.length&&this.pinch(d);};l.prototype.zoomOption=function(d){var f=this.chart,a=f.options.chart,c=a.zoomType||"";f=f.inverted;/touch/.test(d.type)&&(c=m(a.pinchType,c));this.zoomX=d=/x/.test(c);
    this.zoomY=c=/y/.test(c);this.zoomHor=d&&!f||c&&f;this.zoomVert=c&&!f||d&&f;this.hasZoom=d||c;};return l}();return c.Pointer=g});O(q,"parts/MSPointer.js",[q["parts/Globals.js"],q["parts/Pointer.js"],q["parts/Utilities.js"]],function(g,c,q){function y(){var c=[];c.item=function(c){return this[c]};v(n,function(n){c.push({pageX:n.pageX,pageY:n.pageY,target:n.target});});return c}function B(c,n,p,m){"touch"!==c.pointerType&&c.pointerType!==c.MSPOINTER_TYPE_TOUCH||!D[g.hoverChartIndex]||(m(c),m=D[g.hoverChartIndex].pointer,
    m[n]({type:p,target:c.currentTarget,preventDefault:t,touches:y()}));}var H=this&&this.__extends||function(){var c=function(n,p){c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(c,d){c.__proto__=d;}||function(c,d){for(var l in d)d.hasOwnProperty(l)&&(c[l]=d[l]);};return c(n,p)};return function(n,p){function m(){this.constructor=n;}c(n,p);n.prototype=null===p?Object.create(p):(m.prototype=p.prototype,new m);}}(),D=g.charts,J=g.doc,t=g.noop,G=q.addEvent,L=q.css,v=q.objectEach,K=q.removeEvent,
    n={},r=!!g.win.PointerEvent;return function(c){function g(){return null!==c&&c.apply(this,arguments)||this}H(g,c);g.prototype.batchMSEvents=function(c){c(this.chart.container,r?"pointerdown":"MSPointerDown",this.onContainerPointerDown);c(this.chart.container,r?"pointermove":"MSPointerMove",this.onContainerPointerMove);c(J,r?"pointerup":"MSPointerUp",this.onDocumentPointerUp);};g.prototype.destroy=function(){this.batchMSEvents(K);c.prototype.destroy.call(this);};g.prototype.init=function(p,m){c.prototype.init.call(this,
    p,m);this.hasZoom&&L(p.container,{"-ms-touch-action":"none","touch-action":"none"});};g.prototype.onContainerPointerDown=function(c){B(c,"onContainerTouchStart","touchstart",function(c){n[c.pointerId]={pageX:c.pageX,pageY:c.pageY,target:c.currentTarget};});};g.prototype.onContainerPointerMove=function(c){B(c,"onContainerTouchMove","touchmove",function(c){n[c.pointerId]={pageX:c.pageX,pageY:c.pageY};n[c.pointerId].target||(n[c.pointerId].target=c.currentTarget);});};g.prototype.onDocumentPointerUp=function(c){B(c,
    "onDocumentTouchEnd","touchend",function(c){delete n[c.pointerId];});};g.prototype.setDOMEvents=function(){c.prototype.setDOMEvents.call(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(G);};return g}(c)});O(q,"parts/Legend.js",[q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=c.addEvent,y=c.animObject,B=c.css,H=c.defined,D=c.discardElement,J=c.find,t=c.fireEvent,G=c.format,L=c.isNumber,v=c.merge,K=c.pick,n=c.relativeLength,r=c.setAnimation,C=c.stableSort,I=c.syncTimeout;
    c=c.wrap;var p=g.isFirefox,m=g.marginNames,d=g.win,l=function(){function d(d,a){this.allItems=[];this.contentGroup=this.box=void 0;this.display=!1;this.group=void 0;this.offsetWidth=this.maxLegendWidth=this.maxItemWidth=this.legendWidth=this.legendHeight=this.lastLineHeight=this.lastItemY=this.itemY=this.itemX=this.itemMarginTop=this.itemMarginBottom=this.itemHeight=this.initialItemY=0;this.options={};this.padding=0;this.pages=[];this.proximate=!1;this.scrollGroup=void 0;this.widthOption=this.totalItemWidth=
    this.titleHeight=this.symbolWidth=this.symbolHeight=0;this.chart=d;this.init(d,a);}d.prototype.init=function(d,a){this.chart=d;this.setOptions(a);a.enabled&&(this.render(),q(this.chart,"endResize",function(){this.legend.positionCheckboxes();}),this.proximate?this.unchartrender=q(this.chart,"render",function(){this.legend.proximatePositions();this.legend.positionItems();}):this.unchartrender&&this.unchartrender());};d.prototype.setOptions=function(d){var a=K(d.padding,8);this.options=d;this.chart.styledMode||
    (this.itemStyle=d.itemStyle,this.itemHiddenStyle=v(this.itemStyle,d.itemHiddenStyle));this.itemMarginTop=d.itemMarginTop||0;this.itemMarginBottom=d.itemMarginBottom||0;this.padding=a;this.initialItemY=a-5;this.symbolWidth=K(d.symbolWidth,16);this.pages=[];this.proximate="proximate"===d.layout&&!this.chart.inverted;this.baseline=void 0;};d.prototype.update=function(d,a){var f=this.chart;this.setOptions(v(!0,this.options,d));this.destroy();f.isDirtyLegend=f.isDirtyBox=!0;K(a,!0)&&f.redraw();t(this,"afterUpdate");};
    d.prototype.colorizeItem=function(d,a){d.legendGroup[a?"removeClass":"addClass"]("highcharts-legend-item-hidden");if(!this.chart.styledMode){var f=this.options,c=d.legendItem,l=d.legendLine,k=d.legendSymbol,m=this.itemHiddenStyle.color;f=a?f.itemStyle.color:m;var p=a?d.color||m:m,n=d.options&&d.options.marker,g={fill:p};c&&c.css({fill:f,color:f});l&&l.attr({stroke:p});k&&(n&&k.isMarker&&(g=d.pointAttribs(),a||(g.stroke=g.fill=m)),k.attr(g));}t(this,"afterColorizeItem",{item:d,visible:a});};d.prototype.positionItems=
    function(){this.allItems.forEach(this.positionItem,this);this.chart.isResizing||this.positionCheckboxes();};d.prototype.positionItem=function(d){var a=this,f=this.options,c=f.symbolPadding,k=!f.rtl,l=d._legendItemPos;f=l[0];l=l[1];var m=d.checkbox,p=d.legendGroup;p&&p.element&&(c={translateX:k?f:this.legendWidth-f-2*c-4,translateY:l},k=function(){t(a,"afterPositionItem",{item:d});},H(p.translateY)?p.animate(c,{complete:k}):(p.attr(c),k()));m&&(m.x=f,m.y=l);};d.prototype.destroyItem=function(d){var a=
    d.checkbox;["legendItem","legendLine","legendSymbol","legendGroup"].forEach(function(a){d[a]&&(d[a]=d[a].destroy());});a&&D(d.checkbox);};d.prototype.destroy=function(){function d(a){this[a]&&(this[a]=this[a].destroy());}this.getAllItems().forEach(function(a){["legendItem","legendGroup"].forEach(d,a);});"clipRect up down pager nav box title group".split(" ").forEach(d,this);this.display=null;};d.prototype.positionCheckboxes=function(){var d=this.group&&this.group.alignAttr,a=this.clipHeight||this.legendHeight,
    c=this.titleHeight;if(d){var l=d.translateY;this.allItems.forEach(function(f){var k=f.checkbox;if(k){var m=l+c+k.y+(this.scrollOffset||0)+3;B(k,{left:d.translateX+f.checkboxOffset+k.x-20+"px",top:m+"px",display:this.proximate||m>l-6&&m<l+a-6?"":"none"});}},this);}};d.prototype.renderTitle=function(){var d=this.options,a=this.padding,c=d.title,k=0;c.text&&(this.title||(this.title=this.chart.renderer.label(c.text,a-3,a-4,null,null,null,d.useHTML,null,"legend-title").attr({zIndex:1}),this.chart.styledMode||
    this.title.css(c.style),this.title.add(this.group)),c.width||this.title.css({width:this.maxLegendWidth+"px"}),d=this.title.getBBox(),k=d.height,this.offsetWidth=d.width,this.contentGroup.attr({translateY:k}));this.titleHeight=k;};d.prototype.setText=function(d){var a=this.options;d.legendItem.attr({text:a.labelFormat?G(a.labelFormat,d,this.chart):a.labelFormatter.call(d)});};d.prototype.renderItem=function(d){var a=this.chart,f=a.renderer,c=this.options,k=this.symbolWidth,l=c.symbolPadding,m=this.itemStyle,
    p=this.itemHiddenStyle,n="horizontal"===c.layout?K(c.itemDistance,20):0,g=!c.rtl,e=d.legendItem,b=!d.series,h=!b&&d.series.drawLegendSymbol?d.series:d,z=h.options;z=this.createCheckboxForItem&&z&&z.showCheckbox;n=k+l+n+(z?20:0);var x=c.useHTML,r=d.options.className;e||(d.legendGroup=f.g("legend-item").addClass("highcharts-"+h.type+"-series highcharts-color-"+d.colorIndex+(r?" "+r:"")+(b?" highcharts-series-"+d.index:"")).attr({zIndex:1}).add(this.scrollGroup),d.legendItem=e=f.text("",g?k+l:-l,this.baseline||
    0,x),a.styledMode||e.css(v(d.visible?m:p)),e.attr({align:g?"left":"right",zIndex:2}).add(d.legendGroup),this.baseline||(this.fontMetrics=f.fontMetrics(a.styledMode?12:m.fontSize,e),this.baseline=this.fontMetrics.f+3+this.itemMarginTop,e.attr("y",this.baseline)),this.symbolHeight=c.symbolHeight||this.fontMetrics.f,h.drawLegendSymbol(this,d),this.setItemEvents&&this.setItemEvents(d,e,x));z&&!d.checkbox&&this.createCheckboxForItem&&this.createCheckboxForItem(d);this.colorizeItem(d,d.visible);!a.styledMode&&
    m.width||e.css({width:(c.itemWidth||this.widthOption||a.spacingBox.width)-n+"px"});this.setText(d);a=e.getBBox();d.itemWidth=d.checkboxOffset=c.itemWidth||d.legendItemWidth||a.width+n;this.maxItemWidth=Math.max(this.maxItemWidth,d.itemWidth);this.totalItemWidth+=d.itemWidth;this.itemHeight=d.itemHeight=Math.round(d.legendItemHeight||a.height||this.symbolHeight);};d.prototype.layoutItem=function(d){var a=this.options,f=this.padding,c="horizontal"===a.layout,k=d.itemHeight,l=this.itemMarginBottom,m=
    this.itemMarginTop,p=c?K(a.itemDistance,20):0,n=this.maxLegendWidth;a=a.alignColumns&&this.totalItemWidth>n?this.maxItemWidth:d.itemWidth;c&&this.itemX-f+a>n&&(this.itemX=f,this.lastLineHeight&&(this.itemY+=m+this.lastLineHeight+l),this.lastLineHeight=0);this.lastItemY=m+this.itemY+l;this.lastLineHeight=Math.max(k,this.lastLineHeight);d._legendItemPos=[this.itemX,this.itemY];c?this.itemX+=a:(this.itemY+=m+k+l,this.lastLineHeight=k);this.offsetWidth=this.widthOption||Math.max((c?this.itemX-f-(d.checkbox?
    0:p):a)+f,this.offsetWidth);};d.prototype.getAllItems=function(){var d=[];this.chart.series.forEach(function(a){var f=a&&a.options;a&&K(f.showInLegend,H(f.linkedTo)?!1:void 0,!0)&&(d=d.concat(a.legendItems||("point"===f.legendType?a.data:a)));});t(this,"afterGetAllItems",{allItems:d});return d};d.prototype.getAlignment=function(){var d=this.options;return this.proximate?d.align.charAt(0)+"tv":d.floating?"":d.align.charAt(0)+d.verticalAlign.charAt(0)+d.layout.charAt(0)};d.prototype.adjustMargins=function(d,
    a){var c=this.chart,f=this.options,k=this.getAlignment();k&&[/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/].forEach(function(l,p){l.test(k)&&!H(d[p])&&(c[m[p]]=Math.max(c[m[p]],c.legend[(p+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][p]*f[p%2?"x":"y"]+K(f.margin,12)+a[p]+(c.titleOffset[p]||0)));});};d.prototype.proximatePositions=function(){var d=this.chart,a=[],c="left"===this.options.align;this.allItems.forEach(function(f){var k=c;if(f.yAxis&&f.points){f.xAxis.options.reversed&&(k=
    !k);var l=J(k?f.points:f.points.slice(0).reverse(),function(a){return L(a.plotY)});k=this.itemMarginTop+f.legendItem.getBBox().height+this.itemMarginBottom;var m=f.yAxis.top-d.plotTop;f.visible?(l=l?l.plotY:f.yAxis.height,l+=m-.3*k):l=m+f.yAxis.height;a.push({target:l,size:k,item:f});}},this);g.distribute(a,d.plotHeight);a.forEach(function(a){a.item._legendItemPos[1]=d.plotTop-d.spacing[0]+a.pos;});};d.prototype.render=function(){var d=this.chart,a=d.renderer,c=this.group,k=this.box,l=this.options,m=
    this.padding;this.itemX=m;this.itemY=this.initialItemY;this.lastItemY=this.offsetWidth=0;this.widthOption=n(l.width,d.spacingBox.width-m);var p=d.spacingBox.width-2*m-l.x;-1<["rm","lm"].indexOf(this.getAlignment().substring(0,2))&&(p/=2);this.maxLegendWidth=this.widthOption||p;c||(this.group=c=a.g("legend").attr({zIndex:7}).add(),this.contentGroup=a.g().attr({zIndex:1}).add(c),this.scrollGroup=a.g().add(this.contentGroup));this.renderTitle();var g=this.getAllItems();C(g,function(a,e){return (a.options&&
    a.options.legendIndex||0)-(e.options&&e.options.legendIndex||0)});l.reversed&&g.reverse();this.allItems=g;this.display=p=!!g.length;this.itemHeight=this.totalItemWidth=this.maxItemWidth=this.lastLineHeight=0;g.forEach(this.renderItem,this);g.forEach(this.layoutItem,this);g=(this.widthOption||this.offsetWidth)+m;var r=this.lastItemY+this.lastLineHeight+this.titleHeight;r=this.handleOverflow(r);r+=m;k||(this.box=k=a.rect().addClass("highcharts-legend-box").attr({r:l.borderRadius}).add(c),k.isNew=!0);
    d.styledMode||k.attr({stroke:l.borderColor,"stroke-width":l.borderWidth||0,fill:l.backgroundColor||"none"}).shadow(l.shadow);0<g&&0<r&&(k[k.isNew?"attr":"animate"](k.crisp.call({},{x:0,y:0,width:g,height:r},k.strokeWidth())),k.isNew=!1);k[p?"show":"hide"]();d.styledMode&&"none"===c.getStyle("display")&&(g=r=0);this.legendWidth=g;this.legendHeight=r;p&&this.align();this.proximate||this.positionItems();t(this,"afterRender");};d.prototype.align=function(d){void 0===d&&(d=this.chart.spacingBox);var a=
    this.chart,c=this.options,f=d.y;/(lth|ct|rth)/.test(this.getAlignment())&&0<a.titleOffset[0]?f+=a.titleOffset[0]:/(lbh|cb|rbh)/.test(this.getAlignment())&&0<a.titleOffset[2]&&(f-=a.titleOffset[2]);f!==d.y&&(d=v(d,{y:f}));this.group.align(v(c,{width:this.legendWidth,height:this.legendHeight,verticalAlign:this.proximate?"top":c.verticalAlign}),!0,d);};d.prototype.handleOverflow=function(d){var a=this,c=this.chart,f=c.renderer,k=this.options,l=k.y,m=this.padding;l=c.spacingBox.height+("top"===k.verticalAlign?
    -l:l)-m;var p=k.maxHeight,n,g=this.clipRect,e=k.navigation,b=K(e.animation,!0),h=e.arrowSize||12,z=this.nav,x=this.pages,r,t=this.allItems,v=function(b){"number"===typeof b?g.attr({height:b}):g&&(a.clipRect=g.destroy(),a.contentGroup.clip());a.contentGroup.div&&(a.contentGroup.div.style.clip=b?"rect("+m+"px,9999px,"+(m+b)+"px,0)":"auto");},q=function(b){a[b]=f.circle(0,0,1.3*h).translate(h/2,h/2).add(z);c.styledMode||a[b].attr("fill","rgba(0,0,0,0.0001)");return a[b]};"horizontal"!==k.layout||"middle"===
    k.verticalAlign||k.floating||(l/=2);p&&(l=Math.min(l,p));x.length=0;d>l&&!1!==e.enabled?(this.clipHeight=n=Math.max(l-20-this.titleHeight-m,0),this.currentPage=K(this.currentPage,1),this.fullHeight=d,t.forEach(function(b,a){var e=b._legendItemPos[1],d=Math.round(b.legendItem.getBBox().height),h=x.length;if(!h||e-x[h-1]>n&&(r||e)!==x[h-1])x.push(r||e),h++;b.pageIx=h-1;r&&(t[a-1].pageIx=h-1);a===t.length-1&&e+d-x[h-1]>n&&e!==r&&(x.push(e),b.pageIx=h);e!==r&&(r=e);}),g||(g=a.clipRect=f.clipRect(0,m,9999,
    0),a.contentGroup.clip(g)),v(n),z||(this.nav=z=f.g().attr({zIndex:1}).add(this.group),this.up=f.symbol("triangle",0,0,h,h).add(z),q("upTracker").on("click",function(){a.scroll(-1,b);}),this.pager=f.text("",15,10).addClass("highcharts-legend-navigation"),c.styledMode||this.pager.css(e.style),this.pager.add(z),this.down=f.symbol("triangle-down",0,0,h,h).add(z),q("downTracker").on("click",function(){a.scroll(1,b);})),a.scroll(0),d=l):z&&(v(),this.nav=z.destroy(),this.scrollGroup.attr({translateY:1}),this.clipHeight=
    0);return d};d.prototype.scroll=function(d,a){var c=this,f=this.chart,k=this.pages,l=k.length,m=this.currentPage+d;d=this.clipHeight;var p=this.options.navigation,n=this.pager,g=this.padding;m>l&&(m=l);0<m&&("undefined"!==typeof a&&r(a,f),this.nav.attr({translateX:g,translateY:d+this.padding+7+this.titleHeight,visibility:"visible"}),[this.up,this.upTracker].forEach(function(a){a.attr({"class":1===m?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"});}),n.attr({text:m+"/"+l}),[this.down,
    this.downTracker].forEach(function(a){a.attr({x:18+this.pager.getBBox().width,"class":m===l?"highcharts-legend-nav-inactive":"highcharts-legend-nav-active"});},this),f.styledMode||(this.up.attr({fill:1===m?p.inactiveColor:p.activeColor}),this.upTracker.css({cursor:1===m?"default":"pointer"}),this.down.attr({fill:m===l?p.inactiveColor:p.activeColor}),this.downTracker.css({cursor:m===l?"default":"pointer"})),this.scrollOffset=-k[m-1]+this.initialItemY,this.scrollGroup.animate({translateY:this.scrollOffset}),
    this.currentPage=m,this.positionCheckboxes(),a=y(K(a,f.renderer.globalAnimation,!0)),I(function(){t(c,"afterScroll",{currentPage:m});},a.duration||0));};return d}();(/Trident\/7\.0/.test(d.navigator&&d.navigator.userAgent)||p)&&c(l.prototype,"positionItem",function(d,c){var a=this,f=function(){c._legendItemPos&&d.call(a,c);};f();a.bubbleLegend||setTimeout(f);});g.Legend=l;return g.Legend});O(q,"parts/Chart.js",[q["parts/Axis.js"],q["parts/Globals.js"],q["parts/Legend.js"],q["parts/MSPointer.js"],q["parts/Options.js"],
    q["parts/Pointer.js"],q["parts/Time.js"],q["parts/Utilities.js"]],function(g,c,q,y,B,H,D,J){var t=c.charts,G=c.doc,L=c.seriesTypes,v=c.win,K=B.defaultOptions,n=J.addEvent,r=J.animate,C=J.animObject,I=J.attr,p=J.createElement,m=J.css,d=J.defined,l=J.discardElement,k=J.erase,f=J.error,a=J.extend,A=J.find,u=J.fireEvent,E=J.getStyle,P=J.isArray,w=J.isFunction,M=J.isNumber,F=J.isObject,Q=J.isString,e=J.merge,b=J.numberFormat,h=J.objectEach,z=J.pick,x=J.pInt,N=J.relativeLength,aa=J.removeEvent,Z=J.setAnimation,
    V=J.splat,Y=J.syncTimeout,ba=J.uniqueKey,U=c.marginNames,X=function(){function B(b,a,e){this.yAxis=this.xAxis=this.userOptions=this.titleOffset=this.time=this.symbolCounter=this.spacingBox=this.spacing=this.series=this.renderTo=this.renderer=this.pointer=this.pointCount=this.plotWidth=this.plotTop=this.plotLeft=this.plotHeight=this.plotBox=this.options=this.numberFormatter=this.margin=this.legend=this.labelCollectors=this.isResizing=this.index=this.container=this.colorCounter=this.clipBox=this.chartWidth=
    this.chartHeight=this.bounds=this.axisOffset=this.axes=void 0;this.getArgs(b,a,e);}B.prototype.getArgs=function(b,a,e){Q(b)||b.nodeName?(this.renderTo=b,this.init(a,e)):this.init(b,a);};B.prototype.init=function(a,d){var f,l=a.series,k=a.plotOptions||{};u(this,"init",{args:arguments},function(){a.series=null;f=e(K,a);var m=f.chart||{};h(f.plotOptions,function(b,a){F(b)&&(b.tooltip=k[a]&&e(k[a].tooltip)||void 0);});f.tooltip.userOptions=a.chart&&a.chart.forExport&&a.tooltip.userOptions||a.tooltip;f.series=
    a.series=l;this.userOptions=a;var p=m.events;this.margin=[];this.spacing=[];this.bounds={h:{},v:{}};this.labelCollectors=[];this.callback=d;this.isResizing=0;this.options=f;this.axes=[];this.series=[];this.time=a.time&&Object.keys(a.time).length?new D(a.time):c.time;this.numberFormatter=m.numberFormatter||b;this.styledMode=m.styledMode;this.hasCartesianSeries=m.showAxes;var g=this;g.index=t.length;t.push(g);c.chartCount++;p&&h(p,function(b,a){w(b)&&n(g,a,b);});g.xAxis=[];g.yAxis=[];g.pointCount=g.colorCounter=
    g.symbolCounter=0;u(g,"afterInit");g.firstRender();});};B.prototype.initSeries=function(b){var a=this.options.chart;a=b.type||a.type||a.defaultSeriesType;var e=L[a];e||f(17,!0,this,{missingModuleFor:a});a=new e;a.init(this,b);return a};B.prototype.setSeriesData=function(){this.getSeriesOrderByLinks().forEach(function(b){b.points||b.data||!b.enabledDataSorting||b.setData(b.options.data,!1);});};B.prototype.getSeriesOrderByLinks=function(){return this.series.concat().sort(function(b,a){return b.linkedSeries.length||
    a.linkedSeries.length?a.linkedSeries.length-b.linkedSeries.length:0})};B.prototype.orderSeries=function(b){var a=this.series;for(b=b||0;b<a.length;b++)a[b]&&(a[b].index=b,a[b].name=a[b].getName());};B.prototype.isInsidePlot=function(b,a,e){var d=e?a:b;b=e?b:a;d={x:d,y:b,isInsidePlot:0<=d&&d<=this.plotWidth&&0<=b&&b<=this.plotHeight};u(this,"afterIsInsidePlot",d);return d.isInsidePlot};B.prototype.redraw=function(b){u(this,"beforeRedraw");var e=this,d=e.axes,h=e.series,c=e.pointer,f=e.legend,l=e.userOptions.legend,
    k=e.isDirtyLegend,m=e.hasCartesianSeries,p=e.isDirtyBox,g=e.renderer,n=g.isHidden(),x=[];e.setResponsive&&e.setResponsive(!1);Z(e.hasRendered?b:!1,e);n&&e.temporaryDisplay();e.layOutTitles();for(b=h.length;b--;){var z=h[b];if(z.options.stacking){var w=!0;if(z.isDirty){var r=!0;break}}}if(r)for(b=h.length;b--;)z=h[b],z.options.stacking&&(z.isDirty=!0);h.forEach(function(b){b.isDirty&&("point"===b.options.legendType?(b.updateTotals&&b.updateTotals(),k=!0):l&&(l.labelFormatter||l.labelFormat)&&(k=!0));
    b.isDirtyData&&u(b,"updatedData");});k&&f&&f.options.enabled&&(f.render(),e.isDirtyLegend=!1);w&&e.getStacks();m&&d.forEach(function(b){e.isResizing&&M(b.min)||(b.updateNames(),b.setScale());});e.getMargins();m&&(d.forEach(function(b){b.isDirty&&(p=!0);}),d.forEach(function(b){var e=b.min+","+b.max;b.extKey!==e&&(b.extKey=e,x.push(function(){u(b,"afterSetExtremes",a(b.eventArgs,b.getExtremes()));delete b.eventArgs;}));(p||w)&&b.redraw();}));p&&e.drawChartBox();u(e,"predraw");h.forEach(function(b){(p||
    b.isDirty)&&b.visible&&b.redraw();b.isDirtyData=!1;});c&&c.reset(!0);g.draw();u(e,"redraw");u(e,"render");n&&e.temporaryDisplay(!0);x.forEach(function(b){b.call();});};B.prototype.get=function(b){function a(a){return a.id===b||a.options&&a.options.id===b}var e=this.series,d;var h=A(this.axes,a)||A(this.series,a);for(d=0;!h&&d<e.length;d++)h=A(e[d].points||[],a);return h};B.prototype.getAxes=function(){var b=this,a=this.options,e=a.xAxis=V(a.xAxis||{});a=a.yAxis=V(a.yAxis||{});u(this,"getAxes");e.forEach(function(b,
    a){b.index=a;b.isX=!0;});a.forEach(function(b,a){b.index=a;});e.concat(a).forEach(function(a){new g(b,a);});u(this,"afterGetAxes");};B.prototype.getSelectedPoints=function(){var b=[];this.series.forEach(function(a){b=b.concat(a.getPointsCollection().filter(function(b){return z(b.selectedStaging,b.selected)}));});return b};B.prototype.getSelectedSeries=function(){return this.series.filter(function(b){return b.selected})};B.prototype.setTitle=function(b,a,e){this.applyDescription("title",b);this.applyDescription("subtitle",
    a);this.applyDescription("caption",void 0);this.layOutTitles(e);};B.prototype.applyDescription=function(b,a){var d=this,h="title"===b?{color:"#333333",fontSize:this.options.isStock?"16px":"18px"}:{color:"#666666"};h=this.options[b]=e(!this.styledMode&&{style:h},this.options[b],a);var c=this[b];c&&a&&(this[b]=c=c.destroy());h&&!c&&(c=this.renderer.text(h.text,0,0,h.useHTML).attr({align:h.align,"class":"highcharts-"+b,zIndex:h.zIndex||4}).add(),c.update=function(a){d[{title:"setTitle",subtitle:"setSubtitle",
    caption:"setCaption"}[b]](a);},this.styledMode||c.css(h.style),this[b]=c);};B.prototype.layOutTitles=function(b){var e=[0,0,0],d=this.renderer,h=this.spacingBox;["title","subtitle","caption"].forEach(function(b){var c=this[b],f=this.options[b],l=f.verticalAlign||"top";b="title"===b?-3:"top"===l?e[0]+2:0;if(c){if(!this.styledMode)var k=f.style.fontSize;k=d.fontMetrics(k,c).b;c.css({width:(f.width||h.width+(f.widthAdjust||0))+"px"});var m=Math.round(c.getBBox(f.useHTML).height);c.align(a({y:"bottom"===
    l?k:b+k,height:m},f),!1,"spacingBox");f.floating||("top"===l?e[0]=Math.ceil(e[0]+m):"bottom"===l&&(e[2]=Math.ceil(e[2]+m)));}},this);e[0]&&"top"===(this.options.title.verticalAlign||"top")&&(e[0]+=this.options.title.margin);e[2]&&"bottom"===this.options.caption.verticalAlign&&(e[2]+=this.options.caption.margin);var c=!this.titleOffset||this.titleOffset.join(",")!==e.join(",");this.titleOffset=e;u(this,"afterLayOutTitles");!this.isDirtyBox&&c&&(this.isDirtyBox=this.isDirtyLegend=c,this.hasRendered&&
    z(b,!0)&&this.isDirtyBox&&this.redraw());};B.prototype.getChartSize=function(){var b=this.options.chart,a=b.width;b=b.height;var e=this.renderTo;d(a)||(this.containerWidth=E(e,"width"));d(b)||(this.containerHeight=E(e,"height"));this.chartWidth=Math.max(0,a||this.containerWidth||600);this.chartHeight=Math.max(0,N(b,this.chartWidth)||(1<this.containerHeight?this.containerHeight:400));};B.prototype.temporaryDisplay=function(b){var a=this.renderTo;if(b)for(;a&&a.style;)a.hcOrigStyle&&(m(a,a.hcOrigStyle),
    delete a.hcOrigStyle),a.hcOrigDetached&&(G.body.removeChild(a),a.hcOrigDetached=!1),a=a.parentNode;else for(;a&&a.style;){G.body.contains(a)||a.parentNode||(a.hcOrigDetached=!0,G.body.appendChild(a));if("none"===E(a,"display",!1)||a.hcOricDetached)a.hcOrigStyle={display:a.style.display,height:a.style.height,overflow:a.style.overflow},b={display:"block",overflow:"hidden"},a!==this.renderTo&&(b.height=0),m(a,b),a.offsetWidth||a.style.setProperty("display","block","important");a=a.parentNode;if(a===
    G.body)break}};B.prototype.setClassName=function(b){this.container.className="highcharts-container "+(b||"");};B.prototype.getContainer=function(){var b=this.options,e=b.chart;var d=this.renderTo;var h=ba(),l,k;d||(this.renderTo=d=e.renderTo);Q(d)&&(this.renderTo=d=G.getElementById(d));d||f(13,!0,this);var g=x(I(d,"data-highcharts-chart"));M(g)&&t[g]&&t[g].hasRendered&&t[g].destroy();I(d,"data-highcharts-chart",this.index);d.innerHTML="";e.skipClone||d.offsetWidth||this.temporaryDisplay();this.getChartSize();
    g=this.chartWidth;var n=this.chartHeight;m(d,{overflow:"hidden"});this.styledMode||(l=a({position:"relative",overflow:"hidden",width:g+"px",height:n+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)",userSelect:"none"},e.style));this.container=d=p("div",{id:h},l,d);this._cursor=d.style.cursor;this.renderer=new (c[e.renderer]||c.Renderer)(d,g,n,null,e.forExport,b.exporting&&b.exporting.allowHTML,this.styledMode);Z(void 0,this);this.setClassName(e.className);
    if(this.styledMode)for(k in b.defs)this.renderer.definition(b.defs[k]);else this.renderer.setStyle(e.style);this.renderer.chartIndex=this.index;u(this,"afterGetContainer");};B.prototype.getMargins=function(b){var a=this.spacing,e=this.margin,h=this.titleOffset;this.resetMargins();h[0]&&!d(e[0])&&(this.plotTop=Math.max(this.plotTop,h[0]+a[0]));h[2]&&!d(e[2])&&(this.marginBottom=Math.max(this.marginBottom,h[2]+a[2]));this.legend&&this.legend.display&&this.legend.adjustMargins(e,a);u(this,"getMargins");
    b||this.getAxisMargins();};B.prototype.getAxisMargins=function(){var b=this,a=b.axisOffset=[0,0,0,0],e=b.colorAxis,h=b.margin,c=function(b){b.forEach(function(b){b.visible&&b.getOffset();});};b.hasCartesianSeries?c(b.axes):e&&e.length&&c(e);U.forEach(function(e,c){d(h[c])||(b[e]+=a[c]);});b.setChartSize();};B.prototype.reflow=function(b){var a=this,e=a.options.chart,h=a.renderTo,c=d(e.width)&&d(e.height),f=e.width||E(h,"width");e=e.height||E(h,"height");h=b?b.target:v;if(!c&&!a.isPrinting&&f&&e&&(h===
    v||h===G)){if(f!==a.containerWidth||e!==a.containerHeight)J.clearTimeout(a.reflowTimeout),a.reflowTimeout=Y(function(){a.container&&a.setSize(void 0,void 0,!1);},b?100:0);a.containerWidth=f;a.containerHeight=e;}};B.prototype.setReflow=function(b){var a=this;!1===b||this.unbindReflow?!1===b&&this.unbindReflow&&(this.unbindReflow=this.unbindReflow()):(this.unbindReflow=n(v,"resize",function(b){a.options&&a.reflow(b);}),n(this,"destroy",this.unbindReflow));};B.prototype.setSize=function(b,a,e){var d=this,
    h=d.renderer;d.isResizing+=1;Z(e,d);e=h.globalAnimation;d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;"undefined"!==typeof b&&(d.options.chart.width=b);"undefined"!==typeof a&&(d.options.chart.height=a);d.getChartSize();d.styledMode||(e?r:m)(d.container,{width:d.chartWidth+"px",height:d.chartHeight+"px"},e);d.setChartSize(!0);h.setSize(d.chartWidth,d.chartHeight,e);d.axes.forEach(function(b){b.isDirty=!0;b.setScale();});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();d.getMargins();
    d.redraw(e);d.oldChartHeight=null;u(d,"resize");Y(function(){d&&u(d,"endResize",null,function(){--d.isResizing;});},C(e).duration||0);};B.prototype.setChartSize=function(b){var a=this.inverted,e=this.renderer,d=this.chartWidth,h=this.chartHeight,c=this.options.chart,f=this.spacing,l=this.clipOffset,k,m,p,g;this.plotLeft=k=Math.round(this.plotLeft);this.plotTop=m=Math.round(this.plotTop);this.plotWidth=p=Math.max(0,Math.round(d-k-this.marginRight));this.plotHeight=g=Math.max(0,Math.round(h-m-this.marginBottom));
    this.plotSizeX=a?g:p;this.plotSizeY=a?p:g;this.plotBorderWidth=c.plotBorderWidth||0;this.spacingBox=e.spacingBox={x:f[3],y:f[0],width:d-f[3]-f[1],height:h-f[0]-f[2]};this.plotBox=e.plotBox={x:k,y:m,width:p,height:g};d=2*Math.floor(this.plotBorderWidth/2);a=Math.ceil(Math.max(d,l[3])/2);e=Math.ceil(Math.max(d,l[0])/2);this.clipBox={x:a,y:e,width:Math.floor(this.plotSizeX-Math.max(d,l[1])/2-a),height:Math.max(0,Math.floor(this.plotSizeY-Math.max(d,l[2])/2-e))};b||this.axes.forEach(function(b){b.setAxisSize();
    b.setAxisTranslation();});u(this,"afterSetChartSize",{skipAxes:b});};B.prototype.resetMargins=function(){u(this,"resetMargins");var b=this,a=b.options.chart;["margin","spacing"].forEach(function(e){var d=a[e],h=F(d)?d:[d,d,d,d];["Top","Right","Bottom","Left"].forEach(function(d,c){b[e][c]=z(a[e+d],h[c]);});});U.forEach(function(a,e){b[a]=z(b.margin[e],b.spacing[e]);});b.axisOffset=[0,0,0,0];b.clipOffset=[0,0,0,0];};B.prototype.drawChartBox=function(){var b=this.options.chart,a=this.renderer,e=this.chartWidth,
    d=this.chartHeight,h=this.chartBackground,c=this.plotBackground,f=this.plotBorder,l=this.styledMode,k=this.plotBGImage,m=b.backgroundColor,p=b.plotBackgroundColor,g=b.plotBackgroundImage,n,x=this.plotLeft,z=this.plotTop,w=this.plotWidth,r=this.plotHeight,t=this.plotBox,A=this.clipRect,v=this.clipBox,q="animate";h||(this.chartBackground=h=a.rect().addClass("highcharts-background").add(),q="attr");if(l)var C=n=h.strokeWidth();else{C=b.borderWidth||0;n=C+(b.shadow?8:0);m={fill:m||"none"};if(C||h["stroke-width"])m.stroke=
    b.borderColor,m["stroke-width"]=C;h.attr(m).shadow(b.shadow);}h[q]({x:n/2,y:n/2,width:e-n-C%2,height:d-n-C%2,r:b.borderRadius});q="animate";c||(q="attr",this.plotBackground=c=a.rect().addClass("highcharts-plot-background").add());c[q](t);l||(c.attr({fill:p||"none"}).shadow(b.plotShadow),g&&(k?(g!==k.attr("href")&&k.attr("href",g),k.animate(t)):this.plotBGImage=a.image(g,x,z,w,r).add()));A?A.animate({width:v.width,height:v.height}):this.clipRect=a.clipRect(v);q="animate";f||(q="attr",this.plotBorder=
    f=a.rect().addClass("highcharts-plot-border").attr({zIndex:1}).add());l||f.attr({stroke:b.plotBorderColor,"stroke-width":b.plotBorderWidth||0,fill:"none"});f[q](f.crisp({x:x,y:z,width:w,height:r},-f.strokeWidth()));this.isDirtyBox=!1;u(this,"afterDrawChartBox");};B.prototype.propFromSeries=function(){var b=this,a=b.options.chart,e,d=b.options.series,h,c;["inverted","angular","polar"].forEach(function(f){e=L[a.type||a.defaultSeriesType];c=a[f]||e&&e.prototype[f];for(h=d&&d.length;!c&&h--;)(e=L[d[h].type])&&
    e.prototype[f]&&(c=!0);b[f]=c;});};B.prototype.linkSeries=function(){var b=this,a=b.series;a.forEach(function(b){b.linkedSeries.length=0;});a.forEach(function(a){var e=a.options.linkedTo;Q(e)&&(e=":previous"===e?b.series[a.index-1]:b.get(e))&&e.linkedParent!==a&&(e.linkedSeries.push(a),a.linkedParent=e,e.enabledDataSorting&&a.setDataSortingOptions(),a.visible=z(a.options.visible,e.options.visible,a.visible));});u(this,"afterLinkSeries");};B.prototype.renderSeries=function(){this.series.forEach(function(b){b.translate();
    b.render();});};B.prototype.renderLabels=function(){var b=this,e=b.options.labels;e.items&&e.items.forEach(function(d){var h=a(e.style,d.style),c=x(h.left)+b.plotLeft,f=x(h.top)+b.plotTop+12;delete h.left;delete h.top;b.renderer.text(d.html,c,f).attr({zIndex:2}).css(h).add();});};B.prototype.render=function(){var b=this.axes,a=this.colorAxis,e=this.renderer,d=this.options,h=0,c=function(b){b.forEach(function(b){b.visible&&b.render();});};this.setTitle();this.legend=new q(this,d.legend);this.getStacks&&
    this.getStacks();this.getMargins(!0);this.setChartSize();d=this.plotWidth;b.some(function(b){if(b.horiz&&b.visible&&b.options.labels.enabled&&b.series.length)return h=21,!0});var f=this.plotHeight=Math.max(this.plotHeight-h,0);b.forEach(function(b){b.setScale();});this.getAxisMargins();var l=1.1<d/this.plotWidth;var k=1.05<f/this.plotHeight;if(l||k)b.forEach(function(b){(b.horiz&&l||!b.horiz&&k)&&b.setTickInterval(!0);}),this.getMargins();this.drawChartBox();this.hasCartesianSeries?c(b):a&&a.length&&
    c(a);this.seriesGroup||(this.seriesGroup=e.g("series-group").attr({zIndex:3}).add());this.renderSeries();this.renderLabels();this.addCredits();this.setResponsive&&this.setResponsive();this.updateContainerScaling();this.hasRendered=!0;};B.prototype.addCredits=function(b){var a=this,d=e(!0,this.options.credits,b);d.enabled&&!this.credits&&(this.credits=this.renderer.text(d.text+(this.mapCredits||""),0,0).addClass("highcharts-credits").on("click",function(){d.href&&(v.location.href=d.href);}).attr({align:d.position.align,
    zIndex:8}),a.styledMode||this.credits.css(d.style),this.credits.add().align(d.position),this.credits.update=function(b){a.credits=a.credits.destroy();a.addCredits(b);});};B.prototype.updateContainerScaling=function(){var b=this.container;if(2<b.offsetWidth&&2<b.offsetHeight&&b.getBoundingClientRect){var a=b.getBoundingClientRect(),e=a.width/b.offsetWidth;b=a.height/b.offsetHeight;1!==e||1!==b?this.containerScaling={scaleX:e,scaleY:b}:delete this.containerScaling;}};B.prototype.destroy=function(){var b=
    this,a=b.axes,e=b.series,d=b.container,f,m=d&&d.parentNode;u(b,"destroy");b.renderer.forExport?k(t,b):t[b.index]=void 0;c.chartCount--;b.renderTo.removeAttribute("data-highcharts-chart");aa(b);for(f=a.length;f--;)a[f]=a[f].destroy();this.scroller&&this.scroller.destroy&&this.scroller.destroy();for(f=e.length;f--;)e[f]=e[f].destroy();"title subtitle chartBackground plotBackground plotBGImage plotBorder seriesGroup clipRect credits pointer rangeSelector legend resetZoomButton tooltip renderer".split(" ").forEach(function(a){var e=
    b[a];e&&e.destroy&&(b[a]=e.destroy());});d&&(d.innerHTML="",aa(d),m&&l(d));h(b,function(a,e){delete b[e];});};B.prototype.firstRender=function(){var b=this,a=b.options;if(!b.isReadyToRender||b.isReadyToRender()){b.getContainer();b.resetMargins();b.setChartSize();b.propFromSeries();b.getAxes();(P(a.series)?a.series:[]).forEach(function(a){b.initSeries(a);});b.linkSeries();b.setSeriesData();u(b,"beforeRender");H&&(b.pointer=c.hasTouch||!v.PointerEvent&&!v.MSPointerEvent?new H(b,a):new y(b,a));b.render();
    if(!b.renderer.imgCount&&!b.hasLoaded)b.onload();b.temporaryDisplay(!0);}};B.prototype.onload=function(){this.callbacks.concat([this.callback]).forEach(function(b){b&&"undefined"!==typeof this.index&&b.apply(this,[this]);},this);u(this,"load");u(this,"render");d(this.index)&&this.setReflow(this.options.chart.reflow);this.hasLoaded=!0;};return B}();X.prototype.callbacks=[];c.chart=function(b,a,e){return new X(b,a,e)};return c.Chart=X});O(q,"parts/ScrollablePlotArea.js",[q["parts/Chart.js"],q["parts/Globals.js"],
    q["parts/Utilities.js"]],function(g,c,q){var y=q.addEvent,B=q.createElement,H=q.pick,D=q.stop;y(g,"afterSetChartSize",function(g){var t=this.options.chart.scrollablePlotArea,q=t&&t.minWidth;t=t&&t.minHeight;if(!this.renderer.forExport){if(q){if(this.scrollablePixelsX=q=Math.max(0,q-this.chartWidth)){this.plotWidth+=q;this.inverted?(this.clipBox.height+=q,this.plotBox.height+=q):(this.clipBox.width+=q,this.plotBox.width+=q);var y={1:{name:"right",value:q}};}}else t&&(this.scrollablePixelsY=q=Math.max(0,
    t-this.chartHeight))&&(this.plotHeight+=q,this.inverted?(this.clipBox.width+=q,this.plotBox.width+=q):(this.clipBox.height+=q,this.plotBox.height+=q),y={2:{name:"bottom",value:q}});y&&!g.skipAxes&&this.axes.forEach(function(g){y[g.side]?g.getPlotLinePath=function(){var t=y[g.side].name,n=this[t];this[t]=n-y[g.side].value;var r=c.Axis.prototype.getPlotLinePath.apply(this,arguments);this[t]=n;return r}:(g.setAxisSize(),g.setAxisTranslation());});}});y(g,"render",function(){this.scrollablePixelsX||this.scrollablePixelsY?
    (this.setUpScrolling&&this.setUpScrolling(),this.applyFixed()):this.fixedDiv&&this.applyFixed();});g.prototype.setUpScrolling=function(){var c=this,g={WebkitOverflowScrolling:"touch",overflowX:"hidden",overflowY:"hidden"};this.scrollablePixelsX&&(g.overflowX="auto");this.scrollablePixelsY&&(g.overflowY="auto");this.scrollingContainer=B("div",{className:"highcharts-scrolling"},g,this.renderTo);y(this.scrollingContainer,"scroll",function(){c.pointer&&delete c.pointer.chartPosition;});this.innerContainer=
    B("div",{className:"highcharts-inner-container"},null,this.scrollingContainer);this.innerContainer.appendChild(this.container);this.setUpScrolling=null;};g.prototype.moveFixedElements=function(){var c=this.container,g=this.fixedRenderer,q=".highcharts-contextbutton .highcharts-credits .highcharts-legend .highcharts-legend-checkbox .highcharts-navigator-series .highcharts-navigator-xaxis .highcharts-navigator-yaxis .highcharts-navigator .highcharts-reset-zoom .highcharts-scrollbar .highcharts-subtitle .highcharts-title".split(" "),
    y;this.scrollablePixelsX&&!this.inverted?y=".highcharts-yaxis":this.scrollablePixelsX&&this.inverted?y=".highcharts-xaxis":this.scrollablePixelsY&&!this.inverted?y=".highcharts-xaxis":this.scrollablePixelsY&&this.inverted&&(y=".highcharts-yaxis");q.push(y,y+"-labels");q.forEach(function(t){[].forEach.call(c.querySelectorAll(t),function(c){(c.namespaceURI===g.SVG_NS?g.box:g.box.parentNode).appendChild(c);c.style.pointerEvents="auto";});});};g.prototype.applyFixed=function(){var g,t,q=!this.fixedDiv,L=
    this.options.chart.scrollablePlotArea;q?(this.fixedDiv=B("div",{className:"highcharts-fixed"},{position:"absolute",overflow:"hidden",pointerEvents:"none",zIndex:2},null,!0),this.renderTo.insertBefore(this.fixedDiv,this.renderTo.firstChild),this.renderTo.style.overflow="visible",this.fixedRenderer=t=new c.Renderer(this.fixedDiv,this.chartWidth,this.chartHeight,null===(g=this.options.chart)||void 0===g?void 0:g.style),this.scrollableMask=t.path().attr({fill:this.options.chart.backgroundColor||"#fff",
    "fill-opacity":H(L.opacity,.85),zIndex:-1}).addClass("highcharts-scrollable-mask").add(),this.moveFixedElements(),y(this,"afterShowResetZoom",this.moveFixedElements),y(this,"afterLayOutTitles",this.moveFixedElements)):this.fixedRenderer.setSize(this.chartWidth,this.chartHeight);g=this.chartWidth+(this.scrollablePixelsX||0);t=this.chartHeight+(this.scrollablePixelsY||0);D(this.container);this.container.style.width=g+"px";this.container.style.height=t+"px";this.renderer.boxWrapper.attr({width:g,height:t,
    viewBox:[0,0,g,t].join(" ")});this.chartBackground.attr({width:g,height:t});this.scrollingContainer.style.height=this.chartHeight+"px";q&&(L.scrollPositionX&&(this.scrollingContainer.scrollLeft=this.scrollablePixelsX*L.scrollPositionX),L.scrollPositionY&&(this.scrollingContainer.scrollTop=this.scrollablePixelsY*L.scrollPositionY));t=this.axisOffset;q=this.plotTop-t[0]-1;L=this.plotLeft-t[3]-1;g=this.plotTop+this.plotHeight+t[2]+1;t=this.plotLeft+this.plotWidth+t[1]+1;var v=this.plotLeft+this.plotWidth-
    (this.scrollablePixelsX||0),K=this.plotTop+this.plotHeight-(this.scrollablePixelsY||0);q=this.scrollablePixelsX?[["M",0,q],["L",this.plotLeft-1,q],["L",this.plotLeft-1,g],["L",0,g],["Z"],["M",v,q],["L",this.chartWidth,q],["L",this.chartWidth,g],["L",v,g],["Z"]]:this.scrollablePixelsY?[["M",L,0],["L",L,this.plotTop-1],["L",t,this.plotTop-1],["L",t,0],["Z"],["M",L,K],["L",L,this.chartHeight],["L",t,this.chartHeight],["L",t,K],["Z"]]:[["M",0,0]];"adjustHeight"!==this.redrawTrigger&&this.scrollableMask.attr({d:q});};});
    O(q,"parts/StackingAxis.js",[q["parts/Utilities.js"]],function(g){var c=g.addEvent,q=g.destroyObjectProperties,y=g.fireEvent,B=g.objectEach,H=g.pick,D=function(){function c(c){this.oldStacks={};this.stacks={};this.stacksTouched=0;this.axis=c;}c.prototype.buildStacks=function(){var c=this.axis,g=c.series,q=H(c.options.reversedStacks,!0),v=g.length,D;if(!c.isXAxis){this.usePercentage=!1;for(D=v;D--;){var n=g[q?D:v-D-1];n.setStackedPoints();n.setGroupedPoints();}for(D=0;D<v;D++)g[D].modifyStacks();y(c,
    "afterBuildStacks");}};c.prototype.cleanStacks=function(){if(!this.axis.isXAxis){if(this.oldStacks)var c=this.stacks=this.oldStacks;B(c,function(c){B(c,function(c){c.cumulative=c.total;});});}};c.prototype.resetStacks=function(){var c=this,g=c.stacks;c.axis.isXAxis||B(g,function(g){B(g,function(q,t){q.touched<c.stacksTouched?(q.destroy(),delete g[t]):(q.total=null,q.cumulative=null);});});};c.prototype.renderStackTotals=function(){var c=this.axis.chart,g=c.renderer,q=this.stacks,v=this.stackTotalGroup=this.stackTotalGroup||
    g.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();v.translate(c.plotLeft,c.plotTop);B(q,function(c){B(c,function(c){c.render(v);});});};return c}();return function(){function g(){}g.compose=function(q){c(q,"init",g.onInit);c(q,"destroy",g.onDestroy);};g.onDestroy=function(){var c=this.stacking;if(c){var g=c.stacks;B(g,function(c,t){q(c);g[t]=null;});c&&c.stackTotalGroup&&c.stackTotalGroup.destroy();}};g.onInit=function(){this.stacking||(this.stacking=new D(this));};return g}()});O(q,"mixins/legend-symbol.js",
    [q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=c.merge,y=c.pick;g.LegendSymbolMixin={drawRectangle:function(c,g){var q=c.symbolHeight,B=c.options.squareSymbol;g.legendSymbol=this.chart.renderer.rect(B?(c.symbolWidth-q)/2:0,c.baseline-q+1,B?q:c.symbolWidth,q,y(c.options.symbolRadius,q/2)).addClass("highcharts-point").attr({zIndex:3}).add(g.legendGroup);},drawLineMarker:function(c){var g=this.options,D=g.marker,B=c.symbolWidth,t=c.symbolHeight,G=t/2,L=this.chart.renderer,v=this.legendGroup;
    c=c.baseline-Math.round(.3*c.fontMetrics.b);var K={};this.chart.styledMode||(K={"stroke-width":g.lineWidth||0},g.dashStyle&&(K.dashstyle=g.dashStyle));this.legendLine=L.path(["M",0,c,"L",B,c]).addClass("highcharts-graph").attr(K).add(v);D&&!1!==D.enabled&&B&&(g=Math.min(y(D.radius,G),G),0===this.symbol.indexOf("url")&&(D=q(D,{width:t,height:t}),g=0),this.legendSymbol=D=L.symbol(this.symbol,B/2-g,c-g,2*g,2*g,D).addClass("highcharts-point").add(v),D.isMarker=!0);}};return g.LegendSymbolMixin});O(q,"parts/Point.js",
    [q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=c.animObject,y=c.defined,B=c.erase,H=c.extend,D=c.fireEvent,J=c.format,t=c.getNestedProperty,G=c.isArray,L=c.isNumber,v=c.isObject,K=c.syncTimeout,n=c.pick,r=c.removeEvent,C=c.uniqueKey;c=function(){function c(){this.colorIndex=this.category=void 0;this.formatPrefix="point";this.id=void 0;this.isNull=!1;this.percentage=this.options=this.name=void 0;this.selected=!1;this.total=this.series=void 0;this.visible=!0;this.x=void 0;}c.prototype.animateBeforeDestroy=
    function(){var c=this,m={x:c.startXPos,opacity:0},d,l=c.getGraphicalProps();l.singular.forEach(function(l){d="dataLabel"===l;c[l]=c[l].animate(d?{x:c[l].startXPos,y:c[l].startYPos,opacity:0}:m);});l.plural.forEach(function(d){c[d].forEach(function(d){d.element&&d.animate(H({x:c.startXPos},d.startYPos?{x:d.startXPos,y:d.startYPos}:{}));});});};c.prototype.applyOptions=function(p,m){var d=this.series,l=d.options.pointValKey||d.pointValKey;p=c.prototype.optionsToObject.call(this,p);H(this,p);this.options=
    this.options?H(this.options,p):p;p.group&&delete this.group;p.dataLabels&&delete this.dataLabels;l&&(this.y=c.prototype.getNestedProperty.call(this,l));this.formatPrefix=(this.isNull=n(this.isValid&&!this.isValid(),null===this.x||!L(this.y)))?"null":"point";this.selected&&(this.state="select");"name"in this&&"undefined"===typeof m&&d.xAxis&&d.xAxis.hasNames&&(this.x=d.xAxis.nameToX(this));"undefined"===typeof this.x&&d&&(this.x="undefined"===typeof m?d.autoIncrement(this):m);return this};c.prototype.destroy=
    function(){function c(){if(m.graphic||m.dataLabel||m.dataLabels)r(m),m.destroyElements();for(a in m)m[a]=null;}var m=this,d=m.series,l=d.chart;d=d.options.dataSorting;var k=l.hoverPoints,f=q(m.series.chart.renderer.globalAnimation),a;m.legendItem&&l.legend.destroyItem(m);k&&(m.setState(),B(k,m),k.length||(l.hoverPoints=null));if(m===l.hoverPoint)m.onMouseOut();d&&d.enabled?(this.animateBeforeDestroy(),K(c,f.duration)):c();l.pointCount--;};c.prototype.destroyElements=function(c){var m=this;c=m.getGraphicalProps(c);
    c.singular.forEach(function(d){m[d]=m[d].destroy();});c.plural.forEach(function(d){m[d].forEach(function(d){d.element&&d.destroy();});delete m[d];});};c.prototype.firePointEvent=function(c,m,d){var l=this,k=this.series.options;(k.point.events[c]||l.options&&l.options.events&&l.options.events[c])&&l.importEvents();"click"===c&&k.allowPointSelect&&(d=function(d){l.select&&l.select(null,d.ctrlKey||d.metaKey||d.shiftKey);});D(l,c,m,d);};c.prototype.getClassName=function(){return "highcharts-point"+(this.selected?
    " highcharts-point-select":"")+(this.negative?" highcharts-negative":"")+(this.isNull?" highcharts-null-point":"")+("undefined"!==typeof this.colorIndex?" highcharts-color-"+this.colorIndex:"")+(this.options.className?" "+this.options.className:"")+(this.zone&&this.zone.className?" "+this.zone.className.replace("highcharts-negative",""):"")};c.prototype.getGraphicalProps=function(c){var m=this,d=[],l,k={singular:[],plural:[]};c=c||{graphic:1,dataLabel:1};c.graphic&&d.push("graphic","shadowGroup");
    c.dataLabel&&d.push("dataLabel","dataLabelUpper","connector");for(l=d.length;l--;){var f=d[l];m[f]&&k.singular.push(f);}["dataLabel","connector"].forEach(function(a){var d=a+"s";c[a]&&m[d]&&k.plural.push(d);});return k};c.prototype.getLabelConfig=function(){return {x:this.category,y:this.y,color:this.color,colorIndex:this.colorIndex,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,total:this.total||this.stackTotal}};c.prototype.getNestedProperty=function(c){if(c)return 0===
    c.indexOf("custom.")?t(c,this.options):this[c]};c.prototype.getZone=function(){var c=this.series,m=c.zones;c=c.zoneAxis||"y";var d=0,l;for(l=m[d];this[c]>=l.value;)l=m[++d];this.nonZonedColor||(this.nonZonedColor=this.color);this.color=l&&l.color&&!this.options.color?l.color:this.nonZonedColor;return l};c.prototype.hasNewShapeType=function(){return (this.graphic&&(this.graphic.symbolName||this.graphic.element.nodeName))!==this.shapeType};c.prototype.init=function(c,m,d){this.series=c;this.applyOptions(m,
    d);this.id=y(this.id)?this.id:C();this.resolveColor();c.chart.pointCount++;D(this,"afterInit");return this};c.prototype.optionsToObject=function(g){var m={},d=this.series,l=d.options.keys,k=l||d.pointArrayMap||["y"],f=k.length,a=0,p=0;if(L(g)||null===g)m[k[0]]=g;else if(G(g))for(!l&&g.length>f&&(d=typeof g[0],"string"===d?m.name=g[0]:"number"===d&&(m.x=g[0]),a++);p<f;)l&&"undefined"===typeof g[a]||(0<k[p].indexOf(".")?c.prototype.setNestedProperty(m,g[a],k[p]):m[k[p]]=g[a]),a++,p++;else"object"===
    typeof g&&(m=g,g.dataLabels&&(d._hasPointLabels=!0),g.marker&&(d._hasPointMarkers=!0));return m};c.prototype.resolveColor=function(){var c=this.series;var m=c.chart.options.chart.colorCount;var d=c.chart.styledMode;delete this.nonZonedColor;d||this.options.color||(this.color=c.color);c.options.colorByPoint?(d||(m=c.options.colors||c.chart.options.colors,this.color=this.color||m[c.colorCounter],m=m.length),d=c.colorCounter,c.colorCounter++,c.colorCounter===m&&(c.colorCounter=0)):d=c.colorIndex;this.colorIndex=
    n(this.colorIndex,d);};c.prototype.setNestedProperty=function(c,m,d){d.split(".").reduce(function(d,c,f,a){d[c]=a.length-1===f?m:v(d[c],!0)?d[c]:{};return d[c]},c);return c};c.prototype.tooltipFormatter=function(c){var m=this.series,d=m.tooltipOptions,l=n(d.valueDecimals,""),k=d.valuePrefix||"",f=d.valueSuffix||"";m.chart.styledMode&&(c=m.chart.tooltip.styledModeFormat(c));(m.pointArrayMap||["y"]).forEach(function(a){a="{point."+a;if(k||f)c=c.replace(RegExp(a+"}","g"),k+a+"}"+f);c=c.replace(RegExp(a+
    "}","g"),a+":,."+l+"f}");});return J(c,{point:this,series:this.series},m.chart)};return c}();return g.Point=c});O(q,"parts/Series.js",[q["parts/Globals.js"],q["mixins/legend-symbol.js"],q["parts/Options.js"],q["parts/Point.js"],q["parts/SVGElement.js"],q["parts/Utilities.js"]],function(g,c,q,y,B,H){var D=q.defaultOptions,J=H.addEvent,t=H.animObject,G=H.arrayMax,L=H.arrayMin,v=H.clamp,K=H.correctFloat,n=H.defined,r=H.erase,C=H.error,I=H.extend,p=H.find,m=H.fireEvent,d=H.getNestedProperty,l=H.isArray,
    k=H.isFunction,f=H.isNumber,a=H.isString,A=H.merge,u=H.objectEach,E=H.pick,P=H.removeEvent;q=H.seriesType;var w=H.splat,M=H.syncTimeout;var F=g.seriesTypes,Q=g.win;g.Series=q("line",null,{lineWidth:2,allowPointSelect:!1,crisp:!0,showCheckbox:!1,animation:{duration:1E3},events:{},marker:{enabledThreshold:2,lineColor:"#ffffff",lineWidth:0,radius:4,states:{normal:{animation:!0},hover:{animation:{duration:50},enabled:!0,radiusPlus:2,lineWidthPlus:1},select:{fillColor:"#cccccc",lineColor:"#000000",
    lineWidth:2}}},point:{events:{}},dataLabels:{align:"center",formatter:function(){var a=this.series.chart.numberFormatter;return "number"!==typeof this.y?"":a(this.y,-1)},padding:5,style:{fontSize:"11px",fontWeight:"bold",color:"contrast",textOutline:"1px contrast"},verticalAlign:"bottom",x:0,y:0},cropThreshold:300,opacity:1,pointRange:0,softThreshold:!0,states:{normal:{animation:!0},hover:{animation:{duration:50},lineWidthPlus:1,marker:{},halo:{size:10,opacity:.25}},select:{animation:{duration:0}},
    inactive:{animation:{duration:50},opacity:.2}},stickyTracking:!0,turboThreshold:1E3,findNearestPointBy:"x"},{axisTypes:["xAxis","yAxis"],coll:"series",colorCounter:0,cropShoulder:1,directTouch:!1,eventsToUnbind:[],isCartesian:!0,parallelArrays:["x","y"],pointClass:y,requireSorting:!0,sorted:!0,init:function(a,b){m(this,"init",{options:b});var e=this,d=a.series,c;this.eventOptions=this.eventOptions||{};e.chart=a;e.options=b=e.setOptions(b);e.linkedSeries=[];e.bindAxes();I(e,{name:b.name,state:"",visible:!1!==
    b.visible,selected:!0===b.selected});var f=b.events;u(f,function(b,a){k(b)&&e.eventOptions[a]!==b&&(k(e.eventOptions[a])&&P(e,a,e.eventOptions[a]),e.eventOptions[a]=b,J(e,a,b));});if(f&&f.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;e.getColor();e.getSymbol();e.parallelArrays.forEach(function(b){e[b+"Data"]||(e[b+"Data"]=[]);});e.isCartesian&&(a.hasCartesianSeries=!0);d.length&&(c=d[d.length-1]);e._i=E(c&&c._i,-1)+1;e.opacity=e.options.opacity;a.orderSeries(this.insert(d));
    b.dataSorting&&b.dataSorting.enabled?e.setDataSortingOptions():e.points||e.data||e.setData(b.data,!1);m(this,"afterInit");},is:function(a){return F[a]&&this instanceof F[a]},insert:function(a){var b=this.options.index,e;if(f(b)){for(e=a.length;e--;)if(b>=E(a[e].options.index,a[e]._i)){a.splice(e+1,0,this);break}-1===e&&a.unshift(this);e+=1;}else a.push(this);return E(e,a.length-1)},bindAxes:function(){var a=this,b=a.options,d=a.chart,c;m(this,"bindAxes",null,function(){(a.axisTypes||[]).forEach(function(e){d[e].forEach(function(d){c=
    d.options;if(b[e]===c.index||"undefined"!==typeof b[e]&&b[e]===c.id||"undefined"===typeof b[e]&&0===c.index)a.insert(d.series),a[e]=d,d.isDirty=!0;});a[e]||a.optionalAxis===e||C(18,!0,d);});});m(this,"afterBindAxes");},updateParallelArrays:function(a,b){var e=a.series,d=arguments,c=f(b)?function(d){var c="y"===d&&e.toYData?e.toYData(a):a[d];e[d+"Data"][b]=c;}:function(a){Array.prototype[b].apply(e[a+"Data"],Array.prototype.slice.call(d,2));};e.parallelArrays.forEach(c);},hasData:function(){return this.visible&&
    "undefined"!==typeof this.dataMax&&"undefined"!==typeof this.dataMin||this.visible&&this.yData&&0<this.yData.length},autoIncrement:function(){var a=this.options,b=this.xIncrement,d,c=a.pointIntervalUnit,f=this.chart.time;b=E(b,a.pointStart,0);this.pointInterval=d=E(this.pointInterval,a.pointInterval,1);c&&(a=new f.Date(b),"day"===c?f.set("Date",a,f.get("Date",a)+d):"month"===c?f.set("Month",a,f.get("Month",a)+d):"year"===c&&f.set("FullYear",a,f.get("FullYear",a)+d),d=a.getTime()-b);this.xIncrement=
    b+d;return b},setDataSortingOptions:function(){var a=this.options;I(this,{requireSorting:!1,sorted:!1,enabledDataSorting:!0,allowDG:!1});n(a.pointRange)||(a.pointRange=1);},setOptions:function(a){var b=this.chart,e=b.options,d=e.plotOptions,c=b.userOptions||{};a=A(a);b=b.styledMode;var f={plotOptions:d,userOptions:a};m(this,"setOptions",f);var l=f.plotOptions[this.type],k=c.plotOptions||{};this.userOptions=f.userOptions;c=A(l,d.series,c.plotOptions&&c.plotOptions[this.type],a);this.tooltipOptions=
    A(D.tooltip,D.plotOptions.series&&D.plotOptions.series.tooltip,D.plotOptions[this.type].tooltip,e.tooltip.userOptions,d.series&&d.series.tooltip,d[this.type].tooltip,a.tooltip);this.stickyTracking=E(a.stickyTracking,k[this.type]&&k[this.type].stickyTracking,k.series&&k.series.stickyTracking,this.tooltipOptions.shared&&!this.noSharedTooltip?!0:c.stickyTracking);null===l.marker&&delete c.marker;this.zoneAxis=c.zoneAxis;e=this.zones=(c.zones||[]).slice();!c.negativeColor&&!c.negativeFillColor||c.zones||
    (d={value:c[this.zoneAxis+"Threshold"]||c.threshold||0,className:"highcharts-negative"},b||(d.color=c.negativeColor,d.fillColor=c.negativeFillColor),e.push(d));e.length&&n(e[e.length-1].value)&&e.push(b?{}:{color:this.color,fillColor:this.fillColor});m(this,"afterSetOptions",{options:c});return c},getName:function(){return E(this.options.name,"Series "+(this.index+1))},getCyclic:function(a,b,d){var e=this.chart,c=this.userOptions,h=a+"Index",f=a+"Counter",l=d?d.length:E(e.options.chart[a+"Count"],
    e[a+"Count"]);if(!b){var k=E(c[h],c["_"+h]);n(k)||(e.series.length||(e[f]=0),c["_"+h]=k=e[f]%l,e[f]+=1);d&&(b=d[k]);}"undefined"!==typeof k&&(this[h]=k);this[a]=b;},getColor:function(){this.chart.styledMode?this.getCyclic("color"):this.options.colorByPoint?this.options.color=null:this.getCyclic("color",this.options.color||D.plotOptions[this.type].color,this.chart.options.colors);},getPointsCollection:function(){return (this.hasGroupedData?this.points:this.data)||[]},getSymbol:function(){this.getCyclic("symbol",
    this.options.marker.symbol,this.chart.options.symbols);},findPointIndex:function(a,b){var e=a.id,d=a.x,c=this.points,l,k=this.options.dataSorting;if(e)var m=this.chart.get(e);else if(this.linkedParent||this.enabledDataSorting){var g=k&&k.matchByName?"name":"index";m=p(c,function(b){return !b.touched&&b[g]===a[g]});if(!m)return}if(m){var n=m&&m.index;"undefined"!==typeof n&&(l=!0);}"undefined"===typeof n&&f(d)&&(n=this.xData.indexOf(d,b));-1!==n&&"undefined"!==typeof n&&this.cropped&&(n=n>=this.cropStart?
    n-this.cropStart:n);!l&&c[n]&&c[n].touched&&(n=void 0);return n},drawLegendSymbol:c.drawLineMarker,updateData:function(a,b){var e=this.options,d=e.dataSorting,c=this.points,l=[],k,m,g,p=this.requireSorting,u=a.length===c.length,w=!0;this.xIncrement=null;a.forEach(function(b,a){var h=n(b)&&this.pointClass.prototype.optionsToObject.call({series:this},b)||{};var m=h.x;if(h.id||f(m)){if(m=this.findPointIndex(h,g),-1===m||"undefined"===typeof m?l.push(b):c[m]&&b!==e.data[m]?(c[m].update(b,!1,null,!1),
    c[m].touched=!0,p&&(g=m+1)):c[m]&&(c[m].touched=!0),!u||a!==m||d&&d.enabled||this.hasDerivedData)k=!0;}else l.push(b);},this);if(k)for(a=c.length;a--;)(m=c[a])&&!m.touched&&m.remove&&m.remove(!1,b);else!u||d&&d.enabled?w=!1:(a.forEach(function(b,a){c[a].update&&b!==c[a].y&&c[a].update(b,!1,null,!1);}),l.length=0);c.forEach(function(b){b&&(b.touched=!1);});if(!w)return !1;l.forEach(function(b){this.addPoint(b,!1,null,null,!1);},this);null===this.xIncrement&&this.xData&&this.xData.length&&(this.xIncrement=
    G(this.xData),this.autoIncrement());return !0},setData:function(e,b,d,c){var h=this,k=h.points,m=k&&k.length||0,g,p=h.options,n=h.chart,u=p.dataSorting,w=null,z=h.xAxis;w=p.turboThreshold;var r=this.xData,q=this.yData,A=(g=h.pointArrayMap)&&g.length,t=p.keys,v=0,F=1,M;e=e||[];g=e.length;b=E(b,!0);u&&u.enabled&&(e=this.sortData(e));!1!==c&&g&&m&&!h.cropped&&!h.hasGroupedData&&h.visible&&!h.isSeriesBoosting&&(M=this.updateData(e,d));if(!M){h.xIncrement=null;h.colorCounter=0;this.parallelArrays.forEach(function(b){h[b+
    "Data"].length=0;});if(w&&g>w)if(w=h.getFirstValidPoint(e),f(w))for(d=0;d<g;d++)r[d]=this.autoIncrement(),q[d]=e[d];else if(l(w))if(A)for(d=0;d<g;d++)c=e[d],r[d]=c[0],q[d]=c.slice(1,A+1);else for(t&&(v=t.indexOf("x"),F=t.indexOf("y"),v=0<=v?v:0,F=0<=F?F:1),d=0;d<g;d++)c=e[d],r[d]=c[v],q[d]=c[F];else C(12,!1,n);else for(d=0;d<g;d++)"undefined"!==typeof e[d]&&(c={series:h},h.pointClass.prototype.applyOptions.apply(c,[e[d]]),h.updateParallelArrays(c,d));q&&a(q[0])&&C(14,!0,n);h.data=[];h.options.data=
    h.userOptions.data=e;for(d=m;d--;)k[d]&&k[d].destroy&&k[d].destroy();z&&(z.minRange=z.userMinRange);h.isDirty=n.isDirtyBox=!0;h.isDirtyData=!!k;d=!1;}"point"===p.legendType&&(this.processData(),this.generatePoints());b&&n.redraw(d);},sortData:function(a){var b=this,e=b.options.dataSorting.sortKey||"y",c=function(b,a){return n(a)&&b.pointClass.prototype.optionsToObject.call({series:b},a)||{}};a.forEach(function(e,d){a[d]=c(b,e);a[d].index=d;},this);a.concat().sort(function(b,a){b=d(e,b);a=d(e,a);return a<
    b?-1:a>b?1:0}).forEach(function(b,a){b.x=a;},this);b.linkedSeries&&b.linkedSeries.forEach(function(b){var e=b.options,d=e.data;e.dataSorting&&e.dataSorting.enabled||!d||(d.forEach(function(e,h){d[h]=c(b,e);a[h]&&(d[h].x=a[h].x,d[h].index=h);}),b.setData(d,!1));});return a},getProcessedData:function(a){var b=this.xData,e=this.yData,d=b.length;var c=0;var f=this.xAxis,l=this.options;var k=l.cropThreshold;var m=a||this.getExtremesFromAll||l.getExtremesFromAll,g=this.isCartesian;a=f&&f.val2lin;l=!(!f||!f.logarithmic);
    var p=this.requireSorting;if(f){f=f.getExtremes();var n=f.min;var w=f.max;}if(g&&this.sorted&&!m&&(!k||d>k||this.forceCrop))if(b[d-1]<n||b[0]>w)b=[],e=[];else if(this.yData&&(b[0]<n||b[d-1]>w)){c=this.cropData(this.xData,this.yData,n,w);b=c.xData;e=c.yData;c=c.start;var u=!0;}for(k=b.length||1;--k;)if(d=l?a(b[k])-a(b[k-1]):b[k]-b[k-1],0<d&&("undefined"===typeof r||d<r))var r=d;else 0>d&&p&&(C(15,!1,this.chart),p=!1);return {xData:b,yData:e,cropped:u,cropStart:c,closestPointRange:r}},processData:function(a){var b=
    this.xAxis;if(this.isCartesian&&!this.isDirty&&!b.isDirty&&!this.yAxis.isDirty&&!a)return !1;a=this.getProcessedData();this.cropped=a.cropped;this.cropStart=a.cropStart;this.processedXData=a.xData;this.processedYData=a.yData;this.closestPointRange=this.basePointRange=a.closestPointRange;},cropData:function(a,b,d,c,f){var e=a.length,h=0,k=e,l;f=E(f,this.cropShoulder);for(l=0;l<e;l++)if(a[l]>=d){h=Math.max(0,l-f);break}for(d=l;d<e;d++)if(a[d]>c){k=d+f;break}return {xData:a.slice(h,k),yData:b.slice(h,k),
    start:h,end:k}},generatePoints:function(){var a=this.options,b=a.data,d=this.data,c,f=this.processedXData,k=this.processedYData,l=this.pointClass,g=f.length,p=this.cropStart||0,n=this.hasGroupedData;a=a.keys;var u=[],r;d||n||(d=[],d.length=b.length,d=this.data=d);a&&n&&(this.options.keys=!1);for(r=0;r<g;r++){var q=p+r;if(n){var A=(new l).init(this,[f[r]].concat(w(k[r])));A.dataGroup=this.groupMap[r];A.dataGroup.options&&(A.options=A.dataGroup.options,I(A,A.dataGroup.options),delete A.dataLabels);}else(A=
    d[q])||"undefined"===typeof b[q]||(d[q]=A=(new l).init(this,b[q],f[r]));A&&(A.index=q,u[r]=A);}this.options.keys=a;if(d&&(g!==(c=d.length)||n))for(r=0;r<c;r++)r!==p||n||(r+=g),d[r]&&(d[r].destroyElements(),d[r].plotX=void 0);this.data=d;this.points=u;m(this,"afterGeneratePoints");},getXExtremes:function(a){return {min:L(a),max:G(a)}},getExtremes:function(a,b){var d=this.xAxis,e=this.yAxis,c=this.processedXData||this.xData,k=[],g=0,p=0;var n=0;var w=this.requireSorting?this.cropShoulder:0,u=e?e.positiveValuesOnly:
    !1,r;a=a||this.stackedYData||this.processedYData||[];e=a.length;d&&(n=d.getExtremes(),p=n.min,n=n.max);for(r=0;r<e;r++){var q=c[r];var A=a[r];var t=(f(A)||l(A))&&(A.length||0<A||!u);q=b||this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||!d||(c[r+w]||q)>=p&&(c[r-w]||q)<=n;if(t&&q)if(t=A.length)for(;t--;)f(A[t])&&(k[g++]=A[t]);else k[g++]=A;}a={dataMin:L(k),dataMax:G(k)};m(this,"afterGetExtremes",{dataExtremes:a});return a},applyExtremes:function(){var a=this.getExtremes();this.dataMin=
    a.dataMin;this.dataMax=a.dataMax;return a},getFirstValidPoint:function(a){for(var b=null,d=a.length,e=0;null===b&&e<d;)b=a[e],e++;return b},translate:function(){this.processedXData||this.processData();this.generatePoints();var a=this.options,b=a.stacking,d=this.xAxis,c=d.categories,k=this.enabledDataSorting,g=this.yAxis,p=this.points,w=p.length,u=!!this.modifyValue,r,q=this.pointPlacementToXValue(),A=!!q,t=a.threshold,C=a.startFromThreshold?t:0,F,M=this.zoneAxis||"y",y=Number.MAX_VALUE;for(r=0;r<
    w;r++){var I=p[r],D=I.x,B=I.y,G=I.low,P=b&&g.stacking&&g.stacking.stacks[(this.negStacks&&B<(C?0:t)?"-":"")+this.stackKey];g.positiveValuesOnly&&null!==B&&0>=B&&(I.isNull=!0);I.plotX=F=K(v(d.translate(D,0,0,0,1,q,"flags"===this.type),-1E5,1E5));if(b&&this.visible&&P&&P[D]){var H=this.getStackIndicator(H,D,this.index);if(!I.isNull){var Q=P[D];var J=Q.points[H.key];}}l(J)&&(G=J[0],B=J[1],G===C&&H.key===P[D].base&&(G=E(f(t)&&t,g.min)),g.positiveValuesOnly&&0>=G&&(G=null),I.total=I.stackTotal=Q.total,
    I.percentage=Q.total&&I.y/Q.total*100,I.stackY=B,this.irregularWidths||Q.setOffset(this.pointXOffset||0,this.barW||0));I.yBottom=n(G)?v(g.translate(G,0,1,0,1),-1E5,1E5):null;u&&(B=this.modifyValue(B,I));I.plotY="number"===typeof B&&Infinity!==B?v(g.translate(B,0,1,0,1),-1E5,1E5):void 0;I.isInside=this.isPointInside(I);I.clientX=A?K(d.translate(D,0,0,0,1,q)):F;I.negative=I[M]<(a[M+"Threshold"]||t||0);I.category=c&&"undefined"!==typeof c[I.x]?c[I.x]:I.x;if(!I.isNull&&!1!==I.visible){"undefined"!==typeof L&&
    (y=Math.min(y,Math.abs(F-L)));var L=F;}I.zone=this.zones.length&&I.getZone();!I.graphic&&this.group&&k&&(I.isNew=!0);}this.closestPointRangePx=y;m(this,"afterTranslate");},getValidPoints:function(a,b,d){var e=this.chart;return (a||this.points||[]).filter(function(a){return b&&!e.isInsidePlot(a.plotX,a.plotY,e.inverted)?!1:!1!==a.visible&&(d||!a.isNull)})},getClipBox:function(a,b){var d=this.options,e=this.chart,c=e.inverted,f=this.xAxis,k=f&&this.yAxis,l=e.options.chart.scrollablePlotArea||{};a&&!1===
    d.clip&&k?a=c?{y:-e.chartWidth+k.len+k.pos,height:e.chartWidth,width:e.chartHeight,x:-e.chartHeight+f.len+f.pos}:{y:-k.pos,height:e.chartHeight,width:e.chartWidth,x:-f.pos}:(a=this.clipBox||e.clipBox,b&&(a.width=e.plotSizeX,a.x=(e.scrollablePixelsX||0)*(l.scrollPositionX||0)));return b?{width:a.width,x:a.x}:a},setClip:function(a){var b=this.chart,d=this.options,e=b.renderer,c=b.inverted,f=this.clipBox,k=this.getClipBox(a),l=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,k.height,d.xAxis,
    d.yAxis].join(),m=b[l],g=b[l+"m"];a&&(k.width=0,c&&(k.x=b.plotHeight+(!1!==d.clip?0:b.plotTop)));m?b.hasLoaded||m.attr(k):(a&&(b[l+"m"]=g=e.clipRect(c?b.plotSizeX+99:-99,c?-b.plotLeft:-b.plotTop,99,c?b.chartWidth:b.chartHeight)),b[l]=m=e.clipRect(k),m.count={length:0});a&&!m.count[this.index]&&(m.count[this.index]=!0,m.count.length+=1);if(!1!==d.clip||a)this.group.clip(a||f?m:b.clipRect),this.markerGroup.clip(g),this.sharedClipKey=l;a||(m.count[this.index]&&(delete m.count[this.index],--m.count.length),
    0===m.count.length&&l&&b[l]&&(f||(b[l]=b[l].destroy()),b[l+"m"]&&(b[l+"m"]=b[l+"m"].destroy())));},animate:function(a){var b=this.chart,d=t(this.options.animation);if(!b.hasRendered)if(a)this.setClip(d);else{var e=this.sharedClipKey;a=b[e];var c=this.getClipBox(d,!0);a&&a.animate(c,d);b[e+"m"]&&b[e+"m"].animate({width:c.width+99,x:c.x-(b.inverted?0:99)},d);}},afterAnimate:function(){this.setClip();m(this,"afterAnimate");this.finishedAnimating=!0;},drawPoints:function(){var a=this.points,b=this.chart,
    d,c,f=this.options.marker,k=this[this.specialGroup]||this.markerGroup,l=this.xAxis,m=E(f.enabled,!l||l.isRadial?!0:null,this.closestPointRangePx>=f.enabledThreshold*f.radius);if(!1!==f.enabled||this._hasPointMarkers)for(d=0;d<a.length;d++){var g=a[d];var p=(c=g.graphic)?"animate":"attr";var n=g.marker||{};var w=!!g.marker;if((m&&"undefined"===typeof n.enabled||n.enabled)&&!g.isNull&&!1!==g.visible){var u=E(n.symbol,this.symbol);var r=this.markerAttribs(g,g.selected&&"select");this.enabledDataSorting&&
    (g.startXPos=l.reversed?-r.width:l.width);var q=!1!==g.isInside;c?c[q?"show":"hide"](q).animate(r):q&&(0<r.width||g.hasImage)&&(g.graphic=c=b.renderer.symbol(u,r.x,r.y,r.width,r.height,w?n:f).add(k),this.enabledDataSorting&&b.hasRendered&&(c.attr({x:g.startXPos}),p="animate"));c&&"animate"===p&&c[q?"show":"hide"](q).animate(r);if(c&&!b.styledMode)c[p](this.pointAttribs(g,g.selected&&"select"));c&&c.addClass(g.getClassName(),!0);}else c&&(g.graphic=c.destroy());}},markerAttribs:function(a,b){var d=this.options,
    e=d.marker,c=a.marker||{},f=c.symbol||e.symbol,k=E(c.radius,e.radius);b&&(e=e.states[b],b=c.states&&c.states[b],k=E(b&&b.radius,e&&e.radius,k+(e&&e.radiusPlus||0)));a.hasImage=f&&0===f.indexOf("url");a.hasImage&&(k=0);a={x:d.crisp?Math.floor(a.plotX)-k:a.plotX-k,y:a.plotY-k};k&&(a.width=a.height=2*k);return a},pointAttribs:function(a,b){var d=this.options.marker,e=a&&a.options,c=e&&e.marker||{},f=this.color,k=e&&e.color,l=a&&a.color;e=E(c.lineWidth,d.lineWidth);var m=a&&a.zone&&a.zone.color;a=1;f=
    k||m||l||f;k=c.fillColor||d.fillColor||f;f=c.lineColor||d.lineColor||f;b=b||"normal";d=d.states[b];b=c.states&&c.states[b]||{};e=E(b.lineWidth,d.lineWidth,e+E(b.lineWidthPlus,d.lineWidthPlus,0));k=b.fillColor||d.fillColor||k;f=b.lineColor||d.lineColor||f;a=E(b.opacity,d.opacity,a);return {stroke:f,"stroke-width":e,fill:k,opacity:a}},destroy:function(a){var b=this,d=b.chart,e=/AppleWebKit\/533/.test(Q.navigator.userAgent),c,f,k=b.data||[],l,g;m(b,"destroy");this.removeEvents(a);(b.axisTypes||[]).forEach(function(a){(g=
    b[a])&&g.series&&(r(g.series,b),g.isDirty=g.forceRedraw=!0);});b.legendItem&&b.chart.legend.destroyItem(b);for(f=k.length;f--;)(l=k[f])&&l.destroy&&l.destroy();b.points=null;H.clearTimeout(b.animationTimeout);u(b,function(b,a){b instanceof B&&!b.survive&&(c=e&&"group"===a?"hide":"destroy",b[c]());});d.hoverSeries===b&&(d.hoverSeries=null);r(d.series,b);d.orderSeries();u(b,function(d,e){a&&"hcEvents"===e||delete b[e];});},getGraphPath:function(a,b,d){var e=this,c=e.options,f=c.step,h,k=[],l=[],m;a=a||
    e.points;(h=a.reversed)&&a.reverse();(f={right:1,center:2}[f]||f&&3)&&h&&(f=4-f);a=this.getValidPoints(a,!1,!(c.connectNulls&&!b&&!d));a.forEach(function(h,g){var p=h.plotX,r=h.plotY,w=a[g-1];(h.leftCliff||w&&w.rightCliff)&&!d&&(m=!0);h.isNull&&!n(b)&&0<g?m=!c.connectNulls:h.isNull&&!b?m=!0:(0===g||m?g=[["M",h.plotX,h.plotY]]:e.getPointSpline?g=[e.getPointSpline(a,h,g)]:f?(g=1===f?[["L",w.plotX,r]]:2===f?[["L",(w.plotX+p)/2,w.plotY],["L",(w.plotX+p)/2,r]]:[["L",p,w.plotY]],g.push(["L",p,r])):g=[["L",
    p,r]],l.push(h.x),f&&(l.push(h.x),2===f&&l.push(h.x)),k.push.apply(k,g),m=!1);});k.xMap=l;return e.graphPath=k},drawGraph:function(){var a=this,b=this.options,d=(this.gappedPath||this.getGraphPath).call(this),c=this.chart.styledMode,f=[["graph","highcharts-graph"]];c||f[0].push(b.lineColor||this.color||"#cccccc",b.dashStyle);f=a.getZonesGraphs(f);f.forEach(function(e,f){var h=e[0],k=a[h],l=k?"animate":"attr";k?(k.endX=a.preventGraphAnimation?null:d.xMap,k.animate({d:d})):d.length&&(a[h]=k=a.chart.renderer.path(d).addClass(e[1]).attr({zIndex:1}).add(a.group));
    k&&!c&&(h={stroke:e[2],"stroke-width":b.lineWidth,fill:a.fillGraph&&a.color||"none"},e[3]?h.dashstyle=e[3]:"square"!==b.linecap&&(h["stroke-linecap"]=h["stroke-linejoin"]="round"),k[l](h).shadow(2>f&&b.shadow));k&&(k.startX=d.xMap,k.isArea=d.isArea);});},getZonesGraphs:function(a){this.zones.forEach(function(b,d){d=["zone-graph-"+d,"highcharts-graph highcharts-zone-graph-"+d+" "+(b.className||"")];this.chart.styledMode||d.push(b.color||this.color,b.dashStyle||this.options.dashStyle);a.push(d);},this);
    return a},applyZones:function(){var a=this,b=this.chart,d=b.renderer,c=this.zones,f,k,l=this.clips||[],m,g=this.graph,p=this.area,n=Math.max(b.chartWidth,b.chartHeight),r=this[(this.zoneAxis||"y")+"Axis"],w=b.inverted,u,q,A,t=!1,C,F;if(c.length&&(g||p)&&r&&"undefined"!==typeof r.min){var M=r.reversed;var I=r.horiz;g&&!this.showLine&&g.hide();p&&p.hide();var y=r.getExtremes();c.forEach(function(e,c){f=M?I?b.plotWidth:0:I?0:r.toPixels(y.min)||0;f=v(E(k,f),0,n);k=v(Math.round(r.toPixels(E(e.value,y.max),
    !0)||0),0,n);t&&(f=k=r.toPixels(y.max));u=Math.abs(f-k);q=Math.min(f,k);A=Math.max(f,k);r.isXAxis?(m={x:w?A:q,y:0,width:u,height:n},I||(m.x=b.plotHeight-m.x)):(m={x:0,y:w?A:q,width:n,height:u},I&&(m.y=b.plotWidth-m.y));w&&d.isVML&&(m=r.isXAxis?{x:0,y:M?q:A,height:m.width,width:b.chartWidth}:{x:m.y-b.plotLeft-b.spacingBox.x,y:0,width:m.height,height:b.chartHeight});l[c]?l[c].animate(m):l[c]=d.clipRect(m);C=a["zone-area-"+c];F=a["zone-graph-"+c];g&&F&&F.clip(l[c]);p&&C&&C.clip(l[c]);t=e.value>y.max;
    a.resetZones&&0===k&&(k=void 0);});this.clips=l;}else a.visible&&(g&&g.show(!0),p&&p.show(!0));},invertGroups:function(a){function b(){["group","markerGroup"].forEach(function(b){d[b]&&(e.renderer.isVML&&d[b].attr({width:d.yAxis.len,height:d.xAxis.len}),d[b].width=d.yAxis.len,d[b].height=d.xAxis.len,d[b].invert(d.isRadialSeries?!1:a));});}var d=this,e=d.chart;d.xAxis&&(d.eventsToUnbind.push(J(e,"resize",b)),b(),d.invertGroups=b);},plotGroup:function(a,b,d,c,f){var e=this[a],h=!e;d={visibility:d,zIndex:c||
    .1};"undefined"===typeof this.opacity||this.chart.styledMode||(d.opacity=this.opacity);h&&(this[a]=e=this.chart.renderer.g().add(f));e.addClass("highcharts-"+b+" highcharts-series-"+this.index+" highcharts-"+this.type+"-series "+(n(this.colorIndex)?"highcharts-color-"+this.colorIndex+" ":"")+(this.options.className||"")+(e.hasClass("highcharts-tracker")?" highcharts-tracker":""),!0);e.attr(d)[h?"attr":"animate"](this.getPlotBox());return e},getPlotBox:function(){var a=this.chart,b=this.xAxis,d=this.yAxis;
    a.inverted&&(b=d,d=this.xAxis);return {translateX:b?b.left:a.plotLeft,translateY:d?d.top:a.plotTop,scaleX:1,scaleY:1}},removeEvents:function(a){a?this.eventsToUnbind.length&&(this.eventsToUnbind.forEach(function(b){b();}),this.eventsToUnbind.length=0):P(this);},render:function(){var a=this,b=a.chart,d=a.options,c=!a.finishedAnimating&&b.renderer.isSVG&&t(d.animation).duration,f=a.visible?"inherit":"hidden",k=d.zIndex,l=a.hasRendered,g=b.seriesGroup,p=b.inverted;m(this,"render");var n=a.plotGroup("group",
    "series",f,k,g);a.markerGroup=a.plotGroup("markerGroup","markers",f,k,g);c&&a.animate&&a.animate(!0);n.inverted=a.isCartesian||a.invertable?p:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());a.visible&&a.drawPoints();a.drawDataLabels&&a.drawDataLabels();a.redrawPoints&&a.redrawPoints();a.drawTracker&&!1!==a.options.enableMouseTracking&&a.drawTracker();a.invertGroups(p);!1===d.clip||a.sharedClipKey||l||n.clip(b.clipRect);c&&a.animate&&a.animate();l||(a.animationTimeout=M(function(){a.afterAnimate();},
    c||0));a.isDirty=!1;a.hasRendered=!0;m(a,"afterRender");},redraw:function(){var a=this.chart,b=this.isDirty||this.isDirtyData,d=this.group,c=this.xAxis,f=this.yAxis;d&&(a.inverted&&d.attr({width:a.plotWidth,height:a.plotHeight}),d.animate({translateX:E(c&&c.left,a.plotLeft),translateY:E(f&&f.top,a.plotTop)}));this.translate();this.render();b&&delete this.kdTree;},kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var d=this.xAxis,e=this.yAxis,c=this.chart.inverted;return this.searchKDTree({clientX:c?
    d.len-a.chartY+d.pos:a.chartX-d.pos,plotY:c?e.len-a.chartX+e.pos:a.chartY-e.pos},b,a)},buildKDTree:function(a){function b(a,e,c){var f;if(f=a&&a.length){var h=d.kdAxisArray[e%c];a.sort(function(a,b){return a[h]-b[h]});f=Math.floor(f/2);return {point:a[f],left:b(a.slice(0,f),e+1,c),right:b(a.slice(f+1),e+1,c)}}}this.buildingKdTree=!0;var d=this,e=-1<d.options.findNearestPointBy.indexOf("y")?2:1;delete d.kdTree;M(function(){d.kdTree=b(d.getValidPoints(null,!d.directTouch),e,e);d.buildingKdTree=!1;},d.options.kdNow||
    a&&"touchstart"===a.type?0:1);},searchKDTree:function(a,b,d){function e(a,b,d,l){var m=b.point,g=c.kdAxisArray[d%l],p=m;var r=n(a[f])&&n(m[f])?Math.pow(a[f]-m[f],2):null;var w=n(a[h])&&n(m[h])?Math.pow(a[h]-m[h],2):null;w=(r||0)+(w||0);m.dist=n(w)?Math.sqrt(w):Number.MAX_VALUE;m.distX=n(r)?Math.sqrt(r):Number.MAX_VALUE;g=a[g]-m[g];w=0>g?"left":"right";r=0>g?"right":"left";b[w]&&(w=e(a,b[w],d+1,l),p=w[k]<p[k]?w:m);b[r]&&Math.sqrt(g*g)<p[k]&&(a=e(a,b[r],d+1,l),p=a[k]<p[k]?a:p);return p}var c=this,f=
    this.kdAxisArray[0],h=this.kdAxisArray[1],k=b?"distX":"dist";b=-1<c.options.findNearestPointBy.indexOf("y")?2:1;this.kdTree||this.buildingKdTree||this.buildKDTree(d);if(this.kdTree)return e(a,this.kdTree,b,b)},pointPlacementToXValue:function(){var a=this.options,b=a.pointRange,d=this.xAxis;a=a.pointPlacement;"between"===a&&(a=d.reversed?-.5:.5);return f(a)?a*E(b,d.pointRange):0},isPointInside:function(a){return "undefined"!==typeof a.plotY&&"undefined"!==typeof a.plotX&&0<=a.plotY&&a.plotY<=this.yAxis.len&&
    0<=a.plotX&&a.plotX<=this.xAxis.len}});});O(q,"parts/Stacking.js",[q["parts/Axis.js"],q["parts/Chart.js"],q["parts/Globals.js"],q["parts/StackingAxis.js"],q["parts/Utilities.js"]],function(g,c,q,y,B){var H=B.correctFloat,D=B.defined,J=B.destroyObjectProperties,t=B.format,G=B.isNumber,L=B.pick;var v=q.Series,K=function(){function c(c,g,n,p,m){var d=c.chart.inverted;this.axis=c;this.isNegative=n;this.options=g=g||{};this.x=p;this.total=null;this.points={};this.hasValidPoints=!1;this.stack=m;this.rightCliff=
    this.leftCliff=0;this.alignOptions={align:g.align||(d?n?"left":"right":"center"),verticalAlign:g.verticalAlign||(d?"middle":n?"bottom":"top"),y:g.y,x:g.x};this.textAlign=g.textAlign||(d?n?"right":"left":"center");}c.prototype.destroy=function(){J(this,this.axis);};c.prototype.render=function(c){var g=this.axis.chart,n=this.options,p=n.format;p=p?t(p,this,g):n.formatter.call(this);this.label?this.label.attr({text:p,visibility:"hidden"}):(this.label=g.renderer.label(p,null,null,n.shape,null,null,n.useHTML,
    !1,"stack-labels"),p={r:n.borderRadius||0,text:p,rotation:n.rotation,padding:L(n.padding,5),visibility:"hidden"},g.styledMode||(p.fill=n.backgroundColor,p.stroke=n.borderColor,p["stroke-width"]=n.borderWidth,this.label.css(n.style)),this.label.attr(p),this.label.added||this.label.add(c));this.label.labelrank=g.plotHeight;};c.prototype.setOffset=function(c,g,n,p,m){var d=this.axis,l=d.chart;p=d.translate(d.stacking.usePercentage?100:p?p:this.total,0,0,0,1);n=d.translate(n?n:0);n=D(p)&&Math.abs(p-n);
    c=L(m,l.xAxis[0].translate(this.x))+c;d=D(p)&&this.getStackBox(l,this,c,p,g,n,d);g=this.label;n=this.isNegative;c="justify"===L(this.options.overflow,"justify");var k=this.textAlign;g&&d&&(m=g.getBBox(),p=g.padding,k="left"===k?l.inverted?-p:p:"right"===k?m.width:l.inverted&&"center"===k?m.width/2:l.inverted?n?m.width+p:-p:m.width/2,n=l.inverted?m.height/2:n?-p:m.height,this.alignOptions.x=L(this.options.x,0),this.alignOptions.y=L(this.options.y,0),d.x-=k,d.y-=n,g.align(this.alignOptions,null,d),
    l.isInsidePlot(g.alignAttr.x+k-this.alignOptions.x,g.alignAttr.y+n-this.alignOptions.y)?g.show():(g.alignAttr.y=-9999,c=!1),c&&v.prototype.justifyDataLabel.call(this.axis,g,this.alignOptions,g.alignAttr,m,d),g.attr({x:g.alignAttr.x,y:g.alignAttr.y}),L(!c&&this.options.crop,!0)&&((l=G(g.x)&&G(g.y)&&l.isInsidePlot(g.x-p+g.width,g.y)&&l.isInsidePlot(g.x+p,g.y))||g.hide()));};c.prototype.getStackBox=function(c,g,n,p,m,d,l){var k=g.axis.reversed,f=c.inverted,a=l.height+l.pos-(f?c.plotLeft:c.plotTop);g=
    g.isNegative&&!k||!g.isNegative&&k;return {x:f?g?p-l.right:p-d+l.pos-c.plotLeft:n+c.xAxis[0].transB-c.plotLeft,y:f?l.height-n-m:g?a-p-d:a-p,width:f?d:m,height:f?m:d}};return c}();c.prototype.getStacks=function(){var c=this,g=c.inverted;c.yAxis.forEach(function(c){c.stacking&&c.stacking.stacks&&c.hasVisibleSeries&&(c.stacking.oldStacks=c.stacking.stacks);});c.series.forEach(function(n){var r=n.xAxis&&n.xAxis.options||{};!n.options.stacking||!0!==n.visible&&!1!==c.options.chart.ignoreHiddenSeries||(n.stackKey=
    [n.type,L(n.options.stack,""),g?r.top:r.left,g?r.height:r.width].join());});};y.compose(g);v.prototype.setGroupedPoints=function(){this.options.centerInCategory&&(this.is("column")||this.is("columnrange"))&&!this.options.stacking&&1<this.chart.series.length&&v.prototype.setStackedPoints.call(this,"group");};v.prototype.setStackedPoints=function(c){var g=c||this.options.stacking;if(g&&(!0===this.visible||!1===this.chart.options.chart.ignoreHiddenSeries)){var n=this.processedXData,q=this.processedYData,
    p=[],m=q.length,d=this.options,l=d.threshold,k=L(d.startFromThreshold&&l,0);d=d.stack;c=c?this.type+","+g:this.stackKey;var f="-"+c,a=this.negStacks,A=this.yAxis,u=A.stacking.stacks,t=A.stacking.oldStacks,v,w;A.stacking.stacksTouched+=1;for(w=0;w<m;w++){var M=n[w];var F=q[w];var y=this.getStackIndicator(y,M,this.index);var e=y.key;var b=(v=a&&F<(k?0:l))?f:c;u[b]||(u[b]={});u[b][M]||(t[b]&&t[b][M]?(u[b][M]=t[b][M],u[b][M].total=null):u[b][M]=new K(A,A.options.stackLabels,v,M,d));b=u[b][M];null!==F?
    (b.points[e]=b.points[this.index]=[L(b.cumulative,k)],D(b.cumulative)||(b.base=e),b.touched=A.stacking.stacksTouched,0<y.index&&!1===this.singleStacks&&(b.points[e][0]=b.points[this.index+","+M+",0"][0])):b.points[e]=b.points[this.index]=null;"percent"===g?(v=v?c:f,a&&u[v]&&u[v][M]?(v=u[v][M],b.total=v.total=Math.max(v.total,b.total)+Math.abs(F)||0):b.total=H(b.total+(Math.abs(F)||0))):"group"===g?null!==F&&(b.total=(b.total||0)+1):b.total=H(b.total+(F||0));b.cumulative="group"===g?(b.total||1)-1:
    L(b.cumulative,k)+(F||0);null!==F&&(b.points[e].push(b.cumulative),p[w]=b.cumulative,b.hasValidPoints=!0);}"percent"===g&&(A.stacking.usePercentage=!0);"group"!==g&&(this.stackedYData=p);A.stacking.oldStacks={};}};v.prototype.modifyStacks=function(){var c=this,g=c.stackKey,q=c.yAxis.stacking.stacks,t=c.processedXData,p,m=c.options.stacking;c[m+"Stacker"]&&[g,"-"+g].forEach(function(d){for(var l=t.length,k,f;l--;)if(k=t[l],p=c.getStackIndicator(p,k,c.index,d),f=(k=q[d]&&q[d][k])&&k.points[p.key])c[m+
    "Stacker"](f,k,l);});};v.prototype.percentStacker=function(c,g,q){g=g.total?100/g.total:0;c[0]=H(c[0]*g);c[1]=H(c[1]*g);this.stackedYData[q]=c[1];};v.prototype.getStackIndicator=function(c,g,q,t){!D(c)||c.x!==g||t&&c.key!==t?c={x:g,index:0,key:t}:c.index++;c.key=[q,g,c.index].join();return c};q.StackItem=K;return q.StackItem});O(q,"parts/Dynamics.js",[q["parts/Axis.js"],q["parts/Chart.js"],q["parts/Globals.js"],q["parts/Options.js"],q["parts/Point.js"],q["parts/Time.js"],q["parts/Utilities.js"]],function(g,
    c,q,y,B,H,D){var J=y.time,t=D.addEvent,G=D.animate,L=D.createElement,v=D.css,K=D.defined,n=D.erase,r=D.error,C=D.extend,I=D.fireEvent,p=D.isArray,m=D.isNumber,d=D.isObject,l=D.isString,k=D.merge,f=D.objectEach,a=D.pick,A=D.relativeLength,u=D.setAnimation,E=D.splat;y=q.Series;var P=q.seriesTypes;q.cleanRecursively=function(a,c){var k={};f(a,function(f,e){if(d(a[e],!0)&&!a.nodeType&&c[e])f=q.cleanRecursively(a[e],c[e]),Object.keys(f).length&&(k[e]=f);else if(d(a[e])||a[e]!==c[e])k[e]=a[e];});return k};
    C(c.prototype,{addSeries:function(d,c,f){var k,e=this;d&&(c=a(c,!0),I(e,"addSeries",{options:d},function(){k=e.initSeries(d);e.isDirtyLegend=!0;e.linkSeries();k.enabledDataSorting&&k.setData(d.data,!1);I(e,"afterAddSeries",{series:k});c&&e.redraw(f);}));return k},addAxis:function(a,d,c,f){return this.createAxis(d?"xAxis":"yAxis",{axis:a,redraw:c,animation:f})},addColorAxis:function(a,d,c){return this.createAxis("colorAxis",{axis:a,redraw:d,animation:c})},createAxis:function(d,c){var f=this.options,
    l="colorAxis"===d,e=c.redraw,b=c.animation;c=k(c.axis,{index:this[d].length,isX:"xAxis"===d});var h=l?new q.ColorAxis(this,c):new g(this,c);f[d]=E(f[d]||{});f[d].push(c);l&&(this.isDirtyLegend=!0,this.axes.forEach(function(a){a.series=[];}),this.series.forEach(function(a){a.bindAxes();a.isDirtyData=!0;}));a(e,!0)&&this.redraw(b);return h},showLoading:function(d){var c=this,f=c.options,k=c.loadingDiv,e=f.loading,b=function(){k&&v(k,{left:c.plotLeft+"px",top:c.plotTop+"px",width:c.plotWidth+"px",height:c.plotHeight+
    "px"});};k||(c.loadingDiv=k=L("div",{className:"highcharts-loading highcharts-loading-hidden"},null,c.container),c.loadingSpan=L("span",{className:"highcharts-loading-inner"},null,k),t(c,"redraw",b));k.className="highcharts-loading";c.loadingSpan.innerHTML=a(d,f.lang.loading,"");c.styledMode||(v(k,C(e.style,{zIndex:10})),v(c.loadingSpan,e.labelStyle),c.loadingShown||(v(k,{opacity:0,display:""}),G(k,{opacity:e.style.opacity||.5},{duration:e.showDuration||0})));c.loadingShown=!0;b();},hideLoading:function(){var a=
    this.options,d=this.loadingDiv;d&&(d.className="highcharts-loading highcharts-loading-hidden",this.styledMode||G(d,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){v(d,{display:"none"});}}));this.loadingShown=!1;},propsRequireDirtyBox:"backgroundColor borderColor borderWidth borderRadius plotBackgroundColor plotBackgroundImage plotBorderColor plotBorderWidth plotShadow shadow".split(" "),propsRequireReflow:"margin marginTop marginRight marginBottom marginLeft spacing spacingTop spacingRight spacingBottom spacingLeft".split(" "),
    propsRequireUpdateSeries:"chart.inverted chart.polar chart.ignoreHiddenSeries chart.type colors plotOptions time tooltip".split(" "),collectionsWithUpdate:["xAxis","yAxis","zAxis","series"],update:function(d,c,g,p){var e=this,b={credits:"addCredits",title:"setTitle",subtitle:"setSubtitle",caption:"setCaption"},h,n,u,r=d.isResponsiveOptions,w=[];I(e,"update",{options:d});r||e.setResponsive(!1,!0);d=q.cleanRecursively(d,e.options);k(!0,e.userOptions,d);if(h=d.chart){k(!0,e.options.chart,h);"className"in
    h&&e.setClassName(h.className);"reflow"in h&&e.setReflow(h.reflow);if("inverted"in h||"polar"in h||"type"in h){e.propFromSeries();var t=!0;}"alignTicks"in h&&(t=!0);f(h,function(a,b){-1!==e.propsRequireUpdateSeries.indexOf("chart."+b)&&(n=!0);-1!==e.propsRequireDirtyBox.indexOf(b)&&(e.isDirtyBox=!0);-1!==e.propsRequireReflow.indexOf(b)&&(r?e.isDirtyBox=!0:u=!0);});!e.styledMode&&"style"in h&&e.renderer.setStyle(h.style);}!e.styledMode&&d.colors&&(this.options.colors=d.colors);d.plotOptions&&k(!0,this.options.plotOptions,
    d.plotOptions);d.time&&this.time===J&&(this.time=new H(d.time));f(d,function(a,d){if(e[d]&&"function"===typeof e[d].update)e[d].update(a,!1);else if("function"===typeof e[b[d]])e[b[d]](a);"chart"!==d&&-1!==e.propsRequireUpdateSeries.indexOf(d)&&(n=!0);});this.collectionsWithUpdate.forEach(function(b){if(d[b]){if("series"===b){var c=[];e[b].forEach(function(b,d){b.options.isInternal||c.push(a(b.options.index,d));});}E(d[b]).forEach(function(a,d){var f=K(a.id),h;f&&(h=e.get(a.id));h||(h=e[b][c?c[d]:d])&&
    f&&K(h.options.id)&&(h=void 0);h&&h.coll===b&&(h.update(a,!1),g&&(h.touched=!0));!h&&g&&e.collectionsWithInit[b]&&(e.collectionsWithInit[b][0].apply(e,[a].concat(e.collectionsWithInit[b][1]||[]).concat([!1])).touched=!0);});g&&e[b].forEach(function(a){a.touched||a.options.isInternal?delete a.touched:w.push(a);});}});w.forEach(function(a){a.remove&&a.remove(!1);});t&&e.axes.forEach(function(a){a.update({},!1);});n&&e.getSeriesOrderByLinks().forEach(function(a){a.chart&&a.update({},!1);},this);d.loading&&
    k(!0,e.options.loading,d.loading);t=h&&h.width;h=h&&h.height;l(h)&&(h=A(h,t||e.chartWidth));u||m(t)&&t!==e.chartWidth||m(h)&&h!==e.chartHeight?e.setSize(t,h,p):a(c,!0)&&e.redraw(p);I(e,"afterUpdate",{options:d,redraw:c,animation:p});},setSubtitle:function(a,d){this.applyDescription("subtitle",a);this.layOutTitles(d);},setCaption:function(a,d){this.applyDescription("caption",a);this.layOutTitles(d);}});c.prototype.collectionsWithInit={xAxis:[c.prototype.addAxis,[!0]],yAxis:[c.prototype.addAxis,[!1]],
    series:[c.prototype.addSeries]};C(B.prototype,{update:function(c,f,k,l){function e(){b.applyOptions(c);var e=g&&b.hasDummyGraphic;e=null===b.y?!e:e;g&&e&&(b.graphic=g.destroy(),delete b.hasDummyGraphic);d(c,!0)&&(g&&g.element&&c&&c.marker&&"undefined"!==typeof c.marker.symbol&&(b.graphic=g.destroy()),c&&c.dataLabels&&b.dataLabel&&(b.dataLabel=b.dataLabel.destroy()),b.connector&&(b.connector=b.connector.destroy()));m=b.index;h.updateParallelArrays(b,m);n.data[m]=d(n.data[m],!0)||d(c,!0)?b.options:
    a(c,n.data[m]);h.isDirty=h.isDirtyData=!0;!h.fixedBox&&h.hasCartesianSeries&&(p.isDirtyBox=!0);"point"===n.legendType&&(p.isDirtyLegend=!0);f&&p.redraw(k);}var b=this,h=b.series,g=b.graphic,m,p=h.chart,n=h.options;f=a(f,!0);!1===l?e():b.firePointEvent("update",{options:c},e);},remove:function(a,d){this.series.removePoint(this.series.data.indexOf(this),a,d);}});C(y.prototype,{addPoint:function(d,c,f,k,e){var b=this.options,h=this.data,l=this.chart,g=this.xAxis;g=g&&g.hasNames&&g.names;var m=b.data,p=
    this.xData,n;c=a(c,!0);var u={series:this};this.pointClass.prototype.applyOptions.apply(u,[d]);var r=u.x;var w=p.length;if(this.requireSorting&&r<p[w-1])for(n=!0;w&&p[w-1]>r;)w--;this.updateParallelArrays(u,"splice",w,0,0);this.updateParallelArrays(u,w);g&&u.name&&(g[r]=u.name);m.splice(w,0,d);n&&(this.data.splice(w,0,null),this.processData());"point"===b.legendType&&this.generatePoints();f&&(h[0]&&h[0].remove?h[0].remove(!1):(h.shift(),this.updateParallelArrays(u,"shift"),m.shift()));!1!==e&&I(this,
    "addPoint",{point:u});this.isDirtyData=this.isDirty=!0;c&&l.redraw(k);},removePoint:function(d,c,f){var k=this,e=k.data,b=e[d],h=k.points,l=k.chart,g=function(){h&&h.length===e.length&&h.splice(d,1);e.splice(d,1);k.options.data.splice(d,1);k.updateParallelArrays(b||{series:k},"splice",d,1);b&&b.destroy();k.isDirty=!0;k.isDirtyData=!0;c&&l.redraw();};u(f,l);c=a(c,!0);b?b.firePointEvent("remove",null,g):g();},remove:function(d,c,f,k){function e(){b.destroy(k);b.remove=null;h.isDirtyLegend=h.isDirtyBox=
    !0;h.linkSeries();a(d,!0)&&h.redraw(c);}var b=this,h=b.chart;!1!==f?I(b,"remove",null,e):e();},update:function(d,c){d=q.cleanRecursively(d,this.userOptions);I(this,"update",{options:d});var f=this,l=f.chart,e=f.userOptions,b=f.initialType||f.type,h=d.type||e.type||l.options.chart.type,g=!(this.hasDerivedData||d.dataGrouping||h&&h!==this.type||"undefined"!==typeof d.pointStart||d.pointInterval||d.pointIntervalUnit||d.keys),m=P[b].prototype,p,n=["eventOptions","navigatorSeries","baseSeries"],u=f.finishedAnimating&&
    {animation:!1},w={};g&&(n.push("data","isDirtyData","points","processedXData","processedYData","xIncrement","cropped","_hasPointMarkers","_hasPointLabels","mapMap","mapData","minY","maxY","minX","maxX"),!1!==d.visible&&n.push("area","graph"),f.parallelArrays.forEach(function(a){n.push(a+"Data");}),d.data&&(d.dataSorting&&C(f.options.dataSorting,d.dataSorting),this.setData(d.data,!1)));d=k(e,u,{index:"undefined"===typeof e.index?f.index:e.index,pointStart:a(e.pointStart,f.xData[0])},!g&&{data:f.options.data},
    d);g&&d.data&&(d.data=f.options.data);n=["group","markerGroup","dataLabelsGroup","transformGroup"].concat(n);n.forEach(function(a){n[a]=f[a];delete f[a];});f.remove(!1,null,!1,!0);for(p in m)f[p]=void 0;P[h||b]?C(f,P[h||b].prototype):r(17,!0,l,{missingModuleFor:h||b});n.forEach(function(a){f[a]=n[a];});f.init(l,d);if(g&&this.points){var A=f.options;!1===A.visible?(w.graphic=1,w.dataLabel=1):f._hasPointLabels||(d=A.marker,e=A.dataLabels,d&&(!1===d.enabled||"symbol"in d)&&(w.graphic=1),e&&!1===e.enabled&&
    (w.dataLabel=1));this.points.forEach(function(a){a&&a.series&&(a.resolveColor(),Object.keys(w).length&&a.destroyElements(w),!1===A.showInLegend&&a.legendItem&&l.legend.destroyItem(a));},this);}f.initialType=b;l.linkSeries();I(this,"afterUpdate");a(c,!0)&&l.redraw(g?void 0:!1);},setName:function(a){this.name=this.options.name=this.userOptions.name=a;this.chart.isDirtyLegend=!0;}});C(g.prototype,{update:function(d,c){var l=this.chart,g=d&&d.events||{};d=k(this.userOptions,d);l.options[this.coll].indexOf&&
    (l.options[this.coll][l.options[this.coll].indexOf(this.userOptions)]=d);f(l.options[this.coll].events,function(a,b){"undefined"===typeof g[b]&&(g[b]=void 0);});this.destroy(!0);this.init(l,C(d,{events:g}));l.isDirtyBox=!0;a(c,!0)&&l.redraw();},remove:function(d){for(var c=this.chart,f=this.coll,k=this.series,e=k.length;e--;)k[e]&&k[e].remove(!1);n(c.axes,this);n(c[f],this);p(c.options[f])?c.options[f].splice(this.options.index,1):delete c.options[f];c[f].forEach(function(a,d){a.options.index=a.userOptions.index=
    d;});this.destroy();c.isDirtyBox=!0;a(d,!0)&&c.redraw();},setTitle:function(a,d){this.update({title:a},d);},setCategories:function(a,d){this.update({categories:a},d);}});});O(q,"parts/AreaSeries.js",[q["parts/Globals.js"],q["parts/Color.js"],q["mixins/legend-symbol.js"],q["parts/Utilities.js"]],function(g,c,q,y){var B=c.parse,H=y.objectEach,D=y.pick;c=y.seriesType;var J=g.Series;c("area","line",{softThreshold:!1,threshold:0},{singleStacks:!1,getStackPoints:function(c){var g=[],q=[],t=this.xAxis,y=this.yAxis,
    n=y.stacking.stacks[this.stackKey],r={},C=this.index,I=y.series,p=I.length,m=D(y.options.reversedStacks,!0)?1:-1,d;c=c||this.points;if(this.options.stacking){for(d=0;d<c.length;d++)c[d].leftNull=c[d].rightNull=void 0,r[c[d].x]=c[d];H(n,function(d,c){null!==d.total&&q.push(c);});q.sort(function(d,c){return d-c});var l=I.map(function(d){return d.visible});q.forEach(function(c,f){var a=0,k,u;if(r[c]&&!r[c].isNull)g.push(r[c]),[-1,1].forEach(function(a){var g=1===a?"rightNull":"leftNull",w=0,A=n[q[f+a]];
    if(A)for(d=C;0<=d&&d<p;)k=A.points[d],k||(d===C?r[c][g]=!0:l[d]&&(u=n[c].points[d])&&(w-=u[1]-u[0])),d+=m;r[c][1===a?"rightCliff":"leftCliff"]=w;});else{for(d=C;0<=d&&d<p;){if(k=n[c].points[d]){a=k[1];break}d+=m;}a=y.translate(a,0,1,0,1);g.push({isNull:!0,plotX:t.translate(c,0,0,0,1),x:c,plotY:a,yBottom:a});}});}return g},getGraphPath:function(c){var g=J.prototype.getGraphPath,q=this.options,t=q.stacking,y=this.yAxis,n,r=[],C=[],I=this.index,p=y.stacking.stacks[this.stackKey],m=q.threshold,d=Math.round(y.getThreshold(q.threshold));
    q=D(q.connectNulls,"percent"===t);var l=function(a,k,l){var g=c[a];a=t&&p[g.x].points[I];var n=g[l+"Null"]||0;l=g[l+"Cliff"]||0;g=!0;if(l||n){var u=(n?a[0]:a[1])+l;var q=a[0]+l;g=!!n;}else!t&&c[k]&&c[k].isNull&&(u=q=m);"undefined"!==typeof u&&(C.push({plotX:f,plotY:null===u?d:y.getThreshold(u),isNull:g,isCliff:!0}),r.push({plotX:f,plotY:null===q?d:y.getThreshold(q),doCurve:!1}));};c=c||this.points;t&&(c=this.getStackPoints(c));for(n=0;n<c.length;n++){t||(c[n].leftCliff=c[n].rightCliff=c[n].leftNull=
    c[n].rightNull=void 0);var k=c[n].isNull;var f=D(c[n].rectPlotX,c[n].plotX);var a=D(c[n].yBottom,d);if(!k||q)q||l(n,n-1,"left"),k&&!t&&q||(C.push(c[n]),r.push({x:n,plotX:f,plotY:a})),q||l(n,n+1,"right");}n=g.call(this,C,!0,!0);r.reversed=!0;k=g.call(this,r,!0,!0);(a=k[0])&&"M"===a[0]&&(k[0]=["L",a[1],a[2]]);k=n.concat(k);g=g.call(this,C,!1,q);k.xMap=n.xMap;this.areaPath=k;return g},drawGraph:function(){this.areaPath=[];J.prototype.drawGraph.apply(this);var c=this,g=this.areaPath,q=this.options,v=[["area",
    "highcharts-area",this.color,q.fillColor]];this.zones.forEach(function(g,n){v.push(["zone-area-"+n,"highcharts-area highcharts-zone-area-"+n+" "+g.className,g.color||c.color,g.fillColor||q.fillColor]);});v.forEach(function(t){var n=t[0],r=c[n],v=r?"animate":"attr",y={};r?(r.endX=c.preventGraphAnimation?null:g.xMap,r.animate({d:g})):(y.zIndex=0,r=c[n]=c.chart.renderer.path(g).addClass(t[1]).add(c.group),r.isArea=!0);c.chart.styledMode||(y.fill=D(t[3],B(t[2]).setOpacity(D(q.fillOpacity,.75)).get()));
    r[v](y);r.startX=g.xMap;r.shiftUnit=q.step?2:1;});},drawLegendSymbol:q.drawRectangle});});O(q,"parts/SplineSeries.js",[q["parts/Utilities.js"]],function(g){var c=g.pick;g=g.seriesType;g("spline","line",{},{getPointSpline:function(g,q,B){var y=q.plotX||0,D=q.plotY||0,J=g[B-1];B=g[B+1];if(J&&!J.isNull&&!1!==J.doCurve&&!q.isCliff&&B&&!B.isNull&&!1!==B.doCurve&&!q.isCliff){g=J.plotY||0;var t=B.plotX||0;B=B.plotY||0;var G=0;var L=(1.5*y+(J.plotX||0))/2.5;var v=(1.5*D+g)/2.5;t=(1.5*y+t)/2.5;var K=(1.5*
    D+B)/2.5;t!==L&&(G=(K-v)*(t-y)/(t-L)+D-K);v+=G;K+=G;v>g&&v>D?(v=Math.max(g,D),K=2*D-v):v<g&&v<D&&(v=Math.min(g,D),K=2*D-v);K>B&&K>D?(K=Math.max(B,D),v=2*D-K):K<B&&K<D&&(K=Math.min(B,D),v=2*D-K);q.rightContX=t;q.rightContY=K;}q=["C",c(J.rightContX,J.plotX,0),c(J.rightContY,J.plotY,0),c(L,y,0),c(v,D,0),y,D];J.rightContX=J.rightContY=void 0;return q}});});O(q,"parts/AreaSplineSeries.js",[q["parts/Globals.js"],q["mixins/legend-symbol.js"],q["parts/Options.js"],q["parts/Utilities.js"]],function(g,c,q,
    y){y=y.seriesType;g=g.seriesTypes.area.prototype;y("areaspline","spline",q.defaultOptions.plotOptions.area,{getStackPoints:g.getStackPoints,getGraphPath:g.getGraphPath,drawGraph:g.drawGraph,drawLegendSymbol:c.drawRectangle});});O(q,"parts/ColumnSeries.js",[q["parts/Globals.js"],q["parts/Color.js"],q["mixins/legend-symbol.js"],q["parts/Utilities.js"]],function(g,c,q,y){var B=c.parse,H=y.animObject,D=y.clamp,J=y.defined,t=y.extend,G=y.isNumber,L=y.merge,v=y.pick;c=y.seriesType;var K=g.Series;c("column",
    "line",{borderRadius:0,centerInCategory:!1,groupPadding:.2,marker:null,pointPadding:.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{halo:!1,brightness:.1},select:{color:"#cccccc",borderColor:"#000000"}},dataLabels:{align:void 0,verticalAlign:void 0,y:void 0},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0,borderColor:"#ffffff"},{cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){K.prototype.init.apply(this,
    arguments);var c=this,g=c.chart;g.hasRendered&&g.series.forEach(function(g){g.type===c.type&&(g.isDirty=!0);});},getColumnMetrics:function(){var c=this,g=c.options,q=c.xAxis,t=c.yAxis,p=q.options.reversedStacks;p=q.reversed&&!p||!q.reversed&&p;var m,d={},l=0;!1===g.grouping?l=1:c.chart.series.forEach(function(a){var f=a.yAxis,k=a.options;if(a.type===c.type&&(a.visible||!c.chart.options.chart.ignoreHiddenSeries)&&t.len===f.len&&t.pos===f.pos){if(k.stacking&&"group"!==k.stacking){m=a.stackKey;"undefined"===
    typeof d[m]&&(d[m]=l++);var g=d[m];}else!1!==k.grouping&&(g=l++);a.columnIndex=g;}});var k=Math.min(Math.abs(q.transA)*(q.ordinal&&q.ordinal.slope||g.pointRange||q.closestPointRange||q.tickInterval||1),q.len),f=k*g.groupPadding,a=(k-2*f)/(l||1);g=Math.min(g.maxPointWidth||q.len,v(g.pointWidth,a*(1-2*g.pointPadding)));c.columnMetrics={width:g,offset:(a-g)/2+(f+((c.columnIndex||0)+(p?1:0))*a-k/2)*(p?-1:1),paddedWidth:a,columnCount:l};return c.columnMetrics},crispCol:function(c,g,q,t){var p=this.chart,
    m=this.borderWidth,d=-(m%2?.5:0);m=m%2?.5:1;p.inverted&&p.renderer.isVML&&(m+=1);this.options.crisp&&(q=Math.round(c+q)+d,c=Math.round(c)+d,q-=c);t=Math.round(g+t)+m;d=.5>=Math.abs(g)&&.5<t;g=Math.round(g)+m;t-=g;d&&t&&(--g,t+=1);return {x:c,y:g,width:q,height:t}},adjustForMissingColumns:function(c,q,t,v){var p=this,m=this.options.stacking;if(!t.isNull&&1<v.columnCount){var d=0,l=0;Highcharts.objectEach(this.yAxis.stacking&&this.yAxis.stacking.stacks,function(c){if("number"===typeof t.x&&(c=c[t.x.toString()])){var f=
    c.points[p.index],a=c.total;m?(f&&(d=l),c.hasValidPoints&&l++):g.isArray(f)&&(d=f[1],l=a||0);}});c=(t.plotX||0)+((l-1)*v.paddedWidth+q)/2-q-d*v.paddedWidth;}return c},translate:function(){var c=this,g=c.chart,q=c.options,t=c.dense=2>c.closestPointRange*c.xAxis.transA;t=c.borderWidth=v(q.borderWidth,t?0:1);var p=c.xAxis,m=c.yAxis,d=q.threshold,l=c.translatedThreshold=m.getThreshold(d),k=v(q.minPointLength,5),f=c.getColumnMetrics(),a=f.width,A=c.barW=Math.max(a,1+2*t),u=c.pointXOffset=f.offset,E=c.dataMin,
    y=c.dataMax;g.inverted&&(l-=.5);q.pointPadding&&(A=Math.ceil(A));K.prototype.translate.apply(c);c.points.forEach(function(n){var r=v(n.yBottom,l),w=999+Math.abs(r),t=a,e=n.plotX||0;w=D(n.plotY,-w,m.len+w);var b=e+u,h=A,z=Math.min(w,r),x=Math.max(w,r)-z;if(k&&Math.abs(x)<k){x=k;var C=!m.reversed&&!n.negative||m.reversed&&n.negative;G(d)&&G(y)&&n.y===d&&y<=d&&(m.min||0)<d&&E!==y&&(C=!C);z=Math.abs(z-l)>k?r-k:l-(C?k:0);}J(n.options.pointWidth)&&(t=h=Math.ceil(n.options.pointWidth),b-=Math.round((t-a)/
    2));q.centerInCategory&&(b=c.adjustForMissingColumns(b,t,n,f));n.barX=b;n.pointWidth=t;n.tooltipPos=g.inverted?[m.len+m.pos-g.plotLeft-w,p.len+p.pos-g.plotTop-(e||0)-u-h/2,x]:[b+h/2,w+m.pos-g.plotTop,x];n.shapeType=c.pointClass.prototype.shapeType||"rect";n.shapeArgs=c.crispCol.apply(c,n.isNull?[b,l,h,0]:[b,z,h,x]);});},getSymbol:g.noop,drawLegendSymbol:q.drawRectangle,drawGraph:function(){this.group[this.dense?"addClass":"removeClass"]("highcharts-dense-data");},pointAttribs:function(c,g){var n=this.options,
    q=this.pointAttrToOptions||{};var p=q.stroke||"borderColor";var m=q["stroke-width"]||"borderWidth",d=c&&c.color||this.color,l=c&&c[p]||n[p]||this.color||d,k=c&&c[m]||n[m]||this[m]||0;q=c&&c.options.dashStyle||n.dashStyle;var f=v(c&&c.opacity,n.opacity,1);if(c&&this.zones.length){var a=c.getZone();d=c.options.color||a&&(a.color||c.nonZonedColor)||this.color;a&&(l=a.borderColor||l,q=a.dashStyle||q,k=a.borderWidth||k);}g&&c&&(c=L(n.states[g],c.options.states&&c.options.states[g]||{}),g=c.brightness,d=
    c.color||"undefined"!==typeof g&&B(d).brighten(c.brightness).get()||d,l=c[p]||l,k=c[m]||k,q=c.dashStyle||q,f=v(c.opacity,f));p={fill:d,stroke:l,"stroke-width":k,opacity:f};q&&(p.dashstyle=q);return p},drawPoints:function(){var c=this,g=this.chart,q=c.options,t=g.renderer,p=q.animationLimit||250,m;c.points.forEach(function(d){var l=d.graphic,k=!!l,f=l&&g.pointCount<p?"animate":"attr";if(G(d.plotY)&&null!==d.y){m=d.shapeArgs;l&&d.hasNewShapeType()&&(l=l.destroy());c.enabledDataSorting&&(d.startXPos=
    c.xAxis.reversed?-(m?m.width:0):c.xAxis.width);l||(d.graphic=l=t[d.shapeType](m).add(d.group||c.group))&&c.enabledDataSorting&&g.hasRendered&&g.pointCount<p&&(l.attr({x:d.startXPos}),k=!0,f="animate");if(l&&k)l[f](L(m));if(q.borderRadius)l[f]({r:q.borderRadius});g.styledMode||l[f](c.pointAttribs(d,d.selected&&"select")).shadow(!1!==d.allowShadow&&q.shadow,null,q.stacking&&!q.borderRadius);l.addClass(d.getClassName(),!0);}else l&&(d.graphic=l.destroy());});},animate:function(c){var g=this,n=this.yAxis,
    q=g.options,p=this.chart.inverted,m={},d=p?"translateX":"translateY";if(c)m.scaleY=.001,c=D(n.toPixels(q.threshold),n.pos,n.pos+n.len),p?m.translateX=c-n.len:m.translateY=c,g.clipBox&&g.setClip(),g.group.attr(m);else{var l=g.group.attr(d);g.group.animate({scaleY:1},t(H(g.options.animation),{step:function(c,f){g.group&&(m[d]=l+f.pos*(n.pos-l),g.group.attr(m));}}));}},remove:function(){var c=this,g=c.chart;g.hasRendered&&g.series.forEach(function(g){g.type===c.type&&(g.isDirty=!0);});K.prototype.remove.apply(c,
    arguments);}});});O(q,"parts/BarSeries.js",[q["parts/Utilities.js"]],function(g){g=g.seriesType;g("bar","column",null,{inverted:!0});});O(q,"parts/ScatterSeries.js",[q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=c.addEvent;c=c.seriesType;var y=g.Series;c("scatter","line",{lineWidth:0,findNearestPointBy:"xy",jitter:{x:0,y:0},marker:{enabled:!0},tooltip:{headerFormat:'<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px"> {series.name}</span><br/>',pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}},
    {sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,drawGraph:function(){this.options.lineWidth&&y.prototype.drawGraph.call(this);},applyJitter:function(){var c=this,g=this.options.jitter,q=this.points.length;g&&this.points.forEach(function(y,t){["x","y"].forEach(function(D,B){var v="plot"+D.toUpperCase();if(g[D]&&!y.isNull){var G=c[D+"Axis"];var n=g[D]*G.transA;if(G&&!G.isLog){var r=Math.max(0,y[v]-n);G=Math.min(G.len,y[v]+
    n);B=1E4*Math.sin(t+B*q);y[v]=r+(G-r)*(B-Math.floor(B));"x"===D&&(y.clientX=y.plotX);}}});});}});q(y,"afterTranslate",function(){this.applyJitter&&this.applyJitter();});});O(q,"mixins/centered-series.js",[q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=c.isNumber,y=c.pick,B=c.relativeLength,H=g.deg2rad;g.CenteredSeriesMixin={getCenter:function(){var c=this.options,q=this.chart,t=2*(c.slicedOffset||0),G=q.plotWidth-2*t,H=q.plotHeight-2*t,v=c.center,K=Math.min(G,H),n=c.size,r=c.innerSize||
    0;"string"===typeof n&&(n=parseFloat(n));"string"===typeof r&&(r=parseFloat(r));c=[y(v[0],"50%"),y(v[1],"50%"),y(n&&0>n?void 0:c.size,"100%"),y(r&&0>r?void 0:c.innerSize||0,"0%")];!q.angular||this instanceof g.Series||(c[3]=0);for(v=0;4>v;++v)n=c[v],q=2>v||2===v&&/%$/.test(n),c[v]=B(n,[G,H,K,c[2]][v])+(q?t:0);c[3]>c[2]&&(c[3]=c[2]);return c},getStartAndEndRadians:function(c,g){c=q(c)?c:0;g=q(g)&&g>c&&360>g-c?g:c+360;return {start:H*(c+-90),end:H*(g+-90)}}};});O(q,"parts/PieSeries.js",[q["parts/Globals.js"],
    q["mixins/legend-symbol.js"],q["parts/Point.js"],q["parts/Utilities.js"]],function(g,c,q,y){var B=y.addEvent,H=y.clamp,D=y.defined,J=y.fireEvent,t=y.isNumber,G=y.merge,L=y.pick,v=y.relativeLength,K=y.seriesType,n=y.setAnimation;y=g.CenteredSeriesMixin;var r=y.getStartAndEndRadians,C=g.noop,I=g.Series;K("pie","line",{center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{allowOverlap:!0,connectorPadding:5,connectorShape:"fixedOffset",crookDistance:"70%",distance:30,enabled:!0,formatter:function(){return this.point.isNull?
    void 0:this.point.name},softConnector:!0,x:0},fillColor:void 0,ignoreHiddenPoint:!0,inactiveOtherPoints:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,stickyTracking:!1,tooltip:{followPointer:!0},borderColor:"#ffffff",borderWidth:1,lineWidth:void 0,states:{hover:{brightness:.1}}},{isCartesian:!1,requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttribs:g.seriesTypes.column.prototype.pointAttribs,animate:function(c){var g=
    this,d=g.points,l=g.startAngleRad;c||d.forEach(function(d){var c=d.graphic,a=d.shapeArgs;c&&a&&(c.attr({r:L(d.startR,g.center&&g.center[3]/2),start:l,end:l}),c.animate({r:a.r,start:a.start,end:a.end},g.options.animation));});},hasData:function(){return !!this.processedXData.length},updateTotals:function(){var c,g=0,d=this.points,l=d.length,k=this.options.ignoreHiddenPoint;for(c=0;c<l;c++){var f=d[c];g+=k&&!f.visible?0:f.isNull?0:f.y;}this.total=g;for(c=0;c<l;c++)f=d[c],f.percentage=0<g&&(f.visible||!k)?
    f.y/g*100:0,f.total=g;},generatePoints:function(){I.prototype.generatePoints.call(this);this.updateTotals();},getX:function(c,g,d){var l=this.center,k=this.radii?this.radii[d.index]:l[2]/2;c=Math.asin(H((c-l[1])/(k+d.labelDistance),-1,1));return l[0]+(g?-1:1)*Math.cos(c)*(k+d.labelDistance)+(0<d.labelDistance?(g?-1:1)*this.options.dataLabels.padding:0)},translate:function(c){this.generatePoints();var g=0,d=this.options,l=d.slicedOffset,k=l+(d.borderWidth||0),f=r(d.startAngle,d.endAngle),a=this.startAngleRad=
    f.start;f=(this.endAngleRad=f.end)-a;var p=this.points,n=d.dataLabels.distance;d=d.ignoreHiddenPoint;var q,t=p.length;c||(this.center=c=this.getCenter());for(q=0;q<t;q++){var w=p[q];var y=a+g*f;if(!d||w.visible)g+=w.percentage/100;var F=a+g*f;w.shapeType="arc";w.shapeArgs={x:c[0],y:c[1],r:c[2]/2,innerR:c[3]/2,start:Math.round(1E3*y)/1E3,end:Math.round(1E3*F)/1E3};w.labelDistance=L(w.options.dataLabels&&w.options.dataLabels.distance,n);w.labelDistance=v(w.labelDistance,w.shapeArgs.r);this.maxLabelDistance=
    Math.max(this.maxLabelDistance||0,w.labelDistance);F=(F+y)/2;F>1.5*Math.PI?F-=2*Math.PI:F<-Math.PI/2&&(F+=2*Math.PI);w.slicedTranslation={translateX:Math.round(Math.cos(F)*l),translateY:Math.round(Math.sin(F)*l)};var C=Math.cos(F)*c[2]/2;var e=Math.sin(F)*c[2]/2;w.tooltipPos=[c[0]+.7*C,c[1]+.7*e];w.half=F<-Math.PI/2||F>Math.PI/2?1:0;w.angle=F;y=Math.min(k,w.labelDistance/5);w.labelPosition={natural:{x:c[0]+C+Math.cos(F)*w.labelDistance,y:c[1]+e+Math.sin(F)*w.labelDistance},"final":{},alignment:0>
    w.labelDistance?"center":w.half?"right":"left",connectorPosition:{breakAt:{x:c[0]+C+Math.cos(F)*y,y:c[1]+e+Math.sin(F)*y},touchingSliceAt:{x:c[0]+C,y:c[1]+e}}};}J(this,"afterTranslate");},drawEmpty:function(){var c=this.startAngleRad,g=this.endAngleRad,d=this.options;if(0===this.total){var l=this.center[0];var k=this.center[1];this.graph||(this.graph=this.chart.renderer.arc(l,k,this.center[1]/2,0,c,g).addClass("highcharts-empty-series").add(this.group));this.graph.attr({d:Highcharts.SVGRenderer.prototype.symbols.arc(l,
    k,this.center[2]/2,0,{start:c,end:g,innerR:this.center[3]/2})});this.chart.styledMode||this.graph.attr({"stroke-width":d.borderWidth,fill:d.fillColor||"none",stroke:d.color||"#cccccc"});}else this.graph&&(this.graph=this.graph.destroy());},redrawPoints:function(){var c=this,g=c.chart,d=g.renderer,l,k,f,a,n=c.options.shadow;this.drawEmpty();!n||c.shadowGroup||g.styledMode||(c.shadowGroup=d.g("shadow").attr({zIndex:-1}).add(c.group));c.points.forEach(function(m){var p={};k=m.graphic;if(!m.isNull&&k){a=
    m.shapeArgs;l=m.getTranslate();if(!g.styledMode){var q=m.shadowGroup;n&&!q&&(q=m.shadowGroup=d.g("shadow").add(c.shadowGroup));q&&q.attr(l);f=c.pointAttribs(m,m.selected&&"select");}m.delayedRendering?(k.setRadialReference(c.center).attr(a).attr(l),g.styledMode||k.attr(f).attr({"stroke-linejoin":"round"}).shadow(n,q),m.delayedRendering=!1):(k.setRadialReference(c.center),g.styledMode||G(!0,p,f),G(!0,p,a,l),k.animate(p));k.attr({visibility:m.visible?"inherit":"hidden"});k.addClass(m.getClassName());}else k&&
    (m.graphic=k.destroy());});},drawPoints:function(){var c=this.chart.renderer;this.points.forEach(function(g){g.graphic&&g.hasNewShapeType()&&(g.graphic=g.graphic.destroy());g.graphic||(g.graphic=c[g.shapeType](g.shapeArgs).add(g.series.group),g.delayedRendering=!0);});},searchPoint:C,sortByAngle:function(c,g){c.sort(function(c,l){return "undefined"!==typeof c.angle&&(l.angle-c.angle)*g});},drawLegendSymbol:c.drawRectangle,getCenter:y.getCenter,getSymbol:C,drawGraph:null},{init:function(){q.prototype.init.apply(this,
    arguments);var c=this;c.name=L(c.name,"Slice");var g=function(d){c.slice("select"===d.type);};B(c,"select",g);B(c,"unselect",g);return c},isValid:function(){return t(this.y)&&0<=this.y},setVisible:function(c,g){var d=this,l=d.series,k=l.chart,f=l.options.ignoreHiddenPoint;g=L(g,f);c!==d.visible&&(d.visible=d.options.visible=c="undefined"===typeof c?!d.visible:c,l.options.data[l.data.indexOf(d)]=d.options,["graphic","dataLabel","connector","shadowGroup"].forEach(function(a){if(d[a])d[a][c?"show":"hide"](!0);}),
    d.legendItem&&k.legend.colorizeItem(d,c),c||"hover"!==d.state||d.setState(""),f&&(l.isDirty=!0),g&&k.redraw());},slice:function(c,g,d){var l=this.series;n(d,l.chart);L(g,!0);this.sliced=this.options.sliced=D(c)?c:!this.sliced;l.options.data[l.data.indexOf(this)]=this.options;this.graphic&&this.graphic.animate(this.getTranslate());this.shadowGroup&&this.shadowGroup.animate(this.getTranslate());},getTranslate:function(){return this.sliced?this.slicedTranslation:{translateX:0,translateY:0}},haloPath:function(c){var g=
    this.shapeArgs;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(g.x,g.y,g.r+c,g.r+c,{innerR:g.r-1,start:g.start,end:g.end})},connectorShapes:{fixedOffset:function(c,g,d){var l=g.breakAt;g=g.touchingSliceAt;return [["M",c.x,c.y],d.softConnector?["C",c.x+("left"===c.alignment?-5:5),c.y,2*l.x-g.x,2*l.y-g.y,l.x,l.y]:["L",l.x,l.y],["L",g.x,g.y]]},straight:function(c,g){g=g.touchingSliceAt;return [["M",c.x,c.y],["L",g.x,g.y]]},crookedLine:function(c,g,d){g=g.touchingSliceAt;var l=
    this.series,k=l.center[0],f=l.chart.plotWidth,a=l.chart.plotLeft;l=c.alignment;var m=this.shapeArgs.r;d=v(d.crookDistance,1);f="left"===l?k+m+(f+a-k-m)*(1-d):a+(k-m)*d;d=["L",f,c.y];k=!0;if("left"===l?f>c.x||f<g.x:f<c.x||f>g.x)k=!1;c=[["M",c.x,c.y]];k&&c.push(d);c.push(["L",g.x,g.y]);return c}},getConnectorPath:function(){var c=this.labelPosition,g=this.series.options.dataLabels,d=g.connectorShape,l=this.connectorShapes;l[d]&&(d=l[d]);return d.call(this,{x:c.final.x,y:c.final.y,alignment:c.alignment},
    c.connectorPosition,g)}});});O(q,"parts/DataLabels.js",[q["parts/Globals.js"],q["parts/Utilities.js"]],function(g,c){var q=g.noop,y=g.seriesTypes,B=c.animObject,H=c.arrayMax,D=c.clamp,J=c.defined,t=c.extend,G=c.fireEvent,L=c.format,v=c.isArray,K=c.merge,n=c.objectEach,r=c.pick,C=c.relativeLength,I=c.splat,p=c.stableSort,m=g.Series;g.distribute=function(c,l,k){function d(a,c){return a.target-c.target}var a,m=!0,n=c,q=[];var t=0;var w=n.reducedLen||l;for(a=c.length;a--;)t+=c[a].size;if(t>w){p(c,function(a,
    c){return (c.rank||0)-(a.rank||0)});for(t=a=0;t<=w;)t+=c[a].size,a++;q=c.splice(a-1,c.length);}p(c,d);for(c=c.map(function(a){return {size:a.size,targets:[a.target],align:r(a.align,.5)}});m;){for(a=c.length;a--;)m=c[a],t=(Math.min.apply(0,m.targets)+Math.max.apply(0,m.targets))/2,m.pos=D(t-m.size*m.align,0,l-m.size);a=c.length;for(m=!1;a--;)0<a&&c[a-1].pos+c[a-1].size>c[a].pos&&(c[a-1].size+=c[a].size,c[a-1].targets=c[a-1].targets.concat(c[a].targets),c[a-1].align=.5,c[a-1].pos+c[a-1].size>l&&(c[a-1].pos=
    l-c[a-1].size),c.splice(a,1),m=!0);}n.push.apply(n,q);a=0;c.some(function(c){var d=0;if(c.targets.some(function(){n[a].pos=c.pos+d;if("undefined"!==typeof k&&Math.abs(n[a].pos-n[a].target)>k)return n.slice(0,a+1).forEach(function(a){delete a.pos;}),n.reducedLen=(n.reducedLen||l)-.1*l,n.reducedLen>.1*l&&g.distribute(n,l,k),!0;d+=n[a].size;a++;}))return !0});p(n,d);};m.prototype.drawDataLabels=function(){function c(a,c){var b=c.filter;return b?(c=b.operator,a=a[b.property],b=b.value,">"===c&&a>b||"<"===
    c&&a<b||">="===c&&a>=b||"<="===c&&a<=b||"=="===c&&a==b||"==="===c&&a===b?!0:!1):!0}function g(a,c){var b=[],d;if(v(a)&&!v(c))b=a.map(function(a){return K(a,c)});else if(v(c)&&!v(a))b=c.map(function(b){return K(a,b)});else if(v(a)||v(c))for(d=Math.max(a.length,c.length);d--;)b[d]=K(a[d],c[d]);else b=K(a,c);return b}var k=this,f=k.chart,a=k.options,m=a.dataLabels,p=k.points,q,t=k.hasRendered||0,w=B(a.animation).duration,y=Math.min(w,200),F=!f.renderer.forExport&&r(m.defer,0<y),C=f.renderer;m=g(g(f.options.plotOptions&&
    f.options.plotOptions.series&&f.options.plotOptions.series.dataLabels,f.options.plotOptions&&f.options.plotOptions[k.type]&&f.options.plotOptions[k.type].dataLabels),m);G(this,"drawDataLabels");if(v(m)||m.enabled||k._hasPointLabels){var e=k.plotGroup("dataLabelsGroup","data-labels",F&&!t?"hidden":"inherit",m.zIndex||6);F&&(e.attr({opacity:+t}),t||setTimeout(function(){var b=k.dataLabelsGroup;b&&(k.visible&&e.show(!0),b[a.animation?"animate":"attr"]({opacity:1},{duration:y}));},w-y));p.forEach(function(b){q=
    I(g(m,b.dlOptions||b.options&&b.options.dataLabels));q.forEach(function(d,g){var h=d.enabled&&(!b.isNull||b.dataLabelOnNull)&&c(b,d),l=b.dataLabels?b.dataLabels[g]:b.dataLabel,m=b.connectors?b.connectors[g]:b.connector,p=r(d.distance,b.labelDistance),q=!l;if(h){var u=b.getLabelConfig();var w=r(d[b.formatPrefix+"Format"],d.format);u=J(w)?L(w,u,f):(d[b.formatPrefix+"Formatter"]||d.formatter).call(u,d);w=d.style;var t=d.rotation;f.styledMode||(w.color=r(d.color,w.color,k.color,"#000000"),"contrast"===
    w.color?(b.contrastColor=C.getContrast(b.color||k.color),w.color=!J(p)&&d.inside||0>p||a.stacking?b.contrastColor:"#000000"):delete b.contrastColor,a.cursor&&(w.cursor=a.cursor));var A={r:d.borderRadius||0,rotation:t,padding:d.padding,zIndex:1};f.styledMode||(A.fill=d.backgroundColor,A.stroke=d.borderColor,A["stroke-width"]=d.borderWidth);n(A,function(a,b){"undefined"===typeof a&&delete A[b];});}!l||h&&J(u)?h&&J(u)&&(l?A.text=u:(b.dataLabels=b.dataLabels||[],l=b.dataLabels[g]=t?C.text(u,0,-9999,d.useHTML).addClass("highcharts-data-label"):
    C.label(u,0,-9999,d.shape,null,null,d.useHTML,null,"data-label"),g||(b.dataLabel=l),l.addClass(" highcharts-data-label-color-"+b.colorIndex+" "+(d.className||"")+(d.useHTML?" highcharts-tracker":""))),l.options=d,l.attr(A),f.styledMode||l.css(w).shadow(d.shadow),l.added||l.add(e),d.textPath&&!d.useHTML&&(l.setTextPath(b.getDataLabelPath&&b.getDataLabelPath(l)||b.graphic,d.textPath),b.dataLabelPath&&!d.textPath.enabled&&(b.dataLabelPath=b.dataLabelPath.destroy())),k.alignDataLabel(b,l,d,null,q)):(b.dataLabel=
    b.dataLabel&&b.dataLabel.destroy(),b.dataLabels&&(1===b.dataLabels.length?delete b.dataLabels:delete b.dataLabels[g]),g||delete b.dataLabel,m&&(b.connector=b.connector.destroy(),b.connectors&&(1===b.connectors.length?delete b.connectors:delete b.connectors[g])));});});}G(this,"afterDrawDataLabels");};m.prototype.alignDataLabel=function(c,g,k,f,a){var d=this,l=this.chart,m=this.isCartesian&&l.inverted,n=this.enabledDataSorting,p=r(c.dlBox&&c.dlBox.centerX,c.plotX,-9999),q=r(c.plotY,-9999),v=g.getBBox(),
    y=k.rotation,e=k.align,b=l.isInsidePlot(p,Math.round(q),m),h="justify"===r(k.overflow,n?"none":"justify"),z=this.visible&&!1!==c.visible&&(c.series.forceDL||n&&!h||b||k.inside&&f&&l.isInsidePlot(p,m?f.x+1:f.y+f.height-1,m));var x=function(e){n&&d.xAxis&&!h&&d.setDataLabelStartPos(c,g,a,b,e);};if(z){var C=l.renderer.fontMetrics(l.styledMode?void 0:k.style.fontSize,g).b;f=t({x:m?this.yAxis.len-q:p,y:Math.round(m?this.xAxis.len-p:q),width:0,height:0},f);t(k,{width:v.width,height:v.height});y?(h=!1,p=
    l.renderer.rotCorr(C,y),p={x:f.x+(k.x||0)+f.width/2+p.x,y:f.y+(k.y||0)+{top:0,middle:.5,bottom:1}[k.verticalAlign]*f.height},x(p),g[a?"attr":"animate"](p).attr({align:e}),x=(y+720)%360,x=180<x&&360>x,"left"===e?p.y-=x?v.height:0:"center"===e?(p.x-=v.width/2,p.y-=v.height/2):"right"===e&&(p.x-=v.width,p.y-=x?0:v.height),g.placed=!0,g.alignAttr=p):(x(f),g.align(k,null,f),p=g.alignAttr);h&&0<=f.height?this.justifyDataLabel(g,k,p,v,f,a):r(k.crop,!0)&&(z=l.isInsidePlot(p.x,p.y)&&l.isInsidePlot(p.x+v.width,
    p.y+v.height));if(k.shape&&!y)g[a?"attr":"animate"]({anchorX:m?l.plotWidth-c.plotY:c.plotX,anchorY:m?l.plotHeight-c.plotX:c.plotY});}a&&n&&(g.placed=!1);z||n&&!h||(g.hide(!0),g.placed=!1);};m.prototype.setDataLabelStartPos=function(c,g,k,f,a){var d=this.chart,l=d.inverted,m=this.xAxis,n=m.reversed,p=l?g.height/2:g.width/2;c=(c=c.pointWidth)?c/2:0;m=l?a.x:n?-p-c:m.width-p+c;a=l?n?this.yAxis.height-p+c:-p-c:a.y;g.startXPos=m;g.startYPos=a;f?"hidden"===g.visibility&&(g.show(),g.attr({opacity:0}).animate({opacity:1})):
    g.attr({opacity:1}).animate({opacity:0},void 0,g.hide);d.hasRendered&&(k&&g.attr({x:g.startXPos,y:g.startYPos}),g.placed=!0);};m.prototype.justifyDataLabel=function(c,g,k,f,a,m){var d=this.chart,l=g.align,n=g.verticalAlign,p=c.box?0:c.padding||0,q=g.x;q=void 0===q?0:q;var r=g.y;var t=void 0===r?0:r;r=k.x+p;if(0>r){"right"===l&&0<=q?(g.align="left",g.inside=!0):q-=r;var e=!0;}r=k.x+f.width-p;r>d.plotWidth&&("left"===l&&0>=q?(g.align="right",g.inside=!0):q+=d.plotWidth-r,e=!0);r=k.y+p;0>r&&("bottom"===
    n&&0<=t?(g.verticalAlign="top",g.inside=!0):t-=r,e=!0);r=k.y+f.height-p;r>d.plotHeight&&("top"===n&&0>=t?(g.verticalAlign="bottom",g.inside=!0):t+=d.plotHeight-r,e=!0);e&&(g.x=q,g.y=t,c.placed=!m,c.align(g,void 0,a));return e};y.pie&&(y.pie.prototype.dataLabelPositioners={radialDistributionY:function(c){return c.top+c.distributeBox.pos},radialDistributionX:function(c,g,k,f){return c.getX(k<g.top+2||k>g.bottom-2?f:k,g.half,g)},justify:function(c,g,k){return k[0]+(c.half?-1:1)*(g+c.labelDistance)},
    alignToPlotEdges:function(c,g,k,f){c=c.getBBox().width;return g?c+f:k-c-f},alignToConnectors:function(c,g,k,f){var a=0,d;c.forEach(function(c){d=c.dataLabel.getBBox().width;d>a&&(a=d);});return g?a+f:k-a-f}},y.pie.prototype.drawDataLabels=function(){var c=this,l=c.data,k,f=c.chart,a=c.options.dataLabels||{},n=a.connectorPadding,p,q=f.plotWidth,t=f.plotHeight,w=f.plotLeft,v=Math.round(f.chartWidth/3),y,C=c.center,e=C[2]/2,b=C[1],h,z,x,B,D=[[],[]],G,I,L,O,U=[0,0,0,0],R=c.dataLabelPositioners,T;c.visible&&
    (a.enabled||c._hasPointLabels)&&(l.forEach(function(a){a.dataLabel&&a.visible&&a.dataLabel.shortened&&(a.dataLabel.attr({width:"auto"}).css({width:"auto",textOverflow:"clip"}),a.dataLabel.shortened=!1);}),m.prototype.drawDataLabels.apply(c),l.forEach(function(b){b.dataLabel&&(b.visible?(D[b.half].push(b),b.dataLabel._pos=null,!J(a.style.width)&&!J(b.options.dataLabels&&b.options.dataLabels.style&&b.options.dataLabels.style.width)&&b.dataLabel.getBBox().width>v&&(b.dataLabel.css({width:Math.round(.7*
    v)+"px"}),b.dataLabel.shortened=!0)):(b.dataLabel=b.dataLabel.destroy(),b.dataLabels&&1===b.dataLabels.length&&delete b.dataLabels));}),D.forEach(function(d,l){var m=d.length,p=[],u;if(m){c.sortByAngle(d,l-.5);if(0<c.maxLabelDistance){var v=Math.max(0,b-e-c.maxLabelDistance);var A=Math.min(b+e+c.maxLabelDistance,f.plotHeight);d.forEach(function(a){0<a.labelDistance&&a.dataLabel&&(a.top=Math.max(0,b-e-a.labelDistance),a.bottom=Math.min(b+e+a.labelDistance,f.plotHeight),u=a.dataLabel.getBBox().height||
    21,a.distributeBox={target:a.labelPosition.natural.y-a.top+u/2,size:u,rank:a.y},p.push(a.distributeBox));});v=A+u-v;g.distribute(p,v,v/5);}for(O=0;O<m;O++){k=d[O];x=k.labelPosition;h=k.dataLabel;L=!1===k.visible?"hidden":"inherit";I=v=x.natural.y;p&&J(k.distributeBox)&&("undefined"===typeof k.distributeBox.pos?L="hidden":(B=k.distributeBox.size,I=R.radialDistributionY(k)));delete k.positionIndex;if(a.justify)G=R.justify(k,e,C);else switch(a.alignTo){case "connectors":G=R.alignToConnectors(d,l,q,w);
    break;case "plotEdges":G=R.alignToPlotEdges(h,l,q,w);break;default:G=R.radialDistributionX(c,k,I,v);}h._attr={visibility:L,align:x.alignment};T=k.options.dataLabels||{};h._pos={x:G+r(T.x,a.x)+({left:n,right:-n}[x.alignment]||0),y:I+r(T.y,a.y)-10};x.final.x=G;x.final.y=I;r(a.crop,!0)&&(z=h.getBBox().width,v=null,G-z<n&&1===l?(v=Math.round(z-G+n),U[3]=Math.max(v,U[3])):G+z>q-n&&0===l&&(v=Math.round(G+z-q+n),U[1]=Math.max(v,U[1])),0>I-B/2?U[0]=Math.max(Math.round(-I+B/2),U[0]):I+B/2>t&&(U[2]=Math.max(Math.round(I+
    B/2-t),U[2])),h.sideOverflow=v);}}}),0===H(U)||this.verifyDataLabelOverflow(U))&&(this.placeDataLabels(),this.points.forEach(function(b){T=K(a,b.options.dataLabels);if(p=r(T.connectorWidth,1)){var d;y=b.connector;if((h=b.dataLabel)&&h._pos&&b.visible&&0<b.labelDistance){L=h._attr.visibility;if(d=!y)b.connector=y=f.renderer.path().addClass("highcharts-data-label-connector  highcharts-color-"+b.colorIndex+(b.className?" "+b.className:"")).add(c.dataLabelsGroup),f.styledMode||y.attr({"stroke-width":p,
    stroke:T.connectorColor||b.color||"#666666"});y[d?"attr":"animate"]({d:b.getConnectorPath()});y.attr("visibility",L);}else y&&(b.connector=y.destroy());}}));},y.pie.prototype.placeDataLabels=function(){this.points.forEach(function(c){var d=c.dataLabel,g;d&&c.visible&&((g=d._pos)?(d.sideOverflow&&(d._attr.width=Math.max(d.getBBox().width-d.sideOverflow,0),d.css({width:d._attr.width+"px",textOverflow:(this.options.dataLabels.style||{}).textOverflow||"ellipsis"}),d.shortened=!0),d.attr(d._attr),d[d.moved?
    "animate":"attr"](g),d.moved=!0):d&&d.attr({y:-9999}));delete c.distributeBox;},this);},y.pie.prototype.alignDataLabel=q,y.pie.prototype.verifyDataLabelOverflow=function(c){var d=this.center,g=this.options,f=g.center,a=g.minSize||80,m=null!==g.size;if(!m){if(null!==f[0])var n=Math.max(d[2]-Math.max(c[1],c[3]),a);else n=Math.max(d[2]-c[1]-c[3],a),d[0]+=(c[3]-c[1])/2;null!==f[1]?n=D(n,a,d[2]-Math.max(c[0],c[2])):(n=D(n,a,d[2]-c[0]-c[2]),d[1]+=(c[0]-c[2])/2);n<d[2]?(d[2]=n,d[3]=Math.min(C(g.innerSize||
    0,n),n),this.translate(d),this.drawDataLabels&&this.drawDataLabels()):m=!0;}return m});y.column&&(y.column.prototype.alignDataLabel=function(c,g,k,f,a){var d=this.chart.inverted,l=c.series,n=c.dlBox||c.shapeArgs,p=r(c.below,c.plotY>r(this.translatedThreshold,l.yAxis.len)),q=r(k.inside,!!this.options.stacking);n&&(f=K(n),0>f.y&&(f.height+=f.y,f.y=0),n=f.y+f.height-l.yAxis.len,0<n&&n<f.height&&(f.height-=n),d&&(f={x:l.yAxis.len-f.y-f.height,y:l.xAxis.len-f.x-f.width,width:f.height,height:f.width}),q||
    (d?(f.x+=p?0:f.width,f.width=0):(f.y+=p?f.height:0,f.height=0)));k.align=r(k.align,!d||q?"center":p?"right":"left");k.verticalAlign=r(k.verticalAlign,d||q?"middle":p?"top":"bottom");m.prototype.alignDataLabel.call(this,c,g,k,f,a);k.inside&&c.contrastColor&&g.css({color:c.contrastColor});});});O(q,"modules/overlapping-datalabels.src.js",[q["parts/Chart.js"],q["parts/Utilities.js"]],function(g,c){var q=c.addEvent,y=c.fireEvent,B=c.isArray,H=c.isNumber,D=c.objectEach,J=c.pick;q(g,"render",function(){var c=
    [];(this.labelCollectors||[]).forEach(function(g){c=c.concat(g());});(this.yAxis||[]).forEach(function(g){g.stacking&&g.options.stackLabels&&!g.options.stackLabels.allowOverlap&&D(g.stacking.stacks,function(g){D(g,function(g){c.push(g.label);});});});(this.series||[]).forEach(function(g){var q=g.options.dataLabels;g.visible&&(!1!==q.enabled||g._hasPointLabels)&&(g.nodes||g.points).forEach(function(g){g.visible&&(B(g.dataLabels)?g.dataLabels:g.dataLabel?[g.dataLabel]:[]).forEach(function(q){var n=q.options;
    q.labelrank=J(n.labelrank,g.labelrank,g.shapeArgs&&g.shapeArgs.height);n.allowOverlap||c.push(q);});});});this.hideOverlappingLabels(c);});g.prototype.hideOverlappingLabels=function(c){var g=this,q=c.length,t=g.renderer,B,n,r,C=!1;var D=function(c){var d,g=c.box?0:c.padding||0,f=d=0,a;if(c&&(!c.alignAttr||c.placed)){var m=c.alignAttr||{x:c.attr("x"),y:c.attr("y")};var n=c.parentGroup;c.width||(d=c.getBBox(),c.width=d.width,c.height=d.height,d=t.fontMetrics(null,c.element).h);var p=c.width-2*g;(a={left:"0",
    center:"0.5",right:"1"}[c.alignValue])?f=+a*p:H(c.x)&&Math.round(c.x)!==c.translateX&&(f=c.x-c.translateX);return {x:m.x+(n.translateX||0)+g-f,y:m.y+(n.translateY||0)+g-d,width:c.width-2*g,height:c.height-2*g}}};for(n=0;n<q;n++)if(B=c[n])B.oldOpacity=B.opacity,B.newOpacity=1,B.absoluteBox=D(B);c.sort(function(c,g){return (g.labelrank||0)-(c.labelrank||0)});for(n=0;n<q;n++){var p=(D=c[n])&&D.absoluteBox;for(B=n+1;B<q;++B){var m=(r=c[B])&&r.absoluteBox;!p||!m||D===r||0===D.newOpacity||0===r.newOpacity||
    m.x>p.x+p.width||m.x+m.width<p.x||m.y>p.y+p.height||m.y+m.height<p.y||((D.labelrank<r.labelrank?D:r).newOpacity=0);}}c.forEach(function(c){if(c){var d=c.newOpacity;c.oldOpacity!==d&&(c.alignAttr&&c.placed?(c[d?"removeClass":"addClass"]("highcharts-data-label-hidden"),C=!0,c.alignAttr.opacity=d,c[c.isOld?"animate":"attr"](c.alignAttr,null,function(){g.styledMode||c.css({pointerEvents:d?"auto":"none"});c.visibility=d?"inherit":"hidden";c.placed=!!d;}),y(g,"afterHideOverlappingLabel")):c.attr({opacity:d}));
    c.isOld=!0;}});C&&y(g,"afterHideAllOverlappingLabels");};});O(q,"parts/Interaction.js",[q["parts/Chart.js"],q["parts/Globals.js"],q["parts/Legend.js"],q["parts/Options.js"],q["parts/Point.js"],q["parts/Utilities.js"]],function(g,c,q,y,B,H){var D=y.defaultOptions,J=H.addEvent,t=H.createElement,G=H.css,L=H.defined,v=H.extend,K=H.fireEvent,n=H.isArray,r=H.isFunction,C=H.isNumber,I=H.isObject,p=H.merge,m=H.objectEach,d=H.pick,l=c.hasTouch;y=c.Series;H=c.seriesTypes;var k=c.svg;var f=c.TrackerMixin={drawTrackerPoint:function(){var a=
    this,c=a.chart,d=c.pointer,f=function(a){var c=d.getPointFromEvent(a);"undefined"!==typeof c&&(d.isDirectTouch=!0,c.onMouseOver(a));},g;a.points.forEach(function(a){g=n(a.dataLabels)?a.dataLabels:a.dataLabel?[a.dataLabel]:[];a.graphic&&(a.graphic.element.point=a);g.forEach(function(c){c.div?c.div.point=a:c.element.point=a;});});a._hasTracking||(a.trackerGroups.forEach(function(g){if(a[g]){a[g].addClass("highcharts-tracker").on("mouseover",f).on("mouseout",function(a){d.onTrackerMouseOut(a);});if(l)a[g].on("touchstart",
    f);!c.styledMode&&a.options.cursor&&a[g].css(G).css({cursor:a.options.cursor});}}),a._hasTracking=!0);K(this,"afterDrawTracker");},drawTrackerGraph:function(){var a=this,c=a.options,d=c.trackByArea,f=[].concat(d?a.areaPath:a.graphPath),g=a.chart,m=g.pointer,n=g.renderer,p=g.options.tooltip.snap,q=a.tracker,e=function(b){if(g.hoverSeries!==a)a.onMouseOver();},b="rgba(192,192,192,"+(k?.0001:.002)+")";q?q.attr({d:f}):a.graph&&(a.tracker=n.path(f).attr({visibility:a.visible?"visible":"hidden",zIndex:2}).addClass(d?
    "highcharts-tracker-area":"highcharts-tracker-line").add(a.group),g.styledMode||a.tracker.attr({"stroke-linecap":"round","stroke-linejoin":"round",stroke:b,fill:d?b:"none","stroke-width":a.graph.strokeWidth()+(d?0:2*p)}),[a.tracker,a.markerGroup].forEach(function(a){a.addClass("highcharts-tracker").on("mouseover",e).on("mouseout",function(a){m.onTrackerMouseOut(a);});c.cursor&&!g.styledMode&&a.css({cursor:c.cursor});if(l)a.on("touchstart",e);}));K(this,"afterDrawTracker");}};H.column&&(H.column.prototype.drawTracker=
    f.drawTrackerPoint);H.pie&&(H.pie.prototype.drawTracker=f.drawTrackerPoint);H.scatter&&(H.scatter.prototype.drawTracker=f.drawTrackerPoint);v(q.prototype,{setItemEvents:function(a,c,d){var f=this,g=f.chart.renderer.boxWrapper,k=a instanceof B,l="highcharts-legend-"+(k?"point":"series")+"-active",m=f.chart.styledMode;(d?[c,a.legendSymbol]:[a.legendGroup]).forEach(function(d){if(d)d.on("mouseover",function(){a.visible&&f.allItems.forEach(function(c){a!==c&&c.setState("inactive",!k);});a.setState("hover");
    a.visible&&g.addClass(l);m||c.css(f.options.itemHoverStyle);}).on("mouseout",function(){f.chart.styledMode||c.css(p(a.visible?f.itemStyle:f.itemHiddenStyle));f.allItems.forEach(function(c){a!==c&&c.setState("",!k);});g.removeClass(l);a.setState();}).on("click",function(c){var b=function(){a.setVisible&&a.setVisible();f.allItems.forEach(function(b){a!==b&&b.setState(a.visible?"inactive":"",!k);});};g.removeClass(l);c={browserEvent:c};a.firePointEvent?a.firePointEvent("legendItemClick",c,b):K(a,"legendItemClick",
    c,b);});});},createCheckboxForItem:function(a){a.checkbox=t("input",{type:"checkbox",className:"highcharts-legend-checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);J(a.checkbox,"click",function(c){K(a.series||a,"checkboxClick",{checked:c.target.checked,item:a},function(){a.select();});});}});v(g.prototype,{showResetZoom:function(){function a(){c.zoomOut();}var c=this,d=D.lang,f=c.options.chart.resetZoomButton,g=f.theme,k=g.states,l="chart"===f.relativeTo||
    "spaceBox"===f.relativeTo?null:"plotBox";K(this,"beforeShowResetZoom",null,function(){c.resetZoomButton=c.renderer.button(d.resetZoom,null,null,a,g,k&&k.hover).attr({align:f.position.align,title:d.resetZoomTitle}).addClass("highcharts-reset-zoom").add().align(f.position,!1,l);});K(this,"afterShowResetZoom");},zoomOut:function(){K(this,"selection",{resetSelection:!0},this.zoom);},zoom:function(a){var c=this,f,g=c.pointer,k=!1,l=c.inverted?g.mouseDownX:g.mouseDownY;!a||a.resetSelection?(c.axes.forEach(function(a){f=
    a.zoom();}),g.initiated=!1):a.xAxis.concat(a.yAxis).forEach(function(a){var d=a.axis,e=c.inverted?d.left:d.top,b=c.inverted?e+d.width:e+d.height,h=d.isXAxis,m=!1;if(!h&&l>=e&&l<=b||h||!L(l))m=!0;g[h?"zoomX":"zoomY"]&&m&&(f=d.zoom(a.min,a.max),d.displayBtn&&(k=!0));});var m=c.resetZoomButton;k&&!m?c.showResetZoom():!k&&I(m)&&(c.resetZoomButton=m.destroy());f&&c.redraw(d(c.options.chart.animation,a&&a.animation,100>c.pointCount));},pan:function(a,d){var f=this,g=f.hoverPoints,k=f.options.chart,l=f.options.mapNavigation&&
    f.options.mapNavigation.enabled,m;d="object"===typeof d?d:{enabled:d,type:"x"};k&&k.panning&&(k.panning=d);var n=d.type;K(this,"pan",{originalEvent:a},function(){g&&g.forEach(function(a){a.setState();});var d=[1];"xy"===n?d=[1,0]:"y"===n&&(d=[0]);d.forEach(function(d){var b=f[d?"xAxis":"yAxis"][0],e=b.horiz,g=a[e?"chartX":"chartY"];e=e?"mouseDownX":"mouseDownY";var k=f[e],p=(b.pointRange||0)/2,q=b.reversed&&!f.inverted||!b.reversed&&f.inverted?-1:1,r=b.getExtremes(),u=b.toValue(k-g,!0)+p*q;q=b.toValue(k+
    b.len-g,!0)-p*q;var t=q<u;k=t?q:u;u=t?u:q;var w=b.hasVerticalPanning(),v=b.panningState;b.series.forEach(function(a){if(w&&!d&&(!v||v.isDirty)){var b=a.getProcessedData(!0);a=a.getExtremes(b.yData,!0);v||(v={startMin:Number.MAX_VALUE,startMax:-Number.MAX_VALUE});C(a.dataMin)&&C(a.dataMax)&&(v.startMin=Math.min(a.dataMin,v.startMin),v.startMax=Math.max(a.dataMax,v.startMax));}});q=Math.min(c.pick(null===v||void 0===v?void 0:v.startMin,r.dataMin),p?r.min:b.toValue(b.toPixels(r.min)-b.minPixelPadding));
    p=Math.max(c.pick(null===v||void 0===v?void 0:v.startMax,r.dataMax),p?r.max:b.toValue(b.toPixels(r.max)+b.minPixelPadding));b.panningState=v;b.isOrdinal||(t=q-k,0<t&&(u+=t,k=q),t=u-p,0<t&&(u=p,k-=t),b.series.length&&k!==r.min&&u!==r.max&&k>=q&&u<=p&&(b.setExtremes(k,u,!1,!1,{trigger:"pan"}),f.resetZoomButton||l||k===q||u===p||!n.match("y")||(f.showResetZoom(),b.displayBtn=!1),m=!0),f[e]=g);});m&&f.redraw(!1);G(f.container,{cursor:"move"});});}});v(B.prototype,{select:function(a,c){var f=this,g=f.series,
    k=g.chart;this.selectedStaging=a=d(a,!f.selected);f.firePointEvent(a?"select":"unselect",{accumulate:c},function(){f.selected=f.options.selected=a;g.options.data[g.data.indexOf(f)]=f.options;f.setState(a&&"select");c||k.getSelectedPoints().forEach(function(a){var c=a.series;a.selected&&a!==f&&(a.selected=a.options.selected=!1,c.options.data[c.data.indexOf(a)]=a.options,a.setState(k.hoverPoints&&c.options.inactiveOtherPoints?"inactive":""),a.firePointEvent("unselect"));});});delete this.selectedStaging;},
    onMouseOver:function(a){var c=this.series.chart,d=c.pointer;a=a?d.normalize(a):d.getChartCoordinatesFromPoint(this,c.inverted);d.runPointActions(a,this);},onMouseOut:function(){var a=this.series.chart;this.firePointEvent("mouseOut");this.series.options.inactiveOtherPoints||(a.hoverPoints||[]).forEach(function(a){a.setState();});a.hoverPoints=a.hoverPoint=null;},importEvents:function(){if(!this.hasImportedEvents){var a=this,c=p(a.series.options.point,a.options).events;a.events=c;m(c,function(c,d){r(c)&&
    J(a,d,c);});this.hasImportedEvents=!0;}},setState:function(a,c){var f=this.series,g=this.state,k=f.options.states[a||"normal"]||{},l=D.plotOptions[f.type].marker&&f.options.marker,m=l&&!1===l.enabled,n=l&&l.states&&l.states[a||"normal"]||{},p=!1===n.enabled,e=f.stateMarkerGraphic,b=this.marker||{},h=f.chart,q=f.halo,r,t=l&&f.markerAttribs;a=a||"";if(!(a===this.state&&!c||this.selected&&"select"!==a||!1===k.enabled||a&&(p||m&&!1===n.enabled)||a&&b.states&&b.states[a]&&!1===b.states[a].enabled)){this.state=
    a;t&&(r=f.markerAttribs(this,a));if(this.graphic){g&&this.graphic.removeClass("highcharts-point-"+g);a&&this.graphic.addClass("highcharts-point-"+a);if(!h.styledMode){var y=f.pointAttribs(this,a);var A=d(h.options.chart.animation,k.animation);f.options.inactiveOtherPoints&&y.opacity&&((this.dataLabels||[]).forEach(function(a){a&&a.animate({opacity:y.opacity},A);}),this.connector&&this.connector.animate({opacity:y.opacity},A));this.graphic.animate(y,A);}r&&this.graphic.animate(r,d(h.options.chart.animation,
    n.animation,l.animation));e&&e.hide();}else{if(a&&n){g=b.symbol||f.symbol;e&&e.currentSymbol!==g&&(e=e.destroy());if(r)if(e)e[c?"animate":"attr"]({x:r.x,y:r.y});else g&&(f.stateMarkerGraphic=e=h.renderer.symbol(g,r.x,r.y,r.width,r.height).add(f.markerGroup),e.currentSymbol=g);!h.styledMode&&e&&e.attr(f.pointAttribs(this,a));}e&&(e[a&&this.isInside?"show":"hide"](),e.element.point=this);}a=k.halo;k=(e=this.graphic||e)&&e.visibility||"inherit";a&&a.size&&e&&"hidden"!==k&&!this.isCluster?(q||(f.halo=q=
    h.renderer.path().add(e.parentGroup)),q.show()[c?"animate":"attr"]({d:this.haloPath(a.size)}),q.attr({"class":"highcharts-halo highcharts-color-"+d(this.colorIndex,f.colorIndex)+(this.className?" "+this.className:""),visibility:k,zIndex:-1}),q.point=this,h.styledMode||q.attr(v({fill:this.color||f.color,"fill-opacity":a.opacity},a.attributes))):q&&q.point&&q.point.haloPath&&q.animate({d:q.point.haloPath(0)},null,q.hide);K(this,"afterSetState");}},haloPath:function(a){return this.series.chart.renderer.symbols.circle(Math.floor(this.plotX)-
    a,this.plotY-a,2*a,2*a)}});v(y.prototype,{onMouseOver:function(){var a=this.chart,c=a.hoverSeries;a.pointer.setHoverChartIndex();if(c&&c!==this)c.onMouseOut();this.options.events.mouseOver&&K(this,"mouseOver");this.setState("hover");a.hoverSeries=this;},onMouseOut:function(){var a=this.options,c=this.chart,d=c.tooltip,f=c.hoverPoint;c.hoverSeries=null;if(f)f.onMouseOut();this&&a.events.mouseOut&&K(this,"mouseOut");!d||this.stickyTracking||d.shared&&!this.noSharedTooltip||d.hide();c.series.forEach(function(a){a.setState("",
    !0);});},setState:function(a,c){var f=this,g=f.options,k=f.graph,l=g.inactiveOtherPoints,m=g.states,n=g.lineWidth,p=g.opacity,e=d(m[a||"normal"]&&m[a||"normal"].animation,f.chart.options.chart.animation);g=0;a=a||"";if(f.state!==a&&([f.group,f.markerGroup,f.dataLabelsGroup].forEach(function(b){b&&(f.state&&b.removeClass("highcharts-series-"+f.state),a&&b.addClass("highcharts-series-"+a));}),f.state=a,!f.chart.styledMode)){if(m[a]&&!1===m[a].enabled)return;a&&(n=m[a].lineWidth||n+(m[a].lineWidthPlus||
    0),p=d(m[a].opacity,p));if(k&&!k.dashstyle)for(m={"stroke-width":n},k.animate(m,e);f["zone-graph-"+g];)f["zone-graph-"+g].attr(m),g+=1;l||[f.group,f.markerGroup,f.dataLabelsGroup,f.labelBySeries].forEach(function(a){a&&a.animate({opacity:p},e);});}c&&l&&f.points&&f.setAllPointsToState(a);},setAllPointsToState:function(a){this.points.forEach(function(c){c.setState&&c.setState(a);});},setVisible:function(a,c){var d=this,f=d.chart,g=d.legendItem,k=f.options.chart.ignoreHiddenSeries,l=d.visible;var m=(d.visible=
    a=d.options.visible=d.userOptions.visible="undefined"===typeof a?!l:a)?"show":"hide";["group","dataLabelsGroup","markerGroup","tracker","tt"].forEach(function(a){if(d[a])d[a][m]();});if(f.hoverSeries===d||(f.hoverPoint&&f.hoverPoint.series)===d)d.onMouseOut();g&&f.legend.colorizeItem(d,a);d.isDirty=!0;d.options.stacking&&f.series.forEach(function(a){a.options.stacking&&a.visible&&(a.isDirty=!0);});d.linkedSeries.forEach(function(c){c.setVisible(a,!1);});k&&(f.isDirtyBox=!0);K(d,m);!1!==c&&f.redraw();},
    show:function(){this.setVisible(!0);},hide:function(){this.setVisible(!1);},select:function(a){this.selected=a=this.options.selected="undefined"===typeof a?!this.selected:a;this.checkbox&&(this.checkbox.checked=a);K(this,a?"select":"unselect");},drawTracker:f.drawTrackerGraph});});O(q,"parts/Responsive.js",[q["parts/Chart.js"],q["parts/Utilities.js"]],function(g,c){var q=c.find,y=c.isArray,B=c.isObject,H=c.merge,D=c.objectEach,J=c.pick,t=c.splat,G=c.uniqueKey;g.prototype.setResponsive=function(c,g){var t=
    this.options.responsive,n=[],r=this.currentResponsive;!g&&t&&t.rules&&t.rules.forEach(function(c){"undefined"===typeof c._id&&(c._id=G());this.matchResponsiveRule(c,n);},this);g=H.apply(0,n.map(function(c){return q(t.rules,function(g){return g._id===c}).chartOptions}));g.isResponsiveOptions=!0;n=n.toString()||void 0;n!==(r&&r.ruleIds)&&(r&&this.update(r.undoOptions,c,!0),n?(r=this.currentOptions(g),r.isResponsiveOptions=!0,this.currentResponsive={ruleIds:n,mergedOptions:g,undoOptions:r},this.update(g,
    c,!0)):this.currentResponsive=void 0);};g.prototype.matchResponsiveRule=function(c,g){var q=c.condition;(q.callback||function(){return this.chartWidth<=J(q.maxWidth,Number.MAX_VALUE)&&this.chartHeight<=J(q.maxHeight,Number.MAX_VALUE)&&this.chartWidth>=J(q.minWidth,0)&&this.chartHeight>=J(q.minHeight,0)}).call(this)&&g.push(c._id);};g.prototype.currentOptions=function(c){function g(c,n,v,p){var m;D(c,function(c,l){if(!p&&-1<q.collectionsWithUpdate.indexOf(l))for(c=t(c),v[l]=[],m=0;m<Math.max(c.length,
    n[l].length);m++)n[l][m]&&(void 0===c[m]?v[l][m]=n[l][m]:(v[l][m]={},g(c[m],n[l][m],v[l][m],p+1)));else B(c)?(v[l]=y(c)?[]:{},g(c,n[l]||{},v[l],p+1)):v[l]="undefined"===typeof n[l]?null:n[l];});}var q=this,n={};g(c,this.options,n,0);return n};});O(q,"masters/highcharts.src.js",[q["parts/Globals.js"]],function(g){return g});q["masters/highcharts.src.js"]._modules=q;return q["masters/highcharts.src.js"]});

    });

    class HighchartHedwig extends HTMLElement {
      constructor() {
        super();
      }

      connectedCallback() {
        this.innerHTML = `<div style="height: 400px,width:400px" id="container"> test</div>`;
        var container = document.querySelector(`#container`);
        highcharts.chart("container", {
          chart: {
            height: 300,
            width: 600,
            type: 'line'
          },
          title: {
            text: 'Hedwig High chart Demo'
          },
          subtitle: {
            text: 'Source: Metrics'
          },
          yAxis: {
            title: {
              text: 'Number of cpus'
            }
          },
          xAxis: {
            accessibility: {
              rangeDescription: 'Range: 2010 to 2017'
            }
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },
          plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              }
            }
          },
          series: [{
            name: '6221-forestofdean.prod.com',
            data: [0.45, 0.67, 0.10, 0.99],
            color: "#F7CD9D"
          }, {
            name: '7877-ministryofmagic.staging.com',
            data: [0.80, 0.33, 0.2, 0.78],
            color: "red"
          }],
          responsive: {
            rules: [{
              condition: {
                maxWidth: 200
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        });
        this.attachShadow({
          mode: 'open'
        });
        this.shadowRoot.appendChild(container);
      }

    }
    customElements.define('hedwig-highchart', HighchartHedwig);

    exports.Defaults = Defaults;
    exports.GraphEngine = GraphEngine;
    exports.HighchartHedwig = HighchartHedwig;
    exports.LineGraph = LineGraph;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
