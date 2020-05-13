import React from 'react';
import ReactDOM from 'react-dom';
import notification from '..';

describe('notification', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    notification.destroy();
  });

  it('not duplicate create holder', () => {
    const originRender = ReactDOM.render;
    const argsList = [];
    const spyRender = jest.spyOn(ReactDOM, 'render').mockImplementation((...args) => {
      argsList.push(args);
    });
    for (let i = 0; i < 5; i += 1) {
      notification.open({
        message: 'Notification Title',
        duration: 0,
        prefixCls: 'additional-holder',
      });
    }

    argsList.forEach(args => {
      originRender(...args);
    });

    const count = document.querySelectorAll('.additional-holder').length;
    expect(count).toEqual(1);

    spyRender.mockRestore();
  });

  it('should be able to hide manually', async () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
      key: '1',
    });
    notification.open({
      message: 'Notification Title',
      duration: 0,
      key: '2',
    });

    await Promise.resolve();
    expect(document.querySelectorAll('.ant-notification-notice').length).toBe(2);
    notification.close('1');
    await Promise.resolve();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-notification-notice').length).toBe(1);
    notification.close('2');
    await Promise.resolve();
    jest.runAllTimers();
    expect(document.querySelectorAll('.ant-notification-notice').length).toBe(0);
  });

  it('should be able to destroy globally', async () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
    });
    notification.open({
      message: 'Notification Title',
      duration: 0,
    });
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-notification').length).toBe(1);
    expect(document.querySelectorAll('.ant-notification-notice').length).toBe(2);
    notification.destroy();
    await Promise.resolve();
    expect(document.querySelectorAll('.ant-notification').length).toBe(0);
    expect(document.querySelectorAll('.ant-notification-notice').length).toBe(0);
  });

  it('should be able to destroy after config', () => {
    notification.config({
      bottom: 100,
    });
    notification.destroy();
  });

  it('should be able to open with icon', async () => {
    const openNotificationWithIcon = async type => {
      const iconPrefix = '.ant-notification-notice-icon';
      notification[type]({
        message: 'Notification Title',
        duration: 0,
        description: 'This is the content of the notification.',
      });
      await Promise.resolve();
      expect(document.querySelectorAll(`${iconPrefix}-${type}`).length).toBe(1);
    };

    const promises = ['success', 'info', 'warning', 'error'].map(type => {
      return openNotificationWithIcon(type);
    });

    await Promise.all(promises);
  });

  it('trigger onClick', () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
    });
    expect(document.querySelectorAll('.ant-notification').length).toBe(1);
  });

  it('support closeIcon', () => {
    notification.open({
      message: 'Notification Title',
      duration: 0,
      closeIcon: <span className="test-customize-icon" />,
    });
    expect(document.querySelectorAll('.test-customize-icon').length).toBe(1);
  });

  it('support config closeIcon', () => {
    notification.config({
      closeIcon: <span className="test-customize-icon" />,
    });
    notification.open({
      message: 'Notification Title',
      duration: 0,
      closeIcon: <span className="test-customize-icon" />,
    });
    expect(document.querySelectorAll('.test-customize-icon').length).toBe(1);
  });
});
