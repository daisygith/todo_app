exports.lowercaseKeys = function (obj) {
  if (!isObject(obj)) {
    throw new Error(
      `You must provide an object to "lowercaseKeys". Received "${typeof obj}"`,
    );
  }

  return Object.entries(obj).reduce((carry, [key, value]) => {
    carry[camelize(key.toLowerCase())] = value;

    return carry;
  }, {});
};

/**
 * Determine whether the given `value` is an object.
 *
 * @param {*} value
 *
 * @returns {value is object}
 */
function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function camelize(str) {
  return str
    .replace("_", " ")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
