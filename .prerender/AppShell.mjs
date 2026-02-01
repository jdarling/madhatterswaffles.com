var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/papaparse/papaparse.js
var require_papaparse = __commonJS({
  "node_modules/papaparse/papaparse.js"(exports, module) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define([], factory);
      } else if (typeof module === "object" && typeof exports !== "undefined") {
        module.exports = factory();
      } else {
        root.Papa = factory();
      }
    })(exports, function moduleFactory() {
      "use strict";
      var global = (function() {
        if (typeof self !== "undefined") {
          return self;
        }
        if (typeof window !== "undefined") {
          return window;
        }
        if (typeof global !== "undefined") {
          return global;
        }
        return {};
      })();
      function getWorkerBlob() {
        var URL = global.URL || global.webkitURL || null;
        var code = moduleFactory.toString();
        return Papa3.BLOB_URL || (Papa3.BLOB_URL = URL.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", code, ")();"], { type: "text/javascript" })));
      }
      var IS_WORKER = !global.document && !!global.postMessage, IS_PAPA_WORKER = global.IS_PAPA_WORKER || false;
      var workers = {}, workerIdCounter = 0;
      var Papa3 = {};
      Papa3.parse = CsvToJson;
      Papa3.unparse = JsonToCsv;
      Papa3.RECORD_SEP = String.fromCharCode(30);
      Papa3.UNIT_SEP = String.fromCharCode(31);
      Papa3.BYTE_ORDER_MARK = "\uFEFF";
      Papa3.BAD_DELIMITERS = ["\r", "\n", '"', Papa3.BYTE_ORDER_MARK];
      Papa3.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
      Papa3.NODE_STREAM_INPUT = 1;
      Papa3.LocalChunkSize = 1024 * 1024 * 10;
      Papa3.RemoteChunkSize = 1024 * 1024 * 5;
      Papa3.DefaultDelimiter = ",";
      Papa3.Parser = Parser;
      Papa3.ParserHandle = ParserHandle;
      Papa3.NetworkStreamer = NetworkStreamer;
      Papa3.FileStreamer = FileStreamer;
      Papa3.StringStreamer = StringStreamer;
      Papa3.ReadableStreamStreamer = ReadableStreamStreamer;
      if (typeof PAPA_BROWSER_CONTEXT === "undefined") {
        Papa3.DuplexStreamStreamer = DuplexStreamStreamer;
      }
      if (global.jQuery) {
        var $ = global.jQuery;
        $.fn.parse = function(options) {
          var config = options.config || {};
          var queue = [];
          this.each(function(idx) {
            var supported = $(this).prop("tagName").toUpperCase() === "INPUT" && $(this).attr("type").toLowerCase() === "file" && global.FileReader;
            if (!supported || !this.files || this.files.length === 0)
              return true;
            for (var i = 0; i < this.files.length; i++) {
              queue.push({
                file: this.files[i],
                inputElem: this,
                instanceConfig: $.extend({}, config)
              });
            }
          });
          parseNextFile();
          return this;
          function parseNextFile() {
            if (queue.length === 0) {
              if (isFunction(options.complete))
                options.complete();
              return;
            }
            var f = queue[0];
            if (isFunction(options.before)) {
              var returned = options.before(f.file, f.inputElem);
              if (typeof returned === "object") {
                if (returned.action === "abort") {
                  error("AbortError", f.file, f.inputElem, returned.reason);
                  return;
                } else if (returned.action === "skip") {
                  fileComplete();
                  return;
                } else if (typeof returned.config === "object")
                  f.instanceConfig = $.extend(f.instanceConfig, returned.config);
              } else if (returned === "skip") {
                fileComplete();
                return;
              }
            }
            var userCompleteFunc = f.instanceConfig.complete;
            f.instanceConfig.complete = function(results) {
              if (isFunction(userCompleteFunc))
                userCompleteFunc(results, f.file, f.inputElem);
              fileComplete();
            };
            Papa3.parse(f.file, f.instanceConfig);
          }
          function error(name, file, elem, reason) {
            if (isFunction(options.error))
              options.error({ name }, file, elem, reason);
          }
          function fileComplete() {
            queue.splice(0, 1);
            parseNextFile();
          }
        };
      }
      if (IS_PAPA_WORKER) {
        global.onmessage = workerThreadReceivedMessage;
      }
      function CsvToJson(_input, _config) {
        _config = _config || {};
        var dynamicTyping = _config.dynamicTyping || false;
        if (isFunction(dynamicTyping)) {
          _config.dynamicTypingFunction = dynamicTyping;
          dynamicTyping = {};
        }
        _config.dynamicTyping = dynamicTyping;
        _config.transform = isFunction(_config.transform) ? _config.transform : false;
        if (_config.worker && Papa3.WORKERS_SUPPORTED) {
          var w = newWorker();
          w.userStep = _config.step;
          w.userChunk = _config.chunk;
          w.userComplete = _config.complete;
          w.userError = _config.error;
          _config.step = isFunction(_config.step);
          _config.chunk = isFunction(_config.chunk);
          _config.complete = isFunction(_config.complete);
          _config.error = isFunction(_config.error);
          delete _config.worker;
          w.postMessage({
            input: _input,
            config: _config,
            workerId: w.id
          });
          return;
        }
        var streamer = null;
        if (_input === Papa3.NODE_STREAM_INPUT && typeof PAPA_BROWSER_CONTEXT === "undefined") {
          streamer = new DuplexStreamStreamer(_config);
          return streamer.getStream();
        } else if (typeof _input === "string") {
          _input = stripBom(_input);
          if (_config.download)
            streamer = new NetworkStreamer(_config);
          else
            streamer = new StringStreamer(_config);
        } else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on)) {
          streamer = new ReadableStreamStreamer(_config);
        } else if (global.File && _input instanceof File || _input instanceof Object)
          streamer = new FileStreamer(_config);
        return streamer.stream(_input);
        function stripBom(string) {
          if (string.charCodeAt(0) === 65279) {
            return string.slice(1);
          }
          return string;
        }
      }
      function JsonToCsv(_input, _config) {
        var _quotes = false;
        var _writeHeader = true;
        var _delimiter = ",";
        var _newline = "\r\n";
        var _quoteChar = '"';
        var _escapedQuote = _quoteChar + _quoteChar;
        var _skipEmptyLines = false;
        var _columns = null;
        var _escapeFormulae = false;
        unpackConfig();
        var quoteCharRegex = new RegExp(escapeRegExp(_quoteChar), "g");
        if (typeof _input === "string")
          _input = JSON.parse(_input);
        if (Array.isArray(_input)) {
          if (!_input.length || Array.isArray(_input[0]))
            return serialize(null, _input, _skipEmptyLines);
          else if (typeof _input[0] === "object")
            return serialize(_columns || Object.keys(_input[0]), _input, _skipEmptyLines);
        } else if (typeof _input === "object") {
          if (typeof _input.data === "string")
            _input.data = JSON.parse(_input.data);
          if (Array.isArray(_input.data)) {
            if (!_input.fields)
              _input.fields = _input.meta && _input.meta.fields || _columns;
            if (!_input.fields)
              _input.fields = Array.isArray(_input.data[0]) ? _input.fields : typeof _input.data[0] === "object" ? Object.keys(_input.data[0]) : [];
            if (!Array.isArray(_input.data[0]) && typeof _input.data[0] !== "object")
              _input.data = [_input.data];
          }
          return serialize(_input.fields || [], _input.data || [], _skipEmptyLines);
        }
        throw new Error("Unable to serialize unrecognized input");
        function unpackConfig() {
          if (typeof _config !== "object")
            return;
          if (typeof _config.delimiter === "string" && !Papa3.BAD_DELIMITERS.filter(function(value) {
            return _config.delimiter.indexOf(value) !== -1;
          }).length) {
            _delimiter = _config.delimiter;
          }
          if (typeof _config.quotes === "boolean" || typeof _config.quotes === "function" || Array.isArray(_config.quotes))
            _quotes = _config.quotes;
          if (typeof _config.skipEmptyLines === "boolean" || typeof _config.skipEmptyLines === "string")
            _skipEmptyLines = _config.skipEmptyLines;
          if (typeof _config.newline === "string")
            _newline = _config.newline;
          if (typeof _config.quoteChar === "string")
            _quoteChar = _config.quoteChar;
          if (typeof _config.header === "boolean")
            _writeHeader = _config.header;
          if (Array.isArray(_config.columns)) {
            if (_config.columns.length === 0) throw new Error("Option columns is empty");
            _columns = _config.columns;
          }
          if (_config.escapeChar !== void 0) {
            _escapedQuote = _config.escapeChar + _quoteChar;
          }
          if (_config.escapeFormulae instanceof RegExp) {
            _escapeFormulae = _config.escapeFormulae;
          } else if (typeof _config.escapeFormulae === "boolean" && _config.escapeFormulae) {
            _escapeFormulae = /^[=+\-@\t\r].*$/;
          }
        }
        function serialize(fields, data, skipEmptyLines) {
          var csv = "";
          if (typeof fields === "string")
            fields = JSON.parse(fields);
          if (typeof data === "string")
            data = JSON.parse(data);
          var hasHeader = Array.isArray(fields) && fields.length > 0;
          var dataKeyedByField = !Array.isArray(data[0]);
          if (hasHeader && _writeHeader) {
            for (var i = 0; i < fields.length; i++) {
              if (i > 0)
                csv += _delimiter;
              csv += safe(fields[i], i);
            }
            if (data.length > 0)
              csv += _newline;
          }
          for (var row = 0; row < data.length; row++) {
            var maxCol = hasHeader ? fields.length : data[row].length;
            var emptyLine = false;
            var nullLine = hasHeader ? Object.keys(data[row]).length === 0 : data[row].length === 0;
            if (skipEmptyLines && !hasHeader) {
              emptyLine = skipEmptyLines === "greedy" ? data[row].join("").trim() === "" : data[row].length === 1 && data[row][0].length === 0;
            }
            if (skipEmptyLines === "greedy" && hasHeader) {
              var line = [];
              for (var c = 0; c < maxCol; c++) {
                var cx = dataKeyedByField ? fields[c] : c;
                line.push(data[row][cx]);
              }
              emptyLine = line.join("").trim() === "";
            }
            if (!emptyLine) {
              for (var col = 0; col < maxCol; col++) {
                if (col > 0 && !nullLine)
                  csv += _delimiter;
                var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
                csv += safe(data[row][colIdx], col);
              }
              if (row < data.length - 1 && (!skipEmptyLines || maxCol > 0 && !nullLine)) {
                csv += _newline;
              }
            }
          }
          return csv;
        }
        function safe(str, col) {
          if (typeof str === "undefined" || str === null)
            return "";
          if (str.constructor === Date)
            return JSON.stringify(str).slice(1, 25);
          var needsQuotes = false;
          if (_escapeFormulae && typeof str === "string" && _escapeFormulae.test(str)) {
            str = "'" + str;
            needsQuotes = true;
          }
          var escapedQuoteStr = str.toString().replace(quoteCharRegex, _escapedQuote);
          needsQuotes = needsQuotes || _quotes === true || typeof _quotes === "function" && _quotes(str, col) || Array.isArray(_quotes) && _quotes[col] || hasAny(escapedQuoteStr, Papa3.BAD_DELIMITERS) || escapedQuoteStr.indexOf(_delimiter) > -1 || escapedQuoteStr.charAt(0) === " " || escapedQuoteStr.charAt(escapedQuoteStr.length - 1) === " ";
          return needsQuotes ? _quoteChar + escapedQuoteStr + _quoteChar : escapedQuoteStr;
        }
        function hasAny(str, substrings) {
          for (var i = 0; i < substrings.length; i++)
            if (str.indexOf(substrings[i]) > -1)
              return true;
          return false;
        }
      }
      function ChunkStreamer(config) {
        this._handle = null;
        this._finished = false;
        this._completed = false;
        this._halted = false;
        this._input = null;
        this._baseIndex = 0;
        this._partialLine = "";
        this._rowCount = 0;
        this._start = 0;
        this._nextChunk = null;
        this.isFirstChunk = true;
        this._completeResults = {
          data: [],
          errors: [],
          meta: {}
        };
        replaceConfig.call(this, config);
        this.parseChunk = function(chunk, isFakeChunk) {
          const skipFirstNLines = parseInt(this._config.skipFirstNLines) || 0;
          if (this.isFirstChunk && skipFirstNLines > 0) {
            let _newline = this._config.newline;
            if (!_newline) {
              const quoteChar = this._config.quoteChar || '"';
              _newline = this._handle.guessLineEndings(chunk, quoteChar);
            }
            const splitChunk = chunk.split(_newline);
            chunk = [...splitChunk.slice(skipFirstNLines)].join(_newline);
          }
          if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk)) {
            var modifiedChunk = this._config.beforeFirstChunk(chunk);
            if (modifiedChunk !== void 0)
              chunk = modifiedChunk;
          }
          this.isFirstChunk = false;
          this._halted = false;
          var aggregate = this._partialLine + chunk;
          this._partialLine = "";
          var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);
          if (this._handle.paused() || this._handle.aborted()) {
            this._halted = true;
            return;
          }
          var lastIndex = results.meta.cursor;
          if (!this._finished) {
            this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
            this._baseIndex = lastIndex;
          }
          if (results && results.data)
            this._rowCount += results.data.length;
          var finishedIncludingPreview = this._finished || this._config.preview && this._rowCount >= this._config.preview;
          if (IS_PAPA_WORKER) {
            global.postMessage({
              results,
              workerId: Papa3.WORKER_ID,
              finished: finishedIncludingPreview
            });
          } else if (isFunction(this._config.chunk) && !isFakeChunk) {
            this._config.chunk(results, this._handle);
            if (this._handle.paused() || this._handle.aborted()) {
              this._halted = true;
              return;
            }
            results = void 0;
            this._completeResults = void 0;
          }
          if (!this._config.step && !this._config.chunk) {
            this._completeResults.data = this._completeResults.data.concat(results.data);
            this._completeResults.errors = this._completeResults.errors.concat(results.errors);
            this._completeResults.meta = results.meta;
          }
          if (!this._completed && finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted)) {
            this._config.complete(this._completeResults, this._input);
            this._completed = true;
          }
          if (!finishedIncludingPreview && (!results || !results.meta.paused))
            this._nextChunk();
          return results;
        };
        this._sendError = function(error) {
          if (isFunction(this._config.error))
            this._config.error(error);
          else if (IS_PAPA_WORKER && this._config.error) {
            global.postMessage({
              workerId: Papa3.WORKER_ID,
              error,
              finished: false
            });
          }
        };
        function replaceConfig(config2) {
          var configCopy = copy(config2);
          configCopy.chunkSize = parseInt(configCopy.chunkSize);
          if (!config2.step && !config2.chunk)
            configCopy.chunkSize = null;
          this._handle = new ParserHandle(configCopy);
          this._handle.streamer = this;
          this._config = configCopy;
        }
      }
      function NetworkStreamer(config) {
        config = config || {};
        if (!config.chunkSize)
          config.chunkSize = Papa3.RemoteChunkSize;
        ChunkStreamer.call(this, config);
        var xhr;
        if (IS_WORKER) {
          this._nextChunk = function() {
            this._readChunk();
            this._chunkLoaded();
          };
        } else {
          this._nextChunk = function() {
            this._readChunk();
          };
        }
        this.stream = function(url) {
          this._input = url;
          this._nextChunk();
        };
        this._readChunk = function() {
          if (this._finished) {
            this._chunkLoaded();
            return;
          }
          xhr = new XMLHttpRequest();
          if (this._config.withCredentials) {
            xhr.withCredentials = this._config.withCredentials;
          }
          if (!IS_WORKER) {
            xhr.onload = bindFunction(this._chunkLoaded, this);
            xhr.onerror = bindFunction(this._chunkError, this);
          }
          xhr.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !IS_WORKER);
          if (this._config.downloadRequestHeaders) {
            var headers = this._config.downloadRequestHeaders;
            for (var headerName in headers) {
              xhr.setRequestHeader(headerName, headers[headerName]);
            }
          }
          if (this._config.chunkSize) {
            var end = this._start + this._config.chunkSize - 1;
            xhr.setRequestHeader("Range", "bytes=" + this._start + "-" + end);
          }
          try {
            xhr.send(this._config.downloadRequestBody);
          } catch (err) {
            this._chunkError(err.message);
          }
          if (IS_WORKER && xhr.status === 0)
            this._chunkError();
        };
        this._chunkLoaded = function() {
          if (xhr.readyState !== 4)
            return;
          if (xhr.status < 200 || xhr.status >= 400) {
            this._chunkError();
            return;
          }
          this._start += this._config.chunkSize ? this._config.chunkSize : xhr.responseText.length;
          this._finished = !this._config.chunkSize || this._start >= getFileSize(xhr);
          this.parseChunk(xhr.responseText);
        };
        this._chunkError = function(errorMessage) {
          var errorText = xhr.statusText || errorMessage;
          this._sendError(new Error(errorText));
        };
        function getFileSize(xhr2) {
          var contentRange = xhr2.getResponseHeader("Content-Range");
          if (contentRange === null) {
            return -1;
          }
          return parseInt(contentRange.substring(contentRange.lastIndexOf("/") + 1));
        }
      }
      NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
      NetworkStreamer.prototype.constructor = NetworkStreamer;
      function FileStreamer(config) {
        config = config || {};
        if (!config.chunkSize)
          config.chunkSize = Papa3.LocalChunkSize;
        ChunkStreamer.call(this, config);
        var reader, slice;
        var usingAsyncReader = typeof FileReader !== "undefined";
        this.stream = function(file) {
          this._input = file;
          slice = file.slice || file.webkitSlice || file.mozSlice;
          if (usingAsyncReader) {
            reader = new FileReader();
            reader.onload = bindFunction(this._chunkLoaded, this);
            reader.onerror = bindFunction(this._chunkError, this);
          } else
            reader = new FileReaderSync();
          this._nextChunk();
        };
        this._nextChunk = function() {
          if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
            this._readChunk();
        };
        this._readChunk = function() {
          var input = this._input;
          if (this._config.chunkSize) {
            var end = Math.min(this._start + this._config.chunkSize, this._input.size);
            input = slice.call(input, this._start, end);
          }
          var txt = reader.readAsText(input, this._config.encoding);
          if (!usingAsyncReader)
            this._chunkLoaded({ target: { result: txt } });
        };
        this._chunkLoaded = function(event) {
          this._start += this._config.chunkSize;
          this._finished = !this._config.chunkSize || this._start >= this._input.size;
          this.parseChunk(event.target.result);
        };
        this._chunkError = function() {
          this._sendError(reader.error);
        };
      }
      FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
      FileStreamer.prototype.constructor = FileStreamer;
      function StringStreamer(config) {
        config = config || {};
        ChunkStreamer.call(this, config);
        var remaining;
        this.stream = function(s) {
          remaining = s;
          return this._nextChunk();
        };
        this._nextChunk = function() {
          if (this._finished) return;
          var size = this._config.chunkSize;
          var chunk;
          if (size) {
            chunk = remaining.substring(0, size);
            remaining = remaining.substring(size);
          } else {
            chunk = remaining;
            remaining = "";
          }
          this._finished = !remaining;
          return this.parseChunk(chunk);
        };
      }
      StringStreamer.prototype = Object.create(StringStreamer.prototype);
      StringStreamer.prototype.constructor = StringStreamer;
      function ReadableStreamStreamer(config) {
        config = config || {};
        ChunkStreamer.call(this, config);
        var queue = [];
        var parseOnData = true;
        var streamHasEnded = false;
        this.pause = function() {
          ChunkStreamer.prototype.pause.apply(this, arguments);
          this._input.pause();
        };
        this.resume = function() {
          ChunkStreamer.prototype.resume.apply(this, arguments);
          this._input.resume();
        };
        this.stream = function(stream) {
          this._input = stream;
          this._input.on("data", this._streamData);
          this._input.on("end", this._streamEnd);
          this._input.on("error", this._streamError);
        };
        this._checkIsFinished = function() {
          if (streamHasEnded && queue.length === 1) {
            this._finished = true;
          }
        };
        this._nextChunk = function() {
          this._checkIsFinished();
          if (queue.length) {
            this.parseChunk(queue.shift());
          } else {
            parseOnData = true;
          }
        };
        this._streamData = bindFunction(function(chunk) {
          try {
            queue.push(typeof chunk === "string" ? chunk : chunk.toString(this._config.encoding));
            if (parseOnData) {
              parseOnData = false;
              this._checkIsFinished();
              this.parseChunk(queue.shift());
            }
          } catch (error) {
            this._streamError(error);
          }
        }, this);
        this._streamError = bindFunction(function(error) {
          this._streamCleanUp();
          this._sendError(error);
        }, this);
        this._streamEnd = bindFunction(function() {
          this._streamCleanUp();
          streamHasEnded = true;
          this._streamData("");
        }, this);
        this._streamCleanUp = bindFunction(function() {
          this._input.removeListener("data", this._streamData);
          this._input.removeListener("end", this._streamEnd);
          this._input.removeListener("error", this._streamError);
        }, this);
      }
      ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
      ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;
      function DuplexStreamStreamer(_config) {
        var Duplex = __require("stream").Duplex;
        var config = copy(_config);
        var parseOnWrite = true;
        var writeStreamHasFinished = false;
        var parseCallbackQueue = [];
        var stream = null;
        this._onCsvData = function(results) {
          var data = results.data;
          if (!stream.push(data) && !this._handle.paused()) {
            this._handle.pause();
          }
        };
        this._onCsvComplete = function() {
          stream.push(null);
        };
        config.step = bindFunction(this._onCsvData, this);
        config.complete = bindFunction(this._onCsvComplete, this);
        ChunkStreamer.call(this, config);
        this._nextChunk = function() {
          if (writeStreamHasFinished && parseCallbackQueue.length === 1) {
            this._finished = true;
          }
          if (parseCallbackQueue.length) {
            parseCallbackQueue.shift()();
          } else {
            parseOnWrite = true;
          }
        };
        this._addToParseQueue = function(chunk, callback) {
          parseCallbackQueue.push(bindFunction(function() {
            this.parseChunk(typeof chunk === "string" ? chunk : chunk.toString(config.encoding));
            if (isFunction(callback)) {
              return callback();
            }
          }, this));
          if (parseOnWrite) {
            parseOnWrite = false;
            this._nextChunk();
          }
        };
        this._onRead = function() {
          if (this._handle.paused()) {
            this._handle.resume();
          }
        };
        this._onWrite = function(chunk, encoding, callback) {
          this._addToParseQueue(chunk, callback);
        };
        this._onWriteComplete = function() {
          writeStreamHasFinished = true;
          this._addToParseQueue("");
        };
        this.getStream = function() {
          return stream;
        };
        stream = new Duplex({
          readableObjectMode: true,
          decodeStrings: false,
          read: bindFunction(this._onRead, this),
          write: bindFunction(this._onWrite, this)
        });
        stream.once("finish", bindFunction(this._onWriteComplete, this));
      }
      if (typeof PAPA_BROWSER_CONTEXT === "undefined") {
        DuplexStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
        DuplexStreamStreamer.prototype.constructor = DuplexStreamStreamer;
      }
      function ParserHandle(_config) {
        var MAX_FLOAT = Math.pow(2, 53);
        var MIN_FLOAT = -MAX_FLOAT;
        var FLOAT = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/;
        var ISO_DATE = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/;
        var self2 = this;
        var _stepCounter = 0;
        var _rowCounter = 0;
        var _input;
        var _parser;
        var _paused = false;
        var _aborted = false;
        var _delimiterError;
        var _fields = [];
        var _results = {
          // The last results returned from the parser
          data: [],
          errors: [],
          meta: {}
        };
        if (isFunction(_config.step)) {
          var userStep = _config.step;
          _config.step = function(results) {
            _results = results;
            if (needsHeaderRow())
              processResults();
            else {
              processResults();
              if (_results.data.length === 0)
                return;
              _stepCounter += results.data.length;
              if (_config.preview && _stepCounter > _config.preview)
                _parser.abort();
              else {
                _results.data = _results.data[0];
                userStep(_results, self2);
              }
            }
          };
        }
        this.parse = function(input, baseIndex, ignoreLastRow) {
          var quoteChar = _config.quoteChar || '"';
          if (!_config.newline)
            _config.newline = this.guessLineEndings(input, quoteChar);
          _delimiterError = false;
          if (!_config.delimiter) {
            var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines, _config.comments, _config.delimitersToGuess);
            if (delimGuess.successful)
              _config.delimiter = delimGuess.bestDelimiter;
            else {
              _delimiterError = true;
              _config.delimiter = Papa3.DefaultDelimiter;
            }
            _results.meta.delimiter = _config.delimiter;
          } else if (isFunction(_config.delimiter)) {
            _config.delimiter = _config.delimiter(input);
            _results.meta.delimiter = _config.delimiter;
          }
          var parserConfig = copy(_config);
          if (_config.preview && _config.header)
            parserConfig.preview++;
          _input = input;
          _parser = new Parser(parserConfig);
          _results = _parser.parse(_input, baseIndex, ignoreLastRow);
          processResults();
          return _paused ? { meta: { paused: true } } : _results || { meta: { paused: false } };
        };
        this.paused = function() {
          return _paused;
        };
        this.pause = function() {
          _paused = true;
          _parser.abort();
          _input = isFunction(_config.chunk) ? "" : _input.substring(_parser.getCharIndex());
        };
        this.resume = function() {
          if (self2.streamer._halted) {
            _paused = false;
            self2.streamer.parseChunk(_input, true);
          } else {
            setTimeout(self2.resume, 3);
          }
        };
        this.aborted = function() {
          return _aborted;
        };
        this.abort = function() {
          _aborted = true;
          _parser.abort();
          _results.meta.aborted = true;
          if (isFunction(_config.complete))
            _config.complete(_results);
          _input = "";
        };
        this.guessLineEndings = function(input, quoteChar) {
          input = input.substring(0, 1024 * 1024);
          var re = new RegExp(escapeRegExp(quoteChar) + "([^]*?)" + escapeRegExp(quoteChar), "gm");
          input = input.replace(re, "");
          var r = input.split("\r");
          var n = input.split("\n");
          var nAppearsFirst = n.length > 1 && n[0].length < r[0].length;
          if (r.length === 1 || nAppearsFirst)
            return "\n";
          var numWithN = 0;
          for (var i = 0; i < r.length; i++) {
            if (r[i][0] === "\n")
              numWithN++;
          }
          return numWithN >= r.length / 2 ? "\r\n" : "\r";
        };
        function testEmptyLine(s) {
          return _config.skipEmptyLines === "greedy" ? s.join("").trim() === "" : s.length === 1 && s[0].length === 0;
        }
        function testFloat(s) {
          if (FLOAT.test(s)) {
            var floatValue = parseFloat(s);
            if (floatValue > MIN_FLOAT && floatValue < MAX_FLOAT) {
              return true;
            }
          }
          return false;
        }
        function processResults() {
          if (_results && _delimiterError) {
            addError("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + Papa3.DefaultDelimiter + "'");
            _delimiterError = false;
          }
          if (_config.skipEmptyLines) {
            _results.data = _results.data.filter(function(d) {
              return !testEmptyLine(d);
            });
          }
          if (needsHeaderRow())
            fillHeaderFields();
          return applyHeaderAndDynamicTypingAndTransformation();
        }
        function needsHeaderRow() {
          return _config.header && _fields.length === 0;
        }
        function fillHeaderFields() {
          if (!_results)
            return;
          function addHeader(header, i2) {
            if (isFunction(_config.transformHeader))
              header = _config.transformHeader(header, i2);
            _fields.push(header);
          }
          if (Array.isArray(_results.data[0])) {
            for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
              _results.data[i].forEach(addHeader);
            _results.data.splice(0, 1);
          } else
            _results.data.forEach(addHeader);
        }
        function shouldApplyDynamicTyping(field) {
          if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === void 0) {
            _config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
          }
          return (_config.dynamicTyping[field] || _config.dynamicTyping) === true;
        }
        function parseDynamic(field, value) {
          if (shouldApplyDynamicTyping(field)) {
            if (value === "true" || value === "TRUE")
              return true;
            else if (value === "false" || value === "FALSE")
              return false;
            else if (testFloat(value))
              return parseFloat(value);
            else if (ISO_DATE.test(value))
              return new Date(value);
            else
              return value === "" ? null : value;
          }
          return value;
        }
        function applyHeaderAndDynamicTypingAndTransformation() {
          if (!_results || !_config.header && !_config.dynamicTyping && !_config.transform)
            return _results;
          function processRow(rowSource, i) {
            var row = _config.header ? {} : [];
            var j;
            for (j = 0; j < rowSource.length; j++) {
              var field = j;
              var value = rowSource[j];
              if (_config.header)
                field = j >= _fields.length ? "__parsed_extra" : _fields[j];
              if (_config.transform)
                value = _config.transform(value, field);
              value = parseDynamic(field, value);
              if (field === "__parsed_extra") {
                row[field] = row[field] || [];
                row[field].push(value);
              } else
                row[field] = value;
            }
            if (_config.header) {
              if (j > _fields.length)
                addError("FieldMismatch", "TooManyFields", "Too many fields: expected " + _fields.length + " fields but parsed " + j, _rowCounter + i);
              else if (j < _fields.length)
                addError("FieldMismatch", "TooFewFields", "Too few fields: expected " + _fields.length + " fields but parsed " + j, _rowCounter + i);
            }
            return row;
          }
          var incrementBy = 1;
          if (!_results.data.length || Array.isArray(_results.data[0])) {
            _results.data = _results.data.map(processRow);
            incrementBy = _results.data.length;
          } else
            _results.data = processRow(_results.data, 0);
          if (_config.header && _results.meta)
            _results.meta.fields = _fields;
          _rowCounter += incrementBy;
          return _results;
        }
        function guessDelimiter(input, newline, skipEmptyLines, comments, delimitersToGuess) {
          var bestDelim, bestDelta, fieldCountPrevRow, maxFieldCount;
          delimitersToGuess = delimitersToGuess || [",", "	", "|", ";", Papa3.RECORD_SEP, Papa3.UNIT_SEP];
          for (var i = 0; i < delimitersToGuess.length; i++) {
            var delim = delimitersToGuess[i];
            var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
            fieldCountPrevRow = void 0;
            var preview = new Parser({
              comments,
              delimiter: delim,
              newline,
              preview: 10
            }).parse(input);
            for (var j = 0; j < preview.data.length; j++) {
              if (skipEmptyLines && testEmptyLine(preview.data[j])) {
                emptyLinesCount++;
                continue;
              }
              var fieldCount = preview.data[j].length;
              avgFieldCount += fieldCount;
              if (typeof fieldCountPrevRow === "undefined") {
                fieldCountPrevRow = fieldCount;
                continue;
              } else if (fieldCount > 0) {
                delta += Math.abs(fieldCount - fieldCountPrevRow);
                fieldCountPrevRow = fieldCount;
              }
            }
            if (preview.data.length > 0)
              avgFieldCount /= preview.data.length - emptyLinesCount;
            if ((typeof bestDelta === "undefined" || delta <= bestDelta) && (typeof maxFieldCount === "undefined" || avgFieldCount > maxFieldCount) && avgFieldCount > 1.99) {
              bestDelta = delta;
              bestDelim = delim;
              maxFieldCount = avgFieldCount;
            }
          }
          _config.delimiter = bestDelim;
          return {
            successful: !!bestDelim,
            bestDelimiter: bestDelim
          };
        }
        function addError(type, code, msg, row) {
          var error = {
            type,
            code,
            message: msg
          };
          if (row !== void 0) {
            error.row = row;
          }
          _results.errors.push(error);
        }
      }
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      function Parser(config) {
        config = config || {};
        var delim = config.delimiter;
        var newline = config.newline;
        var comments = config.comments;
        var step = config.step;
        var preview = config.preview;
        var fastMode = config.fastMode;
        var quoteChar;
        var renamedHeaders = null;
        var headerParsed = false;
        if (config.quoteChar === void 0 || config.quoteChar === null) {
          quoteChar = '"';
        } else {
          quoteChar = config.quoteChar;
        }
        var escapeChar = quoteChar;
        if (config.escapeChar !== void 0) {
          escapeChar = config.escapeChar;
        }
        if (typeof delim !== "string" || Papa3.BAD_DELIMITERS.indexOf(delim) > -1)
          delim = ",";
        if (comments === delim)
          throw new Error("Comment character same as delimiter");
        else if (comments === true)
          comments = "#";
        else if (typeof comments !== "string" || Papa3.BAD_DELIMITERS.indexOf(comments) > -1)
          comments = false;
        if (newline !== "\n" && newline !== "\r" && newline !== "\r\n")
          newline = "\n";
        var cursor = 0;
        var aborted = false;
        this.parse = function(input, baseIndex, ignoreLastRow) {
          if (typeof input !== "string")
            throw new Error("Input must be a string");
          var inputLen = input.length, delimLen = delim.length, newlineLen = newline.length, commentsLen = comments.length;
          var stepIsFunction = isFunction(step);
          cursor = 0;
          var data = [], errors = [], row = [], lastCursor = 0;
          if (!input)
            return returnable();
          if (fastMode || fastMode !== false && input.indexOf(quoteChar) === -1) {
            var rows = input.split(newline);
            for (var i = 0; i < rows.length; i++) {
              row = rows[i];
              cursor += row.length;
              if (i !== rows.length - 1)
                cursor += newline.length;
              else if (ignoreLastRow)
                return returnable();
              if (comments && row.substring(0, commentsLen) === comments)
                continue;
              if (stepIsFunction) {
                data = [];
                pushRow(row.split(delim));
                doStep();
                if (aborted)
                  return returnable();
              } else
                pushRow(row.split(delim));
              if (preview && i >= preview) {
                data = data.slice(0, preview);
                return returnable(true);
              }
            }
            return returnable();
          }
          var nextDelim = input.indexOf(delim, cursor);
          var nextNewline = input.indexOf(newline, cursor);
          var quoteCharRegex = new RegExp(escapeRegExp(escapeChar) + escapeRegExp(quoteChar), "g");
          var quoteSearch = input.indexOf(quoteChar, cursor);
          for (; ; ) {
            if (input[cursor] === quoteChar) {
              quoteSearch = cursor;
              cursor++;
              for (; ; ) {
                quoteSearch = input.indexOf(quoteChar, quoteSearch + 1);
                if (quoteSearch === -1) {
                  if (!ignoreLastRow) {
                    errors.push({
                      type: "Quotes",
                      code: "MissingQuotes",
                      message: "Quoted field unterminated",
                      row: data.length,
                      // row has yet to be inserted
                      index: cursor
                    });
                  }
                  return finish();
                }
                if (quoteSearch === inputLen - 1) {
                  var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
                  return finish(value);
                }
                if (quoteChar === escapeChar && input[quoteSearch + 1] === escapeChar) {
                  quoteSearch++;
                  continue;
                }
                if (quoteChar !== escapeChar && quoteSearch !== 0 && input[quoteSearch - 1] === escapeChar) {
                  continue;
                }
                if (nextDelim !== -1 && nextDelim < quoteSearch + 1) {
                  nextDelim = input.indexOf(delim, quoteSearch + 1);
                }
                if (nextNewline !== -1 && nextNewline < quoteSearch + 1) {
                  nextNewline = input.indexOf(newline, quoteSearch + 1);
                }
                var checkUpTo = nextNewline === -1 ? nextDelim : Math.min(nextDelim, nextNewline);
                var spacesBetweenQuoteAndDelimiter = extraSpaces(checkUpTo);
                if (input.substr(quoteSearch + 1 + spacesBetweenQuoteAndDelimiter, delimLen) === delim) {
                  row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                  cursor = quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen;
                  if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen] !== quoteChar) {
                    quoteSearch = input.indexOf(quoteChar, cursor);
                  }
                  nextDelim = input.indexOf(delim, cursor);
                  nextNewline = input.indexOf(newline, cursor);
                  break;
                }
                var spacesBetweenQuoteAndNewLine = extraSpaces(nextNewline);
                if (input.substring(quoteSearch + 1 + spacesBetweenQuoteAndNewLine, quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen) === newline) {
                  row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
                  saveRow(quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen);
                  nextDelim = input.indexOf(delim, cursor);
                  quoteSearch = input.indexOf(quoteChar, cursor);
                  if (stepIsFunction) {
                    doStep();
                    if (aborted)
                      return returnable();
                  }
                  if (preview && data.length >= preview)
                    return returnable(true);
                  break;
                }
                errors.push({
                  type: "Quotes",
                  code: "InvalidQuotes",
                  message: "Trailing quote on quoted field is malformed",
                  row: data.length,
                  // row has yet to be inserted
                  index: cursor
                });
                quoteSearch++;
                continue;
              }
              continue;
            }
            if (comments && row.length === 0 && input.substring(cursor, cursor + commentsLen) === comments) {
              if (nextNewline === -1)
                return returnable();
              cursor = nextNewline + newlineLen;
              nextNewline = input.indexOf(newline, cursor);
              nextDelim = input.indexOf(delim, cursor);
              continue;
            }
            if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1)) {
              row.push(input.substring(cursor, nextDelim));
              cursor = nextDelim + delimLen;
              nextDelim = input.indexOf(delim, cursor);
              continue;
            }
            if (nextNewline !== -1) {
              row.push(input.substring(cursor, nextNewline));
              saveRow(nextNewline + newlineLen);
              if (stepIsFunction) {
                doStep();
                if (aborted)
                  return returnable();
              }
              if (preview && data.length >= preview)
                return returnable(true);
              continue;
            }
            break;
          }
          return finish();
          function pushRow(row2) {
            data.push(row2);
            lastCursor = cursor;
          }
          function extraSpaces(index) {
            var spaceLength = 0;
            if (index !== -1) {
              var textBetweenClosingQuoteAndIndex = input.substring(quoteSearch + 1, index);
              if (textBetweenClosingQuoteAndIndex && textBetweenClosingQuoteAndIndex.trim() === "") {
                spaceLength = textBetweenClosingQuoteAndIndex.length;
              }
            }
            return spaceLength;
          }
          function finish(value2) {
            if (ignoreLastRow)
              return returnable();
            if (typeof value2 === "undefined")
              value2 = input.substring(cursor);
            row.push(value2);
            cursor = inputLen;
            pushRow(row);
            if (stepIsFunction)
              doStep();
            return returnable();
          }
          function saveRow(newCursor) {
            cursor = newCursor;
            pushRow(row);
            row = [];
            nextNewline = input.indexOf(newline, cursor);
          }
          function returnable(stopped) {
            if (config.header && !baseIndex && data.length && !headerParsed) {
              const result = data[0];
              const headerCount = /* @__PURE__ */ Object.create(null);
              const usedHeaders = new Set(result);
              let duplicateHeaders = false;
              for (let i2 = 0; i2 < result.length; i2++) {
                let header = result[i2];
                if (isFunction(config.transformHeader))
                  header = config.transformHeader(header, i2);
                if (!headerCount[header]) {
                  headerCount[header] = 1;
                  result[i2] = header;
                } else {
                  let newHeader;
                  let suffixCount = headerCount[header];
                  do {
                    newHeader = `${header}_${suffixCount}`;
                    suffixCount++;
                  } while (usedHeaders.has(newHeader));
                  usedHeaders.add(newHeader);
                  result[i2] = newHeader;
                  headerCount[header]++;
                  duplicateHeaders = true;
                  if (renamedHeaders === null) {
                    renamedHeaders = {};
                  }
                  renamedHeaders[newHeader] = header;
                }
                usedHeaders.add(header);
              }
              if (duplicateHeaders) {
                console.warn("Duplicate headers found and renamed.");
              }
              headerParsed = true;
            }
            return {
              data,
              errors,
              meta: {
                delimiter: delim,
                linebreak: newline,
                aborted,
                truncated: !!stopped,
                cursor: lastCursor + (baseIndex || 0),
                renamedHeaders
              }
            };
          }
          function doStep() {
            step(returnable());
            data = [];
            errors = [];
          }
        };
        this.abort = function() {
          aborted = true;
        };
        this.getCharIndex = function() {
          return cursor;
        };
      }
      function newWorker() {
        if (!Papa3.WORKERS_SUPPORTED)
          return false;
        var workerUrl = getWorkerBlob();
        var w = new global.Worker(workerUrl);
        w.onmessage = mainThreadReceivedMessage;
        w.id = workerIdCounter++;
        workers[w.id] = w;
        return w;
      }
      function mainThreadReceivedMessage(e) {
        var msg = e.data;
        var worker = workers[msg.workerId];
        var aborted = false;
        if (msg.error)
          worker.userError(msg.error, msg.file);
        else if (msg.results && msg.results.data) {
          var abort = function() {
            aborted = true;
            completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
          };
          var handle = {
            abort,
            pause: notImplemented,
            resume: notImplemented
          };
          if (isFunction(worker.userStep)) {
            for (var i = 0; i < msg.results.data.length; i++) {
              worker.userStep({
                data: msg.results.data[i],
                errors: msg.results.errors,
                meta: msg.results.meta
              }, handle);
              if (aborted)
                break;
            }
            delete msg.results;
          } else if (isFunction(worker.userChunk)) {
            worker.userChunk(msg.results, handle, msg.file);
            delete msg.results;
          }
        }
        if (msg.finished && !aborted)
          completeWorker(msg.workerId, msg.results);
      }
      function completeWorker(workerId, results) {
        var worker = workers[workerId];
        if (isFunction(worker.userComplete))
          worker.userComplete(results);
        worker.terminate();
        delete workers[workerId];
      }
      function notImplemented() {
        throw new Error("Not implemented.");
      }
      function workerThreadReceivedMessage(e) {
        var msg = e.data;
        if (typeof Papa3.WORKER_ID === "undefined" && msg)
          Papa3.WORKER_ID = msg.workerId;
        if (typeof msg.input === "string") {
          global.postMessage({
            workerId: Papa3.WORKER_ID,
            results: Papa3.parse(msg.input, msg.config),
            finished: true
          });
        } else if (global.File && msg.input instanceof File || msg.input instanceof Object) {
          var results = Papa3.parse(msg.input, msg.config);
          if (results)
            global.postMessage({
              workerId: Papa3.WORKER_ID,
              results,
              finished: true
            });
        }
      }
      function copy(obj) {
        if (typeof obj !== "object" || obj === null)
          return obj;
        var cpy = Array.isArray(obj) ? [] : {};
        for (var key in obj)
          cpy[key] = copy(obj[key]);
        return cpy;
      }
      function bindFunction(f, self2) {
        return function() {
          f.apply(self2, arguments);
        };
      }
      function isFunction(func) {
        return typeof func === "function";
      }
      return Papa3;
    });
  }
});

