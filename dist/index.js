require('./sourcemap-register.js');module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(198);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 16:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const f = __webpack_require__(133)

class Time extends Date {
  constructor (value) {
    super(`0000-01-01T${value}Z`)
    this.isTime = true
  }
  toISOString () {
    return `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`
  }
}

module.exports = value => {
  const date = new Time(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ }),

/***/ 30:
/***/ (function(module) {

"use strict";

module.exports = stringify
module.exports.value = stringifyInline

function stringify (obj) {
  if (obj === null) throw typeError('null')
  if (obj === void (0)) throw typeError('undefined')
  if (typeof obj !== 'object') throw typeError(typeof obj)

  if (typeof obj.toJSON === 'function') obj = obj.toJSON()
  if (obj == null) return null
  const type = tomlType(obj)
  if (type !== 'table') throw typeError(type)
  return stringifyObject('', '', obj)
}

function typeError (type) {
  return new Error('Can only stringify objects, not ' + type)
}

function arrayOneTypeError () {
  return new Error("Array values can't have mixed types")
}

function getInlineKeys (obj) {
  return Object.keys(obj).filter(key => isInline(obj[key]))
}
function getComplexKeys (obj) {
  return Object.keys(obj).filter(key => !isInline(obj[key]))
}

function toJSON (obj) {
  let nobj = Array.isArray(obj) ? [] : Object.prototype.hasOwnProperty.call(obj, '__proto__') ? {['__proto__']: undefined} : {}
  for (let prop of Object.keys(obj)) {
    if (obj[prop] && typeof obj[prop].toJSON === 'function' && !('toISOString' in obj[prop])) {
      nobj[prop] = obj[prop].toJSON()
    } else {
      nobj[prop] = obj[prop]
    }
  }
  return nobj
}

function stringifyObject (prefix, indent, obj) {
  obj = toJSON(obj)
  var inlineKeys
  var complexKeys
  inlineKeys = getInlineKeys(obj)
  complexKeys = getComplexKeys(obj)
  var result = []
  var inlineIndent = indent || ''
  inlineKeys.forEach(key => {
    var type = tomlType(obj[key])
    if (type !== 'undefined' && type !== 'null') {
      result.push(inlineIndent + stringifyKey(key) + ' = ' + stringifyAnyInline(obj[key], true))
    }
  })
  if (result.length > 0) result.push('')
  var complexIndent = prefix && inlineKeys.length > 0 ? indent + '  ' : ''
  complexKeys.forEach(key => {
    result.push(stringifyComplex(prefix, complexIndent, key, obj[key]))
  })
  return result.join('\n')
}

function isInline (value) {
  switch (tomlType(value)) {
    case 'undefined':
    case 'null':
    case 'integer':
    case 'nan':
    case 'float':
    case 'boolean':
    case 'string':
    case 'datetime':
      return true
    case 'array':
      return value.length === 0 || tomlType(value[0]) !== 'table'
    case 'table':
      return Object.keys(value).length === 0
    /* istanbul ignore next */
    default:
      return false
  }
}

function tomlType (value) {
  if (value === undefined) {
    return 'undefined'
  } else if (value === null) {
    return 'null'
  /* eslint-disable valid-typeof */
  } else if (typeof value === 'bigint' || (Number.isInteger(value) && !Object.is(value, -0))) {
    return 'integer'
  } else if (typeof value === 'number') {
    return 'float'
  } else if (typeof value === 'boolean') {
    return 'boolean'
  } else if (typeof value === 'string') {
    return 'string'
  } else if ('toISOString' in value) {
    return isNaN(value) ? 'undefined' : 'datetime'
  } else if (Array.isArray(value)) {
    return 'array'
  } else {
    return 'table'
  }
}

function stringifyKey (key) {
  var keyStr = String(key)
  if (/^[-A-Za-z0-9_]+$/.test(keyStr)) {
    return keyStr
  } else {
    return stringifyBasicString(keyStr)
  }
}

function stringifyBasicString (str) {
  return '"' + escapeString(str).replace(/"/g, '\\"') + '"'
}

function stringifyLiteralString (str) {
  return "'" + str + "'"
}

function numpad (num, str) {
  while (str.length < num) str = '0' + str
  return str
}

function escapeString (str) {
  return str.replace(/\\/g, '\\\\')
    .replace(/[\b]/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    /* eslint-disable no-control-regex */
    .replace(/([\u0000-\u001f\u007f])/, c => '\\u' + numpad(4, c.codePointAt(0).toString(16)))
    /* eslint-enable no-control-regex */
}

function stringifyMultilineString (str) {
  let escaped = str.split(/\n/).map(str => {
    return escapeString(str).replace(/"(?="")/g, '\\"')
  }).join('\n')
  if (escaped.slice(-1) === '"') escaped += '\\\n'
  return '"""\n' + escaped + '"""'
}

function stringifyAnyInline (value, multilineOk) {
  let type = tomlType(value)
  if (type === 'string') {
    if (multilineOk && /\n/.test(value)) {
      type = 'string-multiline'
    } else if (!/[\b\t\n\f\r']/.test(value) && /"/.test(value)) {
      type = 'string-literal'
    }
  }
  return stringifyInline(value, type)
}

function stringifyInline (value, type) {
  /* istanbul ignore if */
  if (!type) type = tomlType(value)
  switch (type) {
    case 'string-multiline':
      return stringifyMultilineString(value)
    case 'string':
      return stringifyBasicString(value)
    case 'string-literal':
      return stringifyLiteralString(value)
    case 'integer':
      return stringifyInteger(value)
    case 'float':
      return stringifyFloat(value)
    case 'boolean':
      return stringifyBoolean(value)
    case 'datetime':
      return stringifyDatetime(value)
    case 'array':
      return stringifyInlineArray(value.filter(_ => tomlType(_) !== 'null' && tomlType(_) !== 'undefined' && tomlType(_) !== 'nan'))
    case 'table':
      return stringifyInlineTable(value)
    /* istanbul ignore next */
    default:
      throw typeError(type)
  }
}

function stringifyInteger (value) {
  /* eslint-disable security/detect-unsafe-regex */
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '_')
}

function stringifyFloat (value) {
  if (value === Infinity) {
    return 'inf'
  } else if (value === -Infinity) {
    return '-inf'
  } else if (Object.is(value, NaN)) {
    return 'nan'
  } else if (Object.is(value, -0)) {
    return '-0.0'
  }
  var chunks = String(value).split('.')
  var int = chunks[0]
  var dec = chunks[1] || 0
  return stringifyInteger(int) + '.' + dec
}

function stringifyBoolean (value) {
  return String(value)
}

function stringifyDatetime (value) {
  return value.toISOString()
}

function isNumber (type) {
  return type === 'float' || type === 'integer'
}
function arrayType (values) {
  var contentType = tomlType(values[0])
  if (values.every(_ => tomlType(_) === contentType)) return contentType
  // mixed integer/float, emit as floats
  if (values.every(_ => isNumber(tomlType(_)))) return 'float'
  return 'mixed'
}
function validateArray (values) {
  const type = arrayType(values)
  if (type === 'mixed') {
    throw arrayOneTypeError()
  }
  return type
}

function stringifyInlineArray (values) {
  values = toJSON(values)
  const type = validateArray(values)
  var result = '['
  var stringified = values.map(_ => stringifyInline(_, type))
  if (stringified.join(', ').length > 60 || /\n/.test(stringified)) {
    result += '\n  ' + stringified.join(',\n  ') + '\n'
  } else {
    result += ' ' + stringified.join(', ') + (stringified.length > 0 ? ' ' : '')
  }
  return result + ']'
}

function stringifyInlineTable (value) {
  value = toJSON(value)
  var result = []
  Object.keys(value).forEach(key => {
    result.push(stringifyKey(key) + ' = ' + stringifyAnyInline(value[key], false))
  })
  return '{ ' + result.join(', ') + (result.length > 0 ? ' ' : '') + '}'
}

function stringifyComplex (prefix, indent, key, value) {
  var valueType = tomlType(value)
  /* istanbul ignore else */
  if (valueType === 'array') {
    return stringifyArrayOfTables(prefix, indent, key, value)
  } else if (valueType === 'table') {
    return stringifyComplexTable(prefix, indent, key, value)
  } else {
    throw typeError(valueType)
  }
}

function stringifyArrayOfTables (prefix, indent, key, values) {
  values = toJSON(values)
  validateArray(values)
  var firstValueType = tomlType(values[0])
  /* istanbul ignore if */
  if (firstValueType !== 'table') throw typeError(firstValueType)
  var fullKey = prefix + stringifyKey(key)
  var result = ''
  values.forEach(table => {
    if (result.length > 0) result += '\n'
    result += indent + '[[' + fullKey + ']]\n'
    result += stringifyObject(fullKey + '.', indent, table)
  })
  return result
}

function stringifyComplexTable (prefix, indent, key, value) {
  var fullKey = prefix + stringifyKey(key)
  var result = ''
  if (getInlineKeys(value).length > 0) {
    result += indent + '[' + fullKey + ']\n'
  }
  return result + stringifyObject(fullKey + '.', indent, value)
}


/***/ }),

/***/ 74:
/***/ (function(module) {

"use strict";

module.exports = prettyError

function prettyError (err, buf) {
  /* istanbul ignore if */
  if (err.pos == null || err.line == null) return err
  let msg = err.message
  msg += ` at row ${err.line + 1}, col ${err.col + 1}, pos ${err.pos}:\n`

  /* istanbul ignore else */
  if (buf && buf.split) {
    const lines = buf.split(/\n/)
    const lineNumWidth = String(Math.min(lines.length, err.line + 3)).length
    let linePadding = ' '
    while (linePadding.length < lineNumWidth) linePadding += ' '
    for (let ii = Math.max(0, err.line - 1); ii < Math.min(lines.length, err.line + 2); ++ii) {
      let lineNum = String(ii + 1)
      if (lineNum.length < lineNumWidth) lineNum = ' ' + lineNum
      if (err.line === ii) {
        msg += lineNum + '> ' + lines[ii] + '\n'
        msg += linePadding + '  '
        for (let hh = 0; hh < err.col; ++hh) {
          msg += ' '
        }
        msg += '^\n'
      } else {
        msg += lineNum + ': ' + lines[ii] + '\n'
      }
    }
  }
  err.message = msg + '\n'
  return err
}


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 132:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

/* eslint-disable no-new-wrappers, no-eval, camelcase, operator-linebreak */
module.exports = makeParserClass(__webpack_require__(221))
module.exports.makeParserClass = makeParserClass

class TomlError extends Error {
  constructor (msg) {
    super(msg)
    this.name = 'TomlError'
    /* istanbul ignore next */
    if (Error.captureStackTrace) Error.captureStackTrace(this, TomlError)
    this.fromTOML = true
    this.wrapped = null
  }
}
TomlError.wrap = err => {
  const terr = new TomlError(err.message)
  terr.code = err.code
  terr.wrapped = err
  return terr
}
module.exports.TomlError = TomlError

const createDateTime = __webpack_require__(992)
const createDateTimeFloat = __webpack_require__(335)
const createDate = __webpack_require__(371)
const createTime = __webpack_require__(16)

const CTRL_I = 0x09
const CTRL_J = 0x0A
const CTRL_M = 0x0D
const CTRL_CHAR_BOUNDARY = 0x1F // the last non-character in the latin1 region of unicode, except DEL
const CHAR_SP = 0x20
const CHAR_QUOT = 0x22
const CHAR_NUM = 0x23
const CHAR_APOS = 0x27
const CHAR_PLUS = 0x2B
const CHAR_COMMA = 0x2C
const CHAR_HYPHEN = 0x2D
const CHAR_PERIOD = 0x2E
const CHAR_0 = 0x30
const CHAR_1 = 0x31
const CHAR_7 = 0x37
const CHAR_9 = 0x39
const CHAR_COLON = 0x3A
const CHAR_EQUALS = 0x3D
const CHAR_A = 0x41
const CHAR_E = 0x45
const CHAR_F = 0x46
const CHAR_T = 0x54
const CHAR_U = 0x55
const CHAR_Z = 0x5A
const CHAR_LOWBAR = 0x5F
const CHAR_a = 0x61
const CHAR_b = 0x62
const CHAR_e = 0x65
const CHAR_f = 0x66
const CHAR_i = 0x69
const CHAR_l = 0x6C
const CHAR_n = 0x6E
const CHAR_o = 0x6F
const CHAR_r = 0x72
const CHAR_s = 0x73
const CHAR_t = 0x74
const CHAR_u = 0x75
const CHAR_x = 0x78
const CHAR_z = 0x7A
const CHAR_LCUB = 0x7B
const CHAR_RCUB = 0x7D
const CHAR_LSQB = 0x5B
const CHAR_BSOL = 0x5C
const CHAR_RSQB = 0x5D
const CHAR_DEL = 0x7F
const SURROGATE_FIRST = 0xD800
const SURROGATE_LAST = 0xDFFF

const escapes = {
  [CHAR_b]: '\u0008',
  [CHAR_t]: '\u0009',
  [CHAR_n]: '\u000A',
  [CHAR_f]: '\u000C',
  [CHAR_r]: '\u000D',
  [CHAR_QUOT]: '\u0022',
  [CHAR_BSOL]: '\u005C'
}

function isDigit (cp) {
  return cp >= CHAR_0 && cp <= CHAR_9
}
function isHexit (cp) {
  return (cp >= CHAR_A && cp <= CHAR_F) || (cp >= CHAR_a && cp <= CHAR_f) || (cp >= CHAR_0 && cp <= CHAR_9)
}
function isBit (cp) {
  return cp === CHAR_1 || cp === CHAR_0
}
function isOctit (cp) {
  return (cp >= CHAR_0 && cp <= CHAR_7)
}
function isAlphaNumQuoteHyphen (cp) {
  return (cp >= CHAR_A && cp <= CHAR_Z)
      || (cp >= CHAR_a && cp <= CHAR_z)
      || (cp >= CHAR_0 && cp <= CHAR_9)
      || cp === CHAR_APOS
      || cp === CHAR_QUOT
      || cp === CHAR_LOWBAR
      || cp === CHAR_HYPHEN
}
function isAlphaNumHyphen (cp) {
  return (cp >= CHAR_A && cp <= CHAR_Z)
      || (cp >= CHAR_a && cp <= CHAR_z)
      || (cp >= CHAR_0 && cp <= CHAR_9)
      || cp === CHAR_LOWBAR
      || cp === CHAR_HYPHEN
}
const _type = Symbol('type')
const _declared = Symbol('declared')

const hasOwnProperty = Object.prototype.hasOwnProperty
const defineProperty = Object.defineProperty
const descriptor = {configurable: true, enumerable: true, writable: true, value: undefined}

function hasKey (obj, key) {
  if (hasOwnProperty.call(obj, key)) return true
  if (key === '__proto__') defineProperty(obj, '__proto__', descriptor)
  return false
}

const INLINE_TABLE = Symbol('inline-table')
function InlineTable () {
  return Object.defineProperties({}, {
    [_type]: {value: INLINE_TABLE}
  })
}
function isInlineTable (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === INLINE_TABLE
}

const TABLE = Symbol('table')
function Table () {
  return Object.defineProperties({}, {
    [_type]: {value: TABLE},
    [_declared]: {value: false, writable: true}
  })
}
function isTable (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === TABLE
}

const _contentType = Symbol('content-type')
const INLINE_LIST = Symbol('inline-list')
function InlineList (type) {
  return Object.defineProperties([], {
    [_type]: {value: INLINE_LIST},
    [_contentType]: {value: type}
  })
}
function isInlineList (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === INLINE_LIST
}

const LIST = Symbol('list')
function List () {
  return Object.defineProperties([], {
    [_type]: {value: LIST}
  })
}
function isList (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === LIST
}

// in an eval, to let bundlers not slurp in a util proxy
let _custom
try {
  const utilInspect = eval("require('util').inspect")
  _custom = utilInspect.custom
} catch (_) {
  /* eval require not available in transpiled bundle */
}
/* istanbul ignore next */
const _inspect = _custom || 'inspect'

class BoxedBigInt {
  constructor (value) {
    try {
      this.value = global.BigInt.asIntN(64, value)
    } catch (_) {
      /* istanbul ignore next */
      this.value = null
    }
    Object.defineProperty(this, _type, {value: INTEGER})
  }
  isNaN () {
    return this.value === null
  }
  /* istanbul ignore next */
  toString () {
    return String(this.value)
  }
  /* istanbul ignore next */
  [_inspect] () {
    return `[BigInt: ${this.toString()}]}`
  }
  valueOf () {
    return this.value
  }
}

const INTEGER = Symbol('integer')
function Integer (value) {
  let num = Number(value)
  // -0 is a float thing, not an int thing
  if (Object.is(num, -0)) num = 0
  /* istanbul ignore else */
  if (global.BigInt && !Number.isSafeInteger(num)) {
    return new BoxedBigInt(value)
  } else {
    /* istanbul ignore next */
    return Object.defineProperties(new Number(num), {
      isNaN: {value: function () { return isNaN(this) }},
      [_type]: {value: INTEGER},
      [_inspect]: {value: () => `[Integer: ${value}]`}
    })
  }
}
function isInteger (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === INTEGER
}

const FLOAT = Symbol('float')
function Float (value) {
  /* istanbul ignore next */
  return Object.defineProperties(new Number(value), {
    [_type]: {value: FLOAT},
    [_inspect]: {value: () => `[Float: ${value}]`}
  })
}
function isFloat (obj) {
  if (obj === null || typeof (obj) !== 'object') return false
  return obj[_type] === FLOAT
}

function tomlType (value) {
  const type = typeof value
  if (type === 'object') {
    /* istanbul ignore if */
    if (value === null) return 'null'
    if (value instanceof Date) return 'datetime'
    /* istanbul ignore else */
    if (_type in value) {
      switch (value[_type]) {
        case INLINE_TABLE: return 'inline-table'
        case INLINE_LIST: return 'inline-list'
        /* istanbul ignore next */
        case TABLE: return 'table'
        /* istanbul ignore next */
        case LIST: return 'list'
        case FLOAT: return 'float'
        case INTEGER: return 'integer'
      }
    }
  }
  return type
}

function makeParserClass (Parser) {
  class TOMLParser extends Parser {
    constructor () {
      super()
      this.ctx = this.obj = Table()
    }

    /* MATCH HELPER */
    atEndOfWord () {
      return this.char === CHAR_NUM || this.char === CTRL_I || this.char === CHAR_SP || this.atEndOfLine()
    }
    atEndOfLine () {
      return this.char === Parser.END || this.char === CTRL_J || this.char === CTRL_M
    }

    parseStart () {
      if (this.char === Parser.END) {
        return null
      } else if (this.char === CHAR_LSQB) {
        return this.call(this.parseTableOrList)
      } else if (this.char === CHAR_NUM) {
        return this.call(this.parseComment)
      } else if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
        return null
      } else if (isAlphaNumQuoteHyphen(this.char)) {
        return this.callNow(this.parseAssignStatement)
      } else {
        throw this.error(new TomlError(`Unknown character "${this.char}"`))
      }
    }

    // HELPER, this strips any whitespace and comments to the end of the line
    // then RETURNS. Last state in a production.
    parseWhitespaceToEOL () {
      if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
        return null
      } else if (this.char === CHAR_NUM) {
        return this.goto(this.parseComment)
      } else if (this.char === Parser.END || this.char === CTRL_J) {
        return this.return()
      } else {
        throw this.error(new TomlError('Unexpected character, expected only whitespace or comments till end of line'))
      }
    }

    /* ASSIGNMENT: key = value */
    parseAssignStatement () {
      return this.callNow(this.parseAssign, this.recordAssignStatement)
    }
    recordAssignStatement (kv) {
      let target = this.ctx
      let finalKey = kv.key.pop()
      for (let kw of kv.key) {
        if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
          throw this.error(new TomlError("Can't redefine existing key"))
        }
        target = target[kw] = target[kw] || Table()
      }
      if (hasKey(target, finalKey)) {
        throw this.error(new TomlError("Can't redefine existing key"))
      }
      // unbox our numbers
      if (isInteger(kv.value) || isFloat(kv.value)) {
        target[finalKey] = kv.value.valueOf()
      } else {
        target[finalKey] = kv.value
      }
      return this.goto(this.parseWhitespaceToEOL)
    }

    /* ASSSIGNMENT expression, key = value possibly inside an inline table */
    parseAssign () {
      return this.callNow(this.parseKeyword, this.recordAssignKeyword)
    }
    recordAssignKeyword (key) {
      if (this.state.resultTable) {
        this.state.resultTable.push(key)
      } else {
        this.state.resultTable = [key]
      }
      return this.goto(this.parseAssignKeywordPreDot)
    }
    parseAssignKeywordPreDot () {
      if (this.char === CHAR_PERIOD) {
        return this.next(this.parseAssignKeywordPostDot)
      } else if (this.char !== CHAR_SP && this.char !== CTRL_I) {
        return this.goto(this.parseAssignEqual)
      }
    }
    parseAssignKeywordPostDot () {
      if (this.char !== CHAR_SP && this.char !== CTRL_I) {
        return this.callNow(this.parseKeyword, this.recordAssignKeyword)
      }
    }

    parseAssignEqual () {
      if (this.char === CHAR_EQUALS) {
        return this.next(this.parseAssignPreValue)
      } else {
        throw this.error(new TomlError('Invalid character, expected "="'))
      }
    }
    parseAssignPreValue () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else {
        return this.callNow(this.parseValue, this.recordAssignValue)
      }
    }
    recordAssignValue (value) {
      return this.returnNow({key: this.state.resultTable, value: value})
    }

    /* COMMENTS: #...eol */
    parseComment () {
      do {
        if (this.char === Parser.END || this.char === CTRL_J) {
          return this.return()
        }
      } while (this.nextChar())
    }

    /* TABLES AND LISTS, [foo] and [[foo]] */
    parseTableOrList () {
      if (this.char === CHAR_LSQB) {
        this.next(this.parseList)
      } else {
        return this.goto(this.parseTable)
      }
    }

    /* TABLE [foo.bar.baz] */
    parseTable () {
      this.ctx = this.obj
      return this.goto(this.parseTableNext)
    }
    parseTableNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else {
        return this.callNow(this.parseKeyword, this.parseTableMore)
      }
    }
    parseTableMore (keyword) {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === CHAR_RSQB) {
        if (hasKey(this.ctx, keyword) && (!isTable(this.ctx[keyword]) || this.ctx[keyword][_declared])) {
          throw this.error(new TomlError("Can't redefine existing key"))
        } else {
          this.ctx = this.ctx[keyword] = this.ctx[keyword] || Table()
          this.ctx[_declared] = true
        }
        return this.next(this.parseWhitespaceToEOL)
      } else if (this.char === CHAR_PERIOD) {
        if (!hasKey(this.ctx, keyword)) {
          this.ctx = this.ctx[keyword] = Table()
        } else if (isTable(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword]
        } else if (isList(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1]
        } else {
          throw this.error(new TomlError("Can't redefine existing key"))
        }
        return this.next(this.parseTableNext)
      } else {
        throw this.error(new TomlError('Unexpected character, expected whitespace, . or ]'))
      }
    }

    /* LIST [[a.b.c]] */
    parseList () {
      this.ctx = this.obj
      return this.goto(this.parseListNext)
    }
    parseListNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else {
        return this.callNow(this.parseKeyword, this.parseListMore)
      }
    }
    parseListMore (keyword) {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === CHAR_RSQB) {
        if (!hasKey(this.ctx, keyword)) {
          this.ctx[keyword] = List()
        }
        if (isInlineList(this.ctx[keyword])) {
          throw this.error(new TomlError("Can't extend an inline array"))
        } else if (isList(this.ctx[keyword])) {
          const next = Table()
          this.ctx[keyword].push(next)
          this.ctx = next
        } else {
          throw this.error(new TomlError("Can't redefine an existing key"))
        }
        return this.next(this.parseListEnd)
      } else if (this.char === CHAR_PERIOD) {
        if (!hasKey(this.ctx, keyword)) {
          this.ctx = this.ctx[keyword] = Table()
        } else if (isInlineList(this.ctx[keyword])) {
          throw this.error(new TomlError("Can't extend an inline array"))
        } else if (isInlineTable(this.ctx[keyword])) {
          throw this.error(new TomlError("Can't extend an inline table"))
        } else if (isList(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword][this.ctx[keyword].length - 1]
        } else if (isTable(this.ctx[keyword])) {
          this.ctx = this.ctx[keyword]
        } else {
          throw this.error(new TomlError("Can't redefine an existing key"))
        }
        return this.next(this.parseListNext)
      } else {
        throw this.error(new TomlError('Unexpected character, expected whitespace, . or ]'))
      }
    }
    parseListEnd (keyword) {
      if (this.char === CHAR_RSQB) {
        return this.next(this.parseWhitespaceToEOL)
      } else {
        throw this.error(new TomlError('Unexpected character, expected whitespace, . or ]'))
      }
    }

    /* VALUE string, number, boolean, inline list, inline object */
    parseValue () {
      if (this.char === Parser.END) {
        throw this.error(new TomlError('Key without value'))
      } else if (this.char === CHAR_QUOT) {
        return this.next(this.parseDoubleString)
      } if (this.char === CHAR_APOS) {
        return this.next(this.parseSingleString)
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        return this.goto(this.parseNumberSign)
      } else if (this.char === CHAR_i) {
        return this.next(this.parseInf)
      } else if (this.char === CHAR_n) {
        return this.next(this.parseNan)
      } else if (isDigit(this.char)) {
        return this.goto(this.parseNumberOrDateTime)
      } else if (this.char === CHAR_t || this.char === CHAR_f) {
        return this.goto(this.parseBoolean)
      } else if (this.char === CHAR_LSQB) {
        return this.call(this.parseInlineList, this.recordValue)
      } else if (this.char === CHAR_LCUB) {
        return this.call(this.parseInlineTable, this.recordValue)
      } else {
        throw this.error(new TomlError('Unexpected character, expecting string, number, datetime, boolean, inline array or inline table'))
      }
    }
    recordValue (value) {
      return this.returnNow(value)
    }

    parseInf () {
      if (this.char === CHAR_n) {
        return this.next(this.parseInf2)
      } else {
        throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'))
      }
    }
    parseInf2 () {
      if (this.char === CHAR_f) {
        if (this.state.buf === '-') {
          return this.return(-Infinity)
        } else {
          return this.return(Infinity)
        }
      } else {
        throw this.error(new TomlError('Unexpected character, expected "inf", "+inf" or "-inf"'))
      }
    }

    parseNan () {
      if (this.char === CHAR_a) {
        return this.next(this.parseNan2)
      } else {
        throw this.error(new TomlError('Unexpected character, expected "nan"'))
      }
    }
    parseNan2 () {
      if (this.char === CHAR_n) {
        return this.return(NaN)
      } else {
        throw this.error(new TomlError('Unexpected character, expected "nan"'))
      }
    }

    /* KEYS, barewords or basic, literal, or dotted */
    parseKeyword () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseBasicString)
      } else if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralString)
      } else {
        return this.goto(this.parseBareKey)
      }
    }

    /* KEYS: barewords */
    parseBareKey () {
      do {
        if (this.char === Parser.END) {
          throw this.error(new TomlError('Key ended without value'))
        } else if (isAlphaNumHyphen(this.char)) {
          this.consume()
        } else if (this.state.buf.length === 0) {
          throw this.error(new TomlError('Empty bare keys are not allowed'))
        } else {
          return this.returnNow()
        }
      } while (this.nextChar())
    }

    /* STRINGS, single quoted (literal) */
    parseSingleString () {
      if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralMultiStringMaybe)
      } else {
        return this.goto(this.parseLiteralString)
      }
    }
    parseLiteralString () {
      do {
        if (this.char === CHAR_APOS) {
          return this.return()
        } else if (this.atEndOfLine()) {
          throw this.error(new TomlError('Unterminated string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    parseLiteralMultiStringMaybe () {
      if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralMultiString)
      } else {
        return this.returnNow()
      }
    }
    parseLiteralMultiString () {
      if (this.char === CTRL_M) {
        return null
      } else if (this.char === CTRL_J) {
        return this.next(this.parseLiteralMultiStringContent)
      } else {
        return this.goto(this.parseLiteralMultiStringContent)
      }
    }
    parseLiteralMultiStringContent () {
      do {
        if (this.char === CHAR_APOS) {
          return this.next(this.parseLiteralMultiEnd)
        } else if (this.char === Parser.END) {
          throw this.error(new TomlError('Unterminated multi-line string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    parseLiteralMultiEnd () {
      if (this.char === CHAR_APOS) {
        return this.next(this.parseLiteralMultiEnd2)
      } else {
        this.state.buf += "'"
        return this.goto(this.parseLiteralMultiStringContent)
      }
    }
    parseLiteralMultiEnd2 () {
      if (this.char === CHAR_APOS) {
        return this.return()
      } else {
        this.state.buf += "''"
        return this.goto(this.parseLiteralMultiStringContent)
      }
    }

    /* STRINGS double quoted */
    parseDoubleString () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseMultiStringMaybe)
      } else {
        return this.goto(this.parseBasicString)
      }
    }
    parseBasicString () {
      do {
        if (this.char === CHAR_BSOL) {
          return this.call(this.parseEscape, this.recordEscapeReplacement)
        } else if (this.char === CHAR_QUOT) {
          return this.return()
        } else if (this.atEndOfLine()) {
          throw this.error(new TomlError('Unterminated string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    recordEscapeReplacement (replacement) {
      this.state.buf += replacement
      return this.goto(this.parseBasicString)
    }
    parseMultiStringMaybe () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseMultiString)
      } else {
        return this.returnNow()
      }
    }
    parseMultiString () {
      if (this.char === CTRL_M) {
        return null
      } else if (this.char === CTRL_J) {
        return this.next(this.parseMultiStringContent)
      } else {
        return this.goto(this.parseMultiStringContent)
      }
    }
    parseMultiStringContent () {
      do {
        if (this.char === CHAR_BSOL) {
          return this.call(this.parseMultiEscape, this.recordMultiEscapeReplacement)
        } else if (this.char === CHAR_QUOT) {
          return this.next(this.parseMultiEnd)
        } else if (this.char === Parser.END) {
          throw this.error(new TomlError('Unterminated multi-line string'))
        } else if (this.char === CHAR_DEL || (this.char <= CTRL_CHAR_BOUNDARY && this.char !== CTRL_I && this.char !== CTRL_J && this.char !== CTRL_M)) {
          throw this.errorControlCharInString()
        } else {
          this.consume()
        }
      } while (this.nextChar())
    }
    errorControlCharInString () {
      let displayCode = '\\u00'
      if (this.char < 16) {
        displayCode += '0'
      }
      displayCode += this.char.toString(16)

      return this.error(new TomlError(`Control characters (codes < 0x1f and 0x7f) are not allowed in strings, use ${displayCode} instead`))
    }
    recordMultiEscapeReplacement (replacement) {
      this.state.buf += replacement
      return this.goto(this.parseMultiStringContent)
    }
    parseMultiEnd () {
      if (this.char === CHAR_QUOT) {
        return this.next(this.parseMultiEnd2)
      } else {
        this.state.buf += '"'
        return this.goto(this.parseMultiStringContent)
      }
    }
    parseMultiEnd2 () {
      if (this.char === CHAR_QUOT) {
        return this.return()
      } else {
        this.state.buf += '""'
        return this.goto(this.parseMultiStringContent)
      }
    }
    parseMultiEscape () {
      if (this.char === CTRL_M || this.char === CTRL_J) {
        return this.next(this.parseMultiTrim)
      } else if (this.char === CHAR_SP || this.char === CTRL_I) {
        return this.next(this.parsePreMultiTrim)
      } else {
        return this.goto(this.parseEscape)
      }
    }
    parsePreMultiTrim () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === CTRL_M || this.char === CTRL_J) {
        return this.next(this.parseMultiTrim)
      } else {
        throw this.error(new TomlError("Can't escape whitespace"))
      }
    }
    parseMultiTrim () {
      // explicitly whitespace here, END should follow the same path as chars
      if (this.char === CTRL_J || this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M) {
        return null
      } else {
        return this.returnNow()
      }
    }
    parseEscape () {
      if (this.char in escapes) {
        return this.return(escapes[this.char])
      } else if (this.char === CHAR_u) {
        return this.call(this.parseSmallUnicode, this.parseUnicodeReturn)
      } else if (this.char === CHAR_U) {
        return this.call(this.parseLargeUnicode, this.parseUnicodeReturn)
      } else {
        throw this.error(new TomlError('Unknown escape character: ' + this.char))
      }
    }
    parseUnicodeReturn (char) {
      try {
        const codePoint = parseInt(char, 16)
        if (codePoint >= SURROGATE_FIRST && codePoint <= SURROGATE_LAST) {
          throw this.error(new TomlError('Invalid unicode, character in range 0xD800 - 0xDFFF is reserved'))
        }
        return this.returnNow(String.fromCodePoint(codePoint))
      } catch (err) {
        throw this.error(TomlError.wrap(err))
      }
    }
    parseSmallUnicode () {
      if (!isHexit(this.char)) {
        throw this.error(new TomlError('Invalid character in unicode sequence, expected hex'))
      } else {
        this.consume()
        if (this.state.buf.length >= 4) return this.return()
      }
    }
    parseLargeUnicode () {
      if (!isHexit(this.char)) {
        throw this.error(new TomlError('Invalid character in unicode sequence, expected hex'))
      } else {
        this.consume()
        if (this.state.buf.length >= 8) return this.return()
      }
    }

    /* NUMBERS */
    parseNumberSign () {
      this.consume()
      return this.next(this.parseMaybeSignedInfOrNan)
    }
    parseMaybeSignedInfOrNan () {
      if (this.char === CHAR_i) {
        return this.next(this.parseInf)
      } else if (this.char === CHAR_n) {
        return this.next(this.parseNan)
      } else {
        return this.callNow(this.parseNoUnder, this.parseNumberIntegerStart)
      }
    }
    parseNumberIntegerStart () {
      if (this.char === CHAR_0) {
        this.consume()
        return this.next(this.parseNumberIntegerExponentOrDecimal)
      } else {
        return this.goto(this.parseNumberInteger)
      }
    }
    parseNumberIntegerExponentOrDecimal () {
      if (this.char === CHAR_PERIOD) {
        this.consume()
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else {
        return this.returnNow(Integer(this.state.buf))
      }
    }
    parseNumberInteger () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder)
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else if (this.char === CHAR_PERIOD) {
        this.consume()
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }
    parseNoUnder () {
      if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD || this.char === CHAR_E || this.char === CHAR_e) {
        throw this.error(new TomlError('Unexpected character, expected digit'))
      } else if (this.atEndOfWord()) {
        throw this.error(new TomlError('Incomplete number'))
      }
      return this.returnNow()
    }
    parseNoUnderHexOctBinLiteral () {
      if (this.char === CHAR_LOWBAR || this.char === CHAR_PERIOD) {
        throw this.error(new TomlError('Unexpected character, expected digit'))
      } else if (this.atEndOfWord()) {
        throw this.error(new TomlError('Incomplete number'))
      }
      return this.returnNow()
    }
    parseNumberFloat () {
      if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else if (isDigit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else {
        return this.returnNow(Float(this.state.buf))
      }
    }
    parseNumberExponentSign () {
      if (isDigit(this.char)) {
        return this.goto(this.parseNumberExponent)
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        this.consume()
        this.call(this.parseNoUnder, this.parseNumberExponent)
      } else {
        throw this.error(new TomlError('Unexpected character, expected -, + or digit'))
      }
    }
    parseNumberExponent () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder)
      } else {
        return this.returnNow(Float(this.state.buf))
      }
    }

    /* NUMBERS or DATETIMES  */
    parseNumberOrDateTime () {
      if (this.char === CHAR_0) {
        this.consume()
        return this.next(this.parseNumberBaseOrDateTime)
      } else {
        return this.goto(this.parseNumberOrDateTimeOnly)
      }
    }
    parseNumberOrDateTimeOnly () {
      // note, if two zeros are in a row then it MUST be a date
      if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnder, this.parseNumberInteger)
      } else if (isDigit(this.char)) {
        this.consume()
        if (this.state.buf.length > 4) this.next(this.parseNumberInteger)
      } else if (this.char === CHAR_E || this.char === CHAR_e) {
        this.consume()
        return this.next(this.parseNumberExponentSign)
      } else if (this.char === CHAR_PERIOD) {
        this.consume()
        return this.call(this.parseNoUnder, this.parseNumberFloat)
      } else if (this.char === CHAR_HYPHEN) {
        return this.goto(this.parseDateTime)
      } else if (this.char === CHAR_COLON) {
        return this.goto(this.parseOnlyTimeHour)
      } else {
        return this.returnNow(Integer(this.state.buf))
      }
    }
    parseDateTimeOnly () {
      if (this.state.buf.length < 4) {
        if (isDigit(this.char)) {
          return this.consume()
        } else if (this.char === CHAR_COLON) {
          return this.goto(this.parseOnlyTimeHour)
        } else {
          throw this.error(new TomlError('Expected digit while parsing year part of a date'))
        }
      } else {
        if (this.char === CHAR_HYPHEN) {
          return this.goto(this.parseDateTime)
        } else {
          throw this.error(new TomlError('Expected hyphen (-) while parsing year part of date'))
        }
      }
    }
    parseNumberBaseOrDateTime () {
      if (this.char === CHAR_b) {
        this.consume()
        return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerBin)
      } else if (this.char === CHAR_o) {
        this.consume()
        return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerOct)
      } else if (this.char === CHAR_x) {
        this.consume()
        return this.call(this.parseNoUnderHexOctBinLiteral, this.parseIntegerHex)
      } else if (this.char === CHAR_PERIOD) {
        return this.goto(this.parseNumberInteger)
      } else if (isDigit(this.char)) {
        return this.goto(this.parseDateTimeOnly)
      } else {
        return this.returnNow(Integer(this.state.buf))
      }
    }
    parseIntegerHex () {
      if (isHexit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnderHexOctBinLiteral)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }
    parseIntegerOct () {
      if (isOctit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnderHexOctBinLiteral)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }
    parseIntegerBin () {
      if (isBit(this.char)) {
        this.consume()
      } else if (this.char === CHAR_LOWBAR) {
        return this.call(this.parseNoUnderHexOctBinLiteral)
      } else {
        const result = Integer(this.state.buf)
        /* istanbul ignore if */
        if (result.isNaN()) {
          throw this.error(new TomlError('Invalid number'))
        } else {
          return this.returnNow(result)
        }
      }
    }

    /* DATETIME */
    parseDateTime () {
      // we enter here having just consumed the year and about to consume the hyphen
      if (this.state.buf.length < 4) {
        throw this.error(new TomlError('Years less than 1000 must be zero padded to four characters'))
      }
      this.state.result = this.state.buf
      this.state.buf = ''
      return this.next(this.parseDateMonth)
    }
    parseDateMonth () {
      if (this.char === CHAR_HYPHEN) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Months less than 10 must be zero padded to two characters'))
        }
        this.state.result += '-' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseDateDay)
      } else if (isDigit(this.char)) {
        this.consume()
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseDateDay () {
      if (this.char === CHAR_T || this.char === CHAR_SP) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Days less than 10 must be zero padded to two characters'))
        }
        this.state.result += '-' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseStartTimeHour)
      } else if (this.atEndOfWord()) {
        return this.returnNow(createDate(this.state.result + '-' + this.state.buf))
      } else if (isDigit(this.char)) {
        this.consume()
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseStartTimeHour () {
      if (this.atEndOfWord()) {
        return this.returnNow(createDate(this.state.result))
      } else {
        return this.goto(this.parseTimeHour)
      }
    }
    parseTimeHour () {
      if (this.char === CHAR_COLON) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Hours less than 10 must be zero padded to two characters'))
        }
        this.state.result += 'T' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseTimeMin)
      } else if (isDigit(this.char)) {
        this.consume()
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseTimeMin () {
      if (this.state.buf.length < 2 && isDigit(this.char)) {
        this.consume()
      } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
        this.state.result += ':' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseTimeSec)
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }
    parseTimeSec () {
      if (isDigit(this.char)) {
        this.consume()
        if (this.state.buf.length === 2) {
          this.state.result += ':' + this.state.buf
          this.state.buf = ''
          return this.next(this.parseTimeZoneOrFraction)
        }
      } else {
        throw this.error(new TomlError('Incomplete datetime'))
      }
    }

    parseOnlyTimeHour () {
      /* istanbul ignore else */
      if (this.char === CHAR_COLON) {
        if (this.state.buf.length < 2) {
          throw this.error(new TomlError('Hours less than 10 must be zero padded to two characters'))
        }
        this.state.result = this.state.buf
        this.state.buf = ''
        return this.next(this.parseOnlyTimeMin)
      } else {
        throw this.error(new TomlError('Incomplete time'))
      }
    }
    parseOnlyTimeMin () {
      if (this.state.buf.length < 2 && isDigit(this.char)) {
        this.consume()
      } else if (this.state.buf.length === 2 && this.char === CHAR_COLON) {
        this.state.result += ':' + this.state.buf
        this.state.buf = ''
        return this.next(this.parseOnlyTimeSec)
      } else {
        throw this.error(new TomlError('Incomplete time'))
      }
    }
    parseOnlyTimeSec () {
      if (isDigit(this.char)) {
        this.consume()
        if (this.state.buf.length === 2) {
          return this.next(this.parseOnlyTimeFractionMaybe)
        }
      } else {
        throw this.error(new TomlError('Incomplete time'))
      }
    }
    parseOnlyTimeFractionMaybe () {
      this.state.result += ':' + this.state.buf
      if (this.char === CHAR_PERIOD) {
        this.state.buf = ''
        this.next(this.parseOnlyTimeFraction)
      } else {
        return this.return(createTime(this.state.result))
      }
    }
    parseOnlyTimeFraction () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.atEndOfWord()) {
        if (this.state.buf.length === 0) throw this.error(new TomlError('Expected digit in milliseconds'))
        return this.returnNow(createTime(this.state.result + '.' + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z'))
      }
    }

    parseTimeZoneOrFraction () {
      if (this.char === CHAR_PERIOD) {
        this.consume()
        this.next(this.parseDateTimeFraction)
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        this.consume()
        this.next(this.parseTimeZoneHour)
      } else if (this.char === CHAR_Z) {
        this.consume()
        return this.return(createDateTime(this.state.result + this.state.buf))
      } else if (this.atEndOfWord()) {
        return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z'))
      }
    }
    parseDateTimeFraction () {
      if (isDigit(this.char)) {
        this.consume()
      } else if (this.state.buf.length === 1) {
        throw this.error(new TomlError('Expected digit in milliseconds'))
      } else if (this.char === CHAR_HYPHEN || this.char === CHAR_PLUS) {
        this.consume()
        this.next(this.parseTimeZoneHour)
      } else if (this.char === CHAR_Z) {
        this.consume()
        return this.return(createDateTime(this.state.result + this.state.buf))
      } else if (this.atEndOfWord()) {
        return this.returnNow(createDateTimeFloat(this.state.result + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected period (.), minus (-), plus (+) or Z'))
      }
    }
    parseTimeZoneHour () {
      if (isDigit(this.char)) {
        this.consume()
        // FIXME: No more regexps
        if (/\d\d$/.test(this.state.buf)) return this.next(this.parseTimeZoneSep)
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected digit'))
      }
    }
    parseTimeZoneSep () {
      if (this.char === CHAR_COLON) {
        this.consume()
        this.next(this.parseTimeZoneMin)
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected colon'))
      }
    }
    parseTimeZoneMin () {
      if (isDigit(this.char)) {
        this.consume()
        if (/\d\d$/.test(this.state.buf)) return this.return(createDateTime(this.state.result + this.state.buf))
      } else {
        throw this.error(new TomlError('Unexpected character in datetime, expected digit'))
      }
    }

    /* BOOLEAN */
    parseBoolean () {
      /* istanbul ignore else */
      if (this.char === CHAR_t) {
        this.consume()
        return this.next(this.parseTrue_r)
      } else if (this.char === CHAR_f) {
        this.consume()
        return this.next(this.parseFalse_a)
      }
    }
    parseTrue_r () {
      if (this.char === CHAR_r) {
        this.consume()
        return this.next(this.parseTrue_u)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }
    parseTrue_u () {
      if (this.char === CHAR_u) {
        this.consume()
        return this.next(this.parseTrue_e)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }
    parseTrue_e () {
      if (this.char === CHAR_e) {
        return this.return(true)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_a () {
      if (this.char === CHAR_a) {
        this.consume()
        return this.next(this.parseFalse_l)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_l () {
      if (this.char === CHAR_l) {
        this.consume()
        return this.next(this.parseFalse_s)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_s () {
      if (this.char === CHAR_s) {
        this.consume()
        return this.next(this.parseFalse_e)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    parseFalse_e () {
      if (this.char === CHAR_e) {
        return this.return(false)
      } else {
        throw this.error(new TomlError('Invalid boolean, expected true or false'))
      }
    }

    /* INLINE LISTS */
    parseInlineList () {
      if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
        return null
      } else if (this.char === Parser.END) {
        throw this.error(new TomlError('Unterminated inline array'))
      } else if (this.char === CHAR_NUM) {
        return this.call(this.parseComment)
      } else if (this.char === CHAR_RSQB) {
        return this.return(this.state.resultArr || InlineList())
      } else {
        return this.callNow(this.parseValue, this.recordInlineListValue)
      }
    }
    recordInlineListValue (value) {
      if (this.state.resultArr) {
        const listType = this.state.resultArr[_contentType]
        const valueType = tomlType(value)
        if (listType !== valueType) {
          throw this.error(new TomlError(`Inline lists must be a single type, not a mix of ${listType} and ${valueType}`))
        }
      } else {
        this.state.resultArr = InlineList(tomlType(value))
      }
      if (isFloat(value) || isInteger(value)) {
        // unbox now that we've verified they're ok
        this.state.resultArr.push(value.valueOf())
      } else {
        this.state.resultArr.push(value)
      }
      return this.goto(this.parseInlineListNext)
    }
    parseInlineListNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I || this.char === CTRL_M || this.char === CTRL_J) {
        return null
      } else if (this.char === CHAR_NUM) {
        return this.call(this.parseComment)
      } else if (this.char === CHAR_COMMA) {
        return this.next(this.parseInlineList)
      } else if (this.char === CHAR_RSQB) {
        return this.goto(this.parseInlineList)
      } else {
        throw this.error(new TomlError('Invalid character, expected whitespace, comma (,) or close bracket (])'))
      }
    }

    /* INLINE TABLE */
    parseInlineTable () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
        throw this.error(new TomlError('Unterminated inline array'))
      } else if (this.char === CHAR_RCUB) {
        return this.return(this.state.resultTable || InlineTable())
      } else {
        if (!this.state.resultTable) this.state.resultTable = InlineTable()
        return this.callNow(this.parseAssign, this.recordInlineTableValue)
      }
    }
    recordInlineTableValue (kv) {
      let target = this.state.resultTable
      let finalKey = kv.key.pop()
      for (let kw of kv.key) {
        if (hasKey(target, kw) && (!isTable(target[kw]) || target[kw][_declared])) {
          throw this.error(new TomlError("Can't redefine existing key"))
        }
        target = target[kw] = target[kw] || Table()
      }
      if (hasKey(target, finalKey)) {
        throw this.error(new TomlError("Can't redefine existing key"))
      }
      if (isInteger(kv.value) || isFloat(kv.value)) {
        target[finalKey] = kv.value.valueOf()
      } else {
        target[finalKey] = kv.value
      }
      return this.goto(this.parseInlineTableNext)
    }
    parseInlineTableNext () {
      if (this.char === CHAR_SP || this.char === CTRL_I) {
        return null
      } else if (this.char === Parser.END || this.char === CHAR_NUM || this.char === CTRL_J || this.char === CTRL_M) {
        throw this.error(new TomlError('Unterminated inline array'))
      } else if (this.char === CHAR_COMMA) {
        return this.next(this.parseInlineTable)
      } else if (this.char === CHAR_RCUB) {
        return this.goto(this.parseInlineTable)
      } else {
        throw this.error(new TomlError('Invalid character, expected whitespace, comma (,) or close bracket (])'))
      }
    }
  }
  return TOMLParser
}


/***/ }),

/***/ 133:
/***/ (function(module) {

"use strict";

module.exports = (d, num) => {
  num = String(num)
  while (num.length < d) num = '0' + num
  return num
}


/***/ }),

/***/ 197:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

exports.parse = __webpack_require__(734)
exports.stringify = __webpack_require__(30)


/***/ }),

/***/ 198:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(__webpack_require__(470));
const wait_1 = __webpack_require__(521);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ms = core.getInput('milliseconds');
            core.debug(`Waiting ${ms} milliseconds ...`); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
            core.debug(new Date().toTimeString());
            yield wait_1.wait(parseInt(ms, 10));
            core.debug(new Date().toTimeString());
            core.setOutput('time', new Date().toTimeString());
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();


/***/ }),

