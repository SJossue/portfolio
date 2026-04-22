# LogRocket SDK Setup

You are setting up the LogRocket JavaScript SDK in this project. The app ID is `APP_ID`. Follow every section below in order.

- https://docs.logrocket.com/docs/quickstart
- https://docs.logrocket.com/reference/init
- https://docs.logrocket.com/reference/identify
- https://docs.logrocket.com/reference/release
- https://docs.logrocket.com/reference/mergeiframes — conditional on iframes being found
- https://docs.logrocket.com/reference/track
- https://docs.logrocket.com/reference/redux-logging — conditional on Redux being detected
- https://docs.logrocket.com/reference/graphql-1 — conditional on graphql being detected
- https://docs.logrocket.com/reference/mobx — conditional on mobx being detected
- https://docs.logrocket.com/reference/mobx-state-tree — conditional on mobx state tree being detected
- https://docs.logrocket.com/reference/ngrx-middleware-1 — conditional on ngrx being detected
- https://docs.logrocket.com/reference/react-plugin-1 — conditional on react being detected
- https://docs.logrocket.com/reference/redux-middleware-1 — conditional on redux being detected
- https://docs.logrocket.com/reference/vuex — conditional on vuex being detected
- https://docs.logrocket.com/reference/capture-exception — conditional on error boundaries/catch blocks found
- https://docs.logrocket.com/reference/capture-message — conditional on error boundaries/catch blocks found

## 2. Summary

After finishing all changes, output a structured summary:

```
LogRocket Setup Summary
=======================
Init file:        [path to file where LogRocket.init was added]
App ID:           APP_ID
Events tracked:   [count] events across [count] files
  - [EventName] in [file:line]
  - ...
Plugins added:    [list or "none"]
Identify calls:   [count] location(s)
Needs review:     [anything the developer should verify]

Note: This integration does not include automatic PII sanitization.
Before going live, review LogRocket's DOM redaction documentation to configure
what data is captured in your session recordings.
Redaction docs: https://docs.logrocket.com/reference/dom

Optional next steps:
====================
- Source Maps: https://docs.logrocket.com/reference/javascript-stack-traces
- Subdomain Tracking: https://docs.logrocket.com/reference/roothostname
- DOM Sanitization: https://docs.logrocket.com/reference/dom
- Network Sanitization: https://docs.logrocket.com/reference/network
- Console Logs: https://docs.logrocket.com/reference/console
- IP Capture: https://docs.logrocket.com/reference/shouldcaptureip
```
