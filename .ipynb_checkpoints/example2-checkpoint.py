__all__ = ['example2']

# Don't look below, you will not understand this Python code :) I don't.

from js2py.pyjs import *
# setting scope
var = Scope( JS_BUILTINS )
set_global_object(var)

# Code follows:
var.registers(['heyman'])
@Js
def PyJsHoisted_heyman_(this, arguments, var=var):
    var = Scope({'this':this, 'arguments':arguments}, var)
    var.registers([])
    return (Js(2.0)+Js(2.0))
PyJsHoisted_heyman_.func_name = 'heyman'
var.put('heyman', PyJsHoisted_heyman_)
pass
var.get('heyman')()


# Add lib to the module scope
example2 = var.to_python()