---
category: Components
type: Feedback
title: Alert
---

Alert component for feedback.

## When To Use

- When you need to show alert messages to users.
- When you need a persistent static container which is closable by user actions.

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| afterClose | Called when close animation is finished | () => void | - |
| banner | Whether to show as banner | boolean | false |
| closable | Whether Alert can be closed | boolean | - |
| closeText | Close text to show | string\|ReactNode | - |
| description | Additional content of Alert | string\|ReactNode | - |
| icon | Custom icon, effective when `showIcon` is `true` | ReactNode | - |
| message | Content of Alert | string\|ReactNode | - |
| showIcon | Whether to show icon | boolean | false, in `banner` mode default is true |
| type | Type of Alert styles, options: `success`, `info`, `warning`, `error` | string | `info`, in `banner` mode default is `warning` |
| onClose | Callback when Alert is closed | (e: MouseEvent) => void | - |

### Alert.ErrorBoundary

| Property    | Description                      | Type      | Default             | Version |
| ----------- | -------------------------------- | --------- | ------------------- | ------- |
| message     | custom error message to show     | ReactNode | `{{ error }}`       |         |
| description | custom error description to show | ReactNode | `{{ error stack }}` |         |
