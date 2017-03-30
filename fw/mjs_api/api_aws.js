// AWS API, see AWS documentation at
// http://docs.aws.amazon.com/iot/latest/developerguide/iot-thing-shadows.html

let AWS = {
  Shadow: {
    _seth: ffi('void mgos_aws_shadow_set_state_handler_simple(int (*)(userdata, int, char *, char *), userdata)'),
    _upd: ffi('int mgos_aws_shadow_update_simple(double, char *)'),
    _scb: function(ud, ev, rep, des) {
      rep = rep !== "" ? JSON.parse(rep) : {};
      des = des !== "" ? JSON.parse(des) : {};
      return ud.cb(ud.ud, ev, rep, des);
    },

    // ## **`AWS.Shadow.setStateHandler(callback, userdata)`**
    // Set AWS shadow
    // state handler callback. When AWS shadow state changes, the callback is
    // called with the following arguments: `(userdata, event, reported,
    // desired)`, where `userdata` is the userdata given to `setStateHandler`,
    // `event` is one of the following: `AWS.Shadow.CONNECTED`,
    // `AWS.Shadow.GET_ACCEPTED`,
    // `AWS.Shadow.GET_REJECTED`, `AWS.Shadow.UPDATE_ACCEPTED`,
    // `AWS.Shadow.UPDATE_REJECTED`, `AWS.Shadow.UPDATE_DELTA`.
    // `reported` is previously reported state object (if any), and `desired`
    // is the desired state (if present).
    //
    // Example:
    // ```javascript
    // AWS.Shadow.setStateHandler(function(data, event, reported, desired) {
    //   print('Reported:', JSON.stringify(reported));
    //   print('Desired:', JSON.stringify(desired));
    // }, null);
    // ```
    setStateHandler: function(cb, ud) {
      this._seth(this._scb, {
        cb: cb,
        ud: ud,
      });
    },

    // ## **`AWS.Shadow.update(version, state)`** 
    // Update AWS shadow state.
    // State should be an object with "reported" and/or "desired" keys.
    //
    // Response will arrive via `UPDATE_ACCEPTED` or `UPDATE_REJECTED` events.
    // If you want the update to be aplied only if a particular version is
    // current, specify the version. Otherwise set it to 0 to apply to any
    // version. Example:
    // ```javascript
    // let state = {state: {reported: {foo: 1, bar: 2}}};
    // AWS.Shadow.update(0, state);
    // ```

    update: function(ver, state) {
      return this._upd(ver, JSON.stringify(state)) === 1;
    },

    CONNECTED: 0,
    GET_ACCEPTED: 1,
    GET_REJECTED: 2,
    UPDATE_ACCEPTED: 3,
    UPDATE_REJECTED: 4,
    UPDATE_DELTA: 5,
  },
};