/***/ 221:
/***/ (function(module) {

"use strict";

const ParserEND = 0x110000
class ParserError extends Error {
  /* istanbul ignore next */
  constructor (msg, filename, linenumber) {
    super('[ParserError] ' + msg, filename, linenumber)
    this.name = 'ParserError'
    this.code = 'ParserError'
    if (Error.captureStackTrace) Error.captureStackTrace(this, ParserError)
  }
}
class State {
  constructor (parser) {
    this.parser = parser
    this.buf = ''
    this.returned = null
    this.result = null
    this.resultTable = null
    this.resultArr = null
  }
}
class Parser {
  constructor () {
    this.pos = 0
    this.col = 0
    this.line = 0
    this.obj = {}
    this.ctx = this.obj
    this.stack = []
    this._buf = ''
    this.char = null
    this.ii = 0
    this.state = new State(this.parseStart)
  }

  parse (str) {
    /* istanbul ignore next */
    if (str.length === 0 || str.length == null) return

    this._buf = String(str)
    this.ii = -1
    this.char = -1
    let getNext
    while (getNext === false || this.nextChar()) {
      getNext = this.runOne()
    }
    this._buf = null
  }
  nextChar () {
    if (this.char === 0x0A) {
      ++this.line
      this.col = -1
    }
    ++this.ii
    this.char = this._buf.codePointAt(this.ii)
    ++this.pos
    ++this.col
    return this.haveBuffer()
  }
  haveBuffer () {
    return this.ii < this._buf.length
  }
  runOne () {
    return this.state.parser.call(this, this.state.returned)
  }
  finish () {
    this.char = ParserEND
    let last
    do {
      last = this.state.parser
      this.runOne()
    } while (this.state.parser !== last)

    this.ctx = null
    this.state = null
    this._buf = null

    return this.obj
  }
  next (fn) {
    /* istanbul ignore next */
    if (typeof fn !== 'function') throw new ParserError('Tried to set state to non-existent state: ' + JSON.stringify(fn))
    this.state.parser = fn
  }
  goto (fn) {
    this.next(fn)
    return this.runOne()
  }
  call (fn, returnWith) {
    if (returnWith) this.next(returnWith)
    this.stack.push(this.state)
    this.state = new State(fn)
  }
  callNow (fn, returnWith) {
    this.call(fn, returnWith)
    return this.runOne()
  }
  return (value) {
    /* istanbul ignore next */
    if (this.stack.length === 0) throw this.error(new ParserError('Stack underflow'))
    if (value === undefined) value = this.state.buf
    this.state = this.stack.pop()
    this.state.returned = value
  }
  returnNow (value) {
    this.return(value)
    return this.runOne()
  }
  consume () {
    /* istanbul ignore next */
    if (this.char === ParserEND) throw this.error(new ParserError('Unexpected end-of-buffer'))
    this.state.buf += this._buf[this.ii]
  }
  error (err) {
    err.line = this.line
    err.col = this.col
    err.pos = this.pos
    return err
  }
  /* istanbul ignore next */
  parseStart () {
    throw new ParserError('Must declare a parseStart method')
  }
}
Parser.END = ParserEND
Parser.Error = ParserError
module.exports = Parser


/***/ }),