// src/AppShell.jsx
import { Route, Routes } from "react-router";

// src/components/Footer.jsx
import { jsx, jsxs } from "react/jsx-runtime";
function Footer() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "site-footer", children: /* @__PURE__ */ jsx("div", { className: "container footer-inner", children: /* @__PURE__ */ jsxs("p", { children: [
    "\xA9 ",
    year,
    " Mad Hatter's Waffles"
  ] }) }) });
}
var Footer_default = Footer;

// src/components/Header.jsx
import { useState } from "react";
import { NavLink } from "react-router";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var navItems = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/schedule", label: "Find Us" }
];
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleNavClick = () => setIsOpen(false);
  return /* @__PURE__ */ jsx2("header", { className: "site-header", children: /* @__PURE__ */ jsxs2("div", { className: "container header-inner", children: [
    /* @__PURE__ */ jsxs2(NavLink, { to: "/", className: "brand", "aria-label": "Mad Hatter's Waffles home", children: [
      /* @__PURE__ */ jsx2("img", { src: "/logo_color.png", alt: "Mad Hatter's Waffles logo", className: "brand-logo" }),
      /* @__PURE__ */ jsx2("span", { className: "brand-text", children: "Mad Hatter's Waffles" })
    ] }),
    /* @__PURE__ */ jsxs2(
      "button",
      {
        className: "nav-toggle",
        type: "button",
        "aria-label": "Toggle navigation",
        "aria-expanded": isOpen,
        onClick: () => setIsOpen((prev) => !prev),
        children: [
          /* @__PURE__ */ jsx2("span", {}),
          /* @__PURE__ */ jsx2("span", {}),
          /* @__PURE__ */ jsx2("span", {})
        ]
      }
    ),
    /* @__PURE__ */ jsx2("nav", { className: `site-nav${isOpen ? " open" : ""}`, "aria-label": "Primary", children: navItems.map((item) => /* @__PURE__ */ jsx2(
      NavLink,
      {
        to: item.to,
        className: ({ isActive }) => isActive ? "nav-link nav-link-active" : "nav-link",
        end: item.to === "/",
        onClick: handleNavClick,
        children: item.label
      },
      item.to
    )) })
  ] }) });
}
var Header_default = Header;

