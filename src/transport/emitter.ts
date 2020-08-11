import { CloudEvent } from "../event/cloudevent";
import { emitBinary, emitStructured } from "./http";
import { Protocol } from "./protocols";
import { AxiosResponse } from "axios";
import { Agent } from "http";

/**
 * Options supplied to the Emitter when sending an event.
 * In addition to url and protocol, TransportOptions may
 * also accept custom options that will be passed to the
 * Node.js http functions.
 */
export interface TransportOptions {
  /**
   * The endpoint that will receieve the event.
   * @example http://cncf.example.com/receiver
   */
  url?: string;
  /**
   * The network protocol over which the event will be sent.
   * @example HTTPStructured
   * @example HTTPBinary
   */
  protocol?: Protocol;

  [key: string]: string | Record<string, unknown> | Protocol | Agent | undefined;
}

interface EmitterFunction {
  (event: CloudEvent, options: TransportOptions): Promise<AxiosResponse>;
}

/**
 * A class to send binary and structured CloudEvents to a remote endpoint.
 * Currently, supported protocols are HTTPBinary and HTTPStructured.
 *
 * @see https://github.com/cloudevents/spec/blob/v1.0/http-protocol-binding.md
 * @see https://github.com/cloudevents/spec/blob/v1.0/http-protocol-binding.md#13-content-modes
 */
export class Emitter {
  /**
   * Sends the {CloudEvent} to an event receiver over HTTP POST
   *
   * @param {CloudEvent} event the CloudEvent to be sent
   * @param {Object} [options] The configuration options for this event. Options
   * provided will be passed along to Node.js `http.request()`.
   * https://nodejs.org/api/http.html#http_http_request_options_callback
   * @param {string} [options.url] The HTTP/S url that should receive this event.
   * The URL is optional if one was provided when this emitter was constructed.
   * In that case, it will be used as the recipient endpoint. The endpoint can
   * be overridden by providing a URL here.
   * @returns {Promise} Promise with an eventual response from the receiver
   */
  static send(event: CloudEvent, options: TransportOptions): Promise<AxiosResponse> {
    const { protocol } = options;
    let emitter = emitBinary;
    if (protocol === Protocol.HTTPStructured) {
      emitter = emitStructured;
    }
    return emitter(event, options);
  }
}
