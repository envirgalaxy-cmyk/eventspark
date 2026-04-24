var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a;
import { P as ProtocolError, T as TimeoutWaitingForResponseErrorCode, d as utf8ToBytes, E as ExternalError, M as MissingRootKeyErrorCode, C as Certificate, l as lookupResultToBuffer, R as RequestStatusResponseStatus, U as UnknownError, e as RequestStatusDoneNoReplyErrorCode, f as RejectError, g as CertifiedRejectErrorCode, h as UNREACHABLE_ERROR, i as InputError, k as InvalidReadStateRequestErrorCode, m as ReadRequestType, n as Principal, o as IDL, p as MissingCanisterIdErrorCode, H as HttpAgent, q as encode, Q as QueryResponseStatus, s as UncertifiedRejectErrorCode, t as isV3ResponseBody, v as isV2ResponseBody, w as UncertifiedRejectUpdateErrorCode, x as UnexpectedErrorCode, y as decode, S as Subscribable, z as pendingThenable, A as resolveEnabled, D as shallowEqualObjects, F as resolveStaleTime, G as noop, J as environmentManager, K as isValidTimeout, N as timeUntilStale, O as timeoutManager, V as focusManager, W as fetchState, Y as replaceData, _ as notifyManager, r as reactExports, $ as shouldThrowError, a0 as useQueryClient, a1 as useInternetIdentity, a2 as createActorWithConfig, c as createLucideIcon, j as jsxRuntimeExports, b as cn, a3 as Record, a4 as Variant, a5 as Vec, a6 as Service, a7 as Func, a8 as Nat, a9 as Text, aa as Opt, ab as Int, ac as Float64, ad as useParams, B as Button, L as Link, X, ae as Linkedin, I as Input, af as ue } from "./index-BV_UP3b9.js";
import { s as sampleEvents, a as sampleTicketTiers, b as sampleReviews, B as Badge } from "./sampleEvents-BX7lNiZr.js";
import { H as Heart, C as Calendar, d as StarRating, c as CountdownTimer, U as Users, a as Card, e as CardHeader, f as CardTitle, b as CardContent, S as Star } from "./StarRating-ClFg-aro.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-8qPPlSfM.js";
import { L as Label } from "./label-Y5Mqef9e.js";
import { T as Textarea } from "./textarea-WK_3Szce.js";
import { u as useFavorites } from "./useFavorites-CqDsFOro.js";
import { M as MapPin } from "./map-pin-_Y7De1KV.js";
import { m as motion } from "./proxy-Ba3TeJxd.js";
import { C as Check } from "./Combination-DtENurLZ.js";
import "./clock-DcPweK9z.js";
const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1e3;
function defaultStrategy() {
  return chain(conditionalDelay(once(), 1e3), backoff(1e3, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
function once() {
  let first = true;
  return async () => {
    if (first) {
      first = false;
      return true;
    }
    return false;
  };
}
function conditionalDelay(condition, timeInMsec) {
  return async (canisterId, requestId, status) => {
    if (await condition(canisterId, requestId, status)) {
      return new Promise((resolve) => setTimeout(resolve, timeInMsec));
    }
  };
}
function timeout(timeInMsec) {
  const end = Date.now() + timeInMsec;
  return async (_canisterId, requestId, status) => {
    if (Date.now() > end) {
      throw ProtocolError.fromCode(new TimeoutWaitingForResponseErrorCode(`Request timed out after ${timeInMsec} msec`, requestId, status));
    }
  };
}
function backoff(startingThrottleInMsec, backoffFactor) {
  let currentThrottling = startingThrottleInMsec;
  return () => new Promise((resolve) => setTimeout(() => {
    currentThrottling *= backoffFactor;
    resolve();
  }, currentThrottling));
}
function chain(...strategies) {
  return async (canisterId, requestId, status) => {
    for (const a of strategies) {
      await a(canisterId, requestId, status);
    }
  };
}
const DEFAULT_POLLING_OPTIONS = {
  preSignReadStateRequest: false
};
function hasProperty(value, property) {
  return Object.prototype.hasOwnProperty.call(value, property);
}
function isObjectWithProperty(value, property) {
  return value !== null && typeof value === "object" && hasProperty(value, property);
}
function hasFunction(value, property) {
  return hasProperty(value, property) && typeof value[property] === "function";
}
function isSignedReadStateRequestWithExpiry(value) {
  return isObjectWithProperty(value, "body") && isObjectWithProperty(value.body, "content") && value.body.content.request_type === ReadRequestType.ReadState && isObjectWithProperty(value.body.content, "ingress_expiry") && typeof value.body.content.ingress_expiry === "object" && value.body.content.ingress_expiry !== null && hasFunction(value.body.content.ingress_expiry, "toHash");
}
async function pollForResponse(agent, canisterId, requestId, options = {}) {
  const path = [utf8ToBytes("request_status"), requestId];
  let state;
  let currentRequest;
  const preSignReadStateRequest = options.preSignReadStateRequest ?? false;
  if (preSignReadStateRequest) {
    currentRequest = await constructRequest({
      paths: [path],
      agent,
      pollingOptions: options
    });
    state = await agent.readState(canisterId, { paths: [path] }, void 0, currentRequest);
  } else {
    state = await agent.readState(canisterId, { paths: [path] });
  }
  if (agent.rootKey == null) {
    throw ExternalError.fromCode(new MissingRootKeyErrorCode());
  }
  const cert = await Certificate.create({
    certificate: state.certificate,
    rootKey: agent.rootKey,
    canisterId,
    blsVerify: options.blsVerify,
    agent
  });
  const maybeBuf = lookupResultToBuffer(cert.lookup_path([...path, utf8ToBytes("status")]));
  let status;
  if (typeof maybeBuf === "undefined") {
    status = RequestStatusResponseStatus.Unknown;
  } else {
    status = new TextDecoder().decode(maybeBuf);
  }
  switch (status) {
    case RequestStatusResponseStatus.Replied: {
      return {
        reply: lookupResultToBuffer(cert.lookup_path([...path, "reply"])),
        certificate: cert
      };
    }
    case RequestStatusResponseStatus.Received:
    case RequestStatusResponseStatus.Unknown:
    case RequestStatusResponseStatus.Processing: {
      const strategy = options.strategy ?? defaultStrategy();
      await strategy(canisterId, requestId, status);
      return pollForResponse(agent, canisterId, requestId, {
        ...options,
        // Pass over either the strategy already provided or the new one created above
        strategy,
        request: currentRequest
      });
    }
    case RequestStatusResponseStatus.Rejected: {
      const rejectCode = new Uint8Array(lookupResultToBuffer(cert.lookup_path([...path, "reject_code"])))[0];
      const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(cert.lookup_path([...path, "reject_message"])));
      const errorCodeBuf = lookupResultToBuffer(cert.lookup_path([...path, "error_code"]));
      const errorCode = errorCodeBuf ? new TextDecoder().decode(errorCodeBuf) : void 0;
      throw RejectError.fromCode(new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, errorCode));
    }
    case RequestStatusResponseStatus.Done:
      throw UnknownError.fromCode(new RequestStatusDoneNoReplyErrorCode(requestId));
  }
  throw UNREACHABLE_ERROR;
}
async function constructRequest(options) {
  var _a2;
  const { paths, agent, pollingOptions } = options;
  if (pollingOptions.request && isSignedReadStateRequestWithExpiry(pollingOptions.request)) {
    return pollingOptions.request;
  }
  const request = await ((_a2 = agent.createReadStateRequest) == null ? void 0 : _a2.call(agent, {
    paths
  }, void 0));
  if (!isSignedReadStateRequestWithExpiry(request)) {
    throw InputError.fromCode(new InvalidReadStateRequestErrorCode(request));
  }
  return request;
}
const metadataSymbol = Symbol.for("ic-agent-metadata");
class Actor {
  /**
   * Get the Agent class this Actor would call, or undefined if the Actor would use
   * the default agent (global.ic.agent).
   * @param actor The actor to get the agent of.
   */
  static agentOf(actor) {
    return actor[metadataSymbol].config.agent;
  }
  /**
   * Get the interface of an actor, in the form of an instance of a Service.
   * @param actor The actor to get the interface of.
   */
  static interfaceOf(actor) {
    return actor[metadataSymbol].service;
  }
  static canisterIdOf(actor) {
    return Principal.from(actor[metadataSymbol].config.canisterId);
  }
  static createActorClass(interfaceFactory, options) {
    const service = interfaceFactory({ IDL });
    class CanisterActor extends Actor {
      constructor(config) {
        if (!config.canisterId) {
          throw InputError.fromCode(new MissingCanisterIdErrorCode(config.canisterId));
        }
        const canisterId = typeof config.canisterId === "string" ? Principal.fromText(config.canisterId) : config.canisterId;
        super({
          config: {
            ...DEFAULT_ACTOR_CONFIG,
            ...config,
            canisterId
          },
          service
        });
        for (const [methodName, func] of service._fields) {
          if (options == null ? void 0 : options.httpDetails) {
            func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
          }
          if (options == null ? void 0 : options.certificate) {
            func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
          }
          this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
        }
      }
    }
    return CanisterActor;
  }
  /**
   * Creates an actor with the given interface factory and configuration.
   *
   * The [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package can be used to generate the interface factory for your canister.
   * @param interfaceFactory - the interface factory for the actor, typically generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package
   * @param configuration - the configuration for the actor
   * @returns an actor with the given interface factory and configuration
   * @example
   * Using the interface factory generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { Actor, HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { idlFactory } from './api/declarations/hello-world.did';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = Actor.createActor(idlFactory, {
   *   agent,
   *   canisterId,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   * @example
   * Using the `createActor` wrapper function generated by the [`@icp-sdk/bindgen`](https://js.icp.build/bindgen/) package:
   * ```ts
   * import { HttpAgent } from '@icp-sdk/core/agent';
   * import { Principal } from '@icp-sdk/core/principal';
   * import { createActor } from './api/hello-world';
   *
   * const canisterId = Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai');
   *
   * const agent = await HttpAgent.create({
   *   host: 'https://icp-api.io',
   * });
   *
   * const actor = createActor(canisterId, {
   *   agent,
   * });
   *
   * const response = await actor.greet('world');
   * console.log(response);
   * ```
   */
  static createActor(interfaceFactory, configuration) {
    if (!configuration.canisterId) {
      throw InputError.fromCode(new MissingCanisterIdErrorCode(configuration.canisterId));
    }
    return new (this.createActorClass(interfaceFactory))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @deprecated - use createActor with actorClassOptions instead
   */
  static createActorWithHttpDetails(interfaceFactory, configuration) {
    return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
  }
  /**
   * Returns an actor with methods that return the http response details along with the result
   * @param interfaceFactory - the interface factory for the actor
   * @param configuration - the configuration for the actor
   * @param actorClassOptions - options for the actor class extended details to return with the result
   */
  static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
    httpDetails: true,
    certificate: true
  }) {
    return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
  }
  constructor(metadata) {
    this[metadataSymbol] = Object.freeze(metadata);
  }
}
function decodeReturnValue(types, msg) {
  const returnValues = decode(types, msg);
  switch (returnValues.length) {
    case 0:
      return void 0;
    case 1:
      return returnValues[0];
    default:
      return returnValues;
  }
}
const DEFAULT_ACTOR_CONFIG = {
  pollingOptions: DEFAULT_POLLING_OPTIONS
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = "http-details";
const ACTOR_METHOD_WITH_CERTIFICATE = "certificate";
function _createActorMethod(actor, methodName, func, blsVerify) {
  let caller;
  if (func.annotations.includes("query") || func.annotations.includes("composite_query")) {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).queryTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || new HttpAgent();
      const cid = Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
      const arg = encode(func.argTypes, args);
      const result = await agent.query(cid, {
        methodName,
        arg,
        effectiveCanisterId: options.effectiveCanisterId
      });
      const httpDetails = {
        ...result.httpDetails,
        requestDetails: result.requestDetails
      };
      switch (result.status) {
        case QueryResponseStatus.Rejected: {
          const uncertifiedRejectErrorCode = new UncertifiedRejectErrorCode(result.requestId, result.reject_code, result.reject_message, result.error_code, result.signatures);
          uncertifiedRejectErrorCode.callContext = {
            canisterId: cid,
            methodName,
            httpDetails
          };
          throw RejectError.fromCode(uncertifiedRejectErrorCode);
        }
        case QueryResponseStatus.Replied:
          return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS) ? {
            httpDetails,
            result: decodeReturnValue(func.retTypes, result.reply.arg)
          } : decodeReturnValue(func.retTypes, result.reply.arg);
      }
    };
  } else {
    caller = async (options, ...args) => {
      var _a2, _b;
      options = {
        ...options,
        ...(_b = (_a2 = actor[metadataSymbol].config).callTransform) == null ? void 0 : _b.call(_a2, methodName, args, {
          ...actor[metadataSymbol].config,
          ...options
        })
      };
      const agent = options.agent || actor[metadataSymbol].config.agent || HttpAgent.createSync();
      const { canisterId, effectiveCanisterId, pollingOptions } = {
        ...DEFAULT_ACTOR_CONFIG,
        ...actor[metadataSymbol].config,
        ...options
      };
      const cid = Principal.from(canisterId);
      const ecid = effectiveCanisterId !== void 0 ? Principal.from(effectiveCanisterId) : cid;
      const arg = encode(func.argTypes, args);
      const { requestId, response, requestDetails } = await agent.call(cid, {
        methodName,
        arg,
        effectiveCanisterId: ecid,
        nonce: options.nonce
      });
      let reply;
      let certificate;
      if (isV3ResponseBody(response.body)) {
        if (agent.rootKey == null) {
          throw ExternalError.fromCode(new MissingRootKeyErrorCode());
        }
        const cert = response.body.certificate;
        certificate = await Certificate.create({
          certificate: cert,
          rootKey: agent.rootKey,
          canisterId: ecid,
          blsVerify,
          agent
        });
        const path = [utf8ToBytes("request_status"), requestId];
        const status = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "status"])));
        switch (status) {
          case "replied":
            reply = lookupResultToBuffer(certificate.lookup_path([...path, "reply"]));
            break;
          case "rejected": {
            const rejectCode = new Uint8Array(lookupResultToBuffer(certificate.lookup_path([...path, "reject_code"])))[0];
            const rejectMessage = new TextDecoder().decode(lookupResultToBuffer(certificate.lookup_path([...path, "reject_message"])));
            const error_code_buf = lookupResultToBuffer(certificate.lookup_path([...path, "error_code"]));
            const error_code = error_code_buf ? new TextDecoder().decode(error_code_buf) : void 0;
            const certifiedRejectErrorCode = new CertifiedRejectErrorCode(requestId, rejectCode, rejectMessage, error_code);
            certifiedRejectErrorCode.callContext = {
              canisterId: cid,
              methodName,
              httpDetails: response
            };
            throw RejectError.fromCode(certifiedRejectErrorCode);
          }
        }
      } else if (isV2ResponseBody(response.body)) {
        const { reject_code, reject_message, error_code } = response.body;
        const errorCode = new UncertifiedRejectUpdateErrorCode(requestId, reject_code, reject_message, error_code);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails: response
        };
        throw RejectError.fromCode(errorCode);
      }
      if (response.status === 202) {
        const pollOptions = {
          ...pollingOptions,
          blsVerify
        };
        const response2 = await pollForResponse(agent, ecid, requestId, pollOptions);
        certificate = response2.certificate;
        reply = response2.reply;
      }
      const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
      const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
      const httpDetails = { ...response, requestDetails };
      if (reply !== void 0) {
        if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
          return {
            httpDetails,
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeCertificate) {
          return {
            certificate,
            result: decodeReturnValue(func.retTypes, reply)
          };
        } else if (shouldIncludeHttpDetails) {
          return {
            httpDetails,
            result: decodeReturnValue(func.retTypes, reply)
          };
        }
        return decodeReturnValue(func.retTypes, reply);
      } else {
        const errorCode = new UnexpectedErrorCode(`Call was returned undefined. We cannot determine if the call was successful or not. Return types: [${func.retTypes.map((t) => t.display()).join(",")}].`);
        errorCode.callContext = {
          canisterId: cid,
          methodName,
          httpDetails
        };
        throw UnknownError.fromCode(errorCode);
      }
    };
  }
  const handler = (...args) => caller({}, ...args);
  handler.withOptions = (options) => (...args) => caller(options, ...args);
  return handler;
}
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout2 = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout2));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function hasAccessControl(actor) {
  return typeof actor === "object" && actor !== null && "_initializeAccessControl" in actor;
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2);
      }
      const actorOptions = {
        agentOptions: {
          identity
        }
      };
      const actor = await createActorWithConfig(createActor2, actorOptions);
      if (hasAccessControl(actor)) {
        await actor._initializeAccessControl();
      }
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z", key: "1jg4f8" }
  ]
];
const Facebook = createLucideIcon("facebook", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const Review = Record({
  "id": Nat,
  "eventId": Nat,
  "date": Int,
  "authorName": Text,
  "comment": Text,
  "rating": Nat
});
const Booking = Record({
  "id": Text,
  "eventId": Nat,
  "confirmationCode": Text,
  "tierId": Nat,
  "attendeeName": Text,
  "attendeeEmail": Text,
  "createdAt": Int,
  "attendeePhone": Text,
  "quantity": Nat,
  "totalPrice": Float64
});
const Result = Variant({ "ok": Booking, "err": Text });
const EventPublic = Record({
  "id": Nat,
  "title": Text,
  "venue": Text,
  "city": Text,
  "date": Int,
  "description": Text,
  "imageUrl": Text,
  "availableSeats": Nat,
  "category": Text,
  "rating": Float64,
  "capacity": Nat,
  "price": Float64,
  "reviewCount": Nat,
  "location": Text
});
const TicketTierPublic = Record({
  "id": Nat,
  "eventId": Nat,
  "total": Nat,
  "name": Text,
  "available": Nat,
  "benefits": Vec(Text),
  "price": Float64
});
Service({
  "addReview": Func([Nat, Text, Nat, Text], [Review], []),
  "createBooking": Func(
    [Nat, Nat, Nat, Text, Text, Text],
    [Result],
    []
  ),
  "getEvent": Func([Nat], [Opt(EventPublic)], ["query"]),
  "getEvents": Func([], [Vec(EventPublic)], ["query"]),
  "getEventsByCategory": Func(
    [Text],
    [Vec(EventPublic)],
    ["query"]
  ),
  "getReviews": Func([Nat], [Vec(Review)], ["query"]),
  "getTicketTiers": Func(
    [Nat],
    [Vec(TicketTierPublic)],
    ["query"]
  )
});
const idlFactory = ({ IDL: IDL2 }) => {
  const Review2 = IDL2.Record({
    "id": IDL2.Nat,
    "eventId": IDL2.Nat,
    "date": IDL2.Int,
    "authorName": IDL2.Text,
    "comment": IDL2.Text,
    "rating": IDL2.Nat
  });
  const Booking2 = IDL2.Record({
    "id": IDL2.Text,
    "eventId": IDL2.Nat,
    "confirmationCode": IDL2.Text,
    "tierId": IDL2.Nat,
    "attendeeName": IDL2.Text,
    "attendeeEmail": IDL2.Text,
    "createdAt": IDL2.Int,
    "attendeePhone": IDL2.Text,
    "quantity": IDL2.Nat,
    "totalPrice": IDL2.Float64
  });
  const Result2 = IDL2.Variant({ "ok": Booking2, "err": IDL2.Text });
  const EventPublic2 = IDL2.Record({
    "id": IDL2.Nat,
    "title": IDL2.Text,
    "venue": IDL2.Text,
    "city": IDL2.Text,
    "date": IDL2.Int,
    "description": IDL2.Text,
    "imageUrl": IDL2.Text,
    "availableSeats": IDL2.Nat,
    "category": IDL2.Text,
    "rating": IDL2.Float64,
    "capacity": IDL2.Nat,
    "price": IDL2.Float64,
    "reviewCount": IDL2.Nat,
    "location": IDL2.Text
  });
  const TicketTierPublic2 = IDL2.Record({
    "id": IDL2.Nat,
    "eventId": IDL2.Nat,
    "total": IDL2.Nat,
    "name": IDL2.Text,
    "available": IDL2.Nat,
    "benefits": IDL2.Vec(IDL2.Text),
    "price": IDL2.Float64
  });
  return IDL2.Service({
    "addReview": IDL2.Func(
      [IDL2.Nat, IDL2.Text, IDL2.Nat, IDL2.Text],
      [Review2],
      []
    ),
    "createBooking": IDL2.Func(
      [IDL2.Nat, IDL2.Nat, IDL2.Nat, IDL2.Text, IDL2.Text, IDL2.Text],
      [Result2],
      []
    ),
    "getEvent": IDL2.Func([IDL2.Nat], [IDL2.Opt(EventPublic2)], ["query"]),
    "getEvents": IDL2.Func([], [IDL2.Vec(EventPublic2)], ["query"]),
    "getEventsByCategory": IDL2.Func(
      [IDL2.Text],
      [IDL2.Vec(EventPublic2)],
      ["query"]
    ),
    "getReviews": IDL2.Func([IDL2.Nat], [IDL2.Vec(Review2)], ["query"]),
    "getTicketTiers": IDL2.Func(
      [IDL2.Nat],
      [IDL2.Vec(TicketTierPublic2)],
      ["query"]
    )
  });
};
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async addReview(arg0, arg1, arg2, arg3) {
    if (this.processError) {
      try {
        const result = await this.actor.addReview(arg0, arg1, arg2, arg3);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.addReview(arg0, arg1, arg2, arg3);
      return result;
    }
  }
  async createBooking(arg0, arg1, arg2, arg3, arg4, arg5) {
    if (this.processError) {
      try {
        const result = await this.actor.createBooking(arg0, arg1, arg2, arg3, arg4, arg5);
        return from_candid_Result_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createBooking(arg0, arg1, arg2, arg3, arg4, arg5);
      return from_candid_Result_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async getEvent(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getEvent(arg0);
        return from_candid_opt_n3(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getEvent(arg0);
      return from_candid_opt_n3(this._uploadFile, this._downloadFile, result);
    }
  }
  async getEvents() {
    if (this.processError) {
      try {
        const result = await this.actor.getEvents();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getEvents();
      return result;
    }
  }
  async getEventsByCategory(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getEventsByCategory(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getEventsByCategory(arg0);
      return result;
    }
  }
  async getReviews(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getReviews(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getReviews(arg0);
      return result;
    }
  }
  async getTicketTiers(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.getTicketTiers(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getTicketTiers(arg0);
      return result;
    }
  }
}
function from_candid_Result_n1(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function from_candid_opt_n3(_uploadFile, _downloadFile, value) {
  return value.length === 0 ? null : value[0];
}
function from_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: value.err
  } : value;
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
function useEvent(id) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["event", id == null ? void 0 : id.toString()],
    queryFn: async () => {
      if (!actor || id === void 0) {
        return sampleEvents.find((e) => e.id === id) ?? null;
      }
      const event = await actor.getEvent(id);
      if (event) return event;
      return sampleEvents.find((e) => e.id === id) ?? null;
    },
    enabled: !isFetching && id !== void 0
  });
}
function formatDate(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function formatTime(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}
function formatReviewDate(ns) {
  const ms = Number(ns / BigInt(1e6));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
const CATEGORY_COLORS = {
  Music: "bg-primary/10 text-primary border-primary/20",
  Conference: "bg-accent/10 text-accent border-accent/20",
  Workshop: "bg-secondary/10 text-secondary border-secondary/20",
  Sports: "bg-green-500/10 text-green-600 border-green-500/20",
  Arts: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  Business: "bg-amber-500/10 text-amber-600 border-amber-500/20"
};
const PLACEHOLDER = "/assets/images/placeholder.svg";
const GALLERY_SEEDS = [10, 20, 30, 40, 50, 60];
const SCHEDULES = {
  Music: [
    { time: "4:00 PM", title: "Doors Open & DJ Set", speaker: "DJ Lena K" },
    { time: "5:30 PM", title: "Opening Act", speaker: "The Static Waves" },
    {
      time: "7:00 PM",
      title: "Main Stage Headliner",
      speaker: "Aurora Collective"
    },
    {
      time: "9:00 PM",
      title: "Closing Set & Fireworks",
      speaker: "DJ Maximus"
    }
  ],
  Conference: [
    {
      time: "9:00 AM",
      title: "Registration & Networking Breakfast",
      speaker: ""
    },
    {
      time: "10:00 AM",
      title: "Opening Keynote: The Future of Software",
      speaker: "Dr. Alicia Chen, Google"
    },
    {
      time: "11:30 AM",
      title: "Workshop: High-Performance APIs",
      speaker: "Marcus Webb, Meta"
    },
    { time: "1:00 PM", title: "Lunch & Sponsor Showcase", speaker: "" },
    {
      time: "2:30 PM",
      title: "Panel: Scaling to Millions of Users",
      speaker: "4 Industry Leaders"
    },
    {
      time: "4:30 PM",
      title: "Closing Keynote & Q&A",
      speaker: "Sofia Park, YC Partner"
    }
  ],
  Workshop: [
    {
      time: "10:00 AM",
      title: "Introduction & Material Overview",
      speaker: "Lead Instructor"
    },
    {
      time: "10:30 AM",
      title: "Hands-On Session 1",
      speaker: "Small Group Work"
    },
    { time: "12:00 PM", title: "Lunch Break", speaker: "" },
    {
      time: "1:00 PM",
      title: "Hands-On Session 2",
      speaker: "Advanced Techniques"
    },
    {
      time: "3:00 PM",
      title: "Showcase & Critique",
      speaker: "Group Presentation"
    }
  ],
  Sports: [
    { time: "6:00 PM", title: "Warm-Up & Fan Zone Opens", speaker: "" },
    {
      time: "7:00 PM",
      title: "Opening Ceremony & Player Introductions",
      speaker: ""
    },
    { time: "7:30 PM", title: "First Half / Period", speaker: "" },
    { time: "9:00 PM", title: "Halftime Show", speaker: "Live Entertainment" },
    { time: "9:30 PM", title: "Second Half / Period", speaker: "" },
    { time: "11:00 PM", title: "Post-Game Celebration", speaker: "" }
  ],
  Arts: [
    { time: "7:00 PM", title: "House Opens", speaker: "" },
    { time: "7:30 PM", title: "Pre-Show Music", speaker: "Live Orchestra" },
    { time: "8:00 PM", title: "Act I", speaker: "Pacific Theatre Company" },
    { time: "9:15 PM", title: "Intermission", speaker: "" },
    { time: "9:30 PM", title: "Act II", speaker: "Pacific Theatre Company" },
    {
      time: "11:00 PM",
      title: "Post-Show Meet & Greet",
      speaker: "Cast Members"
    }
  ],
  Business: [
    { time: "6:00 PM", title: "Networking & Cocktails", speaker: "" },
    {
      time: "7:00 PM",
      title: "Welcome & Format Overview",
      speaker: "MC Sarah Okonkwo"
    },
    { time: "7:15 PM", title: "Pitches 1–5", speaker: "Founders Present" },
    { time: "8:15 PM", title: "Break & Audience Vote", speaker: "" },
    { time: "8:30 PM", title: "Pitches 6–10", speaker: "Founders Present" },
    { time: "9:30 PM", title: "Investor Panel Q&A", speaker: "VC Panel" }
  ]
};
const DEFAULT_SCHEDULE = [
  { time: "10:00 AM", title: "Event Opens", speaker: "" },
  { time: "11:00 AM", title: "Main Program", speaker: "Featured Guests" },
  { time: "1:00 PM", title: "Break", speaker: "" },
  { time: "2:00 PM", title: "Afternoon Sessions", speaker: "" },
  { time: "4:00 PM", title: "Closing Remarks", speaker: "" }
];
function StarSelector({
  value,
  onChange
}) {
  const [hover, setHover] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: 5 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
      onMouseEnter: () => setHover(n),
      onMouseLeave: () => setHover(0),
      onClick: () => onChange(n),
      "aria-label": `Rate ${n} star${n > 1 ? "s" : ""}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Star,
        {
          className: cn(
            "w-7 h-7 transition-colors duration-150",
            n <= (hover || value) ? "text-secondary fill-secondary" : "text-muted-foreground/30 fill-muted-foreground/10"
          )
        }
      )
    },
    n
  )) });
}
function Lightbox({
  src,
  onClose
}) {
  reactExports.useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4",
      onClick: onClose,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      tabIndex: -1,
      "data-ocid": "gallery.lightbox",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute top-4 right-4 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center text-foreground hover:bg-card transition-smooth",
            onClick: onClose,
            "aria-label": "Close lightbox",
            "data-ocid": "gallery.lightbox.close_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: (e) => e.stopPropagation(),
            className: "focus:outline-none p-0 bg-transparent border-0",
            "aria-label": "Gallery image",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src,
                alt: "Gallery preview",
                className: "max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              }
            )
          }
        )
      ]
    }
  );
}
function EventDetailPage() {
  const { id } = useParams({ from: "/events/$id" });
  const eventId = BigInt(id);
  const { data: event, isLoading } = useEvent(eventId);
  const { isFavorite, toggle } = useFavorites();
  const tiers = reactExports.useMemo(
    () => sampleTicketTiers[id] ?? sampleTicketTiers["1"],
    [id]
  );
  const reviews = reactExports.useMemo(() => {
    const base = sampleReviews[id] ?? sampleReviews["1"];
    return base;
  }, [id]);
  const [localReviews, setLocalReviews] = reactExports.useState([]);
  const allReviews = reactExports.useMemo(
    () => [...localReviews, ...reviews],
    [localReviews, reviews]
  );
  const [lightboxSrc, setLightboxSrc] = reactExports.useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = reactExports.useState(false);
  const [reviewRating, setReviewRating] = reactExports.useState(5);
  const [reviewName, setReviewName] = reactExports.useState("");
  const [reviewComment, setReviewComment] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  const isFav = event ? isFavorite(event.id) : false;
  const cheapestAvailable = reactExports.useMemo(
    () => tiers.filter((t) => Number(t.available) > 0).sort((a, b) => a.price - b.price)[0] ?? null,
    [tiers]
  );
  const schedule = event ? SCHEDULES[event.category] ?? DEFAULT_SCHEDULE : DEFAULT_SCHEDULE;
  const avgRating = reactExports.useMemo(() => {
    if (!allReviews.length) return (event == null ? void 0 : event.rating) ?? 0;
    const sum = allReviews.reduce((acc, r) => acc + Number(r.rating), 0);
    return sum / allReviews.length;
  }, [allReviews, event]);
  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      ue.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2e3);
    });
  }
  function handleShare(platform) {
    if (!event) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out "${event.title}" — grab your tickets now!`
    );
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    window.open(shareUrls[platform], "_blank", "width=600,height=500,noopener");
  }
  function handleSubmitReview(e) {
    e.preventDefault();
    if (!event) return;
    if (!reviewName.trim() || !reviewComment.trim()) {
      ue.error("Please fill in all fields.");
      return;
    }
    const newReview = {
      id: BigInt(Date.now()),
      eventId: event.id,
      authorName: reviewName.trim(),
      rating: BigInt(reviewRating),
      comment: reviewComment.trim(),
      date: BigInt(Date.now()) * BigInt(1e6)
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    ue.success("Review submitted!");
    setReviewDialogOpen(false);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-10 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[21/9] rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-2/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" })
      ] })
    ] });
  }
  if (!event) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: "Event not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/events", children: "Browse Events" }) })
    ] });
  }
  const categoryStyle = CATEGORY_COLORS[event.category] ?? "bg-muted text-muted-foreground border-border";
  const soldOut = Number(event.availableSeats) === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    lightboxSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbox, { src: lightboxSrc, onClose: () => setLightboxSrc(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", style: { maxHeight: "560px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[21/9] max-h-[560px] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: event.imageUrl || PLACEHOLDER,
          alt: event.title,
          className: "w-full h-full object-cover",
          onError: (e) => {
            e.currentTarget.src = PLACEHOLDER;
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-5 left-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          asChild: true,
          variant: "outline",
          size: "sm",
          className: "bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-card",
          "data-ocid": "event_detail.back_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/events", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
            "All Events"
          ] })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => toggle(event.id),
          className: cn(
            "absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center transition-smooth shadow-lg",
            isFav ? "bg-pink-500 text-white" : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-pink-500 hover:bg-card"
          ),
          "aria-label": isFav ? "Remove from favorites" : "Add to favorites",
          "data-ocid": "event_detail.favorite_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-5 h-5", fill: isFav ? "currentColor" : "none" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-6 md:p-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: cn("border font-semibold text-sm", categoryStyle),
              variant: "outline",
              children: event.category
            }
          ),
          soldOut && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "font-semibold text-sm", children: "Sold Out" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl md:text-5xl text-white leading-tight mb-4", children: event.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 shrink-0" }),
            formatDate(event.date),
            " · ",
            formatTime(event.date)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 shrink-0" }),
            event.venue,
            ", ",
            event.city
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StarRating,
            {
              rating: event.rating,
              reviewCount: Number(event.reviewCount),
              size: "sm",
              className: "[&_span.text-muted-foreground]:text-white/70 [&_span.text-foreground]:text-white"
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 pb-32 md:pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
          className: "bg-card border border-border rounded-2xl px-6 py-5 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
          "data-ocid": "event_detail.countdown_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1", children: "Event starts in" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CountdownTimer, { targetDate: event.date })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: Number(event.availableSeats).toLocaleString() }),
                " ",
                "seats remaining"
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.4, delay: 0.05 },
          className: "flex flex-wrap items-center gap-3 mt-6",
          "data-ocid": "event_detail.share_section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-sm text-muted-foreground font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" }),
              " Share:"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleShare("twitter"),
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-400/10 text-sky-500 hover:bg-sky-400/20 text-sm font-semibold transition-smooth",
                "aria-label": "Share on Twitter",
                "data-ocid": "event_detail.share_twitter",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                  "Twitter / X"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleShare("facebook"),
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-sm font-semibold transition-smooth",
                "aria-label": "Share on Facebook",
                "data-ocid": "event_detail.share_facebook",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "w-3.5 h-3.5" }),
                  "Facebook"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleShare("linkedin"),
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700/10 text-blue-700 hover:bg-blue-700/20 text-sm font-semibold transition-smooth",
                "aria-label": "Share on LinkedIn",
                "data-ocid": "event_detail.share_linkedin",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "w-3.5 h-3.5" }),
                  "LinkedIn"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: handleCopyLink,
                className: cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-smooth",
                  copied ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground hover:bg-muted/70"
                ),
                "aria-label": "Copy link",
                "data-ocid": "event_detail.copy_link_button",
                children: [
                  copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
                  copied ? "Copied!" : "Copy Link"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-12 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              "data-ocid": "event_detail.overview_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-4", children: "About This Event" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed text-base", children: event.description })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              "data-ocid": "event_detail.schedule_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-5", children: "Event Schedule" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0", children: schedule.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "relative flex gap-5 pb-6 last:pb-0",
                    "data-ocid": `event_detail.schedule_item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center shrink-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-primary mt-1 shrink-0 z-10" }),
                        i < schedule.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px flex-1 bg-border mt-1" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-primary uppercase tracking-wider mb-0.5", children: item.time }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-base text-foreground leading-snug", children: item.title }),
                        item.speaker && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: item.speaker })
                      ] })
                    ]
                  },
                  `${item.time}-${item.title}`
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              "data-ocid": "event_detail.gallery_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-5", children: "Gallery" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: GALLERY_SEEDS.map((seed, i) => {
                  const src = `https://picsum.photos/seed/${seed + Number(event.id) * 7}/600/400`;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLightboxSrc(src),
                      className: "group relative aspect-[4/3] overflow-hidden rounded-xl border border-border hover:border-primary/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "aria-label": `View gallery image ${i + 1}`,
                      "data-ocid": `event_detail.gallery_item.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src,
                            alt: `Gallery ${i + 1}`,
                            className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-smooth" })
                      ]
                    },
                    seed
                  );
                }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              "data-ocid": "event_detail.venue_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-5", children: "Venue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground", children: event.venue }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: event.location }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: event.city })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-1 border-t border-border", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                        "Capacity:",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: Number(event.capacity).toLocaleString() })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-2xl overflow-hidden bg-muted border border-border min-h-[180px] flex items-center justify-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-8 h-8 text-primary mx-auto mb-2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground", children: event.venue }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: event.city })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute inset-0 opacity-10",
                        style: {
                          backgroundImage: "linear-gradient(oklch(var(--border)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--border)) 1px, transparent 1px)",
                          backgroundSize: "32px 32px"
                        }
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.section,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              "data-ocid": "event_detail.reviews_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5 flex-wrap gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-2xl text-foreground mb-1", children: "Reviews" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StarRating,
                      {
                        rating: avgRating,
                        reviewCount: allReviews.length,
                        size: "md"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: () => setReviewDialogOpen(true),
                      className: "bg-primary hover:bg-primary/90 text-primary-foreground",
                      "data-ocid": "event_detail.add_review_button",
                      children: "Add Review"
                    }
                  )
                ] }),
                allReviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "text-center py-10 text-muted-foreground border border-dashed border-border rounded-2xl",
                    "data-ocid": "event_detail.reviews_empty_state",
                    children: "No reviews yet. Be the first to share your experience!"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: allReviews.map((review, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "bg-card border border-border rounded-2xl p-5",
                    "data-ocid": `event_detail.review_item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: review.authorName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatReviewDate(review.date) })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          StarRating,
                          {
                            rating: Number(review.rating),
                            size: "sm",
                            showValue: false
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: review.comment })
                    ]
                  },
                  review.id.toString()
                )) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "sticky top-24 space-y-4",
            "data-ocid": "event_detail.tickets_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground", children: "Ticket Options" }),
              tiers.map((tier, i) => {
                const isAvailable = Number(tier.available) > 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Card,
                  {
                    className: cn(
                      "border transition-smooth",
                      isAvailable ? "border-border hover:border-primary/40 hover:shadow-md" : "border-border opacity-60"
                    ),
                    "data-ocid": `event_detail.ticket_tier.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-4 px-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base font-bold text-foreground", children: tier.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-xl text-primary shrink-0", children: [
                            "$",
                            tier.price
                          ] })
                        ] }),
                        !isAvailable ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "w-fit text-xs", children: "Sold Out" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                          Number(tier.available),
                          " seats left"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 mb-4", children: tier.benefits.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "li",
                          {
                            className: "flex items-center gap-2 text-sm text-muted-foreground",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 text-primary shrink-0" }),
                              b
                            ]
                          },
                          b
                        )) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            asChild: isAvailable,
                            disabled: !isAvailable,
                            className: cn(
                              "w-full font-semibold",
                              isAvailable ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" : "bg-muted text-muted-foreground cursor-not-allowed"
                            ),
                            "data-ocid": `event_detail.get_tickets_button.${i + 1}`,
                            children: isAvailable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Link,
                              {
                                to: "/checkout/$eventId",
                                params: { eventId: id },
                                children: "Get Tickets"
                              }
                            ) : "Sold Out"
                          }
                        )
                      ] })
                    ]
                  },
                  tier.id.toString()
                );
              })
            ]
          }
        ) })
      ] })
    ] }),
    cheapestAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-card border-t border-border px-4 py-3 flex items-center justify-between gap-3",
          "data-ocid": "event_detail.sticky_booking_bar",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm text-foreground truncate", children: event.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "From",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
                  "$",
                  cheapestAvailable.price
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                className: "bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shrink-0",
                "data-ocid": "event_detail.sticky_get_tickets_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout/$eventId", params: { eventId: id }, children: "Get Tickets" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "hidden lg:flex fixed bottom-8 right-8 z-40 flex-col gap-2 w-64 bg-card border border-border rounded-2xl shadow-2xl p-4",
          "data-ocid": "event_detail.sticky_booking_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1", children: "From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-2xl text-primary", children: [
                "$",
                cheapestAvailable.price
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: cheapestAvailable.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                className: "w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold mt-1",
                "data-ocid": "event_detail.sticky_get_tickets_button_desktop",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout/$eventId", params: { eventId: id }, children: "Get Tickets" })
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: reviewDialogOpen, onOpenChange: setReviewDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-md",
        "data-ocid": "event_detail.review_dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: "Write a Review" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmitReview, className: "space-y-5 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Your Rating" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StarSelector, { value: reviewRating, onChange: setReviewRating })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-name", children: "Your Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "review-name",
                  placeholder: "e.g. Alex M.",
                  value: reviewName,
                  onChange: (e) => setReviewName(e.target.value),
                  maxLength: 80,
                  "data-ocid": "event_detail.review_name_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "review-comment", children: [
                "Comment",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                  "(",
                  reviewComment.length,
                  "/500)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "review-comment",
                  placeholder: "Share your experience...",
                  value: reviewComment,
                  onChange: (e) => setReviewComment(e.target.value),
                  maxLength: 500,
                  rows: 4,
                  "data-ocid": "event_detail.review_comment_textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => setReviewDialogOpen(false),
                  "data-ocid": "event_detail.review_cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  className: "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "data-ocid": "event_detail.review_submit_button",
                  children: "Submit Review"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
export {
  EventDetailPage as default
};
