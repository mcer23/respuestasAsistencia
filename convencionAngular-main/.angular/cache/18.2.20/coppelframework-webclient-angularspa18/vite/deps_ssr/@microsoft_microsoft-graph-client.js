import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  __awaiter
} from "./chunk-6I2P25IP.js";
import {
  __require
} from "./chunk-NMKJ35H3.js";

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/RequestMethod.js
var RequestMethod;
(function(RequestMethod2) {
  RequestMethod2["GET"] = "GET";
  RequestMethod2["PATCH"] = "PATCH";
  RequestMethod2["POST"] = "POST";
  RequestMethod2["PUT"] = "PUT";
  RequestMethod2["DELETE"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/content/BatchRequestContent.js
var BatchRequestContent = class _BatchRequestContent {
  /**
   * @private
   * @static
   * Validates the dependency chain of the requests
   *
   * Note:
   * Individual requests can depend on other individual requests. Currently, requests can only depend on a single other request, and must follow one of these three patterns:
   * 1. Parallel - no individual request states a dependency in the dependsOn property.
   * 2. Serial - all individual requests depend on the previous individual request.
   * 3. Same - all individual requests that state a dependency in the dependsOn property, state the same dependency.
   * As JSON batching matures, these limitations will be removed.
   * @see {@link https://developer.microsoft.com/en-us/graph/docs/concepts/known_issues#json-batching}
   *
   * @param {Map<string, BatchRequestStep>} requests - The map of requests.
   * @returns The boolean indicating the validation status
   */
  static validateDependencies(requests) {
    const isParallel = (reqs) => {
      const iterator = reqs.entries();
      let cur = iterator.next();
      while (!cur.done) {
        const curReq = cur.value[1];
        if (curReq.dependsOn !== void 0 && curReq.dependsOn.length > 0) {
          return false;
        }
        cur = iterator.next();
      }
      return true;
    };
    const isSerial = (reqs) => {
      const iterator = reqs.entries();
      let cur = iterator.next();
      const firstRequest = cur.value[1];
      if (firstRequest.dependsOn !== void 0 && firstRequest.dependsOn.length > 0) {
        return false;
      }
      let prev = cur;
      cur = iterator.next();
      while (!cur.done) {
        const curReq = cur.value[1];
        if (curReq.dependsOn === void 0 || curReq.dependsOn.length !== 1 || curReq.dependsOn[0] !== prev.value[1].id) {
          return false;
        }
        prev = cur;
        cur = iterator.next();
      }
      return true;
    };
    const isSame = (reqs) => {
      const iterator = reqs.entries();
      let cur = iterator.next();
      const firstRequest = cur.value[1];
      let dependencyId;
      if (firstRequest.dependsOn === void 0 || firstRequest.dependsOn.length === 0) {
        dependencyId = firstRequest.id;
      } else {
        if (firstRequest.dependsOn.length === 1) {
          const fDependencyId = firstRequest.dependsOn[0];
          if (fDependencyId !== firstRequest.id && reqs.has(fDependencyId)) {
            dependencyId = fDependencyId;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
      cur = iterator.next();
      while (!cur.done) {
        const curReq = cur.value[1];
        if ((curReq.dependsOn === void 0 || curReq.dependsOn.length === 0) && dependencyId !== curReq.id) {
          return false;
        }
        if (curReq.dependsOn !== void 0 && curReq.dependsOn.length !== 0) {
          if (curReq.dependsOn.length === 1 && (curReq.id === dependencyId || curReq.dependsOn[0] !== dependencyId)) {
            return false;
          }
          if (curReq.dependsOn.length > 1) {
            return false;
          }
        }
        cur = iterator.next();
      }
      return true;
    };
    if (requests.size === 0) {
      const error = new Error("Empty requests map, Please provide at least one request.");
      error.name = "Empty Requests Error";
      throw error;
    }
    return isParallel(requests) || isSerial(requests) || isSame(requests);
  }
  /**
   * @private
   * @static
   * @async
   * Converts Request Object instance to a JSON
   * @param {IsomorphicRequest} request - The IsomorphicRequest Object instance
   * @returns A promise that resolves to JSON representation of a request
   */
  static getRequestData(request) {
    return __awaiter(this, void 0, void 0, function* () {
      const requestData = {
        url: ""
      };
      const hasHttpRegex = new RegExp("^https?://");
      requestData.url = hasHttpRegex.test(request.url) ? "/" + request.url.split(/.*?\/\/.*?\//)[1] : request.url;
      requestData.method = request.method;
      const headers = {};
      request.headers.forEach((value, key) => {
        headers[key] = value;
      });
      if (Object.keys(headers).length) {
        requestData.headers = headers;
      }
      if (request.method === RequestMethod.PATCH || request.method === RequestMethod.POST || request.method === RequestMethod.PUT) {
        requestData.body = yield _BatchRequestContent.getRequestBody(request);
      }
      return requestData;
    });
  }
  /**
   * @private
   * @static
   * @async
   * Gets the body of a Request object instance
   * @param {IsomorphicRequest} request - The IsomorphicRequest object instance
   * @returns The Promise that resolves to a body value of a Request
   */
  static getRequestBody(request) {
    return __awaiter(this, void 0, void 0, function* () {
      let bodyParsed = false;
      let body;
      try {
        const cloneReq = request.clone();
        body = yield cloneReq.json();
        bodyParsed = true;
      } catch (e) {
      }
      if (!bodyParsed) {
        try {
          if (typeof Blob !== "undefined") {
            const blob = yield request.blob();
            const reader = new FileReader();
            body = yield new Promise((resolve) => {
              reader.addEventListener("load", () => {
                const dataURL = reader.result;
                const regex = new RegExp("^s*data:(.+?/.+?(;.+?=.+?)*)?(;base64)?,(.*)s*$");
                const segments = regex.exec(dataURL);
                resolve(segments[4]);
              }, false);
              reader.readAsDataURL(blob);
            });
          } else if (typeof Buffer !== "undefined") {
            const buffer = yield request.buffer();
            body = buffer.toString("base64");
          }
          bodyParsed = true;
        } catch (e) {
        }
      }
      return body;
    });
  }
  /**
   * @public
   * @constructor
   * Constructs a BatchRequestContent instance
   * @param {BatchRequestStep[]} [requests] - Array of requests value
   * @returns An instance of a BatchRequestContent
   */
  constructor(requests) {
    this.requests = /* @__PURE__ */ new Map();
    if (typeof requests !== "undefined") {
      const limit = _BatchRequestContent.requestLimit;
      if (requests.length > limit) {
        const error = new Error(`Maximum requests limit exceeded, Max allowed number of requests are ${limit}`);
        error.name = "Limit Exceeded Error";
        throw error;
      }
      for (const req of requests) {
        this.addRequest(req);
      }
    }
  }
  /**
   * @public
   * Adds a request to the batch request content
   * @param {BatchRequestStep} request - The request value
   * @returns The id of the added request
   */
  addRequest(request) {
    const limit = _BatchRequestContent.requestLimit;
    if (request.id === "") {
      const error = new Error(`Id for a request is empty, Please provide an unique id`);
      error.name = "Empty Id For Request";
      throw error;
    }
    if (this.requests.size === limit) {
      const error = new Error(`Maximum requests limit exceeded, Max allowed number of requests are ${limit}`);
      error.name = "Limit Exceeded Error";
      throw error;
    }
    if (this.requests.has(request.id)) {
      const error = new Error(`Adding request with duplicate id ${request.id}, Make the id of the requests unique`);
      error.name = "Duplicate RequestId Error";
      throw error;
    }
    this.requests.set(request.id, request);
    return request.id;
  }
  /**
   * @public
   * Removes request from the batch payload and its dependencies from all dependents
   * @param {string} requestId - The id of a request that needs to be removed
   * @returns The boolean indicating removed status
   */
  removeRequest(requestId) {
    const deleteStatus = this.requests.delete(requestId);
    const iterator = this.requests.entries();
    let cur = iterator.next();
    while (!cur.done) {
      const dependencies = cur.value[1].dependsOn;
      if (typeof dependencies !== "undefined") {
        const index = dependencies.indexOf(requestId);
        if (index !== -1) {
          dependencies.splice(index, 1);
        }
        if (dependencies.length === 0) {
          delete cur.value[1].dependsOn;
        }
      }
      cur = iterator.next();
    }
    return deleteStatus;
  }
  /**
   * @public
   * @async
   * Serialize content from BatchRequestContent instance
   * @returns The body content to make batch request
   */
  getContent() {
    return __awaiter(this, void 0, void 0, function* () {
      const requests = [];
      const requestBody = {
        requests
      };
      const iterator = this.requests.entries();
      let cur = iterator.next();
      if (cur.done) {
        const error = new Error("No requests added yet, Please add at least one request.");
        error.name = "Empty Payload";
        throw error;
      }
      if (!_BatchRequestContent.validateDependencies(this.requests)) {
        const error = new Error(`Invalid dependency found, Dependency should be:
1. Parallel - no individual request states a dependency in the dependsOn property.
2. Serial - all individual requests depend on the previous individual request.
3. Same - all individual requests that state a dependency in the dependsOn property, state the same dependency.`);
        error.name = "Invalid Dependency";
        throw error;
      }
      while (!cur.done) {
        const requestStep = cur.value[1];
        const batchRequestData = yield _BatchRequestContent.getRequestData(requestStep.request);
        if (batchRequestData.body !== void 0 && (batchRequestData.headers === void 0 || batchRequestData.headers["content-type"] === void 0)) {
          const error = new Error(`Content-type header is not mentioned for request #${requestStep.id}, For request having body, Content-type header should be mentioned`);
          error.name = "Invalid Content-type header";
          throw error;
        }
        batchRequestData.id = requestStep.id;
        if (requestStep.dependsOn !== void 0 && requestStep.dependsOn.length > 0) {
          batchRequestData.dependsOn = requestStep.dependsOn;
        }
        requests.push(batchRequestData);
        cur = iterator.next();
      }
      requestBody.requests = requests;
      return requestBody;
    });
  }
  /**
   * @public
   * Adds a dependency for a given dependent request
   * @param {string} dependentId - The id of the dependent request
   * @param {string} [dependencyId] - The id of the dependency request, if not specified the preceding request will be considered as a dependency
   * @returns Nothing
   */
  addDependency(dependentId, dependencyId) {
    if (!this.requests.has(dependentId)) {
      const error = new Error(`Dependent ${dependentId} does not exists, Please check the id`);
      error.name = "Invalid Dependent";
      throw error;
    }
    if (typeof dependencyId !== "undefined" && !this.requests.has(dependencyId)) {
      const error = new Error(`Dependency ${dependencyId} does not exists, Please check the id`);
      error.name = "Invalid Dependency";
      throw error;
    }
    if (typeof dependencyId !== "undefined") {
      const dependent = this.requests.get(dependentId);
      if (dependent.dependsOn === void 0) {
        dependent.dependsOn = [];
      }
      if (dependent.dependsOn.indexOf(dependencyId) !== -1) {
        const error = new Error(`Dependency ${dependencyId} is already added for the request ${dependentId}`);
        error.name = "Duplicate Dependency";
        throw error;
      }
      dependent.dependsOn.push(dependencyId);
    } else {
      const iterator = this.requests.entries();
      let prev;
      let cur = iterator.next();
      while (!cur.done && cur.value[1].id !== dependentId) {
        prev = cur;
        cur = iterator.next();
      }
      if (typeof prev !== "undefined") {
        const dId = prev.value[0];
        if (cur.value[1].dependsOn === void 0) {
          cur.value[1].dependsOn = [];
        }
        if (cur.value[1].dependsOn.indexOf(dId) !== -1) {
          const error = new Error(`Dependency ${dId} is already added for the request ${dependentId}`);
          error.name = "Duplicate Dependency";
          throw error;
        }
        cur.value[1].dependsOn.push(dId);
      } else {
        const error = new Error(`Can't add dependency ${dependencyId}, There is only a dependent request in the batch`);
        error.name = "Invalid Dependency Addition";
        throw error;
      }
    }
  }
  /**
   * @public
   * Removes a dependency for a given dependent request id
   * @param {string} dependentId - The id of the dependent request
   * @param {string} [dependencyId] - The id of the dependency request, if not specified will remove all the dependencies of that request
   * @returns The boolean indicating removed status
   */
  removeDependency(dependentId, dependencyId) {
    const request = this.requests.get(dependentId);
    if (typeof request === "undefined" || request.dependsOn === void 0 || request.dependsOn.length === 0) {
      return false;
    }
    if (typeof dependencyId !== "undefined") {
      const index = request.dependsOn.indexOf(dependencyId);
      if (index === -1) {
        return false;
      }
      request.dependsOn.splice(index, 1);
      return true;
    } else {
      delete request.dependsOn;
      return true;
    }
  }
};
BatchRequestContent.requestLimit = 20;

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/content/BatchResponseContent.js
var BatchResponseContent = class {
  /**
   * @public
   * @constructor
   * Creates the BatchResponseContent instance
   * @param {BatchResponseBody} response - The response body returned for batch request from server
   * @returns An instance of a BatchResponseContent
   */
  constructor(response) {
    this.responses = /* @__PURE__ */ new Map();
    this.update(response);
  }
  /**
   * @private
   * Creates native Response object from the json representation of it.
   * @param {KeyValuePairObject} responseJSON - The response json value
   * @returns The Response Object instance
   */
  createResponseObject(responseJSON) {
    const body = responseJSON.body;
    const options = {};
    options.status = responseJSON.status;
    if (responseJSON.statusText !== void 0) {
      options.statusText = responseJSON.statusText;
    }
    options.headers = responseJSON.headers;
    if (options.headers !== void 0 && options.headers["Content-Type"] !== void 0) {
      if (options.headers["Content-Type"].split(";")[0] === "application/json") {
        const bodyString = JSON.stringify(body);
        return new Response(bodyString, options);
      }
    }
    return new Response(body, options);
  }
  /**
   * @public
   * Updates the Batch response content instance with given responses.
   * @param {BatchResponseBody} response - The response json representing batch response message
   * @returns Nothing
   */
  update(response) {
    this.nextLink = response["@odata.nextLink"];
    const responses = response.responses;
    for (let i = 0, l = responses.length; i < l; i++) {
      this.responses.set(responses[i].id, this.createResponseObject(responses[i]));
    }
  }
  /**
   * @public
   * To get the response of a request for a given request id
   * @param {string} requestId - The request id value
   * @returns The Response object instance for the particular request
   */
  getResponseById(requestId) {
    return this.responses.get(requestId);
  }
  /**
   * @public
   * To get all the responses of the batch request
   * @returns The Map of id and Response objects
   */
  getResponses() {
    return this.responses;
  }
  /**
   * @public
   * To get the iterator for the responses
   * @returns The Iterable generator for the response objects
   */
  *getResponsesIterator() {
    const iterator = this.responses.entries();
    let cur = iterator.next();
    while (!cur.done) {
      yield cur.value;
      cur = iterator.next();
    }
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/Constants.js
var GRAPH_API_VERSION = "v1.0";
var GRAPH_BASE_URL = "https://graph.microsoft.com/";
var GRAPH_URLS = /* @__PURE__ */ new Set(["graph.microsoft.com", "graph.microsoft.us", "dod-graph.microsoft.us", "graph.microsoft.de", "microsoftgraph.chinacloudapi.cn", "canary.graph.microsoft.com"]);

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphClientError.js
var GraphClientError = class _GraphClientError extends Error {
  /**
   * @public
   * @static
   * @async
   * To set the GraphClientError object
   * @param {any} error - The error returned encountered by the Graph JavaScript Client SDK while processing request
   * @returns GraphClientError object set to the error passed
   */
  static setGraphClientError(error) {
    let graphClientError;
    if (error instanceof Error) {
      graphClientError = error;
    } else {
      graphClientError = new _GraphClientError();
      graphClientError.customError = error;
    }
    return graphClientError;
  }
  /**
   * @public
   * @constructor
   * Creates an instance of GraphClientError
   * @param {string} message? - Error message
   * @returns An instance of GraphClientError
   */
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, _GraphClientError.prototype);
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphRequestUtil.js
var oDataQueryNames = ["$select", "$expand", "$orderby", "$filter", "$top", "$skip", "$skipToken", "$count"];
var urlJoin = (urlSegments) => {
  const removePostSlash = (s) => s.replace(/\/+$/, "");
  const removePreSlash = (s) => s.replace(/^\/+/, "");
  const joiner = (pre, cur) => [removePostSlash(pre), removePreSlash(cur)].join("/");
  const parts = Array.prototype.slice.call(urlSegments);
  return parts.reduce(joiner);
};
var serializeContent = (content) => {
  const className = content && content.constructor && content.constructor.name;
  if (className === "Buffer" || className === "Blob" || className === "File" || className === "FormData" || typeof content === "string") {
    return content;
  }
  if (className === "ArrayBuffer") {
    content = Buffer.from(content);
  } else if (className === "Int8Array" || className === "Int16Array" || className === "Int32Array" || className === "Uint8Array" || className === "Uint16Array" || className === "Uint32Array" || className === "Uint8ClampedArray" || className === "Float32Array" || className === "Float64Array" || className === "DataView") {
    content = Buffer.from(content.buffer);
  } else {
    try {
      content = JSON.stringify(content);
    } catch (error) {
      throw new Error("Unable to stringify the content");
    }
  }
  return content;
};
var isGraphURL = (url) => {
  return isValidEndpoint(url);
};
var isCustomHost = (url, customHosts) => {
  customHosts.forEach((host) => isCustomHostValid(host));
  return isValidEndpoint(url, customHosts);
};
var isValidEndpoint = (url, allowedHosts = GRAPH_URLS) => {
  url = url.toLowerCase();
  if (url.indexOf("https://") !== -1) {
    url = url.replace("https://", "");
    const startofPortNoPos = url.indexOf(":");
    const endOfHostStrPos = url.indexOf("/");
    let hostName = "";
    if (endOfHostStrPos !== -1) {
      if (startofPortNoPos !== -1 && startofPortNoPos < endOfHostStrPos) {
        hostName = url.substring(0, startofPortNoPos);
        return allowedHosts.has(hostName);
      }
      hostName = url.substring(0, endOfHostStrPos);
      return allowedHosts.has(hostName);
    }
  }
  return false;
};
var isCustomHostValid = (host) => {
  if (host.indexOf("/") !== -1) {
    throw new GraphClientError("Please add only hosts or hostnames to the CustomHosts config. If the url is `http://example.com:3000/`, host is `example:3000`");
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/MiddlewareControl.js
var MiddlewareControl = class {
  /**
   * @public
   * @constructor
   * Creates an instance of MiddlewareControl
   * @param {MiddlewareOptions[]} [middlewareOptions = []] - The array of middlewareOptions
   * @returns The instance of MiddlewareControl
   */
  constructor(middlewareOptions = []) {
    this.middlewareOptions = /* @__PURE__ */ new Map();
    for (const option of middlewareOptions) {
      const fn = option.constructor;
      this.middlewareOptions.set(fn, option);
    }
  }
  /**
   * @public
   * To get the middleware option using the class of the option
   * @param {Function} fn - The class of the strongly typed option class
   * @returns The middleware option
   * @example
   * // if you wanted to return the middleware option associated with this class (MiddlewareControl)
   * // call this function like this:
   * getMiddlewareOptions(MiddlewareControl)
   */
  getMiddlewareOptions(fn) {
    return this.middlewareOptions.get(fn);
  }
  /**
   * @public
   * To set the middleware options using the class of the option
   * @param {Function} fn - The class of the strongly typed option class
   * @param {MiddlewareOptions} option - The strongly typed middleware option
   * @returns nothing
   */
  setMiddlewareOptions(fn, option) {
    this.middlewareOptions.set(fn, option);
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/MiddlewareUtil.js
var generateUUID = () => {
  let uuid = "";
  for (let j = 0; j < 32; j++) {
    if (j === 8 || j === 12 || j === 16 || j === 20) {
      uuid += "-";
    }
    uuid += Math.floor(Math.random() * 16).toString(16);
  }
  return uuid;
};
var getRequestHeader = (request, options, key) => {
  let value = null;
  if (typeof Request !== "undefined" && request instanceof Request) {
    value = request.headers.get(key);
  } else if (typeof options !== "undefined" && options.headers !== void 0) {
    if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
      value = options.headers.get(key);
    } else if (options.headers instanceof Array) {
      const headers = options.headers;
      for (let i = 0, l = headers.length; i < l; i++) {
        if (headers[i][0] === key) {
          value = headers[i][1];
          break;
        }
      }
    } else if (options.headers[key] !== void 0) {
      value = options.headers[key];
    }
  }
  return value;
};
var setRequestHeader = (request, options, key, value) => {
  if (typeof Request !== "undefined" && request instanceof Request) {
    request.headers.set(key, value);
  } else if (typeof options !== "undefined") {
    if (options.headers === void 0) {
      options.headers = new Headers({
        [key]: value
      });
    } else {
      if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
        options.headers.set(key, value);
      } else if (options.headers instanceof Array) {
        let i = 0;
        const l = options.headers.length;
        for (; i < l; i++) {
          const header = options.headers[i];
          if (header[0] === key) {
            header[1] = value;
            break;
          }
        }
        if (i === l) {
          options.headers.push([key, value]);
        }
      } else {
        Object.assign(options.headers, {
          [key]: value
        });
      }
    }
  }
};
var appendRequestHeader = (request, options, key, value) => {
  if (typeof Request !== "undefined" && request instanceof Request) {
    request.headers.append(key, value);
  } else if (typeof options !== "undefined") {
    if (options.headers === void 0) {
      options.headers = new Headers({
        [key]: value
      });
    } else {
      if (typeof Headers !== "undefined" && options.headers instanceof Headers) {
        options.headers.append(key, value);
      } else if (options.headers instanceof Array) {
        options.headers.push([key, value]);
      } else if (options.headers === void 0) {
        options.headers = {
          [key]: value
        };
      } else if (options.headers[key] === void 0) {
        options.headers[key] = value;
      } else {
        options.headers[key] += `, ${value}`;
      }
    }
  }
};
var cloneRequestWithNewUrl = (newUrl, request) => __awaiter(void 0, void 0, void 0, function* () {
  const body = request.headers.get("Content-Type") ? yield request.blob() : yield Promise.resolve(void 0);
  const {
    method,
    headers,
    referrer,
    referrerPolicy,
    mode,
    credentials,
    cache,
    redirect,
    integrity,
    keepalive,
    signal
  } = request;
  return new Request(newUrl, {
    method,
    headers,
    body,
    referrer,
    referrerPolicy,
    mode,
    credentials,
    cache,
    redirect,
    integrity,
    keepalive,
    signal
  });
});

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/AuthenticationHandlerOptions.js
var AuthenticationHandlerOptions = class {
  /**
   * @public
   * @constructor
   * To create an instance of AuthenticationHandlerOptions
   * @param {AuthenticationProvider} [authenticationProvider] - The authentication provider instance
   * @param {AuthenticationProviderOptions} [authenticationProviderOptions] - The authentication provider options instance
   * @returns An instance of AuthenticationHandlerOptions
   */
  constructor(authenticationProvider, authenticationProviderOptions) {
    this.authenticationProvider = authenticationProvider;
    this.authenticationProviderOptions = authenticationProviderOptions;
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/TelemetryHandlerOptions.js
var FeatureUsageFlag;
(function(FeatureUsageFlag2) {
  FeatureUsageFlag2[FeatureUsageFlag2["NONE"] = 0] = "NONE";
  FeatureUsageFlag2[FeatureUsageFlag2["REDIRECT_HANDLER_ENABLED"] = 1] = "REDIRECT_HANDLER_ENABLED";
  FeatureUsageFlag2[FeatureUsageFlag2["RETRY_HANDLER_ENABLED"] = 2] = "RETRY_HANDLER_ENABLED";
  FeatureUsageFlag2[FeatureUsageFlag2["AUTHENTICATION_HANDLER_ENABLED"] = 4] = "AUTHENTICATION_HANDLER_ENABLED";
})(FeatureUsageFlag || (FeatureUsageFlag = {}));
var TelemetryHandlerOptions = class _TelemetryHandlerOptions {
  constructor() {
    this.featureUsage = FeatureUsageFlag.NONE;
  }
  /**
   * @public
   * @static
   * To update the feature usage in the context object
   * @param {Context} context - The request context object containing middleware options
   * @param {FeatureUsageFlag} flag - The flag value
   * @returns nothing
   */
  static updateFeatureUsageFlag(context, flag) {
    let options;
    if (context.middlewareControl instanceof MiddlewareControl) {
      options = context.middlewareControl.getMiddlewareOptions(_TelemetryHandlerOptions);
    } else {
      context.middlewareControl = new MiddlewareControl();
    }
    if (typeof options === "undefined") {
      options = new _TelemetryHandlerOptions();
      context.middlewareControl.setMiddlewareOptions(_TelemetryHandlerOptions, options);
    }
    options.setFeatureUsage(flag);
  }
  /**
   * @private
   * To set the feature usage flag
   * @param {FeatureUsageFlag} flag - The flag value
   * @returns nothing
   */
  setFeatureUsage(flag) {
    this.featureUsage = this.featureUsage | flag;
  }
  /**
   * @public
   * To get the feature usage
   * @returns A feature usage flag as hexadecimal string
   */
  getFeatureUsage() {
    return this.featureUsage.toString(16);
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/AuthenticationHandler.js
var AuthenticationHandler = class _AuthenticationHandler {
  /**
   * @public
   * @constructor
   * Creates an instance of AuthenticationHandler
   * @param {AuthenticationProvider} authenticationProvider - The authentication provider for the authentication handler
   */
  constructor(authenticationProvider) {
    this.authenticationProvider = authenticationProvider;
  }
  /**
   * @public
   * @async
   * To execute the current middleware
   * @param {Context} context - The context object of the request
   * @returns A Promise that resolves to nothing
   */
  execute(context) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = typeof context.request === "string" ? context.request : context.request.url;
      if (isGraphURL(url) || context.customHosts && isCustomHost(url, context.customHosts)) {
        let options;
        if (context.middlewareControl instanceof MiddlewareControl) {
          options = context.middlewareControl.getMiddlewareOptions(AuthenticationHandlerOptions);
        }
        let authenticationProvider;
        let authenticationProviderOptions;
        if (options) {
          authenticationProvider = options.authenticationProvider;
          authenticationProviderOptions = options.authenticationProviderOptions;
        }
        if (!authenticationProvider) {
          authenticationProvider = this.authenticationProvider;
        }
        const token = yield authenticationProvider.getAccessToken(authenticationProviderOptions);
        const bearerKey = `Bearer ${token}`;
        appendRequestHeader(context.request, context.options, _AuthenticationHandler.AUTHORIZATION_HEADER, bearerKey);
        TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.AUTHENTICATION_HANDLER_ENABLED);
      } else {
        if (context.options.headers) {
          delete context.options.headers[_AuthenticationHandler.AUTHORIZATION_HEADER];
        }
      }
      return yield this.nextMiddleware.execute(context);
    });
  }
  /**
   * @public
   * To set the next middleware in the chain
   * @param {Middleware} next - The middleware instance
   * @returns Nothing
   */
  setNext(next) {
    this.nextMiddleware = next;
  }
};
AuthenticationHandler.AUTHORIZATION_HEADER = "Authorization";

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/HTTPMessageHandler.js
var HTTPMessageHandler = class {
  /**
   * @public
   * @async
   * To execute the current middleware
   * @param {Context} context - The request context object
   * @returns A promise that resolves to nothing
   */
  execute(context) {
    return __awaiter(this, void 0, void 0, function* () {
      context.response = yield fetch(context.request, context.options);
    });
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/RetryHandlerOptions.js
var RetryHandlerOptions = class _RetryHandlerOptions {
  /**
   * @public
   * @constructor
   * To create an instance of RetryHandlerOptions
   * @param {number} [delay = RetryHandlerOptions.DEFAULT_DELAY] - The delay value in seconds
   * @param {number} [maxRetries = RetryHandlerOptions.DEFAULT_MAX_RETRIES] - The maxRetries value
   * @param {ShouldRetry} [shouldRetry = RetryHandlerOptions.DEFAULT_SHOULD_RETRY] - The shouldRetry callback function
   * @returns An instance of RetryHandlerOptions
   */
  constructor(delay = _RetryHandlerOptions.DEFAULT_DELAY, maxRetries = _RetryHandlerOptions.DEFAULT_MAX_RETRIES, shouldRetry = _RetryHandlerOptions.defaultShouldRetry) {
    if (delay > _RetryHandlerOptions.MAX_DELAY && maxRetries > _RetryHandlerOptions.MAX_MAX_RETRIES) {
      const error = new Error(`Delay and MaxRetries should not be more than ${_RetryHandlerOptions.MAX_DELAY} and ${_RetryHandlerOptions.MAX_MAX_RETRIES}`);
      error.name = "MaxLimitExceeded";
      throw error;
    } else if (delay > _RetryHandlerOptions.MAX_DELAY) {
      const error = new Error(`Delay should not be more than ${_RetryHandlerOptions.MAX_DELAY}`);
      error.name = "MaxLimitExceeded";
      throw error;
    } else if (maxRetries > _RetryHandlerOptions.MAX_MAX_RETRIES) {
      const error = new Error(`MaxRetries should not be more than ${_RetryHandlerOptions.MAX_MAX_RETRIES}`);
      error.name = "MaxLimitExceeded";
      throw error;
    } else if (delay < 0 && maxRetries < 0) {
      const error = new Error(`Delay and MaxRetries should not be negative`);
      error.name = "MinExpectationNotMet";
      throw error;
    } else if (delay < 0) {
      const error = new Error(`Delay should not be negative`);
      error.name = "MinExpectationNotMet";
      throw error;
    } else if (maxRetries < 0) {
      const error = new Error(`MaxRetries should not be negative`);
      error.name = "MinExpectationNotMet";
      throw error;
    }
    this.delay = Math.min(delay, _RetryHandlerOptions.MAX_DELAY);
    this.maxRetries = Math.min(maxRetries, _RetryHandlerOptions.MAX_MAX_RETRIES);
    this.shouldRetry = shouldRetry;
  }
  /**
   * @public
   * To get the maximum delay
   * @returns A maximum delay
   */
  getMaxDelay() {
    return _RetryHandlerOptions.MAX_DELAY;
  }
};
RetryHandlerOptions.DEFAULT_DELAY = 3;
RetryHandlerOptions.DEFAULT_MAX_RETRIES = 3;
RetryHandlerOptions.MAX_DELAY = 180;
RetryHandlerOptions.MAX_MAX_RETRIES = 10;
RetryHandlerOptions.defaultShouldRetry = () => true;

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/RetryHandler.js
var RetryHandler = class _RetryHandler {
  /**
   * @public
   * @constructor
   * To create an instance of RetryHandler
   * @param {RetryHandlerOptions} [options = new RetryHandlerOptions()] - The retry handler options value
   * @returns An instance of RetryHandler
   */
  constructor(options = new RetryHandlerOptions()) {
    this.options = options;
  }
  /**
   *
   * @private
   * To check whether the response has the retry status code
   * @param {Response} response - The response object
   * @returns Whether the response has retry status code or not
   */
  isRetry(response) {
    return _RetryHandler.RETRY_STATUS_CODES.indexOf(response.status) !== -1;
  }
  /**
   * @private
   * To check whether the payload is buffered or not
   * @param {RequestInfo} request - The url string or the request object value
   * @param {FetchOptions} options - The options of a request
   * @returns Whether the payload is buffered or not
   */
  isBuffered(request, options) {
    const method = typeof request === "string" ? options.method : request.method;
    const isPutPatchOrPost = method === RequestMethod.PUT || method === RequestMethod.PATCH || method === RequestMethod.POST;
    if (isPutPatchOrPost) {
      const isStream = getRequestHeader(request, options, "Content-Type") === "application/octet-stream";
      if (isStream) {
        return false;
      }
    }
    return true;
  }
  /**
   * @private
   * To get the delay for a retry
   * @param {Response} response - The response object
   * @param {number} retryAttempts - The current attempt count
   * @param {number} delay - The delay value in seconds
   * @returns A delay for a retry
   */
  getDelay(response, retryAttempts, delay) {
    const getRandomness = () => Number(Math.random().toFixed(3));
    const retryAfter = response.headers !== void 0 ? response.headers.get(_RetryHandler.RETRY_AFTER_HEADER) : null;
    let newDelay;
    if (retryAfter !== null) {
      if (Number.isNaN(Number(retryAfter))) {
        newDelay = Math.round((new Date(retryAfter).getTime() - Date.now()) / 1e3);
      } else {
        newDelay = Number(retryAfter);
      }
    } else {
      newDelay = retryAttempts >= 2 ? this.getExponentialBackOffTime(retryAttempts) + delay + getRandomness() : delay + getRandomness();
    }
    return Math.min(newDelay, this.options.getMaxDelay() + getRandomness());
  }
  /**
   * @private
   * To get an exponential back off value
   * @param {number} attempts - The current attempt count
   * @returns An exponential back off value
   */
  getExponentialBackOffTime(attempts) {
    return Math.round(1 / 2 * (Math.pow(2, attempts) - 1));
  }
  /**
   * @private
   * @async
   * To add delay for the execution
   * @param {number} delaySeconds - The delay value in seconds
   * @returns Nothing
   */
  sleep(delaySeconds) {
    return __awaiter(this, void 0, void 0, function* () {
      const delayMilliseconds = delaySeconds * 1e3;
      return new Promise((resolve) => setTimeout(resolve, delayMilliseconds));
    });
  }
  getOptions(context) {
    let options;
    if (context.middlewareControl instanceof MiddlewareControl) {
      options = context.middlewareControl.getMiddlewareOptions(this.options.constructor);
    }
    if (typeof options === "undefined") {
      options = Object.assign(new RetryHandlerOptions(), this.options);
    }
    return options;
  }
  /**
   * @private
   * @async
   * To execute the middleware with retries
   * @param {Context} context - The context object
   * @param {number} retryAttempts - The current attempt count
   * @param {RetryHandlerOptions} options - The retry middleware options instance
   * @returns A Promise that resolves to nothing
   */
  executeWithRetry(context, retryAttempts, options) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.nextMiddleware.execute(context);
      if (retryAttempts < options.maxRetries && this.isRetry(context.response) && this.isBuffered(context.request, context.options) && options.shouldRetry(options.delay, retryAttempts, context.request, context.options, context.response)) {
        ++retryAttempts;
        setRequestHeader(context.request, context.options, _RetryHandler.RETRY_ATTEMPT_HEADER, retryAttempts.toString());
        const delay = this.getDelay(context.response, retryAttempts, options.delay);
        yield this.sleep(delay);
        return yield this.executeWithRetry(context, retryAttempts, options);
      } else {
        return;
      }
    });
  }
  /**
   * @public
   * @async
   * To execute the current middleware
   * @param {Context} context - The context object of the request
   * @returns A Promise that resolves to nothing
   */
  execute(context) {
    return __awaiter(this, void 0, void 0, function* () {
      const retryAttempts = 0;
      const options = this.getOptions(context);
      TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.RETRY_HANDLER_ENABLED);
      return yield this.executeWithRetry(context, retryAttempts, options);
    });
  }
  /**
   * @public
   * To set the next middleware in the chain
   * @param {Middleware} next - The middleware instance
   * @returns Nothing
   */
  setNext(next) {
    this.nextMiddleware = next;
  }
};
RetryHandler.RETRY_STATUS_CODES = [
  429,
  503,
  504
  // Gateway timeout
];
RetryHandler.RETRY_ATTEMPT_HEADER = "Retry-Attempt";
RetryHandler.RETRY_AFTER_HEADER = "Retry-After";

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/RedirectHandlerOptions.js
var RedirectHandlerOptions = class _RedirectHandlerOptions {
  /**
   * @public
   * @constructor
   * To create an instance of RedirectHandlerOptions
   * @param {number} [maxRedirects = RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS] - The max redirects value
   * @param {ShouldRedirect} [shouldRedirect = RedirectHandlerOptions.DEFAULT_SHOULD_RETRY] - The should redirect callback
   * @returns An instance of RedirectHandlerOptions
   */
  constructor(maxRedirects = _RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS, shouldRedirect = _RedirectHandlerOptions.defaultShouldRedirect) {
    if (maxRedirects > _RedirectHandlerOptions.MAX_MAX_REDIRECTS) {
      const error = new Error(`MaxRedirects should not be more than ${_RedirectHandlerOptions.MAX_MAX_REDIRECTS}`);
      error.name = "MaxLimitExceeded";
      throw error;
    }
    if (maxRedirects < 0) {
      const error = new Error(`MaxRedirects should not be negative`);
      error.name = "MinExpectationNotMet";
      throw error;
    }
    this.maxRedirects = maxRedirects;
    this.shouldRedirect = shouldRedirect;
  }
};
RedirectHandlerOptions.DEFAULT_MAX_REDIRECTS = 5;
RedirectHandlerOptions.MAX_MAX_REDIRECTS = 20;
RedirectHandlerOptions.defaultShouldRedirect = () => true;

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/RedirectHandler.js
var RedirectHandler = class _RedirectHandler {
  /**
   * @public
   * @constructor
   * To create an instance of RedirectHandler
   * @param {RedirectHandlerOptions} [options = new RedirectHandlerOptions()] - The redirect handler options instance
   * @returns An instance of RedirectHandler
   */
  constructor(options = new RedirectHandlerOptions()) {
    this.options = options;
  }
  /**
   * @private
   * To check whether the response has the redirect status code or not
   * @param {Response} response - The response object
   * @returns A boolean representing whether the response contains the redirect status code or not
   */
  isRedirect(response) {
    return _RedirectHandler.REDIRECT_STATUS_CODES.indexOf(response.status) !== -1;
  }
  /**
   * @private
   * To check whether the response has location header or not
   * @param {Response} response - The response object
   * @returns A boolean representing the whether the response has location header or not
   */
  hasLocationHeader(response) {
    return response.headers.has(_RedirectHandler.LOCATION_HEADER);
  }
  /**
   * @private
   * To get the redirect url from location header in response object
   * @param {Response} response - The response object
   * @returns A redirect url from location header
   */
  getLocationHeader(response) {
    return response.headers.get(_RedirectHandler.LOCATION_HEADER);
  }
  /**
   * @private
   * To check whether the given url is a relative url or not
   * @param {string} url - The url string value
   * @returns A boolean representing whether the given url is a relative url or not
   */
  isRelativeURL(url) {
    return url.indexOf("://") === -1;
  }
  /**
   * @private
   * To check whether the authorization header in the request should be dropped for consequent redirected requests
   * @param {string} requestUrl - The request url value
   * @param {string} redirectUrl - The redirect url value
   * @returns A boolean representing whether the authorization header in the request should be dropped for consequent redirected requests
   */
  shouldDropAuthorizationHeader(requestUrl, redirectUrl) {
    const schemeHostRegex = /^[A-Za-z].+?:\/\/.+?(?=\/|$)/;
    const requestMatches = schemeHostRegex.exec(requestUrl);
    let requestAuthority;
    let redirectAuthority;
    if (requestMatches !== null) {
      requestAuthority = requestMatches[0];
    }
    const redirectMatches = schemeHostRegex.exec(redirectUrl);
    if (redirectMatches !== null) {
      redirectAuthority = redirectMatches[0];
    }
    return typeof requestAuthority !== "undefined" && typeof redirectAuthority !== "undefined" && requestAuthority !== redirectAuthority;
  }
  /**
   * @private
   * @async
   * To update a request url with the redirect url
   * @param {string} redirectUrl - The redirect url value
   * @param {Context} context - The context object value
   * @returns Nothing
   */
  updateRequestUrl(redirectUrl, context) {
    return __awaiter(this, void 0, void 0, function* () {
      context.request = typeof context.request === "string" ? redirectUrl : yield cloneRequestWithNewUrl(redirectUrl, context.request);
    });
  }
  /**
   * @private
   * To get the options for execution of the middleware
   * @param {Context} context - The context object
   * @returns A options for middleware execution
   */
  getOptions(context) {
    let options;
    if (context.middlewareControl instanceof MiddlewareControl) {
      options = context.middlewareControl.getMiddlewareOptions(RedirectHandlerOptions);
    }
    if (typeof options === "undefined") {
      options = Object.assign(new RedirectHandlerOptions(), this.options);
    }
    return options;
  }
  /**
   * @private
   * @async
   * To execute the next middleware and to handle in case of redirect response returned by the server
   * @param {Context} context - The context object
   * @param {number} redirectCount - The redirect count value
   * @param {RedirectHandlerOptions} options - The redirect handler options instance
   * @returns A promise that resolves to nothing
   */
  executeWithRedirect(context, redirectCount, options) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.nextMiddleware.execute(context);
      const response = context.response;
      if (redirectCount < options.maxRedirects && this.isRedirect(response) && this.hasLocationHeader(response) && options.shouldRedirect(response)) {
        ++redirectCount;
        if (response.status === _RedirectHandler.STATUS_CODE_SEE_OTHER) {
          context.options.method = RequestMethod.GET;
          delete context.options.body;
        } else {
          const redirectUrl = this.getLocationHeader(response);
          if (!this.isRelativeURL(redirectUrl) && this.shouldDropAuthorizationHeader(response.url, redirectUrl)) {
            delete context.options.headers[_RedirectHandler.AUTHORIZATION_HEADER];
          }
          yield this.updateRequestUrl(redirectUrl, context);
        }
        yield this.executeWithRedirect(context, redirectCount, options);
      } else {
        return;
      }
    });
  }
  /**
   * @public
   * @async
   * To execute the current middleware
   * @param {Context} context - The context object of the request
   * @returns A Promise that resolves to nothing
   */
  execute(context) {
    return __awaiter(this, void 0, void 0, function* () {
      const redirectCount = 0;
      const options = this.getOptions(context);
      context.options.redirect = _RedirectHandler.MANUAL_REDIRECT;
      TelemetryHandlerOptions.updateFeatureUsageFlag(context, FeatureUsageFlag.REDIRECT_HANDLER_ENABLED);
      return yield this.executeWithRedirect(context, redirectCount, options);
    });
  }
  /**
   * @public
   * To set the next middleware in the chain
   * @param {Middleware} next - The middleware instance
   * @returns Nothing
   */
  setNext(next) {
    this.nextMiddleware = next;
  }
};
RedirectHandler.REDIRECT_STATUS_CODES = [
  301,
  302,
  303,
  307,
  308
  // Moved Permanently
];
RedirectHandler.STATUS_CODE_SEE_OTHER = 303;
RedirectHandler.LOCATION_HEADER = "Location";
RedirectHandler.AUTHORIZATION_HEADER = "Authorization";
RedirectHandler.MANUAL_REDIRECT = "manual";

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/Version.js
var PACKAGE_VERSION = "3.0.7";

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/TelemetryHandler.js
var TelemetryHandler = class _TelemetryHandler {
  /**
   * @public
   * @async
   * To execute the current middleware
   * @param {Context} context - The context object of the request
   * @returns A Promise that resolves to nothing
   */
  execute(context) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = typeof context.request === "string" ? context.request : context.request.url;
      if (isGraphURL(url) || context.customHosts && isCustomHost(url, context.customHosts)) {
        let clientRequestId = getRequestHeader(context.request, context.options, _TelemetryHandler.CLIENT_REQUEST_ID_HEADER);
        if (!clientRequestId) {
          clientRequestId = generateUUID();
          setRequestHeader(context.request, context.options, _TelemetryHandler.CLIENT_REQUEST_ID_HEADER, clientRequestId);
        }
        let sdkVersionValue = `${_TelemetryHandler.PRODUCT_NAME}/${PACKAGE_VERSION}`;
        let options;
        if (context.middlewareControl instanceof MiddlewareControl) {
          options = context.middlewareControl.getMiddlewareOptions(TelemetryHandlerOptions);
        }
        if (options) {
          const featureUsage = options.getFeatureUsage();
          sdkVersionValue += ` (${_TelemetryHandler.FEATURE_USAGE_STRING}=${featureUsage})`;
        }
        appendRequestHeader(context.request, context.options, _TelemetryHandler.SDK_VERSION_HEADER, sdkVersionValue);
      } else {
        delete context.options.headers[_TelemetryHandler.CLIENT_REQUEST_ID_HEADER];
        delete context.options.headers[_TelemetryHandler.SDK_VERSION_HEADER];
      }
      return yield this.nextMiddleware.execute(context);
    });
  }
  /**
   * @public
   * To set the next middleware in the chain
   * @param {Middleware} next - The middleware instance
   * @returns Nothing
   */
  setNext(next) {
    this.nextMiddleware = next;
  }
};
TelemetryHandler.CLIENT_REQUEST_ID_HEADER = "client-request-id";
TelemetryHandler.SDK_VERSION_HEADER = "SdkVersion";
TelemetryHandler.PRODUCT_NAME = "graph-js";
TelemetryHandler.FEATURE_USAGE_STRING = "featureUsage";

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/MiddlewareFactory.js
var isNodeEnvironment = () => {
  return typeof process === "object" && typeof __require === "function";
};
var MiddlewareFactory = class {
  /**
   * @public
   * @static
   * Returns the default middleware chain an array with the  middleware handlers
   * @param {AuthenticationProvider} authProvider - The authentication provider instance
   * @returns an array of the middleware handlers of the default middleware chain
   */
  static getDefaultMiddlewareChain(authProvider) {
    const middleware = [];
    const authenticationHandler = new AuthenticationHandler(authProvider);
    const retryHandler = new RetryHandler(new RetryHandlerOptions());
    const telemetryHandler = new TelemetryHandler();
    const httpMessageHandler = new HTTPMessageHandler();
    middleware.push(authenticationHandler);
    middleware.push(retryHandler);
    if (isNodeEnvironment()) {
      const redirectHandler = new RedirectHandler(new RedirectHandlerOptions());
      middleware.push(redirectHandler);
    }
    middleware.push(telemetryHandler);
    middleware.push(httpMessageHandler);
    return middleware;
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/ChaosStrategy.js
var ChaosStrategy;
(function(ChaosStrategy2) {
  ChaosStrategy2[ChaosStrategy2["MANUAL"] = 0] = "MANUAL";
  ChaosStrategy2[ChaosStrategy2["RANDOM"] = 1] = "RANDOM";
})(ChaosStrategy || (ChaosStrategy = {}));

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/ChaosHandlerOptions.js
var ChaosHandlerOptions = class {
  /**
   * @public
   * @constructor
   * To create an instance of Testing Handler Options
   * @param {ChaosStrategy} chaosStrategy - Specifies the startegy used for the Testing Handler -> RAMDOM/MANUAL
   * @param {string} statusMessage - The Message to be returned in the response
   * @param {number?} statusCode - The statusCode to be returned in the response
   * @param {number?} chaosPercentage - The percentage of randomness/chaos in the handler
   * @param {any?} responseBody - The response body to be returned in the response
   * @returns An instance of ChaosHandlerOptions
   */
  constructor(chaosStrategy = ChaosStrategy.RANDOM, statusMessage = "Some error Happened", statusCode, chaosPercentage, responseBody, headers) {
    this.chaosStrategy = chaosStrategy;
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.chaosPercentage = chaosPercentage !== void 0 ? chaosPercentage : 10;
    this.responseBody = responseBody;
    this.headers = headers;
    if (this.chaosPercentage > 100) {
      throw new Error("Error Pecentage can not be more than 100");
    }
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/options/ChaosHandlerData.js
var methodStatusCode = {
  GET: [429, 500, 502, 503, 504],
  POST: [429, 500, 502, 503, 504, 507],
  PUT: [429, 500, 502, 503, 504, 507],
  PATCH: [429, 500, 502, 503, 504],
  DELETE: [429, 500, 502, 503, 504, 507]
};
var httpStatusCode = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required"
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/middleware/ChaosHandler.js
var ChaosHandler = class {
  /**
   * @public
   * @constructor
   * To create an instance of Testing Handler
   * @param {ChaosHandlerOptions} [options = new ChaosHandlerOptions()] - The testing handler options instance
   * @param manualMap - The Map passed by user containing url-statusCode info
   * @returns An instance of Testing Handler
   */
  constructor(options = new ChaosHandlerOptions(), manualMap) {
    this.options = options;
    this.manualMap = manualMap;
  }
  /**
   * Generates responseHeader
   * @private
   * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
   * @param {string} requestID - request id
   * @param {string} requestDate - date of the request
   * @returns response Header
   */
  createResponseHeaders(chaosHandlerOptions, requestID, requestDate) {
    const responseHeader = chaosHandlerOptions.headers ? new Headers(chaosHandlerOptions.headers) : new Headers();
    responseHeader.append("Cache-Control", "no-store");
    responseHeader.append("request-id", requestID);
    responseHeader.append("client-request-id", requestID);
    responseHeader.append("x-ms-ags-diagnostic", "");
    responseHeader.append("Date", requestDate);
    responseHeader.append("Strict-Transport-Security", "");
    if (chaosHandlerOptions.statusCode === 429) {
      responseHeader.append("retry-after", "3");
    }
    return responseHeader;
  }
  /**
   * Generates responseBody
   * @private
   * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
   * @param {string} requestID - request id
   * @param {string} requestDate - date of the request
   *  * @returns response body
   */
  createResponseBody(chaosHandlerOptions, requestID, requestDate) {
    if (chaosHandlerOptions.responseBody) {
      return chaosHandlerOptions.responseBody;
    }
    let body;
    if (chaosHandlerOptions.statusCode >= 400) {
      const codeMessage = httpStatusCode[chaosHandlerOptions.statusCode];
      const errMessage = chaosHandlerOptions.statusMessage;
      body = {
        error: {
          code: codeMessage,
          message: errMessage,
          innerError: {
            "request-id": requestID,
            date: requestDate
          }
        }
      };
    } else {
      body = {};
    }
    return body;
  }
  /**
   * creates a response
   * @private
   * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
   * @param {Context} context - Contains the context of the request
   */
  createResponse(chaosHandlerOptions, context) {
    const requestURL = context.request;
    const requestID = generateUUID();
    const requestDate = /* @__PURE__ */ new Date();
    const responseHeader = this.createResponseHeaders(chaosHandlerOptions, requestID, requestDate.toString());
    const responseBody = this.createResponseBody(chaosHandlerOptions, requestID, requestDate.toString());
    const init = {
      url: requestURL,
      status: chaosHandlerOptions.statusCode,
      statusText: chaosHandlerOptions.statusMessage,
      headers: responseHeader
    };
    context.response = new Response(typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody), init);
  }
  /**
   * Decides whether to send the request to the graph or not
   * @private
   * @param {ChaosHandlerOptions} chaosHandlerOptions - A ChaosHandlerOptions object
   * @param {Context} context - Contains the context of the request
   * @returns nothing
   */
  sendRequest(chaosHandlerOptions, context) {
    return __awaiter(this, void 0, void 0, function* () {
      this.setStatusCode(chaosHandlerOptions, context.request, context.options.method);
      if (chaosHandlerOptions.chaosStrategy === ChaosStrategy.MANUAL && !this.nextMiddleware || Math.floor(Math.random() * 100) < chaosHandlerOptions.chaosPercentage) {
        this.createResponse(chaosHandlerOptions, context);
      } else if (this.nextMiddleware) {
        yield this.nextMiddleware.execute(context);
      }
    });
  }
  /**
   * Fetches a random status code for the RANDOM mode from the predefined array
   * @private
   * @param {string} requestMethod - the API method for the request
   * @returns a random status code from a given set of status codes
   */
  getRandomStatusCode(requestMethod) {
    const statusCodeArray = methodStatusCode[requestMethod];
    return statusCodeArray[Math.floor(Math.random() * statusCodeArray.length)];
  }
  /**
   * To fetch the relative URL out of the complete URL using a predefined regex pattern
   * @private
   * @param {string} urlMethod - the complete URL
   * @returns the string as relative URL
   */
  getRelativeURL(urlMethod) {
    const pattern = /https?:\/\/graph\.microsoft\.com\/[^/]+(.+?)(\?|$)/;
    let relativeURL;
    if (pattern.exec(urlMethod) !== null) {
      relativeURL = pattern.exec(urlMethod)[1];
    }
    return relativeURL;
  }
  /**
   * To fetch the status code from the map(if needed), then returns response by calling createResponse
   * @private
   * @param {ChaosHandlerOptions} chaosHandlerOptions - The ChaosHandlerOptions object
   * @param {string} requestURL - the URL for the request
   * @param {string} requestMethod - the API method for the request
   */
  setStatusCode(chaosHandlerOptions, requestURL, requestMethod) {
    if (chaosHandlerOptions.chaosStrategy === ChaosStrategy.MANUAL) {
      if (chaosHandlerOptions.statusCode === void 0) {
        const relativeURL = this.getRelativeURL(requestURL);
        if (this.manualMap.get(relativeURL) !== void 0) {
          if (this.manualMap.get(relativeURL).get(requestMethod) !== void 0) {
            chaosHandlerOptions.statusCode = this.manualMap.get(relativeURL).get(requestMethod);
          }
        } else {
          this.manualMap.forEach((value, key) => {
            const regexURL = new RegExp(key + "$");
            if (regexURL.test(relativeURL)) {
              if (this.manualMap.get(key).get(requestMethod) !== void 0) {
                chaosHandlerOptions.statusCode = this.manualMap.get(key).get(requestMethod);
              }
            }
          });
        }
      }
    } else {
      chaosHandlerOptions.statusCode = this.getRandomStatusCode(requestMethod);
    }
  }
  /**
   * To get the options for execution of the middleware
   * @private
   * @param {Context} context - The context object
   * @returns options for middleware execution
   */
  getOptions(context) {
    let options;
    if (context.middlewareControl instanceof MiddlewareControl) {
      options = context.middlewareControl.getMiddlewareOptions(ChaosHandlerOptions);
    }
    if (typeof options === "undefined") {
      options = Object.assign(new ChaosHandlerOptions(), this.options);
    }
    return options;
  }
  /**
   * To execute the current middleware
   * @public
   * @async
   * @param {Context} context - The context object of the request
   * @returns A Promise that resolves to nothing
   */
  execute(context) {
    return __awaiter(this, void 0, void 0, function* () {
      const chaosHandlerOptions = this.getOptions(context);
      return yield this.sendRequest(chaosHandlerOptions, context);
    });
  }
  /**
   * @public
   * To set the next middleware in the chain
   * @param {Middleware} next - The middleware instance
   * @returns Nothing
   */
  setNext(next) {
    this.nextMiddleware = next;
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/ResponseType.js
var ResponseType;
(function(ResponseType2) {
  ResponseType2["ARRAYBUFFER"] = "arraybuffer";
  ResponseType2["BLOB"] = "blob";
  ResponseType2["DOCUMENT"] = "document";
  ResponseType2["JSON"] = "json";
  ResponseType2["RAW"] = "raw";
  ResponseType2["STREAM"] = "stream";
  ResponseType2["TEXT"] = "text";
})(ResponseType || (ResponseType = {}));

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphResponseHandler.js
var DocumentType;
(function(DocumentType2) {
  DocumentType2["TEXT_HTML"] = "text/html";
  DocumentType2["TEXT_XML"] = "text/xml";
  DocumentType2["APPLICATION_XML"] = "application/xml";
  DocumentType2["APPLICATION_XHTML"] = "application/xhtml+xml";
})(DocumentType || (DocumentType = {}));
var ContentType;
(function(ContentType2) {
  ContentType2["TEXT_PLAIN"] = "text/plain";
  ContentType2["APPLICATION_JSON"] = "application/json";
})(ContentType || (ContentType = {}));
var ContentTypeRegexStr;
(function(ContentTypeRegexStr2) {
  ContentTypeRegexStr2["DOCUMENT"] = "^(text\\/(html|xml))|(application\\/(xml|xhtml\\+xml))$";
  ContentTypeRegexStr2["IMAGE"] = "^image\\/.+";
})(ContentTypeRegexStr || (ContentTypeRegexStr = {}));
var GraphResponseHandler = class _GraphResponseHandler {
  /**
   * @private
   * @static
   * To parse Document response
   * @param {Response} rawResponse - The response object
   * @param {DocumentType} type - The type to which the document needs to be parsed
   * @returns A promise that resolves to a document content
   */
  static parseDocumentResponse(rawResponse, type) {
    if (typeof DOMParser !== "undefined") {
      return new Promise((resolve, reject) => {
        rawResponse.text().then((xmlString) => {
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, type);
            resolve(xmlDoc);
          } catch (error) {
            reject(error);
          }
        });
      });
    } else {
      return Promise.resolve(rawResponse.body);
    }
  }
  /**
   * @private
   * @static
   * @async
   * To convert the native Response to response content
   * @param {Response} rawResponse - The response object
   * @param {ResponseType} [responseType] - The response type value
   * @returns A promise that resolves to the converted response content
   */
  static convertResponse(rawResponse, responseType) {
    return __awaiter(this, void 0, void 0, function* () {
      if (rawResponse.status === 204) {
        return Promise.resolve();
      }
      let responseValue;
      const contentType = rawResponse.headers.get("Content-type");
      switch (responseType) {
        case ResponseType.ARRAYBUFFER:
          responseValue = yield rawResponse.arrayBuffer();
          break;
        case ResponseType.BLOB:
          responseValue = yield rawResponse.blob();
          break;
        case ResponseType.DOCUMENT:
          responseValue = yield _GraphResponseHandler.parseDocumentResponse(rawResponse, DocumentType.TEXT_XML);
          break;
        case ResponseType.JSON:
          responseValue = yield rawResponse.json();
          break;
        case ResponseType.STREAM:
          responseValue = yield Promise.resolve(rawResponse.body);
          break;
        case ResponseType.TEXT:
          responseValue = yield rawResponse.text();
          break;
        default:
          if (contentType !== null) {
            const mimeType = contentType.split(";")[0];
            if (new RegExp(ContentTypeRegexStr.DOCUMENT).test(mimeType)) {
              responseValue = yield _GraphResponseHandler.parseDocumentResponse(rawResponse, mimeType);
            } else if (new RegExp(ContentTypeRegexStr.IMAGE).test(mimeType)) {
              responseValue = rawResponse.blob();
            } else if (mimeType === ContentType.TEXT_PLAIN) {
              responseValue = yield rawResponse.text();
            } else if (mimeType === ContentType.APPLICATION_JSON) {
              responseValue = yield rawResponse.json();
            } else {
              responseValue = Promise.resolve(rawResponse.body);
            }
          } else {
            responseValue = Promise.resolve(rawResponse.body);
          }
          break;
      }
      return responseValue;
    });
  }
  /**
   * @public
   * @static
   * @async
   * To get the parsed response
   * @param {Response} rawResponse - The response object
   * @param {ResponseType} [responseType] - The response type value
   * @param {GraphRequestCallback} [callback] - The graph request callback function
   * @returns The parsed response
   */
  static getResponse(rawResponse, responseType, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      if (responseType === ResponseType.RAW) {
        return Promise.resolve(rawResponse);
      } else {
        const response = yield _GraphResponseHandler.convertResponse(rawResponse, responseType);
        if (rawResponse.ok) {
          if (typeof callback === "function") {
            callback(null, response);
          } else {
            return response;
          }
        } else {
          throw response;
        }
      }
    });
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/Range.js
var Range = class {
  /**
   * @public
   * @constructor
   * Creates a range for given min and max values
   * @param {number} [minVal = -1] - The minimum value.
   * @param {number} [maxVal = -1] - The maximum value.
   * @returns An instance of a Range
   */
  constructor(minVal = -1, maxVal = -1) {
    this.minValue = minVal;
    this.maxValue = maxVal;
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/UploadResult.js
var UploadResult = class _UploadResult {
  /**
   * @public
   * Get of the location value.
   * Location value is looked up in the response header
   */
  get location() {
    return this._location;
  }
  /**
   * @public
   * Set the location value
   * Location value is looked up in the response header
   */
  set location(location) {
    this._location = location;
  }
  /**
   * @public
   * Get The response body from the completed upload response
   */
  get responseBody() {
    return this._responseBody;
  }
  /**
   * @public
   * Set the response body from the completed upload response
   */
  set responseBody(responseBody) {
    this._responseBody = responseBody;
  }
  /**
   * @public
   * @param {responseBody} responsebody - The response body from the completed upload response
   * @param {location} location - The location value from the headers from the completed upload response
   */
  constructor(responseBody, location) {
    this._location = location;
    this._responseBody = responseBody;
  }
  /**
   * @public
   * @param {responseBody} responseBody - The response body from the completed upload response
   * @param {responseHeaders} responseHeaders - The headers from the completed upload response
   */
  static CreateUploadResult(responseBody, responseHeaders) {
    return new _UploadResult(responseBody, responseHeaders.get("location"));
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/LargeFileUploadTask.js
var LargeFileUploadTask = class {
  /**
   * @public
   * @static
   * @async
   * Makes request to the server to create an upload session
   * @param {Client} client - The GraphClient instance
   * @param {string} requestUrl - The URL to create the upload session
   * @param {any} payload - The payload that needs to be sent
   * @param {KeyValuePairObjectStringNumber} headers - The headers that needs to be sent
   * @returns The promise that resolves to LargeFileUploadSession
   */
  static createUploadSession(client, requestUrl, payload, headers = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      const session = yield client.api(requestUrl).headers(headers).post(payload);
      const largeFileUploadSession = {
        url: session.uploadUrl,
        expiry: new Date(session.expirationDateTime),
        isCancelled: false
      };
      return largeFileUploadSession;
    });
  }
  /**
   * @public
   * @constructor
   * Constructs a LargeFileUploadTask
   * @param {Client} client - The GraphClient instance
   * @param {FileObject} file - The FileObject holding details of a file that needs to be uploaded
   * @param {LargeFileUploadSession} uploadSession - The upload session to which the upload has to be done
   * @param {LargeFileUploadTaskOptions} options - The upload task options
   * @returns An instance of LargeFileUploadTask
   */
  constructor(client, file, uploadSession, options = {}) {
    this.DEFAULT_FILE_SIZE = 5 * 1024 * 1024;
    this.client = client;
    if (!file.sliceFile) {
      throw new GraphClientError("Please pass the FileUpload object, StreamUpload object or any custom implementation of the FileObject interface");
    } else {
      this.file = file;
    }
    this.file = file;
    if (!options.rangeSize) {
      options.rangeSize = this.DEFAULT_FILE_SIZE;
    }
    this.options = options;
    this.uploadSession = uploadSession;
    this.nextRange = new Range(0, this.options.rangeSize - 1);
  }
  /**
   * @private
   * Parses given range string to the Range instance
   * @param {string[]} ranges - The ranges value
   * @returns The range instance
   */
  parseRange(ranges) {
    const rangeStr = ranges[0];
    if (typeof rangeStr === "undefined" || rangeStr === "") {
      return new Range();
    }
    const firstRange = rangeStr.split("-");
    const minVal = parseInt(firstRange[0], 10);
    let maxVal = parseInt(firstRange[1], 10);
    if (Number.isNaN(maxVal)) {
      maxVal = this.file.size - 1;
    }
    return new Range(minVal, maxVal);
  }
  /**
   * @private
   * Updates the expiration date and the next range
   * @param {UploadStatusResponse} response - The response of the upload status
   * @returns Nothing
   */
  updateTaskStatus(response) {
    this.uploadSession.expiry = new Date(response.expirationDateTime);
    this.nextRange = this.parseRange(response.nextExpectedRanges);
  }
  /**
   * @public
   * Gets next range that needs to be uploaded
   * @returns The range instance
   */
  getNextRange() {
    if (this.nextRange.minValue === -1) {
      return this.nextRange;
    }
    const minVal = this.nextRange.minValue;
    let maxValue = minVal + this.options.rangeSize - 1;
    if (maxValue >= this.file.size) {
      maxValue = this.file.size - 1;
    }
    return new Range(minVal, maxValue);
  }
  /**
   * @deprecated This function has been moved into FileObject interface.
   * @public
   * Slices the file content to the given range
   * @param {Range} range - The range value
   * @returns The sliced ArrayBuffer or Blob
   */
  sliceFile(range) {
    console.warn("The LargeFileUploadTask.sliceFile() function has been deprecated and moved into the FileObject interface.");
    if (this.file.content instanceof ArrayBuffer || this.file.content instanceof Blob || this.file.content instanceof Uint8Array) {
      return this.file.content.slice(range.minValue, range.maxValue + 1);
    }
    throw new GraphClientError("The LargeFileUploadTask.sliceFile() function expects only Blob, ArrayBuffer or Uint8Array file content. Please note that the sliceFile() function is deprecated.");
  }
  /**
   * @public
   * @async
   * Uploads file to the server in a sequential order by slicing the file
   * @returns The promise resolves to uploaded response
   */
  upload() {
    return __awaiter(this, void 0, void 0, function* () {
      const uploadEventHandlers = this.options && this.options.uploadEventHandlers;
      while (!this.uploadSession.isCancelled) {
        const nextRange = this.getNextRange();
        if (nextRange.maxValue === -1) {
          const err = new Error("Task with which you are trying to upload is already completed, Please check for your uploaded file");
          err.name = "Invalid Session";
          throw err;
        }
        const fileSlice = yield this.file.sliceFile(nextRange);
        const rawResponse = yield this.uploadSliceGetRawResponse(fileSlice, nextRange, this.file.size);
        if (!rawResponse) {
          throw new GraphClientError("Something went wrong! Large file upload slice response is null.");
        }
        const responseBody = yield GraphResponseHandler.getResponse(rawResponse);
        if (rawResponse.status === 201 || rawResponse.status === 200 && responseBody.id) {
          this.reportProgress(uploadEventHandlers, nextRange);
          return UploadResult.CreateUploadResult(responseBody, rawResponse.headers);
        }
        const res = {
          expirationDateTime: responseBody.expirationDateTime || responseBody.ExpirationDateTime,
          nextExpectedRanges: responseBody.NextExpectedRanges || responseBody.nextExpectedRanges
        };
        this.updateTaskStatus(res);
        this.reportProgress(uploadEventHandlers, nextRange);
      }
    });
  }
  reportProgress(uploadEventHandlers, nextRange) {
    if (uploadEventHandlers && uploadEventHandlers.progress) {
      uploadEventHandlers.progress(nextRange, uploadEventHandlers.extraCallbackParam);
    }
  }
  /**
   * @public
   * @async
   * Uploads given slice to the server
   * @param {ArrayBuffer | Blob | File} fileSlice - The file slice
   * @param {Range} range - The range value
   * @param {number} totalSize - The total size of a complete file
   * @returns The response body of the upload slice result
   */
  uploadSlice(fileSlice, range, totalSize) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.client.api(this.uploadSession.url).headers({
        "Content-Length": `${range.maxValue - range.minValue + 1}`,
        "Content-Range": `bytes ${range.minValue}-${range.maxValue}/${totalSize}`,
        "Content-Type": "application/octet-stream"
      }).put(fileSlice);
    });
  }
  /**
   * @public
   * @async
   * Uploads given slice to the server
   * @param {unknown} fileSlice - The file slice
   * @param {Range} range - The range value
   * @param {number} totalSize - The total size of a complete file
   * @returns The raw response of the upload slice result
   */
  uploadSliceGetRawResponse(fileSlice, range, totalSize) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.client.api(this.uploadSession.url).headers({
        "Content-Length": `${range.maxValue - range.minValue + 1}`,
        "Content-Range": `bytes ${range.minValue}-${range.maxValue}/${totalSize}`,
        "Content-Type": "application/octet-stream"
      }).responseType(ResponseType.RAW).put(fileSlice);
    });
  }
  /**
   * @public
   * @async
   * Deletes upload session in the server
   * @returns The promise resolves to cancelled response
   */
  cancel() {
    return __awaiter(this, void 0, void 0, function* () {
      const cancelResponse = yield this.client.api(this.uploadSession.url).responseType(ResponseType.RAW).delete();
      if (cancelResponse.status === 204) {
        this.uploadSession.isCancelled = true;
      }
      return cancelResponse;
    });
  }
  /**
   * @public
   * @async
   * Gets status for the upload session
   * @returns The promise resolves to the status enquiry response
   */
  getStatus() {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield this.client.api(this.uploadSession.url).get();
      this.updateTaskStatus(response);
      return response;
    });
  }
  /**
   * @public
   * @async
   * Resumes upload session and continue uploading the file from the last sent range
   * @returns The promise resolves to the uploaded response
   */
  resume() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.getStatus();
      return yield this.upload();
    });
  }
  /**
   * @public
   * @async
   * Get the upload session information
   * @returns The large file upload session
   */
  getUploadSession() {
    return this.uploadSession;
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/FileObjectClasses/FileUpload.js
var FileUpload = class {
  /**
   * @public
   * @constructor
   * @param {ArrayBuffer | Blob | Uint8Array} content - The file to be uploaded
   * @param {string} name - The name of the file to be uploaded
   * @param {number} size - The total size of the file to be uploaded
   * @returns An instance of the FileUpload class
   */
  constructor(content, name, size) {
    this.content = content;
    this.name = name;
    this.size = size;
    if (!content || !name || !size) {
      throw new GraphClientError("Please provide the upload content, name of the file and size of the file");
    }
  }
  /**
   * @public
   * Slices the file content to the given range
   * @param {Range} range - The range value
   * @returns The sliced file part
   */
  sliceFile(range) {
    return this.content.slice(range.minValue, range.maxValue + 1);
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/OneDriveLargeFileUploadTaskUtil.js
var DEFAULT_FILE_SIZE = 5 * 1024 * 1024;
var roundTo320KB = (value) => {
  if (value > 320 * 1024) {
    value = Math.floor(value / (320 * 1024)) * 320 * 1024;
  }
  return value;
};
var getValidRangeSize = (rangeSize = DEFAULT_FILE_SIZE) => {
  const sixtyMB = 60 * 1024 * 1024;
  if (rangeSize > sixtyMB) {
    rangeSize = sixtyMB;
  }
  return roundTo320KB(rangeSize);
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/OneDriveLargeFileUploadTask.js
var OneDriveLargeFileUploadTask = class _OneDriveLargeFileUploadTask extends LargeFileUploadTask {
  /**
   * @private
   * @static
   * Constructs the create session url for Onedrive
   * @param {string} fileName - The name of the file
   * @param {path} [path = OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH] - The path for the upload
   * @returns The constructed create session url
   */
  static constructCreateSessionUrl(fileName, path = _OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH) {
    fileName = fileName.trim();
    path = path.trim();
    if (path === "") {
      path = "/";
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path[path.length - 1] !== "/") {
      path = `${path}/`;
    }
    return `/me/drive/root:${path.split("/").map((p) => encodeURIComponent(p)).join("/")}${encodeURIComponent(fileName)}:/createUploadSession`;
  }
  /**
   * @private
   * @static
   * Get file information
   * @param {Blob | Uint8Array | File} file - The file entity
   * @param {string} fileName - The file name
   * @returns {FileInfo} The file information
   */
  static getFileInfo(file, fileName) {
    let content;
    let size;
    if (typeof Blob !== "undefined" && file instanceof Blob) {
      content = new File([file], fileName);
      size = content.size;
    } else if (typeof File !== "undefined" && file instanceof File) {
      content = file;
      size = content.size;
    } else if (typeof Uint8Array !== "undefined" && file instanceof Uint8Array) {
      const b = file;
      size = b.byteLength;
      content = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    }
    return {
      content,
      size
    };
  }
  /**
   * @public
   * @static
   * @async
   * Creates a OneDriveLargeFileUploadTask
   * @param {Client} client - The GraphClient instance
   * @param {Blob | Uint8Array | File} file - File represented as Blob, Uint8Array or File
   * @param {OneDriveLargeFileUploadOptions} options - The options for upload task
   * @returns The promise that will be resolves to OneDriveLargeFileUploadTask instance
   */
  static create(client, file, options) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!client || !file || !options) {
        throw new GraphClientError("Please provide the Graph client instance, file object and OneDriveLargeFileUploadOptions value");
      }
      const fileName = options.fileName;
      const fileInfo = _OneDriveLargeFileUploadTask.getFileInfo(file, fileName);
      const fileObj = new FileUpload(fileInfo.content, fileName, fileInfo.size);
      return this.createTaskWithFileObject(client, fileObj, options);
    });
  }
  /**
   * @public
   * @static
   * @async
   * Creates a OneDriveLargeFileUploadTask
   * @param {Client} client - The GraphClient instance
   * @param {FileObject} fileObject - FileObject instance
   * @param {OneDriveLargeFileUploadOptions} options - The options for upload task
   * @returns The promise that will be resolves to OneDriveLargeFileUploadTask instance
   */
  static createTaskWithFileObject(client, fileObject, options) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!client || !fileObject || !options) {
        throw new GraphClientError("Please provide the Graph client instance, FileObject interface implementation and OneDriveLargeFileUploadOptions value");
      }
      const requestUrl = options.uploadSessionURL ? options.uploadSessionURL : _OneDriveLargeFileUploadTask.constructCreateSessionUrl(options.fileName, options.path);
      const uploadSessionPayload = {
        fileName: options.fileName,
        fileDescription: options.fileDescription,
        conflictBehavior: options.conflictBehavior
      };
      const session = yield _OneDriveLargeFileUploadTask.createUploadSession(client, requestUrl, uploadSessionPayload);
      const rangeSize = getValidRangeSize(options.rangeSize);
      return new _OneDriveLargeFileUploadTask(client, fileObject, session, {
        rangeSize,
        uploadEventHandlers: options.uploadEventHandlers
      });
    });
  }
  /**
   * @public
   * @static
   * @async
   * Makes request to the server to create an upload session
   * @param {Client} client - The GraphClient instance
   * @param {string} requestUrl - The URL to create the upload session
   * @param {string} payloadOptions - The payload option. Default conflictBehavior is 'rename'
   * @returns The promise that resolves to LargeFileUploadSession
   */
  static createUploadSession(client, requestUrl, payloadOptions) {
    const _super = Object.create(null, {
      createUploadSession: {
        get: () => super.createUploadSession
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
      const payload = {
        item: {
          "@microsoft.graph.conflictBehavior": (payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.conflictBehavior) || "rename",
          name: payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.fileName,
          description: payloadOptions === null || payloadOptions === void 0 ? void 0 : payloadOptions.fileDescription
        }
      };
      return _super.createUploadSession.call(this, client, requestUrl, payload);
    });
  }
  /**
   * @public
   * @constructor
   * Constructs a OneDriveLargeFileUploadTask
   * @param {Client} client - The GraphClient instance
   * @param {FileObject} file - The FileObject holding details of a file that needs to be uploaded
   * @param {LargeFileUploadSession} uploadSession - The upload session to which the upload has to be done
   * @param {LargeFileUploadTaskOptions} options - The upload task options
   * @returns An instance of OneDriveLargeFileUploadTask
   */
  constructor(client, file, uploadSession, options) {
    super(client, file, uploadSession, options);
  }
  /**
   * @public
   * Commits upload session to end uploading
   * @param {string} requestUrl - The URL to commit the upload session
   * @param {string} conflictBehavior - Conflict behaviour option. Default is 'rename'
   * @returns The promise resolves to committed response
   */
  commit(requestUrl, conflictBehavior = "rename") {
    return __awaiter(this, void 0, void 0, function* () {
      const payload = {
        name: this.file.name,
        "@microsoft.graph.conflictBehavior": conflictBehavior,
        "@microsoft.graph.sourceUrl": this.uploadSession.url
      };
      return yield this.client.api(requestUrl).put(payload);
    });
  }
};
OneDriveLargeFileUploadTask.DEFAULT_UPLOAD_PATH = "/";

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/FileUploadTask/FileObjectClasses/StreamUpload.js
var StreamUpload = class {
  constructor(content, name, size) {
    this.content = content;
    this.name = name;
    this.size = size;
    if (!content || !name || !size) {
      throw new GraphClientError("Please provide the Readable Stream content, name of the file and size of the file");
    }
  }
  /**
   * @public
   * Slices the file content to the given range
   * @param {Range} range - The range value
   * @returns The sliced file part
   */
  sliceFile(range) {
    return __awaiter(this, void 0, void 0, function* () {
      let rangeSize = range.maxValue - range.minValue + 1;
      const bufs = [];
      if (this.previousSlice) {
        if (range.minValue < this.previousSlice.range.minValue) {
          throw new GraphClientError("An error occurred while uploading the stream. Please restart the stream upload from the first byte of the file.");
        }
        if (range.minValue < this.previousSlice.range.maxValue) {
          const previousRangeMin = this.previousSlice.range.minValue;
          const previousRangeMax = this.previousSlice.range.maxValue;
          if (range.minValue === previousRangeMin && range.maxValue === previousRangeMax) {
            return this.previousSlice.fileSlice;
          }
          if (range.maxValue === previousRangeMax) {
            return this.previousSlice.fileSlice.slice(range.minValue, range.maxValue + 1);
          }
          bufs.push(this.previousSlice.fileSlice.slice(range.minValue, previousRangeMax + 1));
          rangeSize = range.maxValue - previousRangeMax;
        }
      }
      if (this.content && this.content.readable) {
        if (this.content.readableLength >= rangeSize) {
          bufs.push(this.content.read(rangeSize));
        } else {
          bufs.push(yield this.readNBytesFromStream(rangeSize));
        }
      } else {
        throw new GraphClientError("Stream is not readable.");
      }
      const slicedChunk = Buffer.concat(bufs);
      this.previousSlice = {
        fileSlice: slicedChunk,
        range
      };
      return slicedChunk;
    });
  }
  /**
   * @private
   * Reads the specified byte size from the stream
   * @param {number} size - The size of bytes to be read
   * @returns Buffer with the given length of data.
   */
  readNBytesFromStream(size) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let remainder = size;
      let length = 0;
      this.content.on("end", () => {
        if (remainder > 0) {
          return reject(new GraphClientError("Stream ended before reading required range size"));
        }
      });
      this.content.on("readable", () => {
        let chunk;
        while (length < size && (chunk = this.content.read(remainder)) !== null) {
          length += chunk.length;
          chunks.push(chunk);
          if (remainder > 0) {
            remainder = size - length;
          }
        }
        if (length === size) {
          return resolve(Buffer.concat(chunks));
        }
        if (!this.content || !this.content.readable) {
          return reject(new GraphClientError("Error encountered while reading the stream during the upload"));
        }
      });
    });
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/tasks/PageIterator.js
var PageIterator = class {
  /**
   * @public
   * @constructor
   * Creates new instance for PageIterator
   * @param {Client} client - The graph client instance
   * @param {PageCollection} pageCollection - The page collection object
   * @param {PageIteratorCallback} callBack - The callback function
   * @param {GraphRequestOptions} requestOptions - The request options
   * @returns An instance of a PageIterator
   */
  constructor(client, pageCollection, callback, requestOptions) {
    this.client = client;
    this.collection = pageCollection.value;
    this.nextLink = pageCollection["@odata.nextLink"];
    this.deltaLink = pageCollection["@odata.deltaLink"];
    this.callback = callback;
    this.cursor = 0;
    this.complete = false;
    this.requestOptions = requestOptions;
  }
  /**
   * @private
   * Iterates over a collection by enqueuing entries one by one and kicking the callback with the enqueued entry
   * @returns A boolean indicating the continue flag to process next page
   */
  iterationHelper() {
    if (this.collection === void 0) {
      return false;
    }
    let advance = true;
    while (advance && this.cursor < this.collection.length) {
      const item = this.collection[this.cursor];
      advance = this.callback(item);
      this.cursor++;
    }
    return advance;
  }
  /**
   * @private
   * @async
   * Helper to make a get request to fetch next page with nextLink url and update the page iterator instance with the returned response
   * @returns A promise that resolves to a response data with next page collection
   */
  fetchAndUpdateNextPageData() {
    return __awaiter(this, void 0, void 0, function* () {
      let graphRequest = this.client.api(this.nextLink);
      if (this.requestOptions) {
        if (this.requestOptions.headers) {
          graphRequest = graphRequest.headers(this.requestOptions.headers);
        }
        if (this.requestOptions.middlewareOptions) {
          graphRequest = graphRequest.middlewareOptions(this.requestOptions.middlewareOptions);
        }
        if (this.requestOptions.options) {
          graphRequest = graphRequest.options(this.requestOptions.options);
        }
      }
      const response = yield graphRequest.get();
      this.collection = response.value;
      this.cursor = 0;
      this.nextLink = response["@odata.nextLink"];
      this.deltaLink = response["@odata.deltaLink"];
    });
  }
  /**
   * @public
   * Getter to get the deltaLink in the current response
   * @returns A deltaLink which is being used to make delta requests in future
   */
  getDeltaLink() {
    return this.deltaLink;
  }
  /**
   * @public
   * @async
   * Iterates over the collection and kicks callback for each item on iteration. Fetches next set of data through nextLink and iterates over again
   * This happens until the nextLink is drained out or the user responds with a red flag to continue from callback
   * @returns A Promise that resolves to nothing on completion and throws error incase of any discrepancy.
   */
  iterate() {
    return __awaiter(this, void 0, void 0, function* () {
      let advance = this.iterationHelper();
      while (advance) {
        if (this.nextLink !== void 0) {
          yield this.fetchAndUpdateNextPageData();
          advance = this.iterationHelper();
        } else {
          advance = false;
        }
      }
      if (this.nextLink === void 0 && this.cursor >= this.collection.length) {
        this.complete = true;
      }
    });
  }
  /**
   * @public
   * @async
   * To resume the iteration
   * Note: This internally calls the iterate method, It's just for more readability.
   * @returns A Promise that resolves to nothing on completion and throws error incase of any discrepancy
   */
  resume() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.iterate();
    });
  }
  /**
   * @public
   * To get the completeness status of the iterator
   * @returns Boolean indicating the completeness
   */
  isComplete() {
    return this.complete;
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/CustomAuthenticationProvider.js
var CustomAuthenticationProvider = class {
  /**
   * @public
   * @constructor
   * Creates an instance of CustomAuthenticationProvider
   * @param {AuthProviderCallback} provider - An authProvider function
   * @returns An instance of CustomAuthenticationProvider
   */
  constructor(provider) {
    this.provider = provider;
  }
  /**
   * @public
   * @async
   * To get the access token
   * @returns The promise that resolves to an access token
   */
  getAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve, reject) => {
        this.provider((error, accessToken) => __awaiter(this, void 0, void 0, function* () {
          if (accessToken) {
            resolve(accessToken);
          } else {
            if (!error) {
              const invalidTokenMessage = "Access token is undefined or empty.						Please provide a valid token.						For more help - https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CustomAuthenticationProvider.md";
              error = new GraphClientError(invalidTokenMessage);
            }
            const err = yield GraphClientError.setGraphClientError(error);
            reject(err);
          }
        }));
      });
    });
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphError.js
var GraphError = class _GraphError extends Error {
  /**
   * @public
   * @constructor
   * Creates an instance of GraphError
   * @param {number} [statusCode = -1] - The status code of the error
   * @param {string} [message] - The message of the error
   * @param {Error} [baseError] - The base error
   * @returns An instance of GraphError
   */
  constructor(statusCode = -1, message, baseError) {
    super(message || baseError && baseError.message);
    Object.setPrototypeOf(this, _GraphError.prototype);
    this.statusCode = statusCode;
    this.code = null;
    this.requestId = null;
    this.date = /* @__PURE__ */ new Date();
    this.body = null;
    this.stack = baseError ? baseError.stack : this.stack;
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphErrorHandler.js
var GraphErrorHandler = class _GraphErrorHandler {
  /**
   * @private
   * @static
   * Populates the GraphError instance with Error instance values
   * @param {Error} error - The error returned by graph service or some native error
   * @param {number} [statusCode] - The status code of the response
   * @returns The GraphError instance
   */
  static constructError(error, statusCode, rawResponse) {
    const gError = new GraphError(statusCode, "", error);
    if (error.name !== void 0) {
      gError.code = error.name;
    }
    gError.body = error.toString();
    gError.date = /* @__PURE__ */ new Date();
    gError.headers = rawResponse === null || rawResponse === void 0 ? void 0 : rawResponse.headers;
    return gError;
  }
  /**
   * @private
   * @static
   * @async
   * Populates the GraphError instance from the Error returned by graph service
   * @param {GraphAPIErrorResponse} graphError - The error possibly returned by graph service or some native error
   * @param {number} statusCode - The status code of the response
   * @returns A promise that resolves to GraphError instance
   *
   * Example error for https://graph.microsoft.com/v1.0/me/events?$top=3&$search=foo
   * {
   *      "error": {
   *          "code": "SearchEvents",
   *          "message": "The parameter $search is not currently supported on the Events resource.",
   *          "innerError": {
   *              "request-id": "b31c83fd-944c-4663-aa50-5d9ceb367e19",
   *              "date": "2016-11-17T18:37:45"
   *          }
   *      }
   *  }
   */
  static constructErrorFromResponse(graphError, statusCode, rawResponse) {
    const error = graphError.error;
    const gError = new GraphError(statusCode, error.message);
    gError.code = error.code;
    if (error.innerError !== void 0) {
      gError.requestId = error.innerError["request-id"];
      gError.date = new Date(error.innerError.date);
    }
    gError.body = JSON.stringify(error);
    gError.headers = rawResponse === null || rawResponse === void 0 ? void 0 : rawResponse.headers;
    return gError;
  }
  /**
   * @public
   * @static
   * @async
   * To get the GraphError object
   * Reference - https://docs.microsoft.com/en-us/graph/errors
   * @param {any} [error = null] - The error returned by graph service or some native error
   * @param {number} [statusCode = -1] - The status code of the response
   * @param {GraphRequestCallback} [callback] - The graph request callback function
   * @returns A promise that resolves to GraphError instance
   */
  static getError(error = null, statusCode = -1, callback, rawResponse) {
    return __awaiter(this, void 0, void 0, function* () {
      let gError;
      if (error && error.error) {
        gError = _GraphErrorHandler.constructErrorFromResponse(error, statusCode, rawResponse);
      } else if (error instanceof Error) {
        gError = _GraphErrorHandler.constructError(error, statusCode, rawResponse);
      } else {
        gError = new GraphError(statusCode);
        gError.body = error;
      }
      if (typeof callback === "function") {
        callback(gError, null);
      } else {
        return gError;
      }
    });
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/GraphRequest.js
var GraphRequest = class {
  /**
   * @public
   * @constructor
   * Creates an instance of GraphRequest
   * @param {HTTPClient} httpClient - The HTTPClient instance
   * @param {ClientOptions} config - The options for making request
   * @param {string} path - A path string
   */
  constructor(httpClient, config, path) {
    this.parsePath = (path2) => {
      if (path2.indexOf("https://") !== -1) {
        path2 = path2.replace("https://", "");
        const endOfHostStrPos = path2.indexOf("/");
        if (endOfHostStrPos !== -1) {
          this.urlComponents.host = "https://" + path2.substring(0, endOfHostStrPos);
          path2 = path2.substring(endOfHostStrPos + 1, path2.length);
        }
        const endOfVersionStrPos = path2.indexOf("/");
        if (endOfVersionStrPos !== -1) {
          this.urlComponents.version = path2.substring(0, endOfVersionStrPos);
          path2 = path2.substring(endOfVersionStrPos + 1, path2.length);
        }
      }
      if (path2.charAt(0) === "/") {
        path2 = path2.substr(1);
      }
      const queryStrPos = path2.indexOf("?");
      if (queryStrPos === -1) {
        this.urlComponents.path = path2;
      } else {
        this.urlComponents.path = path2.substr(0, queryStrPos);
        const queryParams = path2.substring(queryStrPos + 1, path2.length).split("&");
        for (const queryParam of queryParams) {
          this.parseQueryParameter(queryParam);
        }
      }
    };
    this.httpClient = httpClient;
    this.config = config;
    this.urlComponents = {
      host: this.config.baseUrl,
      version: this.config.defaultVersion,
      oDataQueryParams: {},
      otherURLQueryParams: {},
      otherURLQueryOptions: []
    };
    this._headers = {};
    this._options = {};
    this._middlewareOptions = [];
    this.parsePath(path);
  }
  /**
   * @private
   * Adds the query parameter as comma separated values
   * @param {string} propertyName - The name of a property
   * @param {string|string[]} propertyValue - The vale of a property
   * @param {IArguments} additionalProperties - The additional properties
   * @returns Nothing
   */
  addCsvQueryParameter(propertyName, propertyValue, additionalProperties) {
    this.urlComponents.oDataQueryParams[propertyName] = this.urlComponents.oDataQueryParams[propertyName] ? this.urlComponents.oDataQueryParams[propertyName] + "," : "";
    let allValues = [];
    if (additionalProperties.length > 1 && typeof propertyValue === "string") {
      allValues = Array.prototype.slice.call(additionalProperties);
    } else if (typeof propertyValue === "string") {
      allValues.push(propertyValue);
    } else {
      allValues = allValues.concat(propertyValue);
    }
    this.urlComponents.oDataQueryParams[propertyName] += allValues.join(",");
  }
  /**
   * @private
   * Builds the full url from the URLComponents to make a request
   * @returns The URL string that is qualified to make a request to graph endpoint
   */
  buildFullUrl() {
    const url = urlJoin([this.urlComponents.host, this.urlComponents.version, this.urlComponents.path]) + this.createQueryString();
    if (this.config.debugLogging) {
      console.log(url);
    }
    return url;
  }
  /**
   * @private
   * Builds the query string from the URLComponents
   * @returns The Constructed query string
   */
  createQueryString() {
    const urlComponents = this.urlComponents;
    const query = [];
    if (Object.keys(urlComponents.oDataQueryParams).length !== 0) {
      for (const property in urlComponents.oDataQueryParams) {
        if (Object.prototype.hasOwnProperty.call(urlComponents.oDataQueryParams, property)) {
          query.push(property + "=" + urlComponents.oDataQueryParams[property]);
        }
      }
    }
    if (Object.keys(urlComponents.otherURLQueryParams).length !== 0) {
      for (const property in urlComponents.otherURLQueryParams) {
        if (Object.prototype.hasOwnProperty.call(urlComponents.otherURLQueryParams, property)) {
          query.push(property + "=" + urlComponents.otherURLQueryParams[property]);
        }
      }
    }
    if (urlComponents.otherURLQueryOptions.length !== 0) {
      for (const str of urlComponents.otherURLQueryOptions) {
        query.push(str);
      }
    }
    return query.length > 0 ? "?" + query.join("&") : "";
  }
  /**
   * @private
   * Parses the query parameters to set the urlComponents property of the GraphRequest object
   * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query parameter
   * @returns The same GraphRequest instance that is being called with
   */
  parseQueryParameter(queryDictionaryOrString) {
    if (typeof queryDictionaryOrString === "string") {
      if (queryDictionaryOrString.charAt(0) === "?") {
        queryDictionaryOrString = queryDictionaryOrString.substring(1);
      }
      if (queryDictionaryOrString.indexOf("&") !== -1) {
        const queryParams = queryDictionaryOrString.split("&");
        for (const str of queryParams) {
          this.parseQueryParamenterString(str);
        }
      } else {
        this.parseQueryParamenterString(queryDictionaryOrString);
      }
    } else if (queryDictionaryOrString.constructor === Object) {
      for (const key in queryDictionaryOrString) {
        if (Object.prototype.hasOwnProperty.call(queryDictionaryOrString, key)) {
          this.setURLComponentsQueryParamater(key, queryDictionaryOrString[key]);
        }
      }
    }
    return this;
  }
  /**
   * @private
   * Parses the query parameter of string type to set the urlComponents property of the GraphRequest object
   * @param {string} queryParameter - the query parameters
   * returns nothing
   */
  parseQueryParamenterString(queryParameter) {
    if (this.isValidQueryKeyValuePair(queryParameter)) {
      const indexOfFirstEquals = queryParameter.indexOf("=");
      const paramKey = queryParameter.substring(0, indexOfFirstEquals);
      const paramValue = queryParameter.substring(indexOfFirstEquals + 1);
      this.setURLComponentsQueryParamater(paramKey, paramValue);
    } else {
      this.urlComponents.otherURLQueryOptions.push(queryParameter);
    }
  }
  /**
   * @private
   * Sets values into the urlComponents property of GraphRequest object.
   * @param {string} paramKey - the query parameter key
   * @param {string} paramValue - the query paramter value
   * @returns nothing
   */
  setURLComponentsQueryParamater(paramKey, paramValue) {
    if (oDataQueryNames.indexOf(paramKey) !== -1) {
      const currentValue = this.urlComponents.oDataQueryParams[paramKey];
      const isValueAppendable = currentValue && (paramKey === "$expand" || paramKey === "$select" || paramKey === "$orderby");
      this.urlComponents.oDataQueryParams[paramKey] = isValueAppendable ? currentValue + "," + paramValue : paramValue;
    } else {
      this.urlComponents.otherURLQueryParams[paramKey] = paramValue;
    }
  }
  /**
   * @private
   * Check if the query parameter string has a valid key-value structure
   * @param {string} queryString - the query parameter string. Example -> "name=value"
   * #returns true if the query string has a valid key-value structure else false
   */
  isValidQueryKeyValuePair(queryString) {
    const indexofFirstEquals = queryString.indexOf("=");
    if (indexofFirstEquals === -1) {
      return false;
    }
    const indexofOpeningParanthesis = queryString.indexOf("(");
    if (indexofOpeningParanthesis !== -1 && queryString.indexOf("(") < indexofFirstEquals) {
      return false;
    }
    return true;
  }
  /**
   * @private
   * Updates the custom headers and options for a request
   * @param {FetchOptions} options - The request options object
   * @returns Nothing
   */
  updateRequestOptions(options) {
    const optionsHeaders = Object.assign({}, options.headers);
    if (this.config.fetchOptions !== void 0) {
      const fetchOptions = Object.assign({}, this.config.fetchOptions);
      Object.assign(options, fetchOptions);
      if (typeof this.config.fetchOptions.headers !== void 0) {
        options.headers = Object.assign({}, this.config.fetchOptions.headers);
      }
    }
    Object.assign(options, this._options);
    if (options.headers !== void 0) {
      Object.assign(optionsHeaders, options.headers);
    }
    Object.assign(optionsHeaders, this._headers);
    options.headers = optionsHeaders;
  }
  /**
   * @private
   * @async
   * Adds the custom headers and options to the request and makes the HTTPClient send request call
   * @param {RequestInfo} request - The request url string or the Request object value
   * @param {FetchOptions} options - The options to make a request
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the response content
   */
  send(request, options, callback) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      let rawResponse;
      const middlewareControl = new MiddlewareControl(this._middlewareOptions);
      this.updateRequestOptions(options);
      const customHosts = (_a = this.config) === null || _a === void 0 ? void 0 : _a.customHosts;
      try {
        const context = yield this.httpClient.sendRequest({
          request,
          options,
          middlewareControl,
          customHosts
        });
        rawResponse = context.response;
        const response = yield GraphResponseHandler.getResponse(rawResponse, this._responseType, callback);
        return response;
      } catch (error) {
        if (error instanceof GraphClientError) {
          throw error;
        }
        let statusCode;
        if (rawResponse) {
          statusCode = rawResponse.status;
        }
        const gError = yield GraphErrorHandler.getError(error, statusCode, callback, rawResponse);
        throw gError;
      }
    });
  }
  /**
   * @private
   * Checks if the content-type is present in the _headers property. If not present, defaults the content-type to application/json
   * @param none
   * @returns nothing
   */
  setHeaderContentType() {
    if (!this._headers) {
      this.header("Content-Type", "application/json");
      return;
    }
    const headerKeys = Object.keys(this._headers);
    for (const headerKey of headerKeys) {
      if (headerKey.toLowerCase() === "content-type") {
        return;
      }
    }
    this.header("Content-Type", "application/json");
  }
  /**
   * @public
   * Sets the custom header for a request
   * @param {string} headerKey - A header key
   * @param {string} headerValue - A header value
   * @returns The same GraphRequest instance that is being called with
   */
  header(headerKey, headerValue) {
    this._headers[headerKey] = headerValue;
    return this;
  }
  /**
   * @public
   * Sets the custom headers for a request
   * @param {KeyValuePairObjectStringNumber | HeadersInit} headers - The request headers
   * @returns The same GraphRequest instance that is being called with
   */
  headers(headers) {
    for (const key in headers) {
      if (Object.prototype.hasOwnProperty.call(headers, key)) {
        this._headers[key] = headers[key];
      }
    }
    return this;
  }
  /**
   * @public
   * Sets the option for making a request
   * @param {string} key - The key value
   * @param {any} value - The value
   * @returns The same GraphRequest instance that is being called with
   */
  option(key, value) {
    this._options[key] = value;
    return this;
  }
  /**
   * @public
   * Sets the options for making a request
   * @param {{ [key: string]: any }} options - The options key value pair
   * @returns The same GraphRequest instance that is being called with
   */
  options(options) {
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        this._options[key] = options[key];
      }
    }
    return this;
  }
  /**
   * @public
   * Sets the middleware options for a request
   * @param {MiddlewareOptions[]} options - The array of middleware options
   * @returns The same GraphRequest instance that is being called with
   */
  middlewareOptions(options) {
    this._middlewareOptions = options;
    return this;
  }
  /**
   * @public
   * Sets the api endpoint version for a request
   * @param {string} version - The version value
   * @returns The same GraphRequest instance that is being called with
   */
  version(version) {
    this.urlComponents.version = version;
    return this;
  }
  /**
   * @public
   * Sets the api endpoint version for a request
   * @param {ResponseType} responseType - The response type value
   * @returns The same GraphRequest instance that is being called with
   */
  responseType(responseType) {
    this._responseType = responseType;
    return this;
  }
  /**
   * @public
   * To add properties for select OData Query param
   * @param {string|string[]} properties - The Properties value
   * @returns The same GraphRequest instance that is being called with, after adding the properties for $select query
   */
  /*
   * Accepts .select("displayName,birthday")
   *     and .select(["displayName", "birthday"])
   *     and .select("displayName", "birthday")
   *
   */
  select(properties) {
    this.addCsvQueryParameter("$select", properties, arguments);
    return this;
  }
  /**
   * @public
   * To add properties for expand OData Query param
   * @param {string|string[]} properties - The Properties value
   * @returns The same GraphRequest instance that is being called with, after adding the properties for $expand query
   */
  expand(properties) {
    this.addCsvQueryParameter("$expand", properties, arguments);
    return this;
  }
  /**
   * @public
   * To add properties for orderby OData Query param
   * @param {string|string[]} properties - The Properties value
   * @returns The same GraphRequest instance that is being called with, after adding the properties for $orderby query
   */
  orderby(properties) {
    this.addCsvQueryParameter("$orderby", properties, arguments);
    return this;
  }
  /**
   * @public
   * To add query string for filter OData Query param. The request URL accepts only one $filter Odata Query option and its value is set to the most recently passed filter query string.
   * @param {string} filterStr - The filter query string
   * @returns The same GraphRequest instance that is being called with, after adding the $filter query
   */
  filter(filterStr) {
    this.urlComponents.oDataQueryParams.$filter = filterStr;
    return this;
  }
  /**
   * @public
   * To add criterion for search OData Query param. The request URL accepts only one $search Odata Query option and its value is set to the most recently passed search criterion string.
   * @param {string} searchStr - The search criterion string
   * @returns The same GraphRequest instance that is being called with, after adding the $search query criteria
   */
  search(searchStr) {
    this.urlComponents.oDataQueryParams.$search = searchStr;
    return this;
  }
  /**
   * @public
   * To add number for top OData Query param. The request URL accepts only one $top Odata Query option and its value is set to the most recently passed number value.
   * @param {number} n - The number value
   * @returns The same GraphRequest instance that is being called with, after adding the number for $top query
   */
  top(n) {
    this.urlComponents.oDataQueryParams.$top = n;
    return this;
  }
  /**
   * @public
   * To add number for skip OData Query param. The request URL accepts only one $skip Odata Query option and its value is set to the most recently passed number value.
   * @param {number} n - The number value
   * @returns The same GraphRequest instance that is being called with, after adding the number for the $skip query
   */
  skip(n) {
    this.urlComponents.oDataQueryParams.$skip = n;
    return this;
  }
  /**
   * @public
   * To add token string for skipToken OData Query param. The request URL accepts only one $skipToken Odata Query option and its value is set to the most recently passed token value.
   * @param {string} token - The token value
   * @returns The same GraphRequest instance that is being called with, after adding the token string for $skipToken query option
   */
  skipToken(token) {
    this.urlComponents.oDataQueryParams.$skipToken = token;
    return this;
  }
  /**
   * @public
   * To add boolean for count OData Query param. The URL accepts only one $count Odata Query option and its value is set to the most recently passed boolean value.
   * @param {boolean} isCount - The count boolean
   * @returns The same GraphRequest instance that is being called with, after adding the boolean value for the $count query option
   */
  count(isCount = true) {
    this.urlComponents.oDataQueryParams.$count = isCount.toString();
    return this;
  }
  /**
   * @public
   * Appends query string to the urlComponent
   * @param {string|KeyValuePairObjectStringNumber} queryDictionaryOrString - The query value
   * @returns The same GraphRequest instance that is being called with, after appending the query string to the url component
   */
  /*
   * Accepts .query("displayName=xyz")
   *     and .select({ name: "value" })
   */
  query(queryDictionaryOrString) {
    return this.parseQueryParameter(queryDictionaryOrString);
  }
  /**
   * @public
   * @async
   * Makes a http request with GET method
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the get response
   */
  get(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = this.buildFullUrl();
      const options = {
        method: RequestMethod.GET
      };
      const response = yield this.send(url, options, callback);
      return response;
    });
  }
  /**
   * @public
   * @async
   * Makes a http request with POST method
   * @param {any} content - The content that needs to be sent with the request
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the post response
   */
  post(content, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = this.buildFullUrl();
      const options = {
        method: RequestMethod.POST,
        body: serializeContent(content)
      };
      const className = content && content.constructor && content.constructor.name;
      if (className === "FormData") {
        options.headers = {};
      } else {
        this.setHeaderContentType();
        options.headers = this._headers;
      }
      return yield this.send(url, options, callback);
    });
  }
  /**
   * @public
   * @async
   * Alias for Post request call
   * @param {any} content - The content that needs to be sent with the request
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the post response
   */
  create(content, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.post(content, callback);
    });
  }
  /**
   * @public
   * @async
   * Makes http request with PUT method
   * @param {any} content - The content that needs to be sent with the request
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the put response
   */
  put(content, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = this.buildFullUrl();
      this.setHeaderContentType();
      const options = {
        method: RequestMethod.PUT,
        body: serializeContent(content)
      };
      return yield this.send(url, options, callback);
    });
  }
  /**
   * @public
   * @async
   * Makes http request with PATCH method
   * @param {any} content - The content that needs to be sent with the request
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the patch response
   */
  patch(content, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = this.buildFullUrl();
      this.setHeaderContentType();
      const options = {
        method: RequestMethod.PATCH,
        body: serializeContent(content)
      };
      return yield this.send(url, options, callback);
    });
  }
  /**
   * @public
   * @async
   * Alias for PATCH request
   * @param {any} content - The content that needs to be sent with the request
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the patch response
   */
  update(content, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.patch(content, callback);
    });
  }
  /**
   * @public
   * @async
   * Makes http request with DELETE method
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the delete response
   */
  delete(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = this.buildFullUrl();
      const options = {
        method: RequestMethod.DELETE
      };
      return yield this.send(url, options, callback);
    });
  }
  /**
   * @public
   * @async
   * Alias for delete request call
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the delete response
   */
  del(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.delete(callback);
    });
  }
  /**
   * @public
   * @async
   * Makes a http request with GET method to read response as a stream.
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the getStream response
   */
  getStream(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = this.buildFullUrl();
      const options = {
        method: RequestMethod.GET
      };
      this.responseType(ResponseType.STREAM);
      return yield this.send(url, options, callback);
    });
  }
  /**
   * @public
   * @async
   * Makes a http request with GET method to read response as a stream.
   * @param {any} stream - The stream instance
   * @param {GraphRequestCallback} [callback] - The callback function to be called in response with async call
   * @returns A promise that resolves to the putStream response
   */
  putStream(stream, callback) {
    return __awaiter(this, void 0, void 0, function* () {
      const url = this.buildFullUrl();
      const options = {
        method: RequestMethod.PUT,
        headers: {
          "Content-Type": "application/octet-stream"
        },
        body: stream
      };
      return yield this.send(url, options, callback);
    });
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/HTTPClient.js
var HTTPClient = class {
  /**
   * @public
   * @constructor
   * Creates an instance of a HTTPClient
   * @param {...Middleware} middleware - The first middleware of the middleware chain or a sequence of all the Middleware handlers
   */
  constructor(...middleware) {
    if (!middleware || !middleware.length) {
      const error = new Error();
      error.name = "InvalidMiddlewareChain";
      error.message = "Please provide a default middleware chain or custom middleware chain";
      throw error;
    }
    this.setMiddleware(...middleware);
  }
  /**
   * @private
   * Processes the middleware parameter passed to set this.middleware property
   * The calling function should validate if middleware is not undefined or not empty.
   * @param {...Middleware} middleware - The middleware passed
   * @returns Nothing
   */
  setMiddleware(...middleware) {
    if (middleware.length > 1) {
      this.parseMiddleWareArray(middleware);
    } else {
      this.middleware = middleware[0];
    }
  }
  /**
   * @private
   * Processes the middleware array to construct the chain
   * and sets this.middleware property to the first middleware handler of the array
   * The calling function should validate if middleware is not undefined or not empty
   * @param {Middleware[]} middlewareArray - The array of middleware handlers
   * @returns Nothing
   */
  parseMiddleWareArray(middlewareArray) {
    middlewareArray.forEach((element, index) => {
      if (index < middlewareArray.length - 1) {
        element.setNext(middlewareArray[index + 1]);
      }
    });
    this.middleware = middlewareArray[0];
  }
  /**
   * @public
   * @async
   * To send the request through the middleware chain
   * @param {Context} context - The context of a request
   * @returns A promise that resolves to the Context
   */
  sendRequest(context) {
    return __awaiter(this, void 0, void 0, function* () {
      if (typeof context.request === "string" && context.options === void 0) {
        const error = new Error();
        error.name = "InvalidRequestOptions";
        error.message = "Unable to execute the middleware, Please provide valid options for a request";
        throw error;
      }
      yield this.middleware.execute(context);
      return context;
    });
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/HTTPClientFactory.js
var isNodeEnvironment2 = () => {
  return typeof process === "object" && typeof __require === "function";
};
var HTTPClientFactory = class _HTTPClientFactory {
  /**
   * @public
   * @static
   * Creates HTTPClient with default middleware chain
   * @param {AuthenticationProvider} authProvider - The authentication provider instance
   * @returns A HTTPClient instance
   *
   * NOTE: These are the things that we need to remember while doing modifications in the below default pipeline.
   * 		* HTTPMessageHandler should be the last one in the middleware pipeline, because this makes the actual network call of the request
   * 		* TelemetryHandler should be the one prior to the last middleware in the chain, because this is the one which actually collects and appends the usage flag and placing this handler 	*		  before making the actual network call ensures that the usage of all features are recorded in the flag.
   * 		* The best place for AuthenticationHandler is in the starting of the pipeline, because every other handler might have to work for multiple times for a request but the auth token for
   * 		  them will remain same. For example, Retry and Redirect handlers might be working multiple times for a request based on the response but their auth token would remain same.
   */
  static createWithAuthenticationProvider(authProvider) {
    const authenticationHandler = new AuthenticationHandler(authProvider);
    const retryHandler = new RetryHandler(new RetryHandlerOptions());
    const telemetryHandler = new TelemetryHandler();
    const httpMessageHandler = new HTTPMessageHandler();
    authenticationHandler.setNext(retryHandler);
    if (isNodeEnvironment2()) {
      const redirectHandler = new RedirectHandler(new RedirectHandlerOptions());
      retryHandler.setNext(redirectHandler);
      redirectHandler.setNext(telemetryHandler);
    } else {
      retryHandler.setNext(telemetryHandler);
    }
    telemetryHandler.setNext(httpMessageHandler);
    return _HTTPClientFactory.createWithMiddleware(authenticationHandler);
  }
  /**
   * @public
   * @static
   * Creates a middleware chain with the given one
   * @property {...Middleware} middleware - The first middleware of the middleware chain or a sequence of all the Middleware handlers
   * @returns A HTTPClient instance
   */
  static createWithMiddleware(...middleware) {
    return new HTTPClient(...middleware);
  }
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/ValidatePolyFilling.js
var validatePolyFilling = () => {
  if (typeof Promise === "undefined" && typeof fetch === "undefined") {
    const error = new Error("Library cannot function without Promise and fetch. So, please provide polyfill for them.");
    error.name = "PolyFillNotAvailable";
    throw error;
  } else if (typeof Promise === "undefined") {
    const error = new Error("Library cannot function without Promise. So, please provide polyfill for it.");
    error.name = "PolyFillNotAvailable";
    throw error;
  } else if (typeof fetch === "undefined") {
    const error = new Error("Library cannot function without fetch. So, please provide polyfill for it.");
    error.name = "PolyFillNotAvailable";
    throw error;
  }
  return true;
};

// node_modules/@microsoft/microsoft-graph-client/lib/es/src/Client.js
var Client = class _Client {
  /**
   * @public
   * @static
   * To create a client instance with options and initializes the default middleware chain
   * @param {Options} options - The options for client instance
   * @returns The Client instance
   */
  static init(options) {
    const clientOptions = {};
    for (const i in options) {
      if (Object.prototype.hasOwnProperty.call(options, i)) {
        clientOptions[i] = i === "authProvider" ? new CustomAuthenticationProvider(options[i]) : options[i];
      }
    }
    return _Client.initWithMiddleware(clientOptions);
  }
  /**
   * @public
   * @static
   * To create a client instance with the Client Options
   * @param {ClientOptions} clientOptions - The options object for initializing the client
   * @returns The Client instance
   */
  static initWithMiddleware(clientOptions) {
    return new _Client(clientOptions);
  }
  /**
   * @private
   * @constructor
   * Creates an instance of Client
   * @param {ClientOptions} clientOptions - The options to instantiate the client object
   */
  constructor(clientOptions) {
    this.config = {
      baseUrl: GRAPH_BASE_URL,
      debugLogging: false,
      defaultVersion: GRAPH_API_VERSION
    };
    validatePolyFilling();
    for (const key in clientOptions) {
      if (Object.prototype.hasOwnProperty.call(clientOptions, key)) {
        this.config[key] = clientOptions[key];
      }
    }
    let httpClient;
    if (clientOptions.authProvider !== void 0 && clientOptions.middleware !== void 0) {
      const error = new Error();
      error.name = "AmbiguityInInitialization";
      error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain not both";
      throw error;
    } else if (clientOptions.authProvider !== void 0) {
      httpClient = HTTPClientFactory.createWithAuthenticationProvider(clientOptions.authProvider);
    } else if (clientOptions.middleware !== void 0) {
      httpClient = new HTTPClient(...[].concat(clientOptions.middleware));
    } else {
      const error = new Error();
      error.name = "InvalidMiddlewareChain";
      error.message = "Unable to Create Client, Please provide either authentication provider for default middleware chain or custom middleware chain";
      throw error;
    }
    this.httpClient = httpClient;
  }
  /**
   * @public
   * Entry point to make requests
   * @param {string} path - The path string value
   * @returns The graph request instance
   */
  api(path) {
    return new GraphRequest(this.httpClient, this.config, path);
  }
};
export {
  AuthenticationHandler,
  AuthenticationHandlerOptions,
  BatchRequestContent,
  BatchResponseContent,
  ChaosHandler,
  ChaosHandlerOptions,
  ChaosStrategy,
  Client,
  CustomAuthenticationProvider,
  FeatureUsageFlag,
  FileUpload,
  GraphClientError,
  GraphError,
  GraphRequest,
  HTTPMessageHandler,
  LargeFileUploadTask,
  MiddlewareFactory,
  OneDriveLargeFileUploadTask,
  PageIterator,
  Range,
  RedirectHandler,
  RedirectHandlerOptions,
  ResponseType,
  RetryHandler,
  RetryHandlerOptions,
  StreamUpload,
  TelemetryHandler,
  TelemetryHandlerOptions,
  UploadResult,
  getValidRangeSize
};
//# sourceMappingURL=@microsoft_microsoft-graph-client.js.map
