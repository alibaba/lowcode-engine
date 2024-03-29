import { IPublicModelPluginContext } from '@alilc/lowcode-types';

export function DesignerView(props: {
  url: string;
  viewName?: string;
}) {
  return (
    <div className="lc-designer lowcode-plugin-designer">
      <div className="lc-project">
        <div className="lc-simulator-shell">
          <iframe
            name={`webview-view-${props.viewName}`}
            className="lc-simulator-content-frame"
            style={{
              height: '100%',
              width: '100%',
            }}
            src={props.url}
          />
        </div>
      </div>
    </div>
  );
}

export function getWebviewPlugin(url: string, viewName: string) {
  function webviewPlugin(ctx: IPublicModelPluginContext) {
    const { skeleton } = ctx;
    return {
      init() {
        skeleton.add({
          area: 'mainArea',
          name: 'designer',
          type: 'Widget',
          content: DesignerView,
          contentProps: {
            ctx,
            url,
            viewName,
          },
        });
      },
    };
  }

  webviewPlugin.pluginName = '___webview_plugin___';

  return webviewPlugin;
}