// src/pages/Home.jsx
import { useEffect, useMemo, useState as useState2 } from "react";
import { Link } from "react-router";

// src/config/homeImages.js
var homeImages = {
  rotationMs: 2 * 1e3,
  basePath: "/images/",
  images: [
    { file: "waffle_right.avif", alt: "Waffle with whipped topping" },
    { file: "waffle_closeup.jpg", alt: "Close-up of waffle with syrup" }
  ]
};
var homeImages_default = homeImages;

// src/pages/Home.jsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function getVisibleImages(images, startIndex, count) {
  if (images.length <= 3) {
    return images;
  }
  return Array.from({ length: count }, (_, offset) => {
    return images[(startIndex + offset) % images.length];
  });
}
function Home() {
  const images = homeImages_default.images || [];
  const rotationMs = homeImages_default.rotationMs || 6e3;
  const basePath = homeImages_default.basePath || "/";
  const [startIndex, setStartIndex] = useState2(0);
  const [prevStartIndex, setPrevStartIndex] = useState2(null);
  const [visibleCount, setVisibleCount] = useState2(() => {
    if (typeof window === "undefined") return Math.min(3, images.length);
    return window.innerWidth < 768 ? 1 : Math.min(3, images.length);
  });
  const visibleImages = useMemo(
    () => getVisibleImages(images, startIndex, visibleCount),
    [images, startIndex, visibleCount]
  );
  const prevImages = useMemo(() => {
    if (prevStartIndex === null) return [];
    return getVisibleImages(images, prevStartIndex, visibleCount);
  }, [images, prevStartIndex, visibleCount]);
  useEffect(() => {
    const updateVisibleCount = () => {
      const count = window.innerWidth < 768 ? 1 : Math.min(3, images.length);
      setVisibleCount(count);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [images.length]);
  useEffect(() => {
    if (images.length <= visibleCount) return void 0;
    const intervalId = window.setInterval(() => {
      setPrevStartIndex(startIndex);
      setStartIndex((prev) => (prev + 1) % images.length);
    }, rotationMs);
    return () => window.clearInterval(intervalId);
  }, [images.length, rotationMs, startIndex, visibleCount]);
  return /* @__PURE__ */ jsxs3("main", { children: [
    /* @__PURE__ */ jsxs3("section", { className: "hero", children: [
      /* @__PURE__ */ jsxs3("div", { className: "container hero-inner", children: [
        /* @__PURE__ */ jsxs3("div", { className: "hero-copy", children: [
          /* @__PURE__ */ jsx3("p", { className: "eyebrow", children: "Kansas City's roaming waffle kitchen" }),
          /* @__PURE__ */ jsx3("h1", { children: "Warm waffles, bold flavors, and a little bit of wonder." }),
          /* @__PURE__ */ jsx3("p", { className: "hero-lede", children: "Mad Hatter's Waffles brings sweet and savory creations to the streets. Find us each week, or order ahead for pickup." }),
          /* @__PURE__ */ jsxs3("div", { className: "hero-actions", children: [
            /* @__PURE__ */ jsx3(Link, { className: "btn primary", to: "/menu", children: "See the menu" }),
            /* @__PURE__ */ jsx3(Link, { className: "btn outline", to: "/schedule", children: "Find the truck" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "hero-card", children: [
          /* @__PURE__ */ jsx3("h2", { children: "Today's quick info" }),
          /* @__PURE__ */ jsxs3("ul", { children: [
            /* @__PURE__ */ jsx3("li", { children: "Plant-based and classic options" }),
            /* @__PURE__ */ jsx3("li", { children: "Customizable add-ons" }),
            /* @__PURE__ */ jsx3("li", { children: "Serving Kansas City & nearby" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "hero-image", children: /* @__PURE__ */ jsx3("img", { src: "/images/waffle_header.avif", alt: "Waffle breakfast spread" }) })
    ] }),
    /* @__PURE__ */ jsx3("section", { className: "mission", children: /* @__PURE__ */ jsxs3("div", { className: "container mission-grid", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("h2", { children: "Our mission" }),
        /* @__PURE__ */ jsx3("p", { children: "We craft waffles that feel like a celebration. Every stop is a chance to share comfort, creativity, and a little magic with the community." })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "mission-card", children: [
        /* @__PURE__ */ jsx3("h3", { children: "Order & connect" }),
        /* @__PURE__ */ jsx3("p", { children: "Follow us for weekly stops, special events, and menu drops. Online ordering is available when the truck is open." }),
        /* @__PURE__ */ jsxs3("div", { className: "link-grid", children: [
          /* @__PURE__ */ jsx3("a", { href: "https://cash.app/order/$madhatterswaffles", target: "_blank", rel: "noreferrer", children: "Online ordering" }),
          /* @__PURE__ */ jsx3("a", { href: "https://www.doordash.com/store/mad-hatters-waffles-llc-kansas-city-36849887/82792354/", target: "_blank", rel: "noreferrer", children: "DoorDash" }),
          /* @__PURE__ */ jsx3("a", { href: "https://www.instagram.com/madhatterswaffles/", target: "_blank", rel: "noreferrer", children: "Instagram" }),
          /* @__PURE__ */ jsx3("a", { href: "https://www.facebook.com/madhatterswaffles", target: "_blank", rel: "noreferrer", children: "Facebook" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx3("section", { className: "gallery", children: /* @__PURE__ */ jsx3("div", { className: "container gallery-grid", children: Array.from({ length: visibleCount }).map((_, slotIndex) => {
      const current = visibleImages[slotIndex];
      const previous = prevImages[slotIndex];
      return /* @__PURE__ */ jsxs3("div", { className: "gallery-slot", children: [
        previous && /* @__PURE__ */ jsx3(
          "img",
          {
            className: "gallery-image exit",
            src: `${basePath}${previous.file}`,
            alt: previous.alt
          }
        ),
        current && /* @__PURE__ */ jsx3(
          "img",
          {
            className: "gallery-image enter",
            src: `${basePath}${current.file}`,
            alt: current.alt
          }
        )
      ] }, `slot-${slotIndex}`);
    }) }) }),
    /* @__PURE__ */ jsx3("section", { className: "contact", children: /* @__PURE__ */ jsxs3("div", { className: "container contact-grid", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("h2", { children: "Contact" }),
        /* @__PURE__ */ jsx3("p", { children: "Email us for events, catering, or collaborations." })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "contact-card", children: [
        /* @__PURE__ */ jsx3("p", { className: "contact-label", children: "Email" }),
        /* @__PURE__ */ jsx3("a", { href: "mailto:madhatterswaffles@gmail.com", children: "madhatterswaffles@gmail.com" }),
        /* @__PURE__ */ jsx3("p", { className: "contact-label", children: "Based in" }),
        /* @__PURE__ */ jsx3("p", { children: "Kansas City, MO" })
      ] })
    ] }) })
  ] });
}
var Home_default = Home;

// src/pages/Menu.jsx
var import_papaparse = __toESM(require_papaparse(), 1);
import { useEffect as useEffect2, useMemo as useMemo2, useState as useState3 } from "react";

// src/config/dataSources.js
var dataSources = {
  menuCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_2eL_BHhckqaISusOVhDGM97H2KQGMmWn76X9uS8-RIElvB9UPI-xNRFLG6m2uMfjsgFNoKmnq_Rw/pub?output=csv",
  scheduleCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTStRZ-LbPMrvSERpZWS8-HYj4CYF4L1vXcnf_X8ajOtrCa93xIslvdfKzZGFNzc5oeKHgdEmo-23GF/pub?output=csv"
};
var dataSources_default = dataSources;

// src/data/menuFallback.json
var menuFallback_default = {
  generatedAt: "2026-01-31T16:46:47.532Z",
  rows: [
    {
      category: "Unique Flavors",
      item_name: "Waffle Batter Balls 5 piece",
      price: "4.5",
      description: "Comes with your choice of maple syrup or chocolate sauce",
      column: "1",
      special_notes: ""
    },
    {
      category: "Unique Flavors",
      item_name: "Waffle Batter Balls 10 piece",
      price: "5.99",
      description: "Comes with your choice of maple syrup or chocolate sauce",
      column: "1",
      special_notes: ""
    },
    {
      category: "Unique Flavors",
      item_name: "Waffle Batter Balls 20 piece",
      price: "9.99",
      description: "Comes with your choice of maple syrup or chocolate sauce",
      column: "1",
      special_notes: ""
    },
    {
      category: "Unique Flavors",
      item_name: "Waffle Sunday",
      price: "7.99",
      description: "One scoop of oat ice cream with cholate sauce over the top",
      column: "1",
      special_notes: ""
    },
    {
      category: "Drinks",
      item_name: "Pour Over Coffee",
      price: "1.99",
      description: "",
      column: "1",
      special_notes: ""
    },
    {
      category: "Drinks",
      item_name: "English Breakfast Tea",
      price: "1.99",
      description: "",
      column: "1",
      special_notes: ""
    },
    {
      category: "Drinks",
      item_name: "Earl Gray Tea",
      price: "1.99",
      description: "",
      column: "1",
      special_notes: ""
    },
    {
      category: "Drinks",
      item_name: "Mint Tea",
      price: "1.99",
      description: "",
      column: "1",
      special_notes: ""
    },
    {
      category: "Drinks",
      item_name: "Bottled Water",
      price: "0.99",
      description: "",
      column: "1",
      special_notes: ""
    },
    {
      category: "Classics",
      item_name: "Belgian Waffle",
      price: "9.99",
      description: "Comes with maple syrup and your choice of plant butter or real butter",
      column: "2",
      special_notes: ""
    },
    {
      category: "Classics",
      item_name: "Belgian Waffle and A hot pour over coffee",
      price: "10.99",
      description: "Comes with maple syrup and your choice of plant butter or real butter",
      column: "2",
      special_notes: ""
    },
    {
      category: "Classics",
      item_name: "The Works",
      price: "16.99",
      description: "Comes with a Belgian Waffle, Hash Browns, Sausage Links, and a drink of your choice.",
      column: "2",
      special_notes: ""
    },
    {
      category: "Classics",
      item_name: "Waffle Sandwich an drink",
      price: "7.99",
      description: "Comes with a half Waffle, egg, Sausage, your choice of plant or real cheese. and a drink of your choice.",
      column: "2",
      special_notes: ""
    },
    {
      category: "Drinks",
      item_name: "Hot Chocolate",
      price: "1.99",
      description: "",
      column: "1",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "Maple Syrup",
      price: "1.5",
      description: "",
      column: "2",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "Strawberries",
      price: "0.99",
      description: "",
      column: "2",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "Chocolate Sauce",
      price: "0.99",
      description: "",
      column: "2",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "Sausage Links",
      price: "3.99",
      description: "",
      column: "2",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "Hash Browns",
      price: "4.99",
      description: "",
      column: "2",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "Egg",
      price: "0.99",
      description: "",
      column: "2",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "Oat Ice Cream",
      price: "3.99",
      description: "",
      column: "2",
      special_notes: ""
    },
    {
      category: "Add-ons",
      item_name: "",
      price: "",
      description: "",
      column: "2",
      special_notes: "Allergies let us know we do gluten-free, dairy-free, soy-free, and nut-free"
    },
    {
      category: "Classics",
      item_name: "Sausage Waffle Sandwich ",
      price: "6.99",
      description: "Comes with a half waffle, Sausage, egg, and your choice of plant or real cheese.",
      column: "1",
      special_notes: ""
    },
    {
      category: "Classics ",
      item_name: "Bacon Waffles Sandwich ",
      price: "6.99",
      description: "Comes with a half waffle, Bacon, egg, and your choice of plant or real cheese.",
      column: "1",
      special_notes: ""
    },
    {
      category: "Classics ",
      item_name: "BLT on a Waffle",
      price: "6.99",
      description: "Comes with Bacon, Lettuce, Tomato. and mayo. on a half Waffle",
      column: "1",
      special_notes: ""
    },
    {
      category: "Classics ",
      item_name: "Sausage Breakfast Bowl",
      price: "7.99",
      description: "Comes with Hashbrowns, Sausage, egg, and your choice of plant or real cheese. All mixed together.",
      column: "1",
      special_notes: ""
    },
    {
      category: "Classics ",
      item_name: "Bacon Breakfast bowl",
      price: "7.99",
      description: "Comes with Hashbrowns, Bacon, egg, and your choice of plant or real cheese. All mixed together.",
      column: "1",
      special_notes: ""
    },
    {
      category: "Classics ",
      item_name: "Waffle balls Breakfast Bowls",
      price: "9.99",
      description: "Comes with 5 Waffle Balls, Hashbrowns, Sausage or Bacon, egg, and your choice of plant or real cheese. All mixed together.",
      column: "1",
      special_notes: ""
    },
    {
      category: "Drinks",
      item_name: "Oj",
      price: "1.99",
      description: "",
      column: "1",
      special_notes: ""
    }
  ]
};

// src/pages/Menu.jsx
import { Fragment, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var emptyState = {
  column1: /* @__PURE__ */ new Map(),
  column2: /* @__PURE__ */ new Map()
};
function normalizeMenuRows(rows) {
  return rows.filter(
    (row) => Object.values(row || {}).some((value) => String(value || "").trim() !== "")
  );
}
function groupMenu(rows) {
  const grouped = {
    column1: /* @__PURE__ */ new Map(),
    column2: /* @__PURE__ */ new Map()
  };
  rows.forEach((row) => {
    const column = row.column?.trim() === "2" ? "column2" : "column1";
    const category = (row.category || "Other").trim() || "Other";
    if (!grouped[column].has(category)) {
      grouped[column].set(category, []);
    }
    grouped[column].get(category).push(row);
  });
  return grouped;
}
function mergeColumns(grouped) {
  const merged = /* @__PURE__ */ new Map();
  ["column1", "column2"].forEach((columnKey) => {
    grouped[columnKey].forEach((items, category) => {
      if (!merged.has(category)) {
        merged.set(category, []);
      }
      merged.get(category).push(...items);
    });
  });
  return merged;
}
function Menu() {
  const fallbackRows = Array.isArray(menuFallback_default?.rows) ? menuFallback_default.rows : [];
  const fallbackDate = menuFallback_default?.generatedAt || "";
  const fallbackDateLabel = fallbackDate ? new Date(fallbackDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "";
  const isPrerender = typeof window !== "undefined" && window.__PRERENDER__ && window.__PRERENDER__.active;
  const [menuRows, setMenuRows] = useState3(() => fallbackRows);
  const [loading, setLoading] = useState3(fallbackRows.length === 0);
  const [error, setError] = useState3("");
  const [isFallback, setIsFallback] = useState3(fallbackRows.length > 0);
  const [isMobile, setIsMobile] = useState3(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 960;
  });
  useEffect2(() => {
    setMenuRows(fallbackRows);
  }, [fallbackRows]);
  useEffect2(() => {
    let active = true;
    if (isPrerender) {
      setLoading(false);
      return () => {
        active = false;
      };
    }
    if (fallbackRows.length === 0) {
      setLoading(true);
    }
    import_papaparse.default.parse(dataSources_default.menuCsvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!active) return;
        const rows = normalizeMenuRows(results.data || []);
        setMenuRows(rows);
        setError("");
        setIsFallback(false);
        setLoading(false);
      },
      error: (err) => {
        if (!active) return;
        setError(err?.message || "Unable to load the menu right now.");
        setIsFallback(fallbackRows.length > 0);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect2(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const groupedMenu = useMemo2(() => {
    if (!menuRows.length) return emptyState;
    return groupMenu(menuRows);
  }, [menuRows]);
  const mergedMenu = useMemo2(() => {
    if (!menuRows.length) return /* @__PURE__ */ new Map();
    return mergeColumns(groupedMenu);
  }, [groupedMenu, menuRows.length]);
  const renderColumn = (columnKey) => {
    const column = groupedMenu[columnKey];
    return Array.from(column.entries()).map(([category, items]) => /* @__PURE__ */ jsxs4("div", { className: "menu-category", children: [
      /* @__PURE__ */ jsx4("h3", { children: category }),
      items.map((item, idx) => {
        const name = item.item_name?.trim();
        const price = item.price?.trim();
        const description = item.description?.trim();
        const note = item.special_notes?.trim();
        const numericPrice = price ? Number(String(price).replace(/\$/g, "").trim()) : null;
        if (!name && note) {
          return /* @__PURE__ */ jsx4("p", { className: "menu-note", children: note }, `${category}-note-${idx}`);
        }
        if (!name) return null;
        return /* @__PURE__ */ jsxs4("div", { className: "menu-item", children: [
          /* @__PURE__ */ jsxs4("div", { children: [
            /* @__PURE__ */ jsx4("p", { className: "menu-item-name", children: name }),
            description && /* @__PURE__ */ jsx4("p", { className: "menu-item-desc", children: description })
          ] }),
          price && Number.isFinite(numericPrice) && /* @__PURE__ */ jsxs4("span", { className: "menu-item-price", children: [
            "$",
            numericPrice.toFixed(2)
          ] })
        ] }, `${category}-${name}-${idx}`);
      })
    ] }, category));
  };
  const renderMerged = () => Array.from(mergedMenu.entries()).map(([category, items]) => /* @__PURE__ */ jsxs4("div", { className: "menu-category", children: [
    /* @__PURE__ */ jsx4("h3", { children: category }),
    items.map((item, idx) => {
      const name = item.item_name?.trim();
      const price = item.price?.trim();
      const description = item.description?.trim();
      const note = item.special_notes?.trim();
      const numericPrice = price ? Number(String(price).replace(/\$/g, "").trim()) : null;
      if (!name && note) {
        return /* @__PURE__ */ jsx4("p", { className: "menu-note", children: note }, `${category}-note-${idx}`);
      }
      if (!name) return null;
      return /* @__PURE__ */ jsxs4("div", { className: "menu-item", children: [
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx4("p", { className: "menu-item-name", children: name }),
          description && /* @__PURE__ */ jsx4("p", { className: "menu-item-desc", children: description })
        ] }),
        price && Number.isFinite(numericPrice) && /* @__PURE__ */ jsxs4("span", { className: "menu-item-price", children: [
          "$",
          numericPrice.toFixed(2)
        ] })
      ] }, `${category}-${name}-${idx}`);
    })
  ] }, category));
  const showLoading = loading && menuRows.length === 0;
  const showFallbackMessage = Boolean(error && isFallback);
  const fallbackMessage = fallbackDateLabel ? `We couldn't load the live menu. Showing the menu as of ${fallbackDateLabel}.` : "We couldn't load the live menu.";
  return /* @__PURE__ */ jsxs4("main", { children: [
    /* @__PURE__ */ jsx4("section", { className: "page-hero page-hero-wide", children: /* @__PURE__ */ jsxs4("div", { className: "container", children: [
      /* @__PURE__ */ jsx4("h1", { children: "Menu" }),
      /* @__PURE__ */ jsx4("p", { children: "Crafted with love, topped with flavor, and made to order. Prices and availability may vary by stop." })
    ] }) }),
    /* @__PURE__ */ jsx4("section", { className: "menu-section", children: /* @__PURE__ */ jsxs4("div", { className: "container", children: [
      showLoading && /* @__PURE__ */ jsx4("p", { className: "status", children: "Loading menu..." }),
      showFallbackMessage && /* @__PURE__ */ jsx4("p", { className: "status", children: fallbackMessage }),
      error && !isFallback && /* @__PURE__ */ jsx4("p", { className: "status error", children: error }),
      menuRows.length > 0 && /* @__PURE__ */ jsx4(Fragment, { children: isMobile ? /* @__PURE__ */ jsx4("div", { className: "menu-grid single", children: /* @__PURE__ */ jsx4("div", { className: "menu-column", children: renderMerged() }) }) : /* @__PURE__ */ jsxs4("div", { className: "menu-grid", children: [
        /* @__PURE__ */ jsx4("div", { className: "menu-column", children: renderColumn("column1") }),
        /* @__PURE__ */ jsx4("div", { className: "menu-column", children: renderColumn("column2") })
      ] }) })
    ] }) })
  ] });
}
var Menu_default = Menu;

// src/pages/Schedule.jsx
var import_papaparse2 = __toESM(require_papaparse(), 1);
import { useEffect as useEffect3, useMemo as useMemo3, useState as useState4 } from "react";
import { Fragment as Fragment2, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var dayNamesShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
var dayNamesLong = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function camelCaseKey(key) {
  return key.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}
function normalizeValue(value) {
  if (typeof value === "string") {
    value = value.trim();
  }
  if (value === void 0 || value === null || value === "") {
    return null;
  }
  if (/true|yes/i.test(value)) return true;
  if (/false|no/i.test(value)) return false;
  return value;
}
function mapScheduleRow(row) {
  const mapped = {};
  Object.keys(row || {}).forEach((key) => {
    const newKey = camelCaseKey(key);
    const value = normalizeValue(row[key]);
    if (value !== null) {
      mapped[newKey] = value;
    }
  });
  return mapped;
}
function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const hour = Number.parseInt(hours, 10);
  if (Number.isNaN(hour)) return timeString;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes ?? "00"} ${ampm}`;
}
function formatDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function compareDates(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() === d2.getTime();
}
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}
function isProductionHost() {
  return /madhatters?waffles/i.test(window.location.hostname);
}
function shouldShowLocation(locationInfo, dayOfWeek, date) {
  if (locationInfo.test && isProductionHost()) {
    return false;
  }
  if (locationInfo.date) {
    if (compareDates(`${locationInfo.date}T00:00:00`, date)) {
      return true;
    }
  }
  if (locationInfo.daysOfWeek) {
    const daysArray = locationInfo.daysOfWeek.split(",").map((day) => day.trim());
    const dayMatch = daysArray.some(
      (day) => day.toLowerCase() === dayOfWeek.toLowerCase() || day.toLowerCase() === dayOfWeek.substring(0, 3).toLowerCase()
    );
    if (dayMatch) {
      if (locationInfo.startDate) {
        const startDate = new Date(locationInfo.startDate);
        startDate.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        if (checkDate >= startDate) {
          if (locationInfo.endDate) {
            const endDate = new Date(locationInfo.endDate);
            endDate.setHours(0, 0, 0, 0);
            if (checkDate > endDate) {
              return false;
            }
          }
          return true;
        }
      }
    }
  }
  return false;
}
function getLocationsForDay(locations, dayOfWeek, date) {
  return locations.filter(
    (locationInfo) => shouldShowLocation(locationInfo, dayOfWeek, date)
  );
}
function Schedule() {
  const [locations, setLocations] = useState4([]);
  const [loading, setLoading] = useState4(true);
  const [error, setError] = useState4("");
  const [currentMonth, setCurrentMonth] = useState4(/* @__PURE__ */ new Date());
  const [weekStart, setWeekStart] = useState4(getMonday(/* @__PURE__ */ new Date()));
  const [modalInfo, setModalInfo] = useState4(null);
  useEffect3(() => {
    let active = true;
    setLoading(true);
    import_papaparse2.default.parse(dataSources_default.scheduleCsvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!active) return;
        const mapped = (results.data || []).map(mapScheduleRow);
        setLocations(mapped);
        setLoading(false);
      },
      error: (err) => {
        if (!active) return;
        setError(err?.message || "Unable to load schedule data.");
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  const calendarDays = useMemo3(() => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i += 1) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(year, month, day));
    }
    return days;
  }, [currentMonth]);
  const weekDays = useMemo3(() => {
    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekStart]);
  const handleOpenModal = (locationInfo, date) => {
    if (window.innerWidth <= 768) return;
    setModalInfo({ locationInfo, date });
  };
  const handleCloseModal = () => setModalInfo(null);
  const weekCards = weekDays.flatMap((day) => {
    const dayOfWeek = dayNamesLong[day.getDay()];
    const dayLocations = getLocationsForDay(locations, dayOfWeek, day);
    if (dayLocations.length === 0) return [];
    return dayLocations.map((locationInfo, idx) => {
      const address = locationInfo.location || "";
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
      return /* @__PURE__ */ jsxs5("div", { className: "week-card", children: [
        /* @__PURE__ */ jsxs5("p", { className: "week-day", children: [
          dayNamesShort[(day.getDay() + 6) % 7],
          ", ",
          formatDate(day)
        ] }),
        /* @__PURE__ */ jsxs5("p", { className: "week-time", children: [
          formatTime(locationInfo.startTime),
          " - ",
          formatTime(locationInfo.endTime)
        ] }),
        /* @__PURE__ */ jsx5("p", { className: "week-name", children: "Mad Hatter's Waffles" }),
        /* @__PURE__ */ jsx5("a", { href: mapsUrl, target: "_blank", rel: "noreferrer", children: address }),
        locationInfo.description && /* @__PURE__ */ jsx5("p", { className: "week-notes", children: locationInfo.description })
      ] }, `${day.toISOString()}-${idx}`);
    });
  });
  return /* @__PURE__ */ jsxs5("main", { children: [
    /* @__PURE__ */ jsx5("section", { className: "page-hero", children: /* @__PURE__ */ jsxs5("div", { className: "container", children: [
      /* @__PURE__ */ jsx5("h1", { children: "Find Us" }),
      /* @__PURE__ */ jsx5("p", { children: "Track the truck and plan your next waffle stop." })
    ] }) }),
    /* @__PURE__ */ jsx5("section", { className: "schedule-section", children: /* @__PURE__ */ jsxs5("div", { className: "container", children: [
      loading && /* @__PURE__ */ jsx5("p", { className: "status", children: "Loading schedule..." }),
      error && /* @__PURE__ */ jsx5("p", { className: "status error", children: error }),
      !loading && !error && /* @__PURE__ */ jsxs5(Fragment2, { children: [
        /* @__PURE__ */ jsxs5("div", { className: "calendar-controls", children: [
          /* @__PURE__ */ jsx5(
            "button",
            {
              className: "btn outline",
              type: "button",
              onClick: () => setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
              ),
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxs5("h2", { className: "calendar-title", children: [
            monthNames[currentMonth.getMonth()],
            " ",
            currentMonth.getFullYear()
          ] }),
          /* @__PURE__ */ jsx5(
            "button",
            {
              className: "btn outline",
              type: "button",
              onClick: () => setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
              ),
              children: "Next"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "calendar-grid", children: [
          dayNamesShort.map((day) => /* @__PURE__ */ jsx5("div", { className: "calendar-header", children: day }, day)),
          calendarDays.map((day, idx) => {
            if (!day) {
              return /* @__PURE__ */ jsx5("div", { className: "calendar-cell muted" }, `empty-${idx}`);
            }
            const dayOfWeek = dayNamesLong[day.getDay()];
            const locationsForDay = getLocationsForDay(locations, dayOfWeek, day);
            const today = /* @__PURE__ */ new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = day < today;
            return /* @__PURE__ */ jsxs5(
              "div",
              {
                className: `calendar-cell${isPast ? " past" : ""}`,
                children: [
                  /* @__PURE__ */ jsx5("div", { className: "calendar-date", children: day.getDate() }),
                  locationsForDay.map((locationInfo, locationIdx) => {
                    const address = locationInfo.location || "";
                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      address
                    )}`;
                    return /* @__PURE__ */ jsxs5(
                      "button",
                      {
                        type: "button",
                        className: `location-chip${isPast ? " past" : ""}`,
                        onClick: () => handleOpenModal(locationInfo, day),
                        disabled: isPast,
                        children: [
                          /* @__PURE__ */ jsxs5("span", { className: "location-time", children: [
                            formatTime(locationInfo.startTime),
                            " -",
                            " ",
                            formatTime(locationInfo.endTime)
                          ] }),
                          /* @__PURE__ */ jsx5("span", { className: "location-name", children: "Mad Hatter's Waffles" }),
                          /* @__PURE__ */ jsx5("span", { className: "location-address", children: /* @__PURE__ */ jsx5(
                            "a",
                            {
                              href: mapsUrl,
                              target: "_blank",
                              rel: "noreferrer",
                              onClick: (event) => event.stopPropagation(),
                              children: address
                            }
                          ) }),
                          locationInfo.description && /* @__PURE__ */ jsx5("span", { className: "location-notes", children: locationInfo.description })
                        ]
                      },
                      `${day.toISOString()}-${locationIdx}`
                    );
                  })
                ]
              },
              day.toISOString()
            );
          })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "week-view", children: [
          /* @__PURE__ */ jsxs5("div", { className: "week-controls", children: [
            /* @__PURE__ */ jsxs5("h3", { children: [
              formatDate(weekStart),
              " - ",
              formatDate(weekDays[6])
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: "week-buttons", children: [
              /* @__PURE__ */ jsx5(
                "button",
                {
                  className: "btn outline",
                  type: "button",
                  onClick: () => {
                    const prev = new Date(weekStart);
                    prev.setDate(prev.getDate() - 7);
                    setWeekStart(prev);
                  },
                  children: "Previous Week"
                }
              ),
              /* @__PURE__ */ jsx5(
                "button",
                {
                  className: "btn outline",
                  type: "button",
                  onClick: () => {
                    const next = new Date(weekStart);
                    next.setDate(next.getDate() + 7);
                    setWeekStart(next);
                  },
                  children: "Next Week"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "week-cards", children: [
            weekCards,
            weekCards.length === 0 && /* @__PURE__ */ jsx5("p", { className: "status", children: "No stops scheduled for this week. Follow us on social media for updates." })
          ] })
        ] })
      ] })
    ] }) }),
    modalInfo && /* @__PURE__ */ jsx5(
      "div",
      {
        className: "modal",
        role: "dialog",
        "aria-modal": "true",
        onClick: (event) => {
          if (event.target === event.currentTarget) {
            handleCloseModal();
          }
        },
        children: /* @__PURE__ */ jsxs5("div", { className: "modal-card", children: [
          /* @__PURE__ */ jsx5("button", { className: "modal-close", type: "button", onClick: handleCloseModal, children: "\xD7" }),
          /* @__PURE__ */ jsx5("h2", { children: "Mad Hatter's Waffles" }),
          /* @__PURE__ */ jsxs5("p", { className: "modal-time", children: [
            dayNamesLong[modalInfo.date.getDay()],
            ",",
            " ",
            formatTime(modalInfo.locationInfo.startTime),
            " -",
            " ",
            formatTime(modalInfo.locationInfo.endTime)
          ] }),
          /* @__PURE__ */ jsx5("p", { className: "modal-location", children: "Food Truck Location" }),
          /* @__PURE__ */ jsx5("p", { className: "modal-address", children: modalInfo.locationInfo.location }),
          modalInfo.locationInfo.description && /* @__PURE__ */ jsx5("p", { className: "modal-notes", children: modalInfo.locationInfo.description })
        ] })
      }
    )
  ] });
}
var Schedule_default = Schedule;

// src/AppShell.jsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function AppShell() {
  return /* @__PURE__ */ jsxs6("div", { className: "app-shell", children: [
    /* @__PURE__ */ jsx6(Header_default, {}),
    /* @__PURE__ */ jsxs6(Routes, { children: [
      /* @__PURE__ */ jsx6(Route, { path: "/", element: /* @__PURE__ */ jsx6(Home_default, {}) }),
      /* @__PURE__ */ jsx6(Route, { path: "/menu", element: /* @__PURE__ */ jsx6(Menu_default, {}) }),
      /* @__PURE__ */ jsx6(Route, { path: "/schedule", element: /* @__PURE__ */ jsx6(Schedule_default, {}) })
    ] }),
    /* @__PURE__ */ jsx6(Footer_default, {})
  ] });
}
var AppShell_default = AppShell;
export {
  AppShell_default as default
};
/*! Bundled license information:

papaparse/papaparse.js:
  (* @license
  Papa Parse
  v5.5.3
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/
