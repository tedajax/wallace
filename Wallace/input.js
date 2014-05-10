var Keys = (function () {
    function Keys() {
    }
    Keys.ZERO = 48;
    Keys.ONE = 49;
    Keys.TWO = 50;
    Keys.THREE = 51;
    Keys.FOUR = 52;
    Keys.FIVE = 53;
    Keys.SIX = 54;
    Keys.SEVEN = 55;
    Keys.EIGHT = 56;
    Keys.NINE = 57;

    Keys.A = 65;
    Keys.B = 66;
    Keys.C = 67;
    Keys.D = 68;
    Keys.E = 69;
    Keys.F = 70;
    Keys.G = 71;
    Keys.H = 72;
    Keys.I = 73;
    Keys.J = 74;
    Keys.K = 75;
    Keys.L = 76;
    Keys.M = 77;
    Keys.N = 78;
    Keys.O = 79;
    Keys.P = 80;
    Keys.Q = 81;
    Keys.R = 82;
    Keys.S = 83;
    Keys.T = 84;
    Keys.U = 85;
    Keys.V = 86;
    Keys.W = 87;
    Keys.X = 88;
    Keys.Y = 89;
    Keys.Z = 90;

    Keys.SPACE = 32;

    Keys.LEFT = 37;
    Keys.RIGHT = 39;
    Keys.UP = 38;
    Keys.DOWN = 40;

    Keys.F1 = 112;
    Keys.F2 = 113;
    Keys.F3 = 114;
    Keys.F4 = 115;
    Keys.F5 = 116;
    Keys.F6 = 117;
    Keys.F7 = 118;
    Keys.F8 = 119;
    Keys.F9 = 120;
    Keys.F10 = 121;
    Keys.F11 = 122;
    Keys.F12 = 123;

    Keys.HYPEN = 189;
    Keys.EQUALS = 187;
    return Keys;
})();

var MouseButtons = (function () {
    function MouseButtons() {
    }
    MouseButtons.NONE = -1;
    MouseButtons.LEFT = 0;
    MouseButtons.MIDDLE = 1;
    MouseButtons.RIGHT = 2;
    return MouseButtons;
})();

var MouseState = (function () {
    function MouseState() {
        this.x = 0;
        this.y = 0;
        this.buttons = [false, false, false];
    }
    MouseState.prototype.clone = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.buttons = other.buttons.slice(0);
    };
    return MouseState;
})();

var InputAxisKey = (function () {
    function InputAxisKey(keycode, scale) {
        this.keycode = keycode;
        this.scale = Math.min(Math.max(scale, -1), 1);
    }
    return InputAxisKey;
})();

var InputAxis = (function () {
    function InputAxis(name) {
        this.name = name;
        this.keys = [];
        this.axisValue = 0;
    }
    InputAxis.prototype.addKeys = function (keycode, scale) {
        this.keys.push(new InputAxisKey(keycode, scale));
    };

    InputAxis.prototype.addPositiveKey = function (keycode, scale) {
        this.keys.push(new InputAxisKey(keycode, Math.abs(scale)));
    };

    InputAxis.prototype.addNegativeKey = function (keycode, scale) {
        this.keys.push(new InputAxisKey(keycode, -Math.abs(scale)));
    };

    InputAxis.prototype.updateAxisValue = function (input) {
        var maxValue = 0;
        var minValue = 0;
        for (var i = 0, len = this.keys.length; i < len; ++i) {
            var k = this.keys[i].keycode;
            var s = this.keys[i].scale;
            if (input.getKey(k)) {
                if (s > maxValue) {
                    maxValue = s;
                }
                if (s < minValue) {
                    minValue = s;
                }
            }
        }

        this.axisValue = maxValue + minValue;
    };

    InputAxis.prototype.getAxisValue = function () {
        return this.axisValue;
    };
    return InputAxis;
})();

