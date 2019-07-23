var StructuredReceiver = require("./receiver_structured_0_2.js");
var BinaryReceiver     = require("./receiver_binary_0_2.js");

const Constants = require("./constants.js");
const Commons   = require("./commons.js");

const structured = "structured";
const binary = "binary";

const receiver_by_binding = {
  structured : new StructuredReceiver(),
  binary     : new BinaryReceiver(),
};

const allowed_binary_content_types = [];
allowed_binary_content_types.push(Constants.MIME_JSON);

const allowed_structured_content_types = [];
allowed_structured_content_types.push(Constants.MIME_CE_JSON);

function validate_args(payload, headers) {
  if(!payload){
    throw {message: "payload is null or undefined"};
  }

  if(!headers){
    throw {message: "headers is null or undefined"};
  }
}

// Is it binary or structured?
function resolve_binding_name(payload, headers) {

  var contentType = headers[Constants.HEADER_CONTENT_TYPE];
  if(contentType.startsWith(Constants.MIME_CE)){
    // Structured
    if(allowed_structured_content_types.includes(contentType)){
      return structured;
    } else {
      throw {message: "structured+type not allowed", errors: [contentType]};
    }
  } else {
    // Binary
    if(allowed_binary_content_types.includes(contentType)){
      return binary;
    } else {
      throw {message: "content type not allowed", errors : [contentType]};
    }
  }
}

var Unmarshaller = function() {

}

Unmarshaller.prototype.unmarshall = function(payload, headers) {
  return new Promise((resolve, reject) => {
    try {
      validate_args(payload, headers);

      var sanity_headers = Commons.sanity_and_clone(headers);

      // Validation level 1
      if(!sanity_headers[Constants.HEADER_CONTENT_TYPE]){
        throw {message: "content-type header not found"};
      }

      // Resolve the binding
      var binding_name = resolve_binding_name(payload, sanity_headers);

      var cloudevent =
        receiver_by_binding[binding_name].parse(payload, sanity_headers);

      resolve(cloudevent);
    }catch(e){
      reject(e);
    }
  });
};

module.exports = Unmarshaller;