/***/ 335:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const f = __webpack_require__(133)

class FloatingDateTime extends Date {
  constructor (value) {
    super(value + 'Z')
    this.isFloating = true
  }
  toISOString () {
    const date = `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`
    const time = `${f(2, this.getUTCHours())}:${f(2, this.getUTCMinutes())}:${f(2, this.getUTCSeconds())}.${f(3, this.getUTCMilliseconds())}`
    return `${date}T${time}`
  }
}

module.exports = value => {
  const date = new FloatingDateTime(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ }),

/***/ 371:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const f = __webpack_require__(133)
const DateTime = global.Date

class Date extends DateTime {
  constructor (value) {
    super(value)
    this.isDate = true
  }
  toISOString () {
    return `${this.getUTCFullYear()}-${f(2, this.getUTCMonth() + 1)}-${f(2, this.getUTCDate())}`
  }
}

module.exports = value => {
  const date = new Date(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 450:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

module.exports = parseAsync

const TOMLParser = __webpack_require__(132)
const prettyError = __webpack_require__(74)

function parseAsync (str, opts) {
  if (!opts) opts = {}
  const index = 0
  const blocksize = opts.blocksize || 40960
  const parser = new TOMLParser()
  return new Promise((resolve, reject) => {
    setImmediate(parseAsyncNext, index, blocksize, resolve, reject)
  })
  function parseAsyncNext (index, blocksize, resolve, reject) {
    if (index >= str.length) {
      try {
        return resolve(parser.finish())
      } catch (err) {
        return reject(prettyError(err, str))
      }
    }
    try {
      parser.parse(str.slice(index, index + blocksize))
      setImmediate(parseAsyncNext, index + blocksize, blocksize, resolve, reject)
    } catch (err) {
      reject(prettyError(err, str))
    }
  }
}


/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 521:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = void 0;
/* eslint-disable no-console */
const cp = __importStar(__webpack_require__(129));
const fs = __importStar(__webpack_require__(747));
const path = __importStar(__webpack_require__(622));
const core = __importStar(__webpack_require__(470));
const toml_1 = __importDefault(__webpack_require__(197));
const configName = core.getInput('config_file');
// TODO: getInput() doesn't seem to get the yaml default value during tests?
const configPath = path.join(process.cwd(), configName || 'myconfig.toml');
function wait(milliseconds) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('PRINTING LS');
        console.log(cp.execSync('ls -alh', { encoding: 'utf8' }));
        console.log('PRINTING PWD');
        console.log(cp.execSync('pwd', { encoding: 'utf8' }));
        console.log('CONFIG PATH IS', configName, configPath);
        const parsedConfig = toml_1.default.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('PRINTING PARSED CONFIG');
        console.log(JSON.stringify(parsedConfig, null, 2));
        return new Promise(resolve => {
            if (isNaN(milliseconds)) {
                throw new Error('milliseconds not a number');
            }
            setTimeout(() => resolve('done!'), milliseconds);
        });
    });
}
exports.wait = wait;