var Input = (function () {
    function Input() {
        this.newKeys = [];
        this.oldKeys = [];

        for (var i = 0; i < 256; ++i) {
            this.newKeys[i] = false;
            this.oldKeys[i] = false;
        }

        this.newMouseState = new MouseState();
        this.oldMouseState = new MouseState();

        this.buttons = {};
        this.axes = {};

        this.initEvents();
    }
    Input.prototype.initEvents = function () {
        var _this = this;
        document.onkeydown = function (event) {
            _this.onKeyDown(event);
        };
        document.onkeyup = function (event) {
            _this.onKeyUp(event);
        };
        document.onmousedown = function (event) {
            _this.onMouseDown(event);
        };
        document.onmouseup = function (event) {
            _this.onMouseUp(event);
        };
        document.onmousemove = function (event) {
            _this.onMouseMove(event);
        };
    };

    Input.prototype.onKeyDown = function (event) {
        this.newKeys[event.keyCode] = true;
    };

    Input.prototype.onKeyUp = function (event) {
        this.newKeys[event.keyCode] = false;
    };

    Input.prototype.onMouseDown = function (event) {
        this.newMouseState.buttons[event.button] = true;

        return false;
    };

    Input.prototype.onMouseUp = function (event) {
        this.newMouseState.buttons[event.button] = false;

        return false;
    };

    Input.prototype.onMouseMove = function (event) {
        var x = event.clientX - game.canvas.offsetLeft;
        var y = event.clientY - game.canvas.offsetTop;

        this.newMouseState.x = x;
        this.newMouseState.y = y;
    };

    Input.prototype.update = function () {
        this.oldKeys = this.newKeys.slice(0);
        this.oldMouseState.clone(this.newMouseState);
    };

    Input.prototype.registerAxis = function (name, positiveKey, negativeKey) {
        if (this.axes[name] == null) {
            this.axes[name] = new InputAxis(name);
        }

        if (positiveKey != null) {
            this.axes[name].addPositiveKey(positiveKey, 1.0);
        }
        if (negativeKey != null) {
            this.axes[name].addNegativeKey(negativeKey, 1.0);
        }
    };

    Input.prototype.getAxis = function (name) {
        if (this.axes[name] == null) {
            throw "Error no axis named " + name;
        }

        this.axes[name].updateAxisValue(this);
        return this.axes[name].getAxisValue();
    };

    Input.prototype.registerButton = function (name) {
        var keys = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            keys[_i] = arguments[_i + 1];
        }
        if (this.buttons[name] == null) {
            this.buttons[name] = [];
        }

        for (var i = 0, len = keys.length; i < len; ++i) {
            //todo do we care about the dupes?
            this.buttons[name].push(keys[i]);
        }
    };

    Input.prototype.getButton = function (name) {
        if (this.buttons[name] == null) {
            throw "No button registered with name " + name;
            return;
        }

        for (var i = 0, len = this.buttons[name].length; i < len; ++i) {
            if (this.newKeys[this.buttons[name][i]]) {
                return true;
            }
        }

        return false;
    };

    Input.prototype.getButtonDown = function (name) {
        if (this.buttons[name] == null) {
            throw "No button registered with name " + name;
            return;
        }

        var result = false;
        for (var i = 0, len = this.buttons[name].length; i < len; ++i) {
            if (this.newKeys[this.buttons[name][i]]) {
                result = true;
            }
            if (this.oldKeys[this.buttons[name][i]]) {
                return false;
            }
        }

        return result;
    };

    Input.prototype.getButtonUp = function (name) {
        if (this.buttons[name] == null) {
            throw "No button registered with name " + name;
            return;
        }

        var result = false;
        for (var i = 0, len = this.buttons[name].length; i < len; ++i) {
            if (this.newKeys[this.buttons[name][i]]) {
                return false;
            }
            if (this.oldKeys[this.buttons[name][i]]) {
                result = true;
            }
        }

        return result;
    };

    Input.prototype.getKey = function (keycode) {
        return this.newKeys[keycode];
    };

    Input.prototype.getKeyUp = function (keycode) {
        return (!this.newKeys[keycode] && this.oldKeys[keycode]);
    };

    Input.prototype.getKeyDown = function (keycode) {
        return (this.newKeys[keycode] && !this.oldKeys[keycode]);
    };

    Input.prototype.getMouseButton = function (button) {
        return this.newMouseState.buttons[button];
    };

    Input.prototype.getMouseButtonUp = function (button) {
        return (!this.newMouseState.buttons[button] && this.oldMouseState.buttons[button]);
    };

    Input.prototype.getMouseButtonDown = function (button) {
        return (this.newMouseState.buttons[button] && !this.oldMouseState.buttons[button]);
    };

    Input.prototype.getMouseX = function () {
        return this.newMouseState.x;
    };

    Input.prototype.getMouseY = function () {
        return this.newMouseState.y;
    };
    return Input;
})();
//# sourceMappingURL=input.js.map
