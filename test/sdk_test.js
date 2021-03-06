const expect = require("chai").expect;
const { CloudEvent, HTTPReceiver, HTTPEmitter } = require("../");

const {
  SPEC_V03,
  SPEC_V1
} = require("../lib/bindings/http/constants.js");

const fixture = {
  type: "org.cloudevents.test",
  source: "http://cloudevents.io"
};

describe("The SDK Requirements", () => {
  it("should expose a CloudEvent type", () => {
    const event = new CloudEvent(fixture);
    expect(event instanceof CloudEvent).to.equal(true);
  });

  it("should expose an HTTPReceiver type", () => {
    const receiver = new HTTPReceiver();
    expect(receiver instanceof HTTPReceiver).to.equal(true);
  });

  it("should expose an HTTPEmitter type", () => {
    const emitter = new HTTPEmitter({
      url: "http://example.com"
    });
    expect(emitter instanceof HTTPEmitter).to.equal(true);
  });

  describe("v0.3", () => {
    it("should create an event using the right spec version", () => {
      expect(new CloudEvent({
        specversion: SPEC_V03,
        ...fixture
      }).spec.payload.specversion).to.equal(SPEC_V03);
    });
  });

  describe("v1.0", () => {
    it("should create an event using the right spec version", () => {
      expect(new CloudEvent(fixture).spec.payload.specversion).to.equal(SPEC_V1);
    });
  });
});