/***/ }),

/***/ 539:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

module.exports = parseStream

const stream = __webpack_require__(413)
const TOMLParser = __webpack_require__(132)

function parseStream (stm) {
  if (stm) {
    return parseReadable(stm)
  } else {
    return parseTransform(stm)
  }
}

function parseReadable (stm) {
  const parser = new TOMLParser()
  stm.setEncoding('utf8')
  return new Promise((resolve, reject) => {
    let readable
    let ended = false
    let errored = false
    function finish () {
      ended = true
      if (readable) return
      try {
        resolve(parser.finish())
      } catch (err) {
        reject(err)
      }
    }
    function error (err) {
      errored = true
      reject(err)
    }
    stm.once('end', finish)
    stm.once('error', error)
    readNext()

    function readNext () {
      readable = true
      let data
      while ((data = stm.read()) !== null) {
        try {
          parser.parse(data)
        } catch (err) {
          return error(err)
        }
      }
      readable = false
      /* istanbul ignore if */
      if (ended) return finish()
      /* istanbul ignore if */
      if (errored) return
      stm.once('readable', readNext)
    }
  })
}

function parseTransform () {
  const parser = new TOMLParser()
  return new stream.Transform({
    objectMode: true,
    transform (chunk, encoding, cb) {
      try {
        parser.parse(chunk.toString(encoding))
      } catch (err) {
        this.emit('error', err)
      }
      cb()
    },
    flush (cb) {
      try {
        this.push(parser.finish())
      } catch (err) {
        this.emit('error', err)
      }
      cb()
    }
  })
}


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 689:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

module.exports = parseString

const TOMLParser = __webpack_require__(132)
const prettyError = __webpack_require__(74)

function parseString (str) {
  if (global.Buffer && global.Buffer.isBuffer(str)) {
    str = str.toString('utf8')
  }
  const parser = new TOMLParser()
  try {
    parser.parse(str)
    return parser.finish()
  } catch (err) {
    throw prettyError(err, str)
  }
}


/***/ }),

/***/ 734:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(689)
module.exports.async = __webpack_require__(450)
module.exports.stream = __webpack_require__(539)
module.exports.prettyError = __webpack_require__(74)


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 992:
/***/ (function(module) {

"use strict";

module.exports = value => {
  const date = new Date(value)
  /* istanbul ignore if */
  if (isNaN(date)) {
    throw new TypeError('Invalid Datetime')
  } else {
    return date
  }
}


/***/ })

/******/ });
//# sourceMappingURL=index.js.map