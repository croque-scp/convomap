# TODO Store string location for syntax highlighting
# TODO Might need to store string endpoint (from String.length) as well;
# this might mean needing to handle strings directly in postprocessors

@builtin "whitespace.ne"

# Flatten any nested array to a postfix structure.
# Nearley uses nested arrays in most of the stages of its parsing process,
# so flattening the array here simplifies most postprocessors significantly.
main -> _ expression _ {% d => d[1].flat(Infinity) %}

# Cascade through each kind of boolean expression in reverse order of
# precedence:
# 1. Binary expression
# 2. Unary expression
# 3. Function call
# 4. Parenthesised expression
expression -> binaryExpression

binaryExpression ->
    binaryExpression __ binaryOperator __ unaryExpression
    {% ([expr0, , op, , expr1]) => [expr0, expr1, op] %}
  | unaryExpression

unaryExpression ->
    unaryOperator __ primaryExpression
    {% ([op, , expr]) => [expr, op] %}
  | primaryExpression

primaryExpression ->
    conditionFunction
  | "(" _ expression _ ")"
    {% ([, , expr]) => [expr] %}

conditionFunction ->
    conditionFunctionName "(" _ conditionArgument _ ")"
    {% ([cond, , , arg]) => [{ condition: cond[0], argument: arg[0] }] %}

conditionFunctionName -> identifier

conditionArgument -> interaction | identifier

# The name of an interaction. Denoted by a leading colon.
# The event and interaction are delimited by .; if none exists, the entire
# phrase is assumed to be the interaction name and it is assumed to be found
# in the current event.
interaction ->
    ":" (identifier "."):? identifier
	{% ([, eventName, interactionName]) => {
    return {
      interactionName,
      eventName: eventName ? eventName[0] : null
    }
  } %}

unaryOperator -> "EVER"i | "NOT"i

binaryOperator -> "AND"i | "OR"i

identifier ->
    [A-Za-z] [A-Za-z0-9]:*
    {% ([first, rest]) => [first, ...rest].join("") %}